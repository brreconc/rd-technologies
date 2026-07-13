# Despliegue (preparado, no ejecutado)

El proyecto es **local** en esta fase (§16). Este documento deja el camino listo para el futuro.

## Checklist previo al despliegue

- [ ] Quitar `robots: noindex` en `src/config/metadata.ts`.
- [ ] Definir `NEXT_PUBLIC_SITE_URL` real y variables de `.env` (email, captcha, analytics).
- [ ] Endurecer CSP con **nonces** (Fase 6).
- [ ] `pnpm build` + `pnpm start` verdes; `pnpm audit` limpio.
- [ ] Suite Playwright (cross-browser + responsive + a11y) y Lighthouse CI en verde.
- [ ] Revisar HSTS/HTTPS y cabeceras en el hosting.

## Opciones de hosting

- **Vercel** (nativo para Next.js) — despliegue directo.
- **Contenedor** (Dockerfile) para cualquier plataforma — se añadirá en la Fase 7.
- CI/CD (GitHub Actions) — plantillas inertes en `.github/` (Fase 7).

_(Se concreta en la Fase 7.)_
