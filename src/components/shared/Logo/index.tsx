import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { siteConfig } from "@/config/site";

/**
 * Wordmark de marca con el EMBLEMA OFICIAL de R&D Technologies (hexágono con la
 * "R" de nodos, `public/logo/emblem.png`) + el wordmark. El emblema lleva un halo
 * de gradiente y un leve zoom al hover. Accesible por lector de pantalla
 * (`aria-label` del enlace); la imagen es decorativa (`alt=""`).
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
      <span className="relative inline-flex shrink-0 items-center">
        {/* Halo de resplandor detrás del emblema. */}
        <span
          aria-hidden="true"
          className="from-accent-cyan/40 to-accent-purple/40 absolute inset-0 rounded-full bg-gradient-to-br opacity-60 blur-lg transition-opacity duration-300 group-hover:opacity-100"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo/emblem.png"
          alt=""
          aria-hidden="true"
          className="relative h-9 w-auto drop-shadow-[0_2px_10px_rgba(0,245,255,0.35)] transition-transform duration-300 group-hover:scale-105 sm:h-10"
        />
      </span>

      {/* `whitespace-nowrap`: el wordmark nunca se parte a media marca (§5.3.4). */}
      <span className="font-display flex flex-col leading-none whitespace-nowrap">
        <span className="text-foreground text-sm font-bold tracking-tight sm:text-base">
          <span className="text-gradient-animated">R&amp;D</span> Technologies
        </span>
        <span className="text-muted text-[0.5rem] font-medium tracking-[0.18em] uppercase sm:text-[0.6rem] sm:tracking-[0.24em]">
          Construimos confianza digital
        </span>
      </span>
    </Link>
  );
}
