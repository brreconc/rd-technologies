# Despliegue a producción (Docker)

Guía para desplegar la landing de R&D Technologies como **contenedor Docker**. El
proyecto ya está dockerizado y validado; esta página es lo único que necesita
quien lo despliegue.

## TL;DR

```bash
# 1. Configurar variables (una vez)
cp .env.production.example .env
#    → editar .env: NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_SITE_INDEXABLE=true, ...

# 2. Construir y levantar
docker compose up -d --build

# 3. Comprobar salud
curl http://localhost:3000/api/health      # {"status":"ok",...}
```

La app queda sirviendo en el puerto `3000` del host (configurable con `APP_PORT`).

## ⚠️ Lo más importante: build-time vs runtime

Next.js **hornea** las variables `NEXT_PUBLIC_*` dentro del código y de las
páginas estáticas **durante la construcción** (`next build`). Consecuencias:

| Variable                     | Cuándo se aplica | Cómo se pasa                | Cambiarla implica |
| ---------------------------- | ---------------- | --------------------------- | ----------------- |
| `NEXT_PUBLIC_SITE_URL`       | **build-time**   | build arg (compose lo hace) | **reconstruir**   |
| `NEXT_PUBLIC_SITE_INDEXABLE` | **build-time**   | build arg (compose lo hace) | **reconstruir**   |
| `RESEND_API_KEY`             | runtime          | env del contenedor          | solo reiniciar    |
| `CONTACT_TO_EMAIL`           | runtime          | env del contenedor          | solo reiniciar    |

> Si cambias el dominio o activas la indexación, **hay que reconstruir la imagen**
> (`docker compose up -d --build`). Reiniciar el contenedor no basta para esas dos.

`docker compose` lee el fichero `.env` y ya pasa cada variable a donde toca
(build args para las públicas, entorno para los secretos). Si construyes la
imagen a mano, pásalas tú:

```bash
docker build \
  --build-arg NEXT_PUBLIC_SITE_URL="https://www.rdtechnologies.com" \
  --build-arg NEXT_PUBLIC_SITE_INDEXABLE="true" \
  -t rd-technologies:latest .

docker run -d -p 3000:3000 \
  -e NEXT_PUBLIC_SITE_URL="https://www.rdtechnologies.com" \
  -e RESEND_API_KEY="..." -e CONTACT_TO_EMAIL="..." \
  rd-technologies:latest
```

## Anatomía de la imagen

- **Multi-stage** (`Dockerfile`): `deps` (instala) → `builder` (`next build`) →
  `runner` (solo la salida **standalone** de Next).
- Base **`node:22-bookworm-slim`** (glibc; compatible con las dependencias
  nativas). Node 22 LTS.
- **Salida standalone** (`output: "standalone"` en `next.config.ts`): la imagen
  final solo lleva `server.js` + las dependencias mínimas trazadas → pequeña y
  con poca superficie de ataque. Se copian además `.next/static` y `public`.
- **Usuario sin privilegios** (`nextjs`, uid 1001): no corre como root.
- **HEALTHCHECK** integrado contra `/api/health` (usa el `fetch` de Node, sin
  instalar curl/wget).
- La CSP con **nonce por petición** (ADR-009) exige render dinámico: el servidor
  Node del contenedor lo resuelve sin configuración extra.

## Variables de entorno

Ver `.env.production.example` (plantilla comentada). Mínimo para producción:

```dotenv
NEXT_PUBLIC_SITE_URL="https://www.rdtechnologies.com"
NEXT_PUBLIC_SITE_INDEXABLE="true"
# Opcionales (email real del formulario; sin ellos, se registra en log):
RESEND_API_KEY=""
CONTACT_TO_EMAIL=""
```

## Reverse proxy (recomendado)

Poner un proxy inverso (nginx, Traefik, Caddy) **por delante** del contenedor
para terminar TLS/HTTPS y absorber peticiones malformadas/lentas
(recomendación oficial de Next para self-hosting). Requisitos:

- Reenviar `X-Forwarded-For` con la IP real del cliente → de ahí sale el
  **rate limiting** por IP de los formularios (ver
  [ADR-007](../01-architecture/decisions/ADR-007-rate-limit-route-handlers.md)).
  Sin un proxy de confianza, esa cabecera es falsificable.
- Reenviar `Host`/`X-Forwarded-Host` correctos → la verificación de origen
  (CSRF) de los formularios los usa.
