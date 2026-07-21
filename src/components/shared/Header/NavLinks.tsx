"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { siteConfig } from "@/config/site";

/**
 * Navegación de escritorio con "scroll-spy" (Fase 8): resalta el enlace de la
 * sección visible mientras se hace scroll y anima un subrayado de gradiente bajo
 * el activo. El desplazamiento al hacer clic es nativo por ancla (`scroll-mt`
 * en cada `Section` compensa la cabecera fija → aterriza exacto en el título).
 *
 * Accesibilidad: los enlaces siguen siendo `<a href="#...">` reales (funcionan
 * sin JS); el estado activo se expone con `aria-current="true"`. El observer solo
 * añade realce visual — no cambia el comportamiento base.
 */
export function NavLinks() {
  const ids = React.useMemo(() => siteConfig.nav.map((item) => item.href.replace(/^#/, "")), []);
  const [active, setActive] = React.useState<string | null>(null);

  React.useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    // Se considera "activa" la sección cuya parte superior cruza la banda alta
    // del viewport (justo bajo la cabecera). Elegimos la más abajo que ya entró.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return (
    <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
      {siteConfig.nav.map((item) => {
        const id = item.href.replace(/^#/, "");
        const isActive = active === id;
        return (
          <a
            key={item.href}
            href={item.href}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "group relative rounded-md px-3 py-2 text-sm transition-colors",
              isActive ? "text-foreground" : "text-muted hover:text-foreground",
            )}
          >
            {item.label}
            <span
              aria-hidden="true"
              className={cn(
                "from-accent-cyan to-accent-purple absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded-full bg-gradient-to-r transition-transform duration-300 ease-out",
                isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
              )}
            />
          </a>
        );
      })}
    </nav>
  );
}
