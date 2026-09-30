import { Container, Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Reveal } from "@/components/animations/Reveal";
import { FaqExplorer } from "./FaqExplorer";

/**
 * Sección "Preguntas frecuentes" (§8.8).
 *
 * El acordeón se sustituye por un EXPLORADOR de dos paneles (`FaqExplorer`):
 * lista de preguntas a un lado y panel de respuesta al otro, más atractivo para
 * explorar. El contenido sigue disponible como datos estructurados (FAQPage
 * JSON-LD), así que el SEO no depende de esta capa.
 */
export function FAQ() {
  return (
    <Section id="faq" aria-labelledby="faq-title" className="section-edge">
      <Container className="max-w-5xl">
        <SectionHeading
          id="faq-title"
          centered
          eyebrow="Preguntas frecuentes"
          title="Resolvemos tus dudas"
          highlight="tus dudas"
        />

        <Reveal delay={0.1} className="mt-10">
          <FaqExplorer />
        </Reveal>
      </Container>
    </Section>
  );
}
