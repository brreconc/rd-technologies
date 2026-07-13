import * as React from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Contenedor de ancho máximo con padding fluido y seguro (§5.3).
 * Centraliza el ancho de lectura para mantener consistencia entre secciones.
 */
export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-7xl px-6 sm:px-8", className)} {...props} />;
}

/**
 * Sección vertical con espaciado responsivo. Acepta `id` para el scroll por anclas.
 */
export function Section({ className, ...props }: React.ComponentProps<"section">) {
  return <section className={cn("scroll-mt-20 py-16 sm:py-24", className)} {...props} />;
}
