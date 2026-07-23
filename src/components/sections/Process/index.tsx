import { Container, Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { processSteps } from "@/lib/constants/process";
import { Timeline, TimelineStep } from "./Timeline";

/**
 * Sección "Proceso de trabajo" — 6 pasos (§8.5).
 *
 * Presentado como una LÍNEA DE TIEMPO que se ilumina con el scroll (Fase 9,
 * ADR-011): la forma acompaña al fondo ("de la idea al producto final") y da al
 * usuario un motivo para seguir bajando. Semánticamente sigue siendo una lista
 * ordenada `<ol>`, así que los lectores de pantalla anuncian el orden real.
 */
export function Process() {
  return (
    <Section id="proceso" aria-labelledby="process-title" className="section-edge">
      <Container>
        <SectionHeading
          id="process-title"
          centered
          eyebrow="Cómo trabajamos"
          title="De la idea al producto final, con total transparencia"
        />

        <Timeline className="mx-auto mt-14 max-w-2xl">
          {processSteps.map((step, index) => (
            <TimelineStep
              key={step.title}
              index={index}
              marker={<step.icon className="text-accent-cyan size-5" aria-hidden="true" />}
            >
              <h3 className="font-display text-foreground text-lg font-semibold">{step.title}</h3>
              <p className="text-muted mt-1.5">{step.description}</p>
            </TimelineStep>
          ))}
        </Timeline>
      </Container>
    </Section>
  );
}
