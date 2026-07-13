import * as React from "react";
import { cn } from "@/lib/utils/cn";

/** Tarjeta base (superficie con borde). Composición: Card + subpartes. */
export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "border-border bg-surface hover:border-accent-cyan/40 rounded-xl border p-6 transition-[transform,border-color] duration-300 hover:-translate-y-1 sm:p-8",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mb-4 flex flex-col gap-1.5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn("font-display text-foreground text-xl font-semibold", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-muted", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("text-muted", className)} {...props} />;
}
