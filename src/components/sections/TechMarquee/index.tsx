import { Marquee } from "@/components/animations/Marquee";
import { techStack } from "@/lib/constants/tech";

/**
 * Cinta de stack tecnológico (Fase 8, afinada en Fase 9). Banda compacta a todo
 * el ancho: cada tecnología es una "pastilla" con un nodo de gradiente que se
 * enciende al pasar el cursor, sobre una cinta que se desplaza en bucle y se
 * pausa al hover. Una etiqueta lateral fija ("STACK") ancla la sección y se
 * funde con la cinta mediante un degradado.
 */
export function TechMarquee() {
  return (
    <section
      aria-labelledby="tech-title"
      className="section-edge border-border bg-surface/30 relative overflow-hidden border-b py-5"
    >
      <h2 id="tech-title" className="sr-only">
        Tecnologías que dominamos
      </h2>

      {/* Etiqueta lateral fija (oculta en móvil por espacio). El bloque opaco +
          el degradado impiden que las pastillas se lean por debajo del rótulo. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden sm:flex">
        <span className="bg-background text-muted flex items-center pr-3 pl-6 font-mono text-[0.7rem] font-semibold tracking-[0.25em] uppercase">
          Stack
        </span>
        <span aria-hidden="true" className="from-background w-14 bg-gradient-to-r to-transparent" />
      </div>

      <Marquee speed="38s" gap="1.25rem">
        {techStack.map((tech) => (
          <span
            key={tech}
            className="group border-border bg-background/60 text-muted hover:text-foreground hover:border-accent-cyan/40 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-sm whitespace-nowrap transition-colors duration-300"
          >
            <span
              aria-hidden="true"
              className="from-accent-cyan to-accent-purple size-1.5 rounded-full bg-gradient-to-br transition-shadow duration-300 group-hover:shadow-[0_0_10px_2px_rgba(0,245,255,0.8)]"
            />
            {tech}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
