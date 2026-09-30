"use client";

import { useState, type CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/Reveal";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { CountUp } from "@/components/animations/CountUp";
import { stats } from "@/lib/constants/stats";
import { HeroStage } from "./HeroStage";
import { CodeConsole, type HeroPlatform } from "./CodeConsole";

/**
 * Color de texto legible sobre cada acento de plataforma (AA para texto grande):
 * los acentos claros (cian/verde/azul iOS) piden texto oscuro; el azul Windows,
 * más profundo, pide texto blanco.
 */
const CTA_FG: Record<HeroPlatform["id"], string> = {
  web: "#04121a",
  android: "#04140c",
  ios: "#04121a",
  windows: "#ffffff",
};

/**
 * Sección Hero (§8.1). Copy oficial de Prompt.md.
 *
 * Composición a dos columnas (Fase 16, ADR-019): a la IZQUIERDA una CONSOLA DE
 * COMPILACIÓN de cine (`CodeConsole`) que se ejecuta sola —teclea código, compila
 * y aplica ciberseguridad, con un ejemplo distinto por recarga (Web, Android, iOS
 * o Windows)—; a la DERECHA el mensaje de marca. En móvil se apilan: primero el
 * mensaje, después la consola.
 *
 * Rendimiento (§11): el `<h1>` es el elemento LCP y se pinta de inmediato, sin
 * animación de entrada. La consola es decorativa (`aria-hidden`), se detiene al
 * terminar y respeta `prefers-reduced-motion` (salta al estado final).
 */
export function Hero() {
  // Plataforma que está reproduciendo la consola AHORA (Web/Android/iOS/Windows).
  // La consola la reporta en cada avance del carrusel y con ella teñimos la CTA.
  const [platform, setPlatform] = useState<HeroPlatform | null>(null);
  // El color por plataforma va en `--cta`: el glow y su realce los gestiona el
  // CSS (`.cta-primary`), así que el hover puede intensificar la sombra (una
  // sombra inline la bloquearía por especificidad).
  const ctaStyle: CSSProperties | undefined = platform
    ? ({
        backgroundColor: platform.accent,
        color: CTA_FG[platform.id],
        "--cta": platform.accent,
      } as CSSProperties)
    : undefined;

  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      // Encaja EXACTO en el primer pantallazo: alto = viewport menos la cabecera
      // (`sticky h-16` = 4rem). El contenido se centra vertical (`justify-center`),
      // así que en monitores grandes la sección se extiende y respira, y en una
      // laptop a 100 % todo se ve sin hacer scroll. `overflow-hidden` blinda
      // contra cualquier desbordamiento horizontal de las animaciones.
      // `scroll-mt-20`: el ancla "Inicio" aterriza bajo la cabecera sticky.
      className="relative flex min-h-[calc(100svh-4rem)] scroll-mt-20 flex-col justify-center overflow-hidden py-4 sm:py-6"
    >
      {/* Textura técnica de fondo (decorativa, CSS puro). */}
      <div aria-hidden="true" className="grid-dots" />

      <HeroStage className="w-full">
        <Container>
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Consola — izquierda en escritorio, debajo del mensaje en móvil. */}
            <div className="order-2 w-full lg:order-1">
              <CodeConsole onPlatform={setPlatform} />
            </div>

            {/* Mensaje + métricas — derecha en escritorio, primero en móvil. Van
                juntos en la misma columna para no añadir alto y caber en el fold. */}
            <div className="order-1 flex flex-col items-start text-left lg:order-2">
              {/* h1 sin animar: es el elemento LCP; se pinta de inmediato (§11).
                  Tamaño acotado para no desbordar a media columna en escritorio. */}
              <h1
                id="hero-title"
                className="font-display max-w-2xl text-[clamp(2.2rem,1.25rem+3vw,3.75rem)] leading-[1.04] font-extrabold tracking-tight text-balance [text-shadow:0_2px_40px_rgba(0,0,0,0.35)]"
              >
                Transformamos tus ideas en{" "}
                <span className="text-gradient-animated">productos digitales seguros</span>
              </h1>

              <Reveal mode="mount" delay={0.12} blur>
                <p className="text-muted mt-5 max-w-xl text-[clamp(1.05rem,0.95rem+0.55vw,1.4rem)] leading-relaxed text-pretty">
                  Desarrollamos software a medida con estándares de calidad y seguridad desde la
                  primera línea de código.
                </p>
              </Reveal>

              <Reveal
                mode="mount"
                delay={0.26}
                className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:gap-4"
              >
                <MagneticButton>
                  {/* La CTA se tiñe con el color de la plataforma que la consola
                      está creando ahora mismo (cian Web, verde Android, azul iOS,
                      azul Windows) y transiciona suave al cambiar de toma. */}
                  <Button asChild size="lg" className="cta-primary group" style={ctaStyle}>
                    <a href="#contacto">
                      Cotiza tu proyecto
                      <ArrowRight
                        className="size-5 transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </a>
                  </Button>
                </MagneticButton>
                <MagneticButton>
                  <Button asChild variant="outline" size="lg" className="cta-ghost">
                    <a href="#contacto">Habla con un experto</a>
                  </Button>
                </MagneticButton>
              </Reveal>

              {/* --- Métricas de confianza (valores ilustrativos, §19) --- */}
              <Reveal mode="mount" delay={0.42} className="mt-6 w-full max-w-xl">
                <dl className="border-border/60 grid grid-cols-2 gap-y-3 border-t pt-5 sm:grid-cols-4">
                  {stats.map((stat) => (
                    <div key={stat.label} className="flex flex-col items-center gap-0.5">
                      <dt className="sr-only">{stat.label}</dt>
                      <dd className="font-display text-gradient-brand text-xl font-bold tabular-nums sm:text-2xl">
                        <CountUp
                          value={stat.value}
                          prefix={stat.prefix}
                          suffix={stat.suffix}
                          decimals={stat.decimals}
                        />
                      </dd>
                      <p className="text-muted text-[0.7rem]" aria-hidden="true">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </div>
        </Container>
      </HeroStage>
    </section>
  );
}
