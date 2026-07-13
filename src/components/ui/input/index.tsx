import * as React from "react";
import { cn } from "@/lib/utils/cn";

/** Campo de entrada base. Cumple touch target de 44px (§5.3.10). */
export function Input({ className, type = "text", ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "border-border bg-surface text-foreground flex min-h-11 w-full rounded-lg border px-4 py-2",
        "placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-accent-cyan",
        className,
      )}
      {...props}
    />
  );
}

/** Etiqueta asociada a un control de formulario. */
export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn("text-foreground mb-1.5 block text-sm font-medium", className)}
      {...props}
    />
  );
}
