import { Hero } from "@/components/sections/Hero";
import { TechMarquee } from "@/components/sections/TechMarquee";
import { ValueProps } from "@/components/sections/ValueProps";
import { Services } from "@/components/sections/Services";
import { Platforms } from "@/components/sections/Platforms";
import { Differentiators } from "@/components/sections/Differentiators";
import { Process } from "@/components/sections/Process";
import { UseCases } from "@/components/sections/UseCases";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildHomeJsonLd } from "@/lib/seo/json-ld";

/**
 * Home (landing one-page). Composición de secciones (§8).
 * Incluye los datos estructurados JSON-LD (Organization/WebSite/FAQPage, §12).
 */
export default function HomePage() {
  return (
    <main id="contenido-principal" className="flex-1">
      <JsonLd data={buildHomeJsonLd()} />
      <Hero />
      <TechMarquee />
      <ValueProps />
      <Services />
      {/* "Plataformas" va justo detrás de "Servicios": este cuenta QUÉ hacemos,
          aquel demuestra DÓNDE corre. Ninguna sección previa se ha retirado. */}
      <Platforms />
      <Differentiators />
      <Process />
      <UseCases />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
