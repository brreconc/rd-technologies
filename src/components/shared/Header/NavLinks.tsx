"use client";

import * as React from "react";
import { m, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { siteConfig } from "@/config/site";

/**
 * Navegación de escritorio con "scroll-spy" + pastilla deslizante (Fase 9).
 *
 * - Un `IntersectionObserver` marca la sección visible (`aria-current`).
 * - Una ÚNICA pastilla se desliza con muelle hasta el enlace resaltado: el que
 *   tiene puntero o foco y, si no hay ninguno, el de la sección activa. Animar
 *   un solo elemento (en vez de un fondo por enlace) mantiene el coste constante.
 * - Al hacer clic, el desplazamiento es el nativo del ancla; el `scroll-mt` de
 *   cada `Section` compensa la cabecera para aterrizar justo en el título.
 *
 * Accesibilidad: los enlaces son `<a href="#…">` reales (funcionan sin JS); la
 * pastilla es `aria-hidden` y el estado activo se expone con `aria-current`,
 * reforzado con un subrayado de gradiente (no solo color, §10).
 */
export function NavLinks() {
  const reduce = useReducedMotion();
  const ids = React.useMemo(() => siteConfig.nav.map((item) => item.href.replace(/^#/, "")), []);
  const [active, setActive] = React.useState<string | null>(null);
  const [focused, setFocused] = React.useState<string | null>(null);
  const [pill, setPill] = React.useState<{ x: number; width: number } | null>(null);

  const navRef = React.useRef<HTMLElement>(null);
  const itemsRef = React.useRef(new Map<string, HTMLAnchorElement>());

  // --- Scroll-spy: activa la sección más alta que cruza la banda superior del
  // viewport (justo bajo la cabecera).
  React.useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  // --- Posición de la pastilla. Se remide si cambia el resaltado o el ancho del
  // nav (zoom, rotación del dispositivo, carga tardía de la tipografía…).
  const highlighted = focused ?? active;
  React.useEffect(() => {
    const nav = navRef.current;
    const el = highlighted ? itemsRef.current.get(highlighted) : undefined;
    if (!nav || !el) {
      setPill(null);
      return;
    }
    const measure = () => setPill({ x: el.offsetLeft, width: el.offsetWidth });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    return () => observer.disconnect();
  }, [highlighted]);

  return (
    <nav
      ref={navRef}
      aria-label="Principal"
      // A partir de `xl`, no de `lg`: con seis destinos los rótulos completos
      // ("Preguntas frecuentes", "Casos de uso") no caben a 1024px y se partían
      // en varias líneas. Entre 1024 y 1279px manda el menú móvil, que ya es
      // una hoja lateral completa. Se prefiere eso a recortar los rótulos.
      className="relative hidden items-center gap-1 xl:flex"
      onPointerLeave={() => setFocused(null)}
    >
      {pill && (
        <m.span
          aria-hidden="true"
          className="bg-surface-2/70 ring-accent-cyan/25 pointer-events-none absolute inset-y-1 left-0 rounded-full ring-1"
          initial={false}
          animate={{ x: pill.x, width: pill.width }}
          transition={
            reduce ? { duration: 0 } : { type: "spring", stiffness: 460, damping: 36, mass: 0.7 }
          }
        />
      )}

      {siteConfig.nav.map((item) => {
        const id = item.href.replace(/^#/, "");
        const isActive = active === id;
        return (
          <a
            key={item.href}
            href={item.href}
            ref={(node) => {
              if (node) itemsRef.current.set(id, node);
              else itemsRef.current.delete(id);
            }}
            aria-current={isActive ? "true" : undefined}
            onPointerEnter={() => setFocused(id)}
            onFocus={() => setFocused(id)}
            onBlur={() => setFocused(null)}
            className={cn(
              "relative z-10 rounded-full px-3.5 py-2 text-sm whitespace-nowrap transition-colors duration-300",
              isActive ? "text-foreground" : "text-muted hover:text-foreground",
            )}
          >
            {item.label}
            <span
              aria-hidden="true"
              className={cn(
                "from-accent-cyan to-accent-purple absolute inset-x-3.5 bottom-1 h-0.5 origin-left rounded-full bg-gradient-to-r transition-transform duration-300 ease-out",
                isActive ? "scale-x-100" : "scale-x-0",
              )}
            />
          </a>
        );
      })}
    </nav>
  );
}
