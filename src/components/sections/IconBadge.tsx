import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Chip con icono de marca. Decorativo (`aria-hidden`) y visible en ambos temas.
 * Dentro de una `SpotlightCard` (que es `group`) se enciende al pasar el cursor
 * o al enfocar con teclado, acompañando al resto de realces de la tarjeta.
 */
export function IconBadge({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return (
    <span
      className={cn(
        "bg-accent-cyan/10 text-accent-cyan ring-accent-cyan/20 inline-flex size-12 shrink-0 items-center justify-center rounded-xl ring-1 transition-[background-color,box-shadow] duration-300 ring-inset",
        "group-hover:bg-accent-cyan/15 group-hover:shadow-[0_0_26px_-8px_rgba(0,245,255,0.75)]",
        "group-focus-within:bg-accent-cyan/15 group-focus-within:shadow-[0_0_26px_-8px_rgba(0,245,255,0.75)]",
        className,
      )}
    >
      <Icon className="size-6" aria-hidden="true" />
    </span>
  );
}
