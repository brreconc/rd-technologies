# SEO y metadata (Fase 5 — implementado)

Requisito §12. Base en [`src/config/metadata.ts`](../../src/config/metadata.ts) y
política de indexación en [`src/config/seo.ts`](../../src/config/seo.ts).

## Política de indexación (fuente única de verdad)

`config/seo.ts` expone `isIndexable`, derivada de `NEXT_PUBLIC_SITE_INDEXABLE`
(validada en `config/env.ts`, por defecto **`false`**). De ese único flag derivan
las tres piezas, que así **nunca se contradicen** (ver
[ADR-008](../01-architecture/decisions/ADR-008-indexing-policy.md)):

| Pieza                      | No indexable (local) | Indexable (deploy)                      |
| -------------------------- | -------------------- | --------------------------------------- |
| `<meta robots>` (metadata) | `noindex, nofollow`  | `index, follow` (+ googleBot)           |
| `app/robots.ts`            | `Disallow: /`        | `Allow: /`, `Disallow: /api/` + sitemap |
| `app/sitemap.ts`           | vacío                | URL canónica de la home                 |

> **Al desplegar:** poner `NEXT_PUBLIC_SITE_INDEXABLE=true` (y `NEXT_PUBLIC_SITE_URL`
> al dominio real). Es el único cambio necesario para activar la indexación.

## Metadata API

`config/metadata.ts` (heredada por todas las rutas):

- `title` con plantilla (`%s · R&D Technologies`), `description`, `keywords`,
  `applicationName`, `authors`, `publisher`.
- `metadataBase` desde `siteConfig.url` → todas las URLs relativas se absolutizan.
- `alternates.canonical: "/"`.
- **Open Graph** (`type`, `locale`, `url`, `siteName`, `title`, `description`) y
  **Twitter Card** (`summary_large_image`).
- `robots` según la política de indexación.
- `viewport` (en `layout.tsx`, no en `metadata` — deprecado desde Next 14):
  `themeColor` por esquema de color (oscuro `#0a0a0a` / claro `#ffffff`) y
  `colorScheme: "dark light"`.

## Imagen social (OG/Twitter)

Generada con **`next/og`** (`ImageResponse`, satori), diseño 1200×630 compartido en
[`src/lib/seo/og-image.tsx`](../../src/lib/seo/og-image.tsx) y expuesta por
`app/opengraph-image.tsx` y `app/twitter-image.tsx`. Es **estática** (se genera en
build y se cachea). Usa la fuente por defecto que trae `next/og` (Geist) para no
depender de ficheros externos. Next inyecta solo las etiquetas `og:image:*` /
`twitter:image` con el hash de la imagen.

> Reglas de satori a recordar: todo contenedor con varios hijos necesita
> `display: flex`; no hay cascada CSS (estilos inline por elemento).

## Datos estructurados (JSON-LD)

[`src/lib/seo/json-ld.ts`](../../src/lib/seo/json-ld.ts) arma un único `@graph` con
los tres tipos pedidos y lo renderiza el Server Component
[`components/seo/JsonLd`](../../src/components/seo/JsonLd.tsx) en la home:

- **`Organization`** — nombre, descripción, logo (imagen OG), `sameAs` (redes, si
  hay), `contactPoint` (si hay email).
- **`WebSite`** — vinculada a la organización (`publisher`).
- **`FAQPage`** — construida desde `lib/constants/faq.ts` (misma fuente que la
  sección FAQ visible: nunca se desincronizan).

**Seguridad:** `JSON.stringify` no sanea; `JsonLd` escapa `<` → `<` para
impedir que un `</script>` incrustado cierre la etiqueta (ver guía oficial de Next).

## Rutas de metadata

`sitemap.ts`, `robots.ts`, `manifest.ts` (Web App Manifest: nombre, tema, iconos
desde el favicon). Todas construidas con `MetadataRoute.*` de Next.

## Estados de error y carga

`app/loading.tsx` (indicador accesible durante el streaming), `app/not-found.tsx`
(404 real + rutas de recuperación), `app/error.tsx` (boundary de segmento con
`unstable_retry()`, Next 16.2) y `app/global-error.tsx` (fallo del layout raíz,
autocontenido). Detalle en
[03-components/component-catalog](../03-components/component-catalog.md).

## Verificación (smoke test, `pnpm start`)

| Comprobación                        | Resultado                                            |
| ----------------------------------- | ---------------------------------------------------- |
| `robots.txt`                        | `Disallow: /` (no indexable) ✅                      |
| `sitemap.xml`                       | vacío (no indexable) ✅                              |
| `<meta robots>` home                | `noindex, nofollow` ✅                               |
| JSON-LD                             | 1 bloque, tipos Organization/WebSite/FAQPage ✅      |
| `opengraph-image` / `twitter-image` | `200 image/png` (~100 KB) ✅                         |
| `og:image:alt`, `twitter:card`      | presentes (`summary_large_image`) ✅                 |
| `manifest.webmanifest`              | válido ✅                                            |
| canonical, theme-color              | presentes (theme-color por esquema) ✅               |
| Ruta inexistente                    | HTTP **404** + `noindex` automático ✅               |
| Cabeceras de seguridad              | intactas (CSP, X-Frame-Options, sin x-powered-by) ✅ |

## Pendiente

- **Activar indexación** al desplegar (`NEXT_PUBLIC_SITE_INDEXABLE=true`).
- Iconos **maskable** dedicados y favicon vectorial cuando exista identidad
  gráfica (§19.1).
- **Analytics** y **banner de cookies** — decisión pendiente (§19.7), desactivados
  en local.
