import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * Web App Manifest (§12). Habilita instalación como PWA básica y la
 * presentación en el conmutador de apps del sistema.
 *
 * `theme_color`/`background_color` usan el fondo del tema oscuro (por defecto).
 * Los iconos reutilizan el favicon existente; iconos maskable dedicados quedan
 * para cuando exista identidad gráfica (§19.1).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — ${siteConfig.tagline}`,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    lang: siteConfig.lang,
    dir: "ltr",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    categories: ["business", "technology", "productivity"],
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
