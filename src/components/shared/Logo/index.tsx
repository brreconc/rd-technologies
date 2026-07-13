import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { siteConfig } from "@/config/site";

/**
 * Wordmark tipográfico de la marca (sin logo gráfico aún — §19.5).
 * Enlaza al inicio y es accesible por lector de pantalla.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} — Inicio`}
      className={cn(
        "font-display text-foreground text-lg font-bold tracking-tight",
        "rounded-md transition-opacity hover:opacity-90",
        className,
      )}
    >
      <span className="text-gradient-brand">R&amp;D</span> Technologies
    </Link>
  );
}
