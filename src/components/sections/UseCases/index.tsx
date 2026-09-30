import { Container, Section } from "@/components/ui/container";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { IconBadge } from "@/components/sections/IconBadge";
import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import { useCases } from "@/lib/constants/use-cases";

/**
 * Sección "Casos de uso" (§8.6).
 *
 * Comparte la MISMA línea de diseño que "Servicios": tarjetas `SpotlightCard`
 * con la corriente de energía que orbita el borde (`.svc-*`), badge de icono que
 * salta al hover y título con el degradado de marca. La información va compacta
 * (título e idea corta) porque son cuatro columnas.
 */
export function UseCases() {
  return (
    <Section id="casos-de-uso" aria-labelledby="usecases-title" className="section-edge">
      <Container>
        <SectionHeading
          id="usecases-title"
          centered
          eyebrow="Casos de uso"
          title="Soluciones para cualquier industria"
          highlight="cualquier industria"
        />

        <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((useCase) => (
            <StaggerItem key={useCase.title}>
              <SpotlightCard className="svc-card flex h-full flex-col gap-3 p-5 sm:p-6">
                {/* Corriente de energía que orbita el borde al enfocar la tarjeta. */}
                <span aria-hidden="true" className="svc-frame" />

                <IconBadge icon={useCase.icon} className="svc-badge size-10" />
                <h3 className="svc-title font-display text-foreground text-base font-semibold">
                  {useCase.title}
                </h3>
                <p className="text-muted relative z-[2] text-sm leading-relaxed">
                  {useCase.description}
                </p>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
