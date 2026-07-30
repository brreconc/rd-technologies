/**
 * Configuración central del sitio (marca, navegación, contacto, SEO).
 * Fuente única de verdad — §8 y §12 del prompt maestro.
 *
 * Los datos de contacto y redes son PLACEHOLDERS pendientes de confirmar por
 * el cliente (§19). Editar aquí, no en los componentes.
 */

export const siteConfig = {
  name: "R&D Technologies",
  shortName: "R&D",
  tagline: "Transformamos tus ideas en productos digitales seguros",
  description:
    "Construimos soluciones digitales a medida, con código seguro desde el origen y soporte continuo.",
  // La URL real se define en despliegue; en local usa el fallback.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "es_ES",
  lang: "es",

  keywords: [
    "desarrollo de software a medida",
    "código seguro",
    "ciberseguridad en desarrollo",
    "aplicaciones móviles personalizadas",
    "plataformas web escalables",
    "soporte técnico especializado",
    "aliado tecnológico de confianza",
    "soluciones digitales seguras",
    "transformación digital",
    "protección de datos y cumplimiento normativo",
  ],

  // Anclas de la landing (one-page). Rutas dedicadas pendientes de decisión (§19).
  nav: [
    { label: "Servicios", href: "#servicios" },
    { label: "Plataformas", href: "#plataformas" },
    { label: "Proceso", href: "#proceso" },
    { label: "Casos de uso", href: "#casos-de-uso" },
    { label: "Preguntas frecuentes", href: "#faq" },
    { label: "Contacto", href: "#contacto" },
  ],

  // PLACEHOLDERS — confirmar con el cliente (§19.8).
  contact: {
    email: "contacto@rdtechnologies.example",
    phone: "",
  },
  social: {
    linkedin: "",
    github: "",
    x: "",
  },
} as const;

export type SiteConfig = typeof siteConfig;
