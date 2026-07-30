"use client";

import { LazyMotion, MotionConfig } from "framer-motion";

// Carga diferida del motor de animación (chunk aparte, fuera del JS inicial).
const loadFeatures = () => import("@/lib/animations/motion-features").then((mod) => mod.default);

/**
 * Proveedores globales de la aplicación (§7).
 * - `LazyMotion`: carga solo las features `domAnimation` de Framer Motion y
 *   habilita los componentes ligeros `m.*` (en vez de `motion.*`), reduciendo
 *   mucho el bundle inicial (§11). `strict` obliga a usar `m` en todo el árbol.
 * - `MotionConfig reducedMotion="user"`: si el sistema pide menos movimiento,
 *   Framer ignora las animaciones de transformación en todo el árbol (ADR-011).
 *   Es la red de seguridad que permite que NINGÚN componente cambie su markup
 *   según `useReducedMotion()` — hacerlo rompía la hidratación, porque ese hook
 *   devuelve `null` en el servidor y `true` en el cliente.
 *
 * Ya NO hay proveedor de tema: el sitio es de tema oscuro único (ADR-012), así
 * que la paleta vive entera en CSS y no hace falta estado en cliente ni el
 * script anti-parpadeo que `next-themes` inyectaba en el <head>.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
