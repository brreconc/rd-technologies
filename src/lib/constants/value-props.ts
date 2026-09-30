import { Blocks, ShieldCheck, TrendingUp, type LucideIcon } from "lucide-react";

/**
 * Un ESTRATO de la propuesta de valor: no un servicio, sino una afirmación
 * sobre CÓMO trabajamos. La sección "Servicios" cuenta el qué; esta cuenta el
 * criterio con el que se hace, y por eso ninguna de las dos repite a la otra.
 */
export interface ValueStratum {
  icon: LucideIcon;
  /** Etiqueta corta en monoespaciada (columna derecha de la fila). */
  tag: string;
  title: string;
  description: string;
  /** Color propio del estrato: tiñe el nodo, el resplandor y el filo inferior. */
  accent: string;
}

/**
 * Sección "Propuesta de valor" (§8.2).
 *
 * El copy original de Prompt.md eran 73 palabras en un solo párrafo centrado:
 * nueve líneas que nadie termina de leer y que además anticipaban, con las
 * mismas tres palabras, la sección "Servicios" que viene justo detrás. Aquí se
 * condensa a un titular y dos frases —29 palabras—, y las tres ideas pasan del
 * párrafo a los estratos, donde se leen de un vistazo.
 * Ver ADR-017 y docs/09-content-seo/content-guide.md.
 */
export const valueProps = {
  eyebrow: "Quiénes somos",
  title: "Software a medida que nace seguro y escala contigo",
  /** Fragmento del titular que se pinta con el degradado de marca. */
  highlight: "nace seguro",
  lead: "Diseñamos y construimos producto digital a medida: apps móviles, plataformas web y sistemas empresariales. La seguridad no es la última fase del proyecto, es la primera decisión de arquitectura.",
  strata: [
    {
      icon: Blocks,
      tag: "Producto",
      title: "A medida, no de plantilla",
      description: "Cada sistema se diseña sobre tu operación real, y no al revés.",
      accent: "#00f5ff",
    },
    {
      icon: ShieldCheck,
      tag: "Seguridad",
      title: "Seguro desde el diseño",
      description: "Modelamos amenazas y revisamos el código antes de que llegue a producción.",
      accent: "#a78bfa",
    },
    {
      icon: TrendingUp,
      tag: "Escala",
      title: "Preparado para crecer",
      description: "Arquitectura y soporte que acompañan al negocio cuando cambia de tamaño.",
      accent: "#ffd93d",
    },
  ],
} satisfies {
  eyebrow: string;
  title: string;
  highlight: string;
  lead: string;
  strata: ValueStratum[];
};
