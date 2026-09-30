import { Container, Section } from "@/components/ui/container";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { IconBadge } from "@/components/sections/IconBadge";
import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import { services } from "@/lib/constants/services";

/** Sección "Servicios" — 3 pilares (§8.3). */
export function Services() {
  return (
    <Section id="servicios" aria-labelledby="services-title" className="section-edge">
      <Container>
        <SectionHeading
          id="services-title"
          eyebrow="Servicios"
          title="Tres pilares para tu producto digital"
          highlight="Tres pilares"
          description="Desarrollo, seguridad y soporte trabajando juntos en cada proyecto."
        />

        <Stagger className="mt-10 grid gap-5 lg:grid-cols-3">
          {services.map((service) => (
            <StaggerItem key={service.title}>
              <SpotlightCard className="svc-card flex h-full flex-col gap-3.5 p-5 sm:p-6">
                {/* Corriente de energía que ORBITA el borde al enfocar la tarjeta:
                    un cometa cian→violeta con estela recorre el perímetro. */}
                <span aria-hidden="true" className="svc-frame" />

                <IconBadge icon={service.icon} className="svc-badge size-10" />
                <h3 className="svc-title font-display text-foreground text-lg font-semibold">
                  {service.title}
                </h3>
                <ul className="svc-list flex flex-col gap-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="svc-feat text-muted flex gap-2.5 text-sm">
                      <span className="svc-dot bg-accent-cyan mt-1.5 size-1.5 shrink-0 rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
