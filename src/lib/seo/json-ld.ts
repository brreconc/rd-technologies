import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/config/seo";
import { faq } from "@/lib/constants/faq";

/**
 * Datos estructurados JSON-LD (schema.org) — §12.
 *
 * Se construyen los tres tipos pedidos (`Organization`, `WebSite`, `FAQPage`)
 * y se combinan en un único `@graph`, la forma recomendada para emitir varias
 * entidades en un solo bloque `<script type="application/ld+json">`.
 *
 * Nota de seguridad: el serializado se hace en el componente `JsonLd`, que
 * escapa `<` → `<` para evitar romper el `</script>` / inyección (ver
 * guía oficial de Next). Aquí solo se arma el objeto.
 */

const ORG_ID = absoluteUrl("/#organization");
const SITE_ID = absoluteUrl("/#website");

/** Redes sociales configuradas (omite las vacías) → `sameAs`. */
function socialProfiles(): string[] {
  return Object.values<string>(siteConfig.social).filter((url) => url.length > 0);
}

function organization(): Record<string, unknown> {
  const sameAs = socialProfiles();
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    slogan: siteConfig.tagline,
    logo: absoluteUrl("/opengraph-image"),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(siteConfig.contact.email
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "sales",
            email: siteConfig.contact.email,
            ...(siteConfig.contact.phone ? { telephone: siteConfig.contact.phone } : {}),
            availableLanguage: ["Spanish"],
          },
        }
      : {}),
  };
}

function website(): Record<string, unknown> {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: siteConfig.lang,
    publisher: { "@id": ORG_ID },
  };
}

function faqPage(): Record<string, unknown> {
  return {
    "@type": "FAQPage",
    "@id": absoluteUrl("/#faq"),
    inLanguage: siteConfig.lang,
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Grafo completo de datos estructurados de la home. */
export function buildHomeJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [organization(), website(), faqPage()],
  };
}
