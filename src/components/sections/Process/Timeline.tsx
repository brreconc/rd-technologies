"use client";

import * as React from "react";
import { m, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { EASE_OUT } from "@/lib/animations/framer-variants";

/** Posición horizontal del raíl, alineada con el centro del marcador (size-12). */
const RAIL = "left-[23px]";

interface TimelineProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Línea de tiempo del proceso (Fase 9, ADR-011). Sustituye a la rejilla de
 * tarjetas por un recorrido vertical: un raíl que **se ilumina conforme se baja**
 * y una luz que viaja por delante marcando el punto de lectura.
 *
 * Es la pieza que convierte el scroll en narración: el usuario ve avanzar el
 * proceso literalmente mientras lee, lo que invita a seguir bajando.
 *
 * El relleno del raíl es un indicador de progreso ligado al scroll (como la
 * barra superior de lectura), así que se mantiene con `prefers-reduced-motion`;
 * lo que sí se desactiva es el suavizado por muelle, que añadiría movimiento
 * propio. El markup no cambia nunca (ADR-011).
 */
export function Timeline({ children, className }: TimelineProps) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const smoothed = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });
  const progress = reduce ? scrollYProgress : smoothed;

  const tipTop = useTransform(progress, (value) => `${value * 100}%`);
  const tipOpacity = useTransform(progress, [0, 0.02, 0.98, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <span aria-hidden="true" className={cn("absolute top-3 bottom-3 w-px", RAIL)}>
        <span className="bg-border absolute inset-0" />
        <m.span
          style={{ scaleY: progress }}
          className="from-accent-cyan to-accent-purple absolute inset-0 origin-top bg-gradient-to-b"
        />
        <m.span
          style={{ top: tipTop, opacity: tipOpacity }}
          className="bg-accent-cyan absolute left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_14px_3px_rgba(0,245,255,0.6)]"
        />
      </span>
      <ol className="flex flex-col gap-10">{children}</ol>
    </div>
  );
}

interface TimelineStepProps {
  /** Índice 0-based; se muestra como "01", "02"… */
  index: number;
  /** Marcador (icono) renderizado en el servidor. */
  marker: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Paso de la línea de tiempo. Entra desde la izquierda al alcanzarlo el scroll y
 * su marcador se enciende. La clase `reveal` garantiza que quede visible sin JS
 * y con `prefers-reduced-motion`.
 */
export function TimelineStep({ index, marker, children }: TimelineStepProps) {
  return (
    <m.li
      className="reveal relative pl-[4.5rem]"
      initial={{ opacity: 0, x: -18, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-18% 0px" }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
    >
      <span
        aria-hidden="true"
        className="border-border bg-background absolute top-0 left-0 flex size-12 items-center justify-center rounded-full border"
      >
        {marker}
      </span>
      <div className="pt-1">
        <p
          aria-hidden="true"
          className="text-gradient-brand font-display mb-1 text-xs font-bold tracking-[0.25em]"
        >
          {String(index + 1).padStart(2, "0")}
        </p>
        {children}
      </div>
    </m.li>
  );
}
