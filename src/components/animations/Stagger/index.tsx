"use client";

import { m } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { cardIn, staggerContainer } from "@/lib/animations/framer-variants";

/**
 * Lista (`ul`/`ol`) que escalona la entrada de sus `StaggerItem` al hacer scroll.
 * La perspectiva del contenedor es la que da profundidad al giro 3D de cada
 * ítem (ver `cardIn`).
 *
 * `prefers-reduced-motion` se respeta SIN bifurcar el markup (ADR-011): la clase
 * `reveal` la neutraliza el CSS y `MotionConfig` desactiva las transformaciones.
 * Por la misma vía queda visible sin JavaScript.
 */
export function Stagger({
  as = "ul",
  className,
  children,
}: {
  as?: "ul" | "ol";
  className?: string;
  children: React.ReactNode;
}) {
  const MotionList = as === "ol" ? m.ol : m.ul;
  return (
    <MotionList
      className={cn("reveal [perspective:1200px]", className)}
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {children}
    </MotionList>
  );
}

/** Ítem (`li`) de una lista `Stagger`. */
export function StaggerItem({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <m.li className={cn("reveal", className)} variants={cardIn}>
      {children}
    </m.li>
  );
}
