"use client";

import { m, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { EASE_OUT } from "@/lib/animations/framer-variants";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Retraso en segundos (para escalonar manualmente). */
  delay?: number;
  /** Desplazamiento vertical inicial en px. */
  y?: number;
  /** `scroll`: al entrar en viewport. `mount`: al montar (para el hero). */
  mode?: "scroll" | "mount";
  /** Añade un desenfoque de entrada (efecto "enfoque" cinematográfico). */
  blur?: boolean;
}

/**
 * Revela su contenido con un fade + subida. Requisitos §5.4/§10:
 * - Respeta `prefers-reduced-motion` (renderiza estático).
 * - Seguro sin JS: la clase `reveal` se fuerza visible vía <noscript> (layout).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  mode = "scroll",
  blur = false,
}: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  const target = { opacity: 1, y: 0, filter: blur ? "blur(0px)" : undefined };
  const initial = { opacity: 0, y, filter: blur ? "blur(10px)" : undefined };
  const animation =
    mode === "mount"
      ? { animate: target }
      : { whileInView: target, viewport: { once: true, margin: "-10% 0px" } };

  return (
    <m.div
      className={cn("reveal", className)}
      initial={initial}
      transition={{ duration: blur ? 0.7 : 0.5, delay, ease: EASE_OUT }}
      {...animation}
    >
      {children}
    </m.div>
  );
}
