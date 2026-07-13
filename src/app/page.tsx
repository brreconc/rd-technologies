import { Hero } from "@/components/sections/Hero";
import { ValueProps } from "@/components/sections/ValueProps";
import { Services } from "@/components/sections/Services";
import { Differentiators } from "@/components/sections/Differentiators";
import { Process } from "@/components/sections/Process";
import { UseCases } from "@/components/sections/UseCases";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";

/**
 * Home (landing one-page). Composición de secciones (§8).
 * Contenido estático y accesible; las animaciones llegan en la Fase 3 (§18).
 */
export default function HomePage() {
  return (
    <main id="contenido-principal" className="flex-1">
      <Hero />
      <ValueProps />
      <Services />
      <Differentiators />
      <Process />
      <UseCases />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
