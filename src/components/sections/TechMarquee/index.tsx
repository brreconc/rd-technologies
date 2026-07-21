import { Marquee } from "@/components/animations/Marquee";
import { techStack } from "@/lib/constants/tech";

/**
 * Cinta de stack tecnológico (Fase 8). Banda a todo el ancho, sin `Container`,
 * para que la cinta "respire" de borde a borde. Decorativa a nivel de sección
 * pero informativa: se anuncia con un encabezado accesible oculto.
 */
export function TechMarquee() {
  return (
    <section aria-labelledby="tech-title" className="border-border overflow-hidden border-t py-10">
      <h2 id="tech-title" className="sr-only">
        Tecnologías que dominamos
      </h2>
      <Marquee speed="40s" gap="4rem">
        {techStack.map((tech) => (
          <span
            key={tech}
            className="font-display text-muted/70 hover:text-foreground text-xl font-semibold whitespace-nowrap transition-colors sm:text-2xl"
          >
            {tech}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
