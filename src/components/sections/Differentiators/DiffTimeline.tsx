"use client";

import * as React from "react";
import type { CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import { differentiators } from "@/lib/constants/differentiators";

/**
 * "Por qué elegirnos" como un TIMELINE HORIZONTAL de corte enterprise.
 *
 * Arriba, una línea fina con un nodo por motivo y un "playhead" luminoso que se
 * desliza a la parada activa (su posición se mide con precisión). Debajo, una
 * fila de TARJETAS-PANEL (una por motivo) que aparecen escalonadas al entrar en
 * pantalla; la del motivo activo se eleva y se enmarca con su color. Movimiento
 * sobrio y sincronizado (`var(--df-step)`), pensado para leerse como un producto
 * serio, no como un adorno.
 *
 * Accesibilidad / no-JS / `prefers-reduced-motion`: el contenido es una `<ol>`
 * real con los 5 motivos SIEMPRE visibles; sin `data-cycling` se muestra como
 * una rejilla estática (la línea superior es decorativa y se oculta). El bucle
 * se detiene fuera del viewport.
 */
const STEP_MS = 3400;
const N = differentiators.length;

export function DiffTimeline() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = React.useState(false);
  const [inView, setInView] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const [headX, setHeadX] = React.useState<number | null>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const railRef = React.useRef<HTMLDivElement>(null);
  const nodeRefs = React.useRef<(HTMLSpanElement | null)[]>([]);

  React.useEffect(() => {
    // Cliente-only e intencionado (progressive enhancement); en SSR va la rejilla.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (reduce) return;
    let visible = true;
    const el = rootRef.current;
    const io = el
      ? new IntersectionObserver(
          ([entry]) => {
            visible = entry.isIntersecting;
            if (entry.isIntersecting) setInView(true);
          },
          { threshold: 0.2 },
        )
      : null;
    if (el && io) io.observe(el);

    const id = window.setInterval(() => {
      if (visible) setActive((a) => (a + 1) % N);
    }, STEP_MS);

    return () => {
      window.clearInterval(id);
      io?.disconnect();
    };
  }, [reduce]);

  // Playhead: mide el centro exacto del nodo activo (robusto ante gap/zoom).
  const measure = React.useCallback(() => {
    const rail = railRef.current;
    const node = nodeRefs.current[active];
    if (!rail || !node) return;
    const rb = rail.getBoundingClientRect();
    const nb = node.getBoundingClientRect();
    setHeadX(nb.left + nb.width / 2 - rb.left);
  }, [active]);

  React.useEffect(() => {
    measure();
    const rail = railRef.current;
    if (!rail) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(rail);
    return () => ro.disconnect();
  }, [measure]);

  const cycling = mounted && !reduce;

  return (
    <div
      ref={rootRef}
      className="dfe"
      data-cycling={cycling ? "true" : undefined}
      data-inview={inView ? "true" : undefined}
      style={
        {
          "--df-accent": differentiators[active].accent,
          "--df-step": `${STEP_MS}ms`,
        } as CSSProperties
      }
    >
      {/* Línea superior con nodos + playhead (decorativa, solo escritorio). */}
      <div className="dfe-rail" ref={railRef} aria-hidden="true">
        <span className="dfe-line" />
        {/* Progreso luminoso: se llena de la izquierda hasta el playhead. */}
        <span className="dfe-fill" style={headX != null ? { width: `${headX}px` } : undefined}>
          <span className="dfe-fill-flow" />
        </span>
        <div className="dfe-nodes">
          {differentiators.map((item, i) => (
            <span
              key={item.title}
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
              className="dfe-node"
              data-active={i === active ? "true" : undefined}
              data-done={i <= active ? "true" : undefined}
              style={{ "--df-accent": item.accent } as CSSProperties}
            />
          ))}
        </div>
        <span className="dfe-head" style={headX != null ? { left: `${headX}px` } : undefined} />
      </div>

      {/* Tarjetas-panel: una por motivo, siempre en el DOM. */}
      <ol className="dfe-track">
        {differentiators.map((item, i) => (
          <li
            key={item.title}
            className="dfe-card"
            data-active={cycling && i === active ? "true" : undefined}
            style={{ "--df-accent": item.accent, "--i": i } as CSSProperties}
          >
            <span className="dfe-ic">
              <item.icon aria-hidden="true" />
            </span>
            <h3 className="dfe-title font-display">{item.title}</h3>
            <p className="dfe-desc">{item.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
