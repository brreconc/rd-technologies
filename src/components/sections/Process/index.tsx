import { Container, Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Timeline } from "./Timeline";

/**
 * Sección "Proceso de trabajo" — 6 pasos (§8.5).
 *
 * Desde la Fase 13 es una LÍNEA DE TIEMPO HORIZONTAL que se recorre sola
 * ([ADR-016](../../../../docs/01-architecture/decisions/ADR-016-horizontal-process-timeline.md)):
 * un cometa viaja de un hito al siguiente y cada llegada detona en el color de
 * ese paso. Cabe en una pantalla, frente a las seis de bajada que pedía el
 * recorrido vertical anterior.
 *
 * Semánticamente sigue siendo una `<ol>` con los seis pasos completos, así que
 * los lectores de pantalla reciben el orden y el contenido reales sin depender
 * de la animación.
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

        <Timeline className="mt-14" />
      </Container>
    </Section>
  );
}
