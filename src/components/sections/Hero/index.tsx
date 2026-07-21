import { ArrowRight, ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/Reveal";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { CountUp } from "@/components/animations/CountUp";
import { NeuralNetwork } from "@/components/animations/NeuralNetwork";
import { stats } from "@/lib/constants/stats";

/**
 * Sección Hero (§8.1). Copy oficial de Prompt.md.
 *
 * Fondo: RED NEURONAL animada (canvas) que evoca datos moviéndose por una red —
 * vanguardia + seguridad (ver `NeuralNetwork` y ADR-010). Sobre ella, un scrim
 * radial mantiene el texto legible sin apagar el efecto en los bordes.
 *
 * Rendimiento (§11): el `<h1>` es el elemento LCP y se pinta de inmediato (sin
 * animación de entrada). El gradiente animado del resaltado es SOLO color, por
 * lo que no retrasa el LCP. Todo el fondo es decorativo (`aria-hidden`) y se
 * detiene con `prefers-reduced-motion`.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex min-h-[86svh] items-center overflow-hidden py-20 sm:py-24"
    >
      {/* --- Fondo: red neuronal + scrim de legibilidad --- */}
      <NeuralNetwork />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(52% 48% at 50% 42%, color-mix(in srgb, var(--bg) 78%, transparent), transparent 78%)",
        }}
      />

      <Container className="flex flex-col items-center text-center">
        {/* h1 sin animar: es el elemento LCP; se pinta de inmediato (§11). */}
        <h1
          id="hero-title"
          className="font-display text-fluid-hero max-w-4xl font-extrabold tracking-tight text-balance [text-shadow:0_2px_40px_rgba(0,0,0,0.35)]"
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
          className="mt-9 flex flex-col items-center gap-4 sm:flex-row"
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
        <Reveal mode="mount" delay={0.35} className="mt-14 w-full max-w-2xl">
          <dl className="border-border/60 grid grid-cols-2 gap-y-6 border-t pt-8 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display text-gradient-brand text-2xl font-bold sm:text-3xl">
                  <CountUp
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                  />
                </dd>
                <p className="text-muted text-xs" aria-hidden="true">
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
        className="text-muted/50 absolute inset-x-0 bottom-6 flex justify-center"
      >
        <ChevronDown className="size-6 animate-bounce" />
      </div>
    </section>
  );
}
