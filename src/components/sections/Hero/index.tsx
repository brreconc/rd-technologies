import { ArrowRight, ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/Reveal";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { CountUp } from "@/components/animations/CountUp";
import { stats } from "@/lib/constants/stats";

/**
 * Sección Hero (§8.1). Copy oficial de Prompt.md.
 *
 * Rendimiento (§11): el `<h1>` es el elemento LCP y se pinta de inmediato (sin
 * animación de entrada). El gradiente animado del resaltado es SOLO color
 * (no toca opacidad/layout), por lo que no retrasa el LCP. Todo el resto de
 * capas de fondo son decorativas (`aria-hidden`), GPU-friendly y se detienen con
 * `prefers-reduced-motion`.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex min-h-[92svh] items-center overflow-hidden py-24 sm:py-28 lg:py-32"
    >
      {/* --- Capas de fondo decorativas --- */}
      <div aria-hidden="true" className="grid-dots" />
      <div aria-hidden="true" className="hero-aurora" />
      <div
        aria-hidden="true"
        className="orb orb--cyan top-[-6%] left-[-8%] size-[38vw] max-h-[520px] max-w-[520px]"
      />
      <div
        aria-hidden="true"
        className="orb orb--purple right-[-6%] bottom-[-12%] size-[42vw] max-h-[560px] max-w-[560px]"
      />
      <div aria-hidden="true" className="grain-overlay" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: "radial-gradient(60% 50% at 50% 0%, rgba(0,245,255,0.08), transparent 70%)",
        }}
      />

      <Container className="flex flex-col items-center text-center">
        <Reveal mode="mount">
          <p className="animated-ring border-border bg-surface/70 text-muted mb-8 inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 font-mono text-sm backdrop-blur">
            <span className="relative inline-flex size-2 items-center justify-center">
              <span className="pulse-dot bg-accent-cyan absolute inset-0 rounded-full" />
              <span className="bg-accent-cyan relative size-2 rounded-full" aria-hidden="true" />
            </span>
            Desarrollo de software · Ciberseguridad
          </p>
        </Reveal>

        {/* h1 sin animar: es el elemento LCP; se pinta de inmediato (§11). */}
        <h1
          id="hero-title"
          className="font-display text-fluid-hero max-w-4xl font-bold tracking-tight text-balance"
        >
          Transformamos tus ideas en{" "}
          <span className="text-gradient-animated">productos digitales seguros</span>
        </h1>

        <Reveal mode="mount" delay={0.1} blur>
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
          <MagneticButton>
            <Button asChild size="lg" className="btn-shine group">
              <a href="#contacto">
                Cotiza tu proyecto
                <ArrowRight
                  className="size-5 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>
            </Button>
          </MagneticButton>
          <MagneticButton>
            <Button asChild variant="outline" size="lg">
              <a href="#contacto">Habla con un experto</a>
            </Button>
          </MagneticButton>
        </Reveal>

        {/* --- Banda de métricas de confianza (valores ilustrativos, §19) --- */}
        <Reveal mode="mount" delay={0.35} className="mt-16 w-full max-w-3xl">
          <dl className="border-border/70 grid grid-cols-2 gap-y-8 border-t pt-10 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display text-gradient-brand text-3xl font-bold sm:text-4xl">
                  <CountUp
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                  />
                </dd>
                <p className="text-muted text-xs sm:text-sm" aria-hidden="true">
                  {stat.label}
                </p>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>

      {/* --- Indicador de scroll (decorativo) --- */}
      <div
        aria-hidden="true"
        className="text-muted/60 absolute inset-x-0 bottom-6 flex justify-center"
      >
        <ChevronDown className="size-6 animate-bounce" />
      </div>
    </section>
  );
}