- Servir por **HTTPS** (la cabecera HSTS ya se emite en producción).

## Escalado / múltiples instancias (cuando aplique)

- **Rate limiting** es en memoria y por proceso (ADR-007). Con varias réplicas,
  sustituir por un store compartido (Redis/Upstash) tras la misma interfaz
  `checkRateLimit` — sin tocar los route handlers.
- La caché de Next es local por instancia; para varias réplicas, configurar un
  `cacheHandler` compartido (ver self-hosting de Next). La landing es casi toda
  contenido estático/dinámico sin ISR, así que no es crítico al inicio.

## Checklist previo al despliegue

- [ ] `.env` creado a partir de `.env.production.example` con dominio real.
- [ ] `NEXT_PUBLIC_SITE_INDEXABLE="true"` (para que Google indexe).
- [ ] TLS/HTTPS terminado en el reverse proxy; `X-Forwarded-For`/`Host` correctos.
- [ ] `docker compose up -d --build` levanta y `/api/health` responde `ok`.
- [ ] Verificar `robots.txt` (`Allow: /` + `Sitemap:`) y `sitemap.xml` con el
      dominio real.
- [ ] (Opcional) Integrar Resend rellenando `RESEND_API_KEY`/`CONTACT_TO_EMAIL`.
- [ ] Definir las variables `SITE_URL` y `SITE_INDEXABLE` del repositorio
      (Settings → Secrets and variables → Actions → **Variables**) para que la
      imagen publicada se construya contra el dominio real.

## Integración continua

`.github/workflows/ci.yml` ejecuta en cada push/PR a `main`: typecheck, lint,
`format:check`, tests unitarios, build, `pnpm audit --prod`, E2E (Chromium) y el
**build de la imagen Docker**. En los push a `main` además la **publica en GHCR**.

## Compartir el proyecto con otro programador

Hay dos caminos, y conviene entender cuándo usar cada uno.

### A) Desde el código (lo habitual para desarrollar)

```bash
git clone git@github.com:<usuario>/rd-technologies.git
cd rd-technologies
cp .env.production.example .env   # y rellenar
docker compose up -d --build      # construye rd-technologies:latest y levanta
```

### B) Desde la imagen publicada (para solo revisar, sin compilar)

Cada push a `main` publica la imagen en **GitHub Container Registry**:

```
ghcr.io/<usuario>/rd-technologies:latest      # última de main
ghcr.io/<usuario>/rd-technologies:sha-1a2b3c  # inmutable, por commit
```

```bash
# El repo es PRIVADO → el paquete también lo es: hace falta login una vez.
# Token en github.com/settings/tokens con el scope `read:packages`.
echo "<TOKEN>" | docker login ghcr.io -u <usuario> --password-stdin

docker pull ghcr.io/<usuario>/rd-technologies:latest
docker run -d --name rdtech -p 3000:3000 ghcr.io/<usuario>/rd-technologies:latest
```

> Para dar acceso a otra persona sin darle acceso al repo: en la página del
> paquete (Packages → rd-technologies → Package settings) se invita a su usuario
> con rol _Read_, o se marca el paquete como público.

### ⚠️ Qué lleva horneado la imagen publicada

Las `NEXT_PUBLIC_*` se inlinean en `next build`, así que **viajan dentro de la
imagen**. Por defecto el workflow la construye con `http://localhost:3000` y
`INDEXABLE=false`: así quien la descarga la levanta y funciona sin configurar
nada. Cuando exista el dominio real, se definen las variables de repositorio
`SITE_URL` y `SITE_INDEXABLE` y el siguiente push a `main` publica ya la imagen
de producción. Los **secretos de servidor** (`RESEND_API_KEY`, …) nunca se
hornean: se pasan en runtime con `-e` o vía compose.

## Verificación ya realizada (local)

La salida **standalone** se validó ejecutando `node .next/standalone/server.js`
con variables de producción (`INDEXABLE=true`, dominio real): home 200, CSP con
nonce sin `'unsafe-inline'`, `/api/health` ok, `robots.txt`/`sitemap.xml`/
canonical con el dominio real y assets estáticos servidos. Es exactamente el
runtime que ejecuta el contenedor.

> Docker no estaba instalado en la máquina de desarrollo, así que la **imagen**
> se construye/valida en CI (job `docker`) y en el entorno del PM. El runtime
> subyacente (server.js standalone) sí quedó verificado en local.
