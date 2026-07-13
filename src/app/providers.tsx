"use client";

import { ThemeProvider } from "next-themes";

/**
 * Proveedores globales de la aplicación (§7).
 * Por ahora solo el tema (oscuro por defecto). El toggle claro/oscuro se
 * añadirá en la Fase 1; la infraestructura ya queda lista aquí.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
