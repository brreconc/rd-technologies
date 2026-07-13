import { Container, Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { IconBadge } from "@/components/sections/IconBadge";
import { differentiators } from "@/lib/constants/differentiators";

/** Sección "Por qué elegirnos" (§8.4). */
export function Differentiators() {
  return (
    <Section id="por-que-elegirnos" aria-labelledby="diff-title" className="border-border border-t">
      <Container>
        <SectionHeading
          id="diff-title"
          centered
          eyebrow="Por qué elegirnos"
          title="Tu proyecto en manos seguras"
        />
        <ul className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-2">
          {differentiators.map((item) => (
            <li key={item.title} className="flex gap-4">
              <IconBadge icon={item.icon} />
              <div>
                <h3 className="font-display text-foreground text-lg font-semibold">{item.title}</h3>
                <p className="text-muted mt-1">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
