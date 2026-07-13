import * as React from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Área de texto multilínea del sistema de diseño. Comparte estilo con `Input`
 * (ui/input). Altura mínima cómoda y `resize-y` para no romper el layout en
 * anchos pequeños (§5.3: sin desbordamientos horizontales).
 */
export function Textarea({ className, rows = 5, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      rows={rows}
      className={cn(
        "border-border bg-surface text-foreground flex min-h-28 w-full resize-y rounded-lg border px-4 py-3",
        "placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-accent-cyan",
        className,
      )}
      {...props}
    />
  );
}
