"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

/**
 * Menú de navegación móvil (< lg). Usa Radix Dialog: trampa de foco, cierre con
 * Escape y roles ARIA correctos por defecto (§10).
 */
export function MobileNav() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menú">
          <Menu className="size-5" aria-hidden="true" />
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content className="border-border bg-background fixed inset-y-0 right-0 z-50 flex w-[min(20rem,85vw)] flex-col border-l p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <Dialog.Title className="font-display text-foreground text-base font-semibold">
              Menú
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Cerrar menú">
                <X className="size-5" aria-hidden="true" />
              </Button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">
            Navegación principal del sitio
          </Dialog.Description>

          <nav aria-label="Principal (móvil)" className="mt-6 flex flex-col gap-1">
            {siteConfig.nav.map((item) => (
              <Dialog.Close asChild key={item.href}>
                <a
                  href={item.href}
                  className="text-foreground hover:bg-surface rounded-md px-3 py-3 text-base transition-colors"
                >
                  {item.label}
                </a>
              </Dialog.Close>
            ))}
          </nav>

          <Dialog.Close asChild>
            <Button asChild className="mt-6">
              <a href="#contacto">Cotiza tu proyecto</a>
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
