import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/animations/Reveal";
import { ContactForm } from "@/components/forms/ContactForm";
import { siteConfig } from "@/config/site";

/**
 * Sección "CTA final" (§8.9). Aloja el formulario de contacto real (Fase 4).
 *
 * Mejora progresiva (§3.2): el formulario es la vía enriquecida (requiere JS),
 * pero SIEMPRE queda visible un enlace de correo directo, de modo que el CTA de
 * contacto funciona aunque el JavaScript falle o esté desactivado.
 */
export function FinalCTA() {
  return (
    <Section id="contacto" aria-labelledby="cta-title" className="border-border border-t">
      <Container>
        <Reveal>
          <div className="border-border bg-surface relative overflow-hidden rounded-2xl border px-6 py-14 sm:px-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 opacity-70"
              style={{
                background:
                  "radial-gradient(60% 80% at 50% 0%, rgba(0,245,255,0.12), transparent 70%)",
              }}
            />
            <div className="mx-auto max-w-2xl text-center">
              <h2
                id="cta-title"
                className="font-display text-fluid-2xl font-bold tracking-tight text-balance"
              >
                ¿Listo para construir tu próximo producto digital?
              </h2>
              <p className="text-fluid-lg text-muted mx-auto mt-4 max-w-xl text-pretty">
                Hablemos de tu proyecto sin compromiso.
              </p>
            </div>

            <div className="mx-auto mt-10 max-w-2xl">
              <ContactForm />

              <p className="text-muted mt-6 text-center text-sm">
                ¿Prefieres el correo? Escríbenos a{" "}
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-foreground underline decoration-dotted underline-offset-4"
                >
                  {siteConfig.contact.email}
                </a>
                .
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
