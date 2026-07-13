import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/Reveal";

/** Sección Hero (§8.1). Copy oficial de Prompt.md. */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden py-24 sm:py-32 lg:py-40"
    >
      {/* Aurora animada (decorativa, coste casi nulo; se detiene con reduced-motion). */}
      <div aria-hidden="true" className="hero-aurora" />
      {/* Resplandor radial estático de refuerzo. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(0,245,255,0.10), transparent 70%), radial-gradient(45% 45% at 85% 90%, rgba(139,92,246,0.10), transparent 70%)",
        }}
      />
      <Container className="flex flex-col items-center text-center">
        <Reveal mode="mount">
          <p className="border-border bg-surface/60 text-muted mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-sm">
            <span className="bg-accent-cyan size-2 rounded-full" aria-hidden="true" />
            Desarrollo de software · Ciberseguridad
          </p>
        </Reveal>

        {/* h1 sin animar: es el elemento LCP; se pinta de inmediato (§11). */}
        <h1
          id="hero-title"
          className="font-display text-fluid-hero max-w-4xl font-bold tracking-tight text-balance"
        >
          Transformamos tus ideas en{" "}
          <span className="text-gradient-brand">productos digitales seguros</span>
        </h1>

        <Reveal mode="mount" delay={0.1}>
          <p className="text-fluid-lg text-muted mt-6 max-w-2xl text-pretty">
            Desarrollamos software a medida con estándares de calidad y seguridad desde la primera
            línea de código.
          </p>
        </Reveal>

        <Reveal
          mode="mount"
          delay={0.2}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Button asChild size="lg">
            <a href="#contacto">Cotiza tu proyecto</a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="#contacto">Habla con un experto</a>
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
