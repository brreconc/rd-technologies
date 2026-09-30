import { Container, Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Reveal } from "@/components/animations/Reveal";
import { PlatformDeck } from "./PlatformDeck";

/**
 * Sección "Plataformas" (§8) — dónde corre lo que construimos.
 *
 * Responde de un vistazo a la única pregunta que el cliente trae en la cabeza:
 * "¿pueden hacer LO MÍO?". Web, e-commerce, Android, iOS y escritorio, con el
 * mismo núcleo y la misma exigencia de seguridad.
 *
 * Server Component: el encabezado y el marco son HTML plano; solo el deck
 * interactivo (`PlatformDeck`) baja al cliente.
 */
export function Platforms() {
  return (
    <Section id="plataformas" aria-labelledby="platforms-title" className="section-edge">
      <Container>
        <SectionHeading
          id="platforms-title"
          eyebrow="Multiplataforma"
          title="Un núcleo seguro. Todas las pantallas."
          description="Elige un destino y míralo compilarse. Sea cual sea, lo construye el mismo equipo, sobre la misma arquitectura y con seguridad desde la primera línea de código."
        />

        <PlatformDeck />

        <Reveal delay={0.1} className="mt-12 lg:mt-16">
          <p className="text-muted border-border/60 max-w-3xl border-t pt-8 text-pretty">
            <span className="text-foreground font-medium">¿Necesitas varias a la vez?</span> Es lo
            habitual: un portal web para tus clientes, una app móvil para tu equipo en la calle y
            una herramienta de escritorio en la oficina. Las construimos sobre el mismo núcleo, así
            que comparten datos, seguridad y ritmo de evolución en lugar de convertirse en tres
            proyectos que se pisan.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
