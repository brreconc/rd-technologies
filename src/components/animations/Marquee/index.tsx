import * as React from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Cinta infinita horizontal (Fase 8). Una única pista flex contiene el contenido
 * DUPLICADO y se desplaza un 50% en bucle (CSS puro, `.marquee`/`.marquee-track`
 * en globals.css): al llegar al 50% el segundo juego queda exactamente donde
 * empezaba el primero → bucle sin costuras y sin JavaScript (no infla el bundle).
 *
 * - Se pausa al pasar el cursor y se detiene con `prefers-reduced-motion`.
 * - La copia se marca `aria-hidden` con `display:contents` para no duplicar el
 *   contenido al lector de pantalla ni romper el espaciado del flex.
 * - `overflow-hidden` garantiza cero desbordamiento horizontal (§5.3.4).
 */
export function Marquee({
  children,
  className,
  speed = "34s",
  gap = "3rem",
  reverse = false,
}: {
  children: React.ReactNode;
  className?: string;
  /** Duración de una vuelta (mayor = más lento). */
  speed?: string;
  gap?: string;
  reverse?: boolean;
}) {
  const style = {
    "--speed": speed,
    "--gap": gap,
    animationDirection: reverse ? "reverse" : undefined,
  } as React.CSSProperties;

  return (
    <div className={cn("marquee", className)}>
      <div className="marquee-track" style={style}>
        {children}
        <span style={{ display: "contents" }} aria-hidden="true">
          {children}
        </span>
      </div>
    </div>
  );
}
