import { ShieldCheck, Lock, MailCheck } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/animations/Reveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { ContactForm } from "@/components/forms/ContactForm";
import { siteConfig } from "@/config/site";

/**
 * Sección "CTA final" / Contacto (§8.9). Aloja el formulario real (Fase 4).
 *
 * El formulario se presenta como una tarjeta de CANAL SEGURO (coherente con el
 * lenguaje "consola/seguridad" del sitio): cabecera de estado, a la izquierda el
 * mensaje y las garantías, a la derecha el formulario con etiquetas flotantes.
 * Compacto para verse completo en pantalla. Estilos en styles/sections/contact.css.
 *
 * Mejora progresiva (§3.2): siempre queda visible un enlace de correo directo,
 * de modo que el contacto funciona aunque el JavaScript falle o esté desactivado.
 */
export function FinalCTA() {
  return (
    <Section id="contacto" aria-labelledby="cta-title" className="section-edge py-12 sm:py-16">
      <Container>
        <Reveal>
          <div className="cf">
            <div className="cf-head">
              <span aria-hidden="true" className="cf-head-dot" />
              Canal seguro · cifrado en tránsito
              <ShieldCheck className="cf-head-ico size-3.5" aria-hidden="true" />
            </div>

            <div className="cf-body">
              {/* Mensaje + garantías */}
              <aside className="cf-aside">
                <TextReveal
                  id="cta-title"
                  text="¿Listo para construir tu próximo producto digital?"
                  highlight="producto digital"
                  className="font-display text-fluid-xl font-bold tracking-tight text-balance"
                />
                <p className="cf-lead">Hablemos de tu proyecto sin compromiso.</p>

                <ul className="cf-trust">
                  <li>
                    <ShieldCheck className="size-4" aria-hidden="true" />
                    Seguro desde el diseño: validación y saneado en cliente y servidor.
                  </li>
                  <li>
                    <Lock className="size-4" aria-hidden="true" />
                    Anti-bot y límite de peticiones por IP.
                  </li>
                  <li>
                    <MailCheck className="size-4" aria-hidden="true" />
                    Te respondemos por correo. No compartimos tus datos.
                  </li>
                </ul>

                <p className="cf-email">
                  ¿Prefieres el correo? Escríbenos a{" "}
                  <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
                </p>
              </aside>

              {/* Formulario */}
              <div>
                <ContactForm />
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
