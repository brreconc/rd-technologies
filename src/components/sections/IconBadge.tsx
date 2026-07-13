import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/** Chip con icono de marca. Decorativo (aria-hidden); visible en ambos temas. */
export function IconBadge({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return (
    <span
      className={cn(
        "bg-accent-cyan/10 text-accent-cyan ring-accent-cyan/20 inline-flex size-12 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset",
        className,
      )}
    >
      <Icon className="size-6" aria-hidden="true" />
    </span>
  );
}
