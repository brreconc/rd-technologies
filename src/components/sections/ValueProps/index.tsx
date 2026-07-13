import { Container, Section } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { IconBadge } from "@/components/sections/IconBadge";
import { Reveal } from "@/components/animations/Reveal";
import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import { valueProps } from "@/lib/constants/value-props";

/** Sección "Propuesta de valor" (§8.2). */
export function ValueProps() {
  return (
    <Section
      id="propuesta-de-valor"
      aria-labelledby="value-title"
      className="border-border border-t"
    >
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2
            id="value-title"
            className="font-display text-fluid-2xl font-bold tracking-tight text-balance"
          >
            {valueProps.title}
          </h2>
          <p className="text-fluid-lg text-muted mt-6 text-pretty">{valueProps.text}</p>
        </Reveal>

        <Stagger className="mt-12 grid gap-6 sm:grid-cols-3">
          {valueProps.pillars.map((pillar) => (
            <StaggerItem key={pillar.title}>
              <Card className="flex h-full flex-col items-center gap-3 text-center">
                <IconBadge icon={pillar.icon} />
                <h3 className="font-display text-foreground text-lg font-semibold">
                  {pillar.title}
                </h3>
                <p className="text-muted">{pillar.description}</p>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
