import { Container, Section } from "@/components/ui/container";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { IconBadge } from "@/components/sections/IconBadge";
import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import { useCases } from "@/lib/constants/use-cases";

/** Sección "Casos de uso" (§8.6). */
export function UseCases() {
  return (
    <Section id="casos-de-uso" aria-labelledby="usecases-title" className="section-edge">
      <Container>
        <SectionHeading
          id="usecases-title"
          centered
          eyebrow="Casos de uso"
          title="Soluciones para cualquier industria"
        />

        <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((useCase) => (
            <StaggerItem key={useCase.title}>
              <SpotlightCard className="flex h-full flex-col gap-3">
                <IconBadge icon={useCase.icon} />
                <h3 className="font-display text-foreground text-lg font-semibold">
                  {useCase.title}
                </h3>
                <p className="text-muted">{useCase.description}</p>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
