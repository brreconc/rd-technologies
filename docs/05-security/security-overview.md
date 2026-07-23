# Seguridad — Visión general (defensa en profundidad)

Requisito §9. Seguridad aplicada desde la primera línea. Fuente de verdad de cabeceras:
[`src/lib/security/headers.ts`](../../src/lib/security/headers.ts).

## Capas activas (Fase 0)

### 1. Cabeceras HTTP (todas las rutas)

Aplicadas en [`next.config.ts`](../../next.config.ts) vía `getSecurityHeaders()`:

| Cabecera                       | Valor                             | Propósito                        |
| ------------------------------ | --------------------------------- | -------------------------------- |
| `Content-Security-Policy`      | dependiente de entorno            | Mitiga XSS/inyección.            |
| `X-Frame-Options`              | `DENY`                            | Anti-clickjacking.               |
| `X-Content-Type-Options`       | `nosniff`                         | Evita MIME sniffing.             |
| `Referrer-Policy`              | `strict-origin-when-cross-origin` | Minimiza fuga de referer.        |
| `Permissions-Policy`           | cámara/micro/geo = ()             | Desactiva APIs sensibles.        |
| `Cross-Origin-Opener-Policy`   | `same-origin`                     | Aísla el contexto de navegación. |
| `Cross-Origin-Resource-Policy` | `same-origin`                     | Controla carga cross-origin.     |
| `Strict-Transport-Security`    | solo producción                   | Fuerza HTTPS.                    |
| `X-Powered-By`                 | **eliminada**                     | No revelar tecnología.           |

### 2. CSP estricta con nonce (Fase 6)

- **Prod:** `script-src 'self' 'nonce-<n>' 'strict-dynamic'` — **sin `'unsafe-inline'`**. El nonce
  se genera por petición en el proxy; Next lo aplica a sus scripts y `next-themes` lo recibe en su
  script anti-parpadeo. Ver [ADR-009](../01-architecture/decisions/ADR-009-csp-nonce.md).
- **Dev:** `'unsafe-inline'`/`'unsafe-eval'` + `ws:` (necesarios para el HMR de Next/Turbopack); ahí
  el nonce no aplica.
- `style-src` mantiene `'unsafe-inline'` (estilos en atributos `style=""` de React; riesgo muy
  inferior al de script).
- Las **fuentes se auto-hospedan** (next/font) → `font-src 'self'`, sin orígenes externos.
- **Consecuencia:** las páginas HTML pasan a render dinámico; las rutas de metadata
  (sitemap/robots/manifest/OG) siguen estáticas y cacheables.

### 3. Proxy (borde)

[`src/proxy.ts`](../../src/proxy.ts) genera el **nonce** y aplica la **CSP** por petición
([ADR-009](../01-architecture/decisions/ADR-009-csp-nonce.md)). El resto de cabeceras se aplican
en `next.config.ts`. El **rate limiting** NO vive aquí: se aplica en los route handlers (runtime
Node), ver [ADR-007](../01-architecture/decisions/ADR-007-rate-limit-route-handlers.md).

### 4. Validación de entorno

[`src/config/env.ts`](../../src/config/env.ts) valida variables con **Zod** (fallo temprano).

## Verificación

Comprobado en `pnpm start`:

- CSP con **nonce por petición** activa; `script-src` **sin `'unsafe-inline'`**; el nonce de la
  cabecera coincide con el de los `<script>` del HTML (si no, no ejecutarían). Confirmado en
  navegador real (Playwright): **cero violaciones de CSP** ni errores de consola.
- HSTS presente, sin `x-powered-by`, resto de cabeceras correctas.
- **`pnpm audit --prod`: sin vulnerabilidades.** Ver el apartado de dependencias más abajo. Los
  avisos restantes están confinados a `@lhci/cli` (herramienta de desarrollo, no se despliega).

## Dependencias vulnerables — actuaciones

El criterio de entrega es `pnpm audit --prod` limpio, y el CI lo hace fallar si no lo está
(`.github/workflows/ci.yml`, job `quality`). Historial de actuaciones:

| Fecha      | Aviso                                                                                           | Actuación                                                              |
| ---------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Fase 6     | `postcss` — XSS en el stringify de CSS (GHSA-qx2v-qp2m-jg93)                                    | Override a `>=8.5.10` en `pnpm-workspace.yaml` (solo se usa en build). |
| 2026-07-23 | **`next` 16.2.10** — 4 avisos, entre ellos **bypass de middleware/proxy** (GHSA-6gpp-xcg3-4w24) | **Actualización a `next@16.2.11`** + `eslint-config-next@16.2.11`.     |
| 2026-07-23 | `sharp <0.35.0` — CVE de libvips heredados (GHSA-f88m-g3jw-g9cj)                                | Override a `>=0.35.0`.                                                 |

> ⚠️ **Por qué el aviso de `next` era serio aquí.** El bypass afectaba a aplicaciones del App Router
> con Turbopack, y en este proyecto **la CSP con nonce y las cabeceras de seguridad se aplican en el
> proxy** (`src/proxy.ts`, ADR-009). Una petición capaz de esquivar el proxy se serviría sin CSP.
> Por eso la actualización no era opcional.

> **Nota sobre `sharp`.** Es una dependencia _opcional_ de Next (`^0.34.5`) que solo usa el
> optimizador de `next/image`. Este proyecto no usa `next/image` (no hay imágenes rasterizadas;
> `public/` son SVG) y **`sharp` no aparece en la salida standalone**, así que nunca llegó a viajar
> en la imagen Docker. El override se aplica igualmente para no arrastrar el aviso.

## Formularios (Fase 4 — implementado)

Validación doble (Zod cliente/servidor), sanitización, honeypot + time-trap, rate limiting por IP,
verificación de origen (CSRF) y capa de servicios con enmascarado de PII en logs. Detalle y
verificación en [`forms-hardening.md`](./forms-hardening.md).

## QA de seguridad (Fase 6 — implementado)

- **CSP estricta con nonces** — hecho (ADR-009).
- **`pnpm audit` limpio** en producción — hecho (ver historial de actuaciones arriba).
- Tests de seguridad automatizados: unit (sanitize, rate-limit, anti-bot, validadores, respuestas)
  con Vitest y E2E (CSP sin violaciones) con Playwright. Ver [08-testing](../08-testing/testing-strategy.md).

## Pendiente

- **Captcha** opcional (Turnstile/hCaptcha) — decisión §19.7.
- Modelo de amenazas en [`threat-model.md`](./threat-model.md) y repaso final **OWASP Top 10**.
- Rate limiting distribuido (Redis) y `x-forwarded-for` de proxy de confianza — al desplegar (ADR-007).
