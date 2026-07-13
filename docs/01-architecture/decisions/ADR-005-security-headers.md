# ADR-005 — Cabeceras de seguridad y proxy

- **Estado:** Aceptada
- **Fecha:** 2026-07-12
- **Decisores:** AppSec, Arquitecto Senior

## Contexto

Se requiere seguridad de nivel empresarial desde el día uno (§9), aplicada de forma consistente y
sin romper el desarrollo local (HMR de Next/Turbopack necesita inline/eval en dev).

## Decisión

- **Fuente única** de cabeceras en [`src/lib/security/headers.ts`](../../../src/lib/security/headers.ts),
  importada por [`next.config.ts`](../../../next.config.ts) y aplicada a **todas** las rutas.
- **CSP dependiente del entorno:** en dev permite `'unsafe-inline'`/`'unsafe-eval'` y `ws:`
  (necesario para HMR); en producción se endurece y añade `upgrade-insecure-requests`.
- Cabeceras: CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`,
  `Permissions-Policy`, COOP/CORP; **HSTS** solo en producción (HTTPS).
- `poweredByHeader: false` (no revelar tecnología).
- **`proxy.ts`** (antes `middleware.ts`, renombrado en Next 16) refuerza cabeceras clave y es el
  punto de extensión para el **rate limiting** (Fase 4).

## Consecuencias

- ✅ Defensa en profundidad, consistente y verificada (headers comprobados en `pnpm start`).
- ⚠️ La CSP de producción aún usa `'unsafe-inline'` en scripts. **Pendiente Fase 6:** CSP estricta
  con **nonces** (requiere generar nonce en `proxy.ts` e inyectarlo).
- 🔁 Revisar `connect-src`/`img-src` cuando se integren analytics o captcha.
