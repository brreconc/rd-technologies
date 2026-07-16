import type { MetadataRoute } from "next";
import { absoluteUrl, isIndexable } from "@/config/seo";

/**
 * robots.txt (§12). Su política deriva de `config/seo.ts` (fuente única, ADR-008)
 * para no contradecir al `<meta robots>` ni al sitemap.
 *
 * - No indexable (local): `Disallow: /` — se bloquea todo el rastreo.
 * - Indexable (despliegue): `Allow: /` salvo la API, y se anuncia el sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
