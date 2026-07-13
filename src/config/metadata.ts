import type { Metadata } from "next";
import { siteConfig } from "./site";

/**
 * Metadata base heredada por todas las rutas (§12).
 * Cada página puede sobrescribir `title`/`description` mediante su export
 * `metadata` o `generateMetadata`.
 *
 * `robots: noindex` mientras el proyecto es local/no desplegado. Se activará
 * la indexación en la fase de despliegue.
 */
export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: { index: false, follow: false },
  icons: { icon: "/favicon.ico" },
};
