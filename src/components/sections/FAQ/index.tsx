import { Container, Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Reveal } from "@/components/animations/Reveal";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { faq } from "@/lib/constants/faq";

/**
 * Sección "Preguntas frecuentes" (§8.8).
 * Server Component que renderiza el Accordion (cliente) con datos serializables.
 */
export function FAQ() {
  return (
    <Section id="faq" aria-labelledby="faq-title" className="border-border border-t">
      <Container className="max-w-3xl">
        <Reveal className="text-center">
          <SectionHeading
            id="faq-title"
            centered
            eyebrow="Preguntas frecuentes"
            title="Resolvemos tus dudas"
          />
        </Reveal>

        <Reveal>
          <Accordion type="single" collapsible className="mt-10">
            {faq.map((item, index) => (
              <AccordionItem key={item.question} value={`faq-${index}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Container>
    </Section>
  );
}
