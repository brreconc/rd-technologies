import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

/**
 * Home — hero provisional que ya usa el sistema de diseño (Fase 1).
 * Las secciones de contenido (Servicios, Proceso, FAQ…) llegan en la Fase 2 (§18).
 */
export default function HomePage() {
  return (
    <main
      id="contenido-principal"
      className="relative flex flex-1 flex-col items-center justify-center overflow-hidden py-24 text-center"
    >
      {/* Resplandor de marca de fondo (decorativo). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(0,245,255,0.14), transparent 70%), radial-gradient(50% 50% at 80% 100%, rgba(139,92,246,0.12), transparent 70%)",
        }}
      />

      <Container className="flex flex-col items-center">
        <p className="border-border bg-surface/60 text-muted mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-sm">
          <span className="bg-accent-cyan size-2 rounded-full" aria-hidden="true" />
          Desarrollo de software · Ciberseguridad
        </p>

        <h1 className="font-display text-fluid-hero max-w-4xl font-bold tracking-tight text-balance">
          Transformamos tus ideas en{" "}
          <span className="text-gradient-brand">productos digitales seguros</span>
        </h1>

        <p className="text-fluid-lg text-muted mt-6 max-w-2xl text-pretty">
          {siteConfig.description}
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button asChild size="lg">
            <a href="#contacto">Cotiza tu proyecto</a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="#contacto">Habla con un experto</a>
          </Button>
        </div>

        <p className="text-muted mt-16 max-w-md font-mono text-xs">
          Fase 1 lista: sistema de diseño, primitivos UI, header/footer accesibles y toggle de tema.
        </p>
      </Container>
    </main>
  );
}
