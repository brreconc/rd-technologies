import { env } from "./env";
import { siteConfig } from "./site";

/**
 * Política de SEO/indexación — FUENTE ÚNICA DE VERDAD (§12).
 *
 * Todo lo que decide "¿debe indexarse el sitio?" vive aquí para que el
 * `<meta robots>` (metadata.ts), `robots.txt` (robots.ts) y `sitemap.xml`
 * (sitemap.ts) NUNCA se contradigan. Ver ADR-008.
 *
 * En local / sin desplegar → NO indexable (evita filtrar un entorno de
 * pruebas a los buscadores). Se activa con `NEXT_PUBLIC_SITE_INDEXABLE=true`
 * en el despliegue real.
 */
export const isIndexable = env.NEXT_PUBLIC_SITE_INDEXABLE;

/** URL absoluta a partir de una ruta relativa (`/`, `/sitemap.xml`, …). */
export function absoluteUrl(path = "/"): string {
  return new URL(path, siteConfig.url).toString();
}

/** Secciones canónicas de la landing one-page (para el sitemap). */
export const routes = {
  home: "/",
} as const;
