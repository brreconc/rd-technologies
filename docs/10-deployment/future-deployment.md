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
- [ ] (Opcional) Publicar la imagen en el registro del equipo (extender el job
      `docker` de `.github/workflows/ci.yml` con login + `push: true`).

## Integración continua

`.github/workflows/ci.yml` ejecuta en cada push/PR a `main`: typecheck, lint,
`format:check`, tests unitarios, build, `pnpm audit --prod`, E2E (Chromium) y un
**build de la imagen Docker** (sin publicar). Para publicarla, el PM añade
`docker/login-action` y `push: true` con las credenciales de su registro.

## Verificación ya realizada (local)

La salida **standalone** se validó ejecutando `node .next/standalone/server.js`
con variables de producción (`INDEXABLE=true`, dominio real): home 200, CSP con
nonce sin `'unsafe-inline'`, `/api/health` ok, `robots.txt`/`sitemap.xml`/
canonical con el dominio real y assets estáticos servidos. Es exactamente el
runtime que ejecuta el contenedor.

> Docker no estaba instalado en la máquina de desarrollo, así que la **imagen**
> se construye/valida en CI (job `docker`) y en el entorno del PM. El runtime
> subyacente (server.js standalone) sí quedó verificado en local.
