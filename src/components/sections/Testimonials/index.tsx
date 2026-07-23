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

/** Sección "Testimonios" (§8.7). Contenido de EJEMPLO (§19.9). */
export function Testimonials() {
  return (
    <Section id="testimonios" aria-labelledby="testi-title" className="section-edge">
      <Container>
        <SectionHeading
          id="testi-title"
          centered
          eyebrow="Testimonios"
          title="Historias de confianza"
          description="Ejemplos ilustrativos — se reemplazarán por testimonios reales."
        />

        <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.role}>
              <SpotlightCard className="flex h-full flex-col gap-4">
                <Quote className="text-accent-cyan size-8" aria-hidden="true" />
                <p className="text-foreground">“{testimonial.quote}”</p>
                <div className="mt-auto flex items-center gap-3 pt-2">
                  <span
                    aria-hidden="true"
                    className="bg-surface-2 text-foreground inline-flex size-10 shrink-0 items-center justify-center rounded-full font-mono text-sm font-semibold"
                  >
                    {getInitials(testimonial.name)}
                  </span>
                  <div>
                    <p className="text-foreground text-sm font-medium">{testimonial.name}</p>
                    <p className="text-muted text-sm">{testimonial.role}</p>
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
