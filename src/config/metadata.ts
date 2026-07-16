import type { Metadata } from "next";
import { siteConfig } from "./site";
import { isIndexable } from "./seo";

/**
 * Metadata base heredada por todas las rutas (§12).
 * Cada página puede sobrescribir `title`/`description` mediante su export
 * `metadata` o `generateMetadata`.
 *
 * La indexación se decide en `config/seo.ts` (fuente única — ver ADR-008): en
 * local/no desplegado → `noindex, nofollow`. La imagen OG/Twitter la inyecta
 * Next automáticamente desde `app/opengraph-image.tsx` y `app/twitter-image.tsx`.
 */
const title = `${siteConfig.name} — ${siteConfig.tagline}`;

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: title,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: siteConfig.description,
  },
  robots: isIndexable
    ? {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large" },
      }
    : { index: false, follow: false },
  icons: { icon: "/favicon.ico" },
};
