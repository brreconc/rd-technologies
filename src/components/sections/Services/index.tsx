import { Container, Section } from "@/components/ui/container";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { IconBadge } from "@/components/sections/IconBadge";
import { Reveal } from "@/components/animations/Reveal";
import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import { services } from "@/lib/constants/services";

/** Sección "Servicios" — 3 pilares (§8.3). */
export function Services() {
  return (
    <Section id="servicios" aria-labelledby="services-title" className="border-border border-t">
      <Container>
        <Reveal>
          <SectionHeading
            id="services-title"
            eyebrow="Servicios"
            title="Tres pilares para tu producto digital"
            description="Desarrollo, seguridad y soporte trabajando juntos en cada proyecto."
          />
        </Reveal>

        <Stagger className="mt-12 grid gap-6 lg:grid-cols-3">
          {services.map((service) => (
            <StaggerItem key={service.title}>
              <SpotlightCard className="flex h-full flex-col gap-4">
                <IconBadge icon={service.icon} />
                <h3 className="font-display text-foreground text-xl font-semibold">
                  {service.title}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {service.features.map((feature) => (
                    <li key={feature} className="text-muted flex gap-3">
                      <span
                        className="bg-accent-cyan mt-2 size-1.5 shrink-0 rounded-full"
                        aria-hidden="true"
                      />
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
