"use client";

import * as React from "react";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * "Movimiento de cámara" al abandonar el hero (Fase 9): al bajar, el contenido
 * se aleja ligeramente y se funde antes de entregar el foco a la siguiente
 * sección. Es una animación ligada al scroll (solo `transform`/`opacity`,
 * compuestas por la GPU).
 *
 * El `<h1>` vive dentro pero NO se anima al entrar: en reposo el envoltorio está
 * en su estado neutro (opacidad 1, sin desplazamiento), así que el LCP se pinta
 * de inmediato (§11).
 *
 * `prefers-reduced-motion` anula los recorridos — el paralaje es justo el tipo
 * de efecto que molesta a quien lo desactiva. No cambia el markup: en reposo los
 * valores son idénticos, así que la hidratación siempre coincide (ADR-011).
 */
export function HeroStage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 96]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);

  return (
    <m.div ref={ref} className={className} style={{ y, scale, opacity }}>
      {children}
    </m.div>
  );
}
