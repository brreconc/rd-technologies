import { Container, Section } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { IconBadge } from "@/components/sections/IconBadge";
import { Reveal } from "@/components/animations/Reveal";
import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import { useCases } from "@/lib/constants/use-cases";

/** Sección "Casos de uso" (§8.6). */
export function UseCases() {
  return (
    <Section id="casos-de-uso" aria-labelledby="usecases-title" className="border-border border-t">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionHeading
            id="usecases-title"
            centered
            eyebrow="Casos de uso"
            title="Soluciones para cualquier industria"
          />
        </Reveal>

        <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((useCase) => (
            <StaggerItem key={useCase.title}>
              <Card className="flex h-full flex-col gap-3">
                <IconBadge icon={useCase.icon} />
                <h3 className="font-display text-foreground text-lg font-semibold">
                  {useCase.title}
                </h3>
                <p className="text-muted">{useCase.description}</p>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
