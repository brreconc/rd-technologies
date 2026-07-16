"use client";

import { ThemeProvider } from "next-themes";
import { LazyMotion } from "framer-motion";

// Carga diferida del motor de animación (chunk aparte, fuera del JS inicial).
const loadFeatures = () => import("@/lib/animations/motion-features").then((mod) => mod.default);

/**
 * Proveedores globales de la aplicación (§7).
 * - `ThemeProvider`: tema claro/oscuro (oscuro por defecto).
 * - `LazyMotion`: carga solo las features `domAnimation` de Framer Motion y
 *   habilita los componentes ligeros `m.*` (en vez de `motion.*`), reduciendo
 *   mucho el bundle inicial (§11). `strict` obliga a usar `m` en todo el árbol.
 */
export function Providers({ children, nonce }: { children: React.ReactNode; nonce?: string }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      nonce={nonce}
    >
      <LazyMotion features={loadFeatures} strict>
        {children}
      </LazyMotion>
    </ThemeProvider>
  );
}
