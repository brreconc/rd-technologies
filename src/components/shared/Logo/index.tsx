import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { siteConfig } from "@/config/site";

/**
 * Wordmark de marca (Fase 8): marca gráfica "de nodo" (evoca red/seguridad) con
 * resplandor de gradiente + wordmark. "R&D" lleva el gradiente de marca animado
 * y "TECHNOLOGIES" en versalitas espaciadas. Accesible por lector de pantalla
 * (`aria-label`); el SVG es decorativo (`aria-hidden`).
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} — Inicio`}
      className={cn(
        "group flex items-center gap-2.5 rounded-md transition-opacity hover:opacity-95",
        className,
      )}
    >
      <span className="relative inline-flex size-9 shrink-0 items-center justify-center">
        {/* Halo de resplandor. */}
        <span
          aria-hidden="true"
          className="from-accent-cyan/40 to-accent-purple/40 absolute inset-0 rounded-xl bg-gradient-to-br blur-md transition-opacity duration-300 group-hover:opacity-100 sm:opacity-70"
        />
        <svg
          viewBox="0 0 32 32"
          aria-hidden="true"
          className="relative size-9 transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="var(--accent-cyan)" />
              <stop offset="1" stopColor="var(--accent-purple)" />
            </linearGradient>
          </defs>
          <rect x="1.5" y="1.5" width="29" height="29" rx="8" fill="var(--surface)" />
          <rect
            x="1.5"
            y="1.5"
            width="29"
            height="29"
            rx="8"
            fill="none"
            stroke="url(#logo-grad)"
            strokeWidth="1.5"
          />
          {/* Grafo de nodos: aristas + nodos. */}
          <g stroke="url(#logo-grad)" strokeWidth="1.4" strokeLinecap="round">
            <line x1="9" y1="22" x2="16" y2="10" />
            <line x1="16" y1="10" x2="23" y2="18" />
            <line x1="9" y1="22" x2="23" y2="18" />
          </g>
          <g fill="url(#logo-grad)">
            <circle cx="9" cy="22" r="2.6" />
            <circle cx="16" cy="10" r="2.6" />
            <circle cx="23" cy="18" r="2.6" />
          </g>
        </svg>
      </span>
      <span className="font-display flex flex-col leading-none">
        <span className="text-foreground text-base font-bold tracking-tight">
          <span className="text-gradient-animated">R&amp;D</span> Technologies
        </span>
        <span className="text-muted text-[0.6rem] font-medium tracking-[0.28em] uppercase">
          Software · Security
        </span>
      </span>
    </Link>
  );
}
