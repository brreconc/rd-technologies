"use client";

import * as React from "react";
import { useInView, useReducedMotion, animate } from "framer-motion";

/**
 * Número que "cuenta" desde 0 hasta su valor cuando entra en el viewport
 * (Fase 8). Detalle premium para bandas de estadísticas / prueba social.
 *
 * - Arranca una sola vez, al ser visible (`useInView`, once).
 * - `prefers-reduced-motion` → no se anima: el número ya está pintado.
 * - El HTML renderizado contiene SIEMPRE el valor final (ADR-011). Así el
 *   servidor y el cliente coinciden (nada de desajustes de hidratación), la
 *   página es correcta sin JavaScript y los buscadores leen la cifra real; la
 *   cuenta ascendente es puramente un adorno que añade el cliente.
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
    if (!node || reduce || !inView) return;

    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = format(v);
      },
    });
    return () => {
      controls.stop();
      node.textContent = format(value);
    };
  }, [inView, reduce, value, duration, format]);

  return <span ref={ref}>{format(value)}</span>;
}
