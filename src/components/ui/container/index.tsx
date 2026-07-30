import * as React from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Contenedor de ancho máximo con padding fluido y seguro (§5.3).
 * Centraliza el ancho de lectura para mantener consistencia entre secciones.
 */
export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)} {...props} />
  );
}

/**
 * Sección vertical con espaciado responsivo. Acepta `id` para el scroll por anclas.
 *
 * `section-flow` le da la LLEGADA cinematográfica: la sección entra atenuada y
 * alcanza su brillo pleno conforme sube, atada al scroll por CSS puro
 * (`animation-timeline: view()`), sin JavaScript ni observadores. Al vivir aquí,
 * todas las secciones la heredan sin repetir nada. Ver docs/02-design-system/motion.md.
 */
export function Section({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section className={cn("section-flow scroll-mt-20 py-16 sm:py-24", className)} {...props} />
  );
}
