"use client";

import * as React from "react";
import { useInView, useReducedMotion, animate } from "framer-motion";

/**
 * Número que "cuenta" desde 0 hasta su valor cuando entra en el viewport
 * (Fase 8). Detalle premium para bandas de estadísticas / prueba social.
 *
 * - Arranca una sola vez, al ser visible (`useInView`, once).
 * - `prefers-reduced-motion` → pinta el valor final directamente, sin animar.
 * - El valor accesible es el texto final (no hay ARIA extra: el nodo muestra
 *   siempre un número legible; durante la animación es una cuenta ascendente).
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.6,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  const format = React.useCallback(
    (n: number) => `${prefix}${n.toFixed(decimals)}${suffix}`,
    [prefix, suffix, decimals],
  );

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduce || !inView) {
      if (reduce) node.textContent = format(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = format(v);
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, duration, format]);

  return (
    <span ref={ref} aria-label={format(value)}>
      {format(reduce ? value : 0)}
    </span>
  );
}
