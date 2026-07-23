"use client";

import * as React from "react";
import { m, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * Envoltura "magnética" (Fase 8): el contenido (normalmente un CTA) se desplaza
 * suavemente hacia el cursor mientras está encima y vuelve a su sitio al salir,
 * con un muelle. Efecto sutil y muy usado en sitios premium.
 *
 * - Solo interacción de puntero: no altera el foco ni el orden de tabulación,
 *   así que la accesibilidad por teclado es idéntica.
 * - `prefers-reduced-motion` → no se registran los listeners. El markup NO
 *   cambia (ADR-011): los manejadores no forman parte del HTML, así que la
 *   hidratación coincide siempre.
 *
 * Se aplica sobre un `inline-block` para no romper el layout del botón interno.
 */
export function MagneticButton({
  children,
  strength = 18,
  className,
}: {
  children: React.ReactNode;
  /** Desplazamiento máximo en px hacia el cursor. */
  strength?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLSpanElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 16 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 16 });

  const onMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set((dx / (rect.width / 2)) * strength);
    y.set((dy / (rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.span
      ref={ref}
      className={className}
      style={{ x, y, display: "inline-block" }}
      onPointerMove={reduce ? undefined : onMove}
      onPointerLeave={reduce ? undefined : reset}
    >
      {children}
    </m.span>
  );
}
