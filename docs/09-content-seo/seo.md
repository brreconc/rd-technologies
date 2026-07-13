# SEO y metadata

Requisito §12. Base en [`src/config/metadata.ts`](../../src/config/metadata.ts).

## Ya aplicado (Fase 0)

- **Metadata API** con `title` (plantilla), `description`, `keywords`, `applicationName`, autores.
- **Open Graph** + **Twitter Card**.
- `metadataBase` desde `siteConfig.url`.
- **`robots: noindex`** mientras el proyecto es local/no desplegado.

## Pendiente (Fase 5)

- **JSON-LD** estructurado: `Organization`, `WebSite`, `FAQPage`.
- Imagen **OG** generada.
- `sitemap.ts`, `robots.ts`, `manifest.ts`.
- Activar indexación al desplegar (quitar `noindex`).
- **Analytics** y **banner de cookies** — decisión pendiente (§19.7), desactivados en local.
