import { Container, Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { DiffTimeline } from "./DiffTimeline";

/**
 * Sección "Por qué elegirnos" (§8.4). El layout de rejilla se sustituye por una
 * LÍNEA DE TIEMPO cinematográfica auto-revelada (`DiffTimeline`): un escenario
 * central encadena los 5 motivos, sincronizado con un cometa que recorre una
 * línea horizontal. Degrada a una rejilla legible sin JS / con movimiento
 * reducido (ver `DiffTimeline`).
 */
export function Differentiators() {
  return (
    <Section id="por-que-elegirnos" aria-labelledby="diff-title" className="section-edge">
      <Container>
        <SectionHeading
          id="diff-title"
          centered
          eyebrow="Por qué elegirnos"
          title="Tu proyecto en manos seguras"
          highlight="manos seguras"
        />

        <div className="mt-12">
          <DiffTimeline />
        </div>
      </Container>
    </Section>
  );
}
