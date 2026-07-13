"use client";

import { m, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { fadeUp, staggerContainer } from "@/lib/animations/framer-variants";

/**
 * Lista (`ul`/`ol`) que escalona la entrada de sus `StaggerItem` al hacer scroll.
 * Reduced-motion → renderiza la lista estática. Seguro sin JS (clase `reveal`).
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
  const reduce = useReducedMotion();

  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  const MotionList = as === "ol" ? m.ol : m.ul;
  return (
    <MotionList
      className={cn("reveal", className)}
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
  const reduce = useReducedMotion();
  if (reduce) return <li className={className}>{children}</li>;
  return (
    <m.li className={cn("reveal", className)} variants={fadeUp}>
      {children}
    </m.li>
  );
}
