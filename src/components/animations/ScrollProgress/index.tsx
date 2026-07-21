"use client";

import { m, useScroll, useSpring } from "framer-motion";

/**
 * Barra de progreso de lectura fija en el borde superior (§8/Fase 8).
 * Refleja cuánto de la página se ha desplazado. Usa `useScroll` (sin listeners
 * manuales) + un muelle para suavizar. No es "movimiento" vestibular, pero si el
 * usuario pide reduced-motion la CSS global neutraliza cualquier transición.
 *
 * Decorativa: `aria-hidden` y fuera del flujo; no aporta nada a lectores de
 * pantalla (la posición de scroll ya la conocen).
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  return (
    <m.div
      aria-hidden="true"
      style={{ scaleX }}
      className="scroll-progress fixed inset-x-0 top-0 z-50 h-0.5 origin-left"
    />
  );
}
