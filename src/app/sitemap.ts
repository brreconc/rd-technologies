import type { MetadataRoute } from "next";
import { absoluteUrl, isIndexable, routes } from "@/config/seo";

/**
 * Sitemap (§12). Landing one-page → una sola URL canónica.
 *
 * Mientras el sitio NO es indexable (local/no desplegado) se devuelve un
 * sitemap vacío: coherente con `robots.txt` y el `<meta robots>` (ADR-008),
 * para no anunciar URLs de un entorno que no debe aparecer en buscadores.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexable) return [];

  return [
    {
      url: absoluteUrl(routes.home),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
