import type { CSSProperties } from "react";
import { Marquee } from "@/components/animations/Marquee";
import { techStack } from "@/lib/constants/tech";

/**
 * Cinta de stack tecnológico (Fase 8 → rediseño "ultra premium"). Banda a todo
 * el ancho con luz ambiental y una hairline superior encendida. Cada tecnología
 * es una PÍLDORA de vidrio con borde en degradado (anillo cónico), un nodo
 * luminoso con el **color de marca real** de esa tecnología (Docker azul, AWS
 * naranja, GraphQL rosa…) que pulsa, y un destello que la barre al hover, sobre
 * una cinta que se desplaza en bucle y se pausa al pasar el cursor. Una etiqueta
 * lateral fija ("STACK") en degradado de marca ancla la sección.
 *
 * Todo es CSS (`.tech-*` en styles/sections/tech-marquee.css): sin imágenes ni
 * dependencias (CSP estricta), cero peticiones de red y cero peso de imágenes.
 */
export function TechMarquee() {
  return (
    <section
      aria-labelledby="tech-title"
      className="tech-band section-edge border-border relative overflow-hidden border-b"
    >
      <h2 id="tech-title" className="sr-only">
        Tecnologías que dominamos
      </h2>

      {/* Hairline superior encendida (decorativa). */}
      <span aria-hidden="true" className="tech-band-glow" />

      {/* Etiqueta lateral fija (oculta en móvil por espacio). El bloque opaco +
          el degradado impiden que las píldoras se lean por debajo del rótulo. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden sm:flex">
        <span className="tech-label">Stack</span>
        <span aria-hidden="true" className="tech-label-fade" />
      </div>

      <Marquee speed="42s" gap="0.85rem">
        {techStack.map((tech, i) => (
          <span
            key={tech.name}
            className="tech-chip"
            style={{ "--glow": tech.color, "--i": i } as CSSProperties}
          >
            <span aria-hidden="true" className="tech-node" />
            {tech.name}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
