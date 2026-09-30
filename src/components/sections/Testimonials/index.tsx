import { Quote } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import { testimonials } from "@/lib/constants/testimonials";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Sección "Testimonios" (§8.7). Contenido de EJEMPLO (§19.9).
 *
 * Comparte la MISMA línea de diseño que "Servicios"/"Casos de uso": tarjetas
 * `SpotlightCard` con la corriente de energía que orbita el borde (`.svc-*`).
 * Información compacta: una cita breve y el autor. Autor anonimizado.
 */
export function Testimonials() {
  return (
    <Section id="testimonios" aria-labelledby="testi-title" className="section-edge">
      <Container>
        <SectionHeading
          id="testi-title"
          centered
          eyebrow="Testimonios"
          title="Historias de confianza"
          highlight="confianza"
          description="Ejemplos ilustrativos — se reemplazarán por testimonios reales."
        />

        <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.role}>
              <SpotlightCard className="svc-card flex h-full flex-col gap-3 p-5 sm:p-6">
                {/* Corriente de energía que orbita el borde al enfocar la tarjeta. */}
                <span aria-hidden="true" className="svc-frame" />

                <span className="svc-badge text-accent-cyan bg-accent-cyan/10 ring-accent-cyan/20 inline-flex size-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset">
                  <Quote className="size-5" aria-hidden="true" />
                </span>

                <p className="text-foreground relative z-[2] text-sm leading-relaxed text-pretty">
                  “{testimonial.quote}”
                </p>

                <div className="relative z-[2] mt-auto flex items-center gap-3 pt-2">
                  <span
                    aria-hidden="true"
                    className="bg-surface-2 text-foreground inline-flex size-9 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold"
                  >
                    {getInitials(testimonial.name)}
                  </span>
                  <div>
                    <p className="text-foreground text-sm font-medium">{testimonial.name}</p>
                    <p className="text-muted text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
