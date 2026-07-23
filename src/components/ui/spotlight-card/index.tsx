"use client";

import * as React from "react";
import { m, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

/** Props de div, sin los handlers que Framer Motion redefine con otra firma. */
type DivProps = Omit<
  React.ComponentProps<"div">,
  "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
>;

interface SpotlightCardProps extends DivProps {
  /** Inclinación 3D máxima en grados (0 la desactiva). */
  tilt?: number;
}

/**
 * Tarjeta "viva" (Fase 8, ampliada en Fase 9). Combina efectos GPU-friendly que
 * reaccionan al puntero, todos con degradado a un estado seguro:
 *  - Spotlight: un resplandor radial (`--mx`/`--my`) sigue al cursor (CSS).
 *  - Tilt 3D: rota levemente hacia el puntero con un muelle (limitado para no
 *    desbordar nunca; ver §5.3.4).
 *  - Borde de gradiente que se enciende al hover/focus (`.gradient-border`).
 *  - Esquinas de HUD que se despliegan al hover/focus (`.hud-corners`): el guiño
 *    de "consola de seguridad" que hilvana la estética de toda la página.
 *
 * Accesibilidad/rendimiento: con `prefers-reduced-motion` no se registran los
 * listeners de puntero ni el realce de hover, así que la tarjeta se queda
 * quieta. El markup NO cambia (ADR-011) — los manejadores no viajan en el HTML,
 * de modo que la hidratación siempre coincide. Los realces responden también a
 * `:focus-within`, así que el teclado percibe lo mismo que el ratón.
 */
export function SpotlightCard({ className, children, tilt = 6, ...props }: SpotlightCardProps) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);

  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    // Spotlight (porcentaje dentro de la tarjeta).
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    // Tilt: centrado en 0.5; invertido en X para "empujar" hacia el cursor.
    if (tilt > 0) {
      ry.set((px - 0.5) * tilt * 2);
      rx.set((0.5 - py) * tilt * 2);
    }
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <m.div
      ref={ref}
      className={cn(
        "spotlight gradient-border card-sheen border-border bg-surface hover:border-accent-cyan/40 group relative rounded-xl border p-6 transition-colors duration-300 sm:p-8",
        className,
      )}
      onPointerMove={reduce ? undefined : handlePointerMove}
      onPointerLeave={reduce ? undefined : reset}
      whileHover={reduce ? undefined : { y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      style={{
        rotateX: rx,
        rotateY: ry,
        transformPerspective: 900,
        transformStyle: "preserve-3d",
      }}
      {...props}
    >
      <span aria-hidden="true" className="hud-corners" />
      {children}
    </m.div>
  );
}
