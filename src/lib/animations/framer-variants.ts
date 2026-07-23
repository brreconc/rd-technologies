import type { Variants } from "framer-motion";

/**
 * Variantes y constantes de animación compartidas (§6.5, ADR-003/ADR-011).
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
  show: { transition: { delayChildren: 0.05, staggerChildren: 0.09 } },
};

/**
 * Entrada "cinematográfica" de tarjeta (Fase 9): la pieza llega desde abajo,
 * desenfocada y ligeramente inclinada en 3D, y se asienta enfocándose. Solo usa
 * propiedades que compone la GPU (transform/opacity/filter).
 */
export const cardIn: Variants = {
  hidden: { opacity: 0, y: 34, scale: 0.96, rotateX: 7, filter: "blur(7px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: EASE_OUT },
  },
};

/** Contenedor de un título que se revela palabra a palabra. */
export const staggerWords: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045 } },
};

/**
 * Palabra que sube desde detrás de su máscara. El 130% garantiza que quede
 * fuera del área visible incluso con el relleno que deja sitio a los trazos
 * descendentes (g, j, p…).
 */
export const wordUp: Variants = {
  hidden: { y: "130%" },
  show: { y: "0%", transition: { duration: 0.72, ease: EASE_OUT } },
};
