import { Container, Section } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/Reveal";
import { siteConfig } from "@/config/site";

/**
 * Sección "CTA final" (§8.9). El destino es un `mailto` provisional; en la
 * Fase 4 se reemplazará por un formulario de contacto real en este mismo ancla.
 */
export function FinalCTA() {
  return (
    <Section id="contacto" aria-labelledby="cta-title" className="border-border border-t">
      <Container>
        <Reveal>
          <div className="border-border bg-surface relative overflow-hidden rounded-2xl border px-6 py-16 text-center sm:px-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 opacity-70"
              style={{
                background:
                  "radial-gradient(60% 80% at 50% 0%, rgba(0,245,255,0.12), transparent 70%)",
              }}
            />
            <h2
              id="cta-title"
              className="font-display text-fluid-2xl mx-auto max-w-2xl font-bold tracking-tight text-balance"
            >
              ¿Listo para construir tu próximo producto digital?
            </h2>
            <p className="text-fluid-lg text-muted mx-auto mt-4 max-w-xl text-pretty">
              Hablemos de tu proyecto sin compromiso.
            </p>
            <div className="mt-8 flex justify-center">
              <Button asChild size="lg">
                <a href={`mailto:${siteConfig.contact.email}`}>Solicita una asesoría gratuita</a>
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
