"use client";

import * as React from "react";
import { NeuralNetwork } from "@/components/animations/NeuralNetwork";

/**
 * Escenografía del hero (Fase 9): la malla neuronal en `<canvas>`, el velo de
 * legibilidad y el pequeño HUD que refleja lo que ocurre en la simulación.
 *
 * El HUD está etiquetado explícitamente como "simulación": es parte del relato
 * visual (la red se defiende sola), no una métrica de negocio. Es `aria-hidden`
 * porque no aporta información al lector de pantalla.
 */
export function HeroBackdrop() {
  const [blocked, setBlocked] = React.useState(0);
  const handleBlocked = React.useCallback(() => setBlocked((n) => n + 1), []);

  return (
    <>
      <NeuralNetwork onThreatBlocked={handleBlocked} />

      {/* Velo radial: mantiene el texto legible sin apagar la malla en los bordes. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(52% 46% at 50% 42%, color-mix(in srgb, var(--bg) 80%, transparent), transparent 78%)",
        }}
      />
      {/* Desvanecido inferior: cose el hero con la sección siguiente. */}
      <div
        aria-hidden="true"
        className="from-background pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t to-transparent"
      />

      <div
        aria-hidden="true"
        className="text-muted/70 pointer-events-none absolute bottom-5 left-6 hidden items-center gap-2 font-mono text-[0.65rem] tracking-[0.18em] uppercase sm:flex"
      >
        <span className="relative flex size-1.5 shrink-0">
          <span className="bg-accent-cyan absolute inline-flex size-full animate-ping rounded-full opacity-70" />
          <span className="bg-accent-cyan relative inline-flex size-1.5 rounded-full" />
        </span>
        <span>Simulación</span>
        <span className="text-border">·</span>
        <span className="tabular-nums">
          {blocked === 0
            ? "malla activa"
            : `${blocked} ${blocked === 1 ? "intrusión neutralizada" : "intrusiones neutralizadas"}`}
        </span>
      </div>
    </>
  );
}
