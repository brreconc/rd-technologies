import { ArrowUpRight, Handshake } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Reveal } from "@/components/animations/Reveal";

/**
 * Sección "Alianzas". Presenta la alianza entre R&D Technologies (ingeniería de
 * software) y Z-Tech Innovaciones (ingeniería de infraestructura): dos placas de
 * marca unidas por un puente de energía animado, un mensaje de sinergia y un
 * enlace al sitio del aliado. Los logotipos son activos oficiales de cada marca
 * (`public/logo/`). Estilos en styles/sections/alliances.css (`.alx-*`).
 */
const ZTECH_URL = "https://z-tech-ashen.vercel.app/";

export function Alliances() {
  return (
    <Section id="alianzas" aria-labelledby="alianzas-title" className="section-edge py-12 sm:py-16">
      <Container>
        <SectionHeading
          id="alianzas-title"
          centered
          eyebrow="Alianzas"
          title="Software e infraestructura, una sola fuerza"
          highlight="una sola fuerza"
          description="Unimos nuestra ingeniería de software con la ingeniería de infraestructura de Z-Tech Innovaciones para entregar soluciones completas, de punta a punta."
        />

        <Reveal delay={0.1} className="mt-8">
          <div className="alx">
            <div className="alx-bridge">
              {/* R&D Technologies */}
              <article className="alx-plate">
                <div className="alx-logo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo/logo-full.png" alt="R&D Technologies" className="alx-logo-img" />
                </div>
                <p className="alx-role">Ingeniería de software</p>
              </article>

              {/* Puente de energía */}
              <div className="alx-link" aria-hidden="true">
                <span className="alx-wire" />
                <span className="alx-node">
                  <Handshake className="size-5" />
                </span>
                <span className="alx-wire" />
              </div>

              {/* Z-Tech Innovaciones */}
              <article className="alx-plate">
                <div className="alx-logo alx-logo-light">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo/ztech-brand.jpg"
                    alt="Z-Tech Innovaciones"
                    className="alx-logo-img"
                  />
                </div>
                <p className="alx-role">Ingeniería de infraestructura</p>
              </article>
            </div>

            <p className="alx-desc">
              Del código al despliegue: desarrollamos software seguro a medida y lo ponemos sobre
              una infraestructura robusta y escalable. Una alianza que cubre todo el ciclo, sin
              costuras.
            </p>

            <a className="alx-cta" href={ZTECH_URL} target="_blank" rel="noopener noreferrer">
              Conoce a Z-Tech Innovaciones
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
