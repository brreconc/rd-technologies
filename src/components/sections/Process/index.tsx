import { Container, Section } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { IconBadge } from "@/components/sections/IconBadge";
import { Reveal } from "@/components/animations/Reveal";
import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import { processSteps } from "@/lib/constants/process";

/** Sección "Proceso de trabajo" — 6 pasos (§8.5). */
export function Process() {
  return (
    <Section id="proceso" aria-labelledby="process-title" className="border-border border-t">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionHeading
            id="process-title"
            centered
            eyebrow="Cómo trabajamos"
            title="De la idea al producto final, con total transparencia"
          />
        </Reveal>

        <Stagger as="ol" className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {processSteps.map((step, index) => (
            <StaggerItem key={step.title}>
              <Card className="flex h-full flex-col gap-3">
                <div className="flex items-center justify-between">
                  <IconBadge icon={step.icon} />
                  <span className="text-border font-mono text-2xl font-bold" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-display text-foreground text-lg font-semibold">{step.title}</h3>
                <p className="text-muted">{step.description}</p>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
