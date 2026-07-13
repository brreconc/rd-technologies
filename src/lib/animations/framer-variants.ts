import type { Variants } from "framer-motion";

/**
 * Variantes y constantes de animación compartidas (§6.5, ADR-003).
 * Framer Motion es el motor principal. Curva de salida suave y consistente.
 */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Entrada "fade + subir" para elementos individuales. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

/** Contenedor que escalona la entrada de sus hijos. */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
