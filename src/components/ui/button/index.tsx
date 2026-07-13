import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

/**
 * Botón base del sistema de diseño. Variantes con `cva`.
 * `asChild` (Radix Slot) permite renderizar como `<a>` u otro elemento
 * manteniendo estilos y semántica (útil para CTAs que son enlaces).
 * Todas las tallas cumplen el touch target mínimo de 44px (§5.3.10).
 */
const buttonVariants = cva(
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-[transform,background-color,color,border-color,filter] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-accent-cyan text-on-accent hover:brightness-110 active:brightness-95",
        secondary: "border border-border bg-surface text-foreground hover:bg-surface-2",
        outline: "border border-border text-foreground hover:bg-surface",
        ghost: "text-foreground hover:bg-surface",
      },
      size: {
        sm: "min-h-9 px-4 text-sm",
        md: "min-h-11 px-6 py-3",
        lg: "min-h-12 px-8 text-lg",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
