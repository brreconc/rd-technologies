"use client";

import * as React from "react";
import type { CSSProperties } from "react";
import { m, useReducedMotion } from "framer-motion";
import { rowIn, staggerContainer } from "@/lib/animations/framer-variants";
import { valueProps } from "@/lib/constants/value-props";

/**
 * Panel de estratos con LÍNEA DE TIEMPO AUTOMÁTICA (01 → 02 → 03 → reinicia).
 *
 * Antes el realce de cada estrato solo respondía a `:hover`/`:focus-within`.
 * Ahora una única fuente de verdad —el índice `active`— recorre los tres en
 * bucle a un ritmo fijo (`STEP_MS`), y TODA la coreografía premium se deriva de
 * ese estado: un REFLECTOR de luz se DESLIZA (glide) hasta la fila activa —lo
 * posiciona este componente midiendo la fila—, un HAZ baja por la espina hasta
 * el nodo siguiente para "entregarle" el testigo, un barrido de luz cruza la
 * fila, el nodo hace glow con un leve zoom, el subrayado de acento se dibuja y
 * los estratos en reposo se atenúan para enfocar la atención. Las animaciones de
 * CSS usan `var(--vpx-step)` (que fijamos aquí), así que su duración coincide
 * EXACTA con el reloj → sincronía perfecta.
 *
 * Accesibilidad/rendimiento: la lista sigue siendo una `<ol>` real con su
 * entrada escalonada; el bucle se detiene fuera del viewport
 * (IntersectionObserver) y no arranca con `prefers-reduced-motion` (queda el
 * primer estrato resaltado, sin movimiento). El hover/focus manuales siguen
 * funcionando por encima del ciclo.
 */
const STEP_MS = 2800;

export function StrataTimeline() {
  const reduce = useReducedMotion();
  const [active, setActive] = React.useState(0);
  const [spot, setSpot] = React.useState<{ y: number; h: number } | null>(null);
  const olRef = React.useRef<HTMLOListElement>(null);
  const itemRefs = React.useRef<(HTMLLIElement | null)[]>([]);

  // Avance del ciclo (se detiene fuera del viewport y no arranca con reduce).
  React.useEffect(() => {
    if (reduce) return;
    let visible = true;
    const el = olRef.current;
    const io = el
      ? new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { threshold: 0.2 })
      : null;
    if (el && io) io.observe(el);

    const id = window.setInterval(() => {
      if (visible) setActive((a) => (a + 1) % valueProps.strata.length);
    }, STEP_MS);

    return () => {
      window.clearInterval(id);
      io?.disconnect();
    };
  }, [reduce]);

  // Mide la fila activa para DESLIZAR el reflector hasta ella (y se re-mide si
  // cambia el tamaño del panel: zoom, fuentes, viewport…).
  const measure = React.useCallback(() => {
    const el = itemRefs.current[active];
    if (el) setSpot({ y: el.offsetTop, h: el.offsetHeight });
  }, [active]);

  React.useEffect(() => {
    measure();
    const ol = olRef.current;
    if (!ol) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(ol);
    return () => ro.disconnect();
  }, [measure]);

  return (
    <m.ol
      ref={olRef}
      className="vpx-strata reveal [perspective:1200px]"
      data-cycling={reduce ? undefined : "true"}
      style={{ "--vpx-step": `${STEP_MS}ms` } as CSSProperties}
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {/* Reflector que se desliza a la fila activa (glide). */}
      <span
        aria-hidden="true"
        className="vpx-spot"
        style={
          {
            transform: spot ? `translateY(${spot.y}px)` : undefined,
            height: spot ? `${spot.h}px` : undefined,
            "--spot-accent": valueProps.strata[active].accent,
          } as CSSProperties
        }
      />

      {valueProps.strata.map((stratum, index) => (
        <m.li
          key={stratum.title}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          className="vpx-stratum reveal"
          variants={rowIn}
          data-active={index === active ? "true" : undefined}
          style={{ "--own-accent": stratum.accent } as CSSProperties}
        >
          {/* Columna del nodo. La espina que baja hasta el siguiente estrato es
              el `::after` de este raíl; el HAZ que la recorre es el `::before`. */}
          <span aria-hidden="true" className="vpx-rail">
            <span className="vpx-node">
              <stratum.icon className="size-5" />
            </span>
          </span>

          <div className="vpx-body">
            <p className="vpx-tag" aria-hidden="true">
              <span className="vpx-ord">{String(index + 1).padStart(2, "0")}</span>
              {stratum.tag}
            </p>
            <h3 className="vpx-title font-display">{stratum.title}</h3>
            <p className="vpx-desc">{stratum.description}</p>
          </div>

          <span aria-hidden="true" className="vpx-edge" />
        </m.li>
      ))}
    </m.ol>
  );
}
