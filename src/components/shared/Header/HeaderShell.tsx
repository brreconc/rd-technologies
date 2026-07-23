"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Envoltorio de la cabecera que reacciona al scroll (Fase 9): arriba del todo es
 * invisible y deja respirar al hero; en cuanto se hace scroll aparece el cristal
 * esmerilado, la sombra y una fina línea de gradiente.
 *
 * Solo mantiene un booleano de estado y escucha el scroll de forma pasiva, así
 * que no interfiere con el desplazamiento. La cabecera sigue siendo `sticky`
 * (nunca `fixed`) para no tapar contenido ni provocar saltos de layout.
 */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500",
        scrolled
          ? "border-border/60 bg-background/75 shadow-[0_12px_40px_-28px_rgba(0,0,0,0.9)] backdrop-blur-xl"
          : "border-transparent bg-transparent",
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className={cn(
          "via-accent-cyan/45 pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent to-transparent transition-opacity duration-500",
          scrolled ? "opacity-100" : "opacity-0",
        )}
      />
    </header>
  );
}
