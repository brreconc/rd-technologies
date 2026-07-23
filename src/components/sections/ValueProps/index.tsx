import { Container, Section } from "@/components/ui/container";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { IconBadge } from "@/components/sections/IconBadge";
import { Reveal } from "@/components/animations/Reveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import { valueProps } from "@/lib/constants/value-props";

/** Sección "Propuesta de valor" (§8.2). */
export function ValueProps() {
  return (
    <Section id="propuesta-de-valor" aria-labelledby="value-title" className="section-edge">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <TextReveal
            id="value-title"
            text={valueProps.title}
            className="font-display text-fluid-2xl font-bold tracking-tight text-balance"
          />
          <Reveal delay={0.15} y={16}>
            <p className="text-fluid-lg text-muted mt-6 text-pretty">{valueProps.text}</p>
          </Reveal>
        </div>

        <Stagger className="mt-12 grid gap-6 sm:grid-cols-3">
          {valueProps.pillars.map((pillar) => (
            <StaggerItem key={pillar.title}>
              <SpotlightCard className="flex h-full flex-col items-center gap-3 text-center">
                <IconBadge icon={pillar.icon} />
                <h3 className="font-display text-foreground text-lg font-semibold">
                  {pillar.title}
                </h3>
                <p className="text-muted">{pillar.description}</p>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
