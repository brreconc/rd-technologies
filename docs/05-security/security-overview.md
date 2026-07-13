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

### 2. CSP dependiente del entorno

- **Dev:** permite `'unsafe-inline'`/`'unsafe-eval'` y `ws:`/`wss:` (necesario para el HMR de
  Next/Turbopack).
- **Prod:** se endurece y añade `upgrade-insecure-requests`.
- Las **fuentes se auto-hospedan** (next/font) → `font-src 'self'`, sin orígenes externos.

### 3. Proxy (borde)

[`src/proxy.ts`](../../src/proxy.ts) refuerza cabeceras clave y es el punto de extensión para el
**rate limiting** (Fase 4).

### 4. Validación de entorno

[`src/config/env.ts`](../../src/config/env.ts) valida variables con **Zod** (fallo temprano).

## Verificación

Comprobado en `pnpm start` que todas las cabeceras se emiten correctamente (200 OK, CSP de
producción con `upgrade-insecure-requests`, HSTS presente, sin `x-powered-by`).

## Pendiente (Fases 4 y 6)

- **Formularios:** validación doble (Zod cliente/servidor), sanitización, honeypot + time-trap,
  rate limiting por IP, CSRF, captcha opcional. Ver [`forms-hardening.md`](./forms-hardening.md).
- **CSP estricta con nonces** (eliminar `'unsafe-inline'` de scripts) — Fase 6.
- **`pnpm audit` limpio** como criterio de entrega; modelo de amenazas en
  [`threat-model.md`](./threat-model.md).
- Alineación con **OWASP Top 10**.
