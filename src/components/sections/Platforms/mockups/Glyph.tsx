import * as React from "react";

/**
 * Pictogramas mínimos para el interior de los mock-ups.
 *
 * Se dibujan aquí en vez de tirar de `lucide-react` a propósito: dentro del
 * dispositivo estos iconos miden 6–10 px, ninguno llega a ser identificable, y
 * añadir una docena de iconos reales solo engordaría el bundle (§11) para pintar
 * manchas. Son trazos de 1px que escalan con `1em`, así que siguen la tipografía
 * del mock-up sin cálculos.
 */
const PATHS = {
  home: "M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z",
  grid: "M3 3h7v7H3Zm11 0h7v7h-7ZM3 14h7v7H3Zm11 0h7v7h-7Z",
  chart: "M3 21V3m0 18h18M7 16v-5m5 5V7m5 9v-8",
  users: "M3 21v-2a5 5 0 0 1 10 0v2M8 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm13 18v-2a5 5 0 0 0-4-4.9",
  shield: "M12 3 4 6v6c0 5 3.4 8.2 8 9 4.6-.8 8-4 8-9V6Z",
  cog: "M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM12 2v3m0 14v3M2 12h3m14 0h3M4.9 4.9 7 7m10 10 2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1",
  search: "M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm5 12 5 5",
  bell: "M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Zm4 10a2 2 0 0 0 4 0",
  lock: "M5 11h14v10H5Zm3-1V7a4 4 0 0 1 8 0v3",
  user: "M4 21v-2a6 6 0 0 1 16 0v2M12 3a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z",
  check: "m4 12.5 5.5 5.5L20 6",
  refresh: "M3 12a9 9 0 0 1 15.5-6.2M21 12a9 9 0 0 1-15.5 6.2M18 3v5h-5M6 21v-5h5",
  clock: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm0 4.5V12l3.5 2.5",
  wrench: "M15 3a6 6 0 0 0-5.2 9L3 18.8 5.2 21 12 14.2A6 6 0 1 0 15 3Z",
  alert: "M12 3 1.5 21h21ZM12 10v5m0 3h.01",
  plus: "M12 5v14M5 12h14",
  dots: "M5 12h.01M12 12h.01M19 12h.01",
  chevron: "m9 5 7 7-7 7",
  list: "M4 6h16M4 12h16M4 18h16",
  box: "m12 2 9 5v10l-9 5-9-5V7Z",
} as const;

export type GlyphName = keyof typeof PATHS;

export function Glyph({ name, className }: { name: GlyphName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path d={PATHS[name]} />
    </svg>
  );
}
