"use client";

import { useTheme } from "next-themes";
import { m, useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useMounted } from "@/lib/hooks/use-mounted";

/**
 * Switch de tema "premium" (§6.3): una pista tipo interruptor con un pomo que
 * se desliza (muelle) entre luna (oscuro) y sol (claro), con resplandor de marca
 * y los iconos que aparecen/desaparecen. Detalle VIP sin coste real.
 *
 * Accesibilidad: es un `role="switch"` con `aria-checked` (marcado = tema claro),
 * operable por teclado como cualquier botón, con `aria-label` descriptivo y área
 * táctil ≥44px. `useMounted` evita el mismatch de hidratación (el tema real solo
 * se conoce en cliente). `prefers-reduced-motion` → el pomo salta sin muelle.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const reduce = useReducedMotion();
  const mounted = useMounted();
  const isDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={!isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Activar tema claro" : "Activar tema oscuro"}
      className="group border-border bg-surface hover:border-accent-cyan/50 relative inline-flex h-11 w-[4.25rem] items-center rounded-full border p-1 transition-colors"
    >
      {/* Iconos de fondo a ambos lados de la pista. */}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-between px-2.5">
        <Sun
          className={`size-4 transition-colors ${isDark ? "text-muted/50" : "text-accent-yellow"}`}
          aria-hidden="true"
        />
        <Moon
          className={`size-4 transition-colors ${isDark ? "text-accent-cyan" : "text-muted/50"}`}
          aria-hidden="true"
        />
      </span>

      {/* Pomo deslizante con resplandor. */}
      <m.span
        aria-hidden="true"
        initial={false}
        animate={{ x: isDark ? 0 : "1.75rem" }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 32 }}
        className="from-accent-cyan to-accent-purple relative z-10 flex size-8 items-center justify-center rounded-full bg-gradient-to-br shadow-[0_0_16px_-2px_rgba(0,245,255,0.7)]"
      >
        {isDark ? (
          <Moon className="text-on-accent size-4" aria-hidden="true" />
        ) : (
          <Sun className="text-on-accent size-4" aria-hidden="true" />
        )}
      </m.span>
      <span className="sr-only">Cambiar tema</span>
    </button>
  );
}
