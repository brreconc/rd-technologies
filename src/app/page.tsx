import { siteConfig } from "@/config/site";

/**
 * Página raíz — SHELL de la Fase 0 (cimientos).
 * Placeholder estilizado que valida tokens, fuentes, responsive y accesibilidad.
 * El Hero real y las secciones de contenido llegan en las Fases 2–3 (§18).
 */
export default function HomePage() {
  return (
    <main
      id="contenido-principal"
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-24 text-center"
    >
      {/* Resplandor de marca de fondo (decorativo). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(0,245,255,0.14), transparent 70%), radial-gradient(50% 50% at 80% 100%, rgba(139,92,246,0.14), transparent 70%)",
        }}
      />

      <p className="border-border bg-surface/60 text-muted mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-sm">
        <span className="bg-accent-cyan size-2 rounded-full" aria-hidden="true" />
        Fundación del proyecto · Fase 0
      </p>

      <h1 className="font-display text-fluid-hero max-w-4xl font-bold tracking-tight text-balance">
        <span className="text-gradient-brand">{siteConfig.name}</span>
      </h1>

      <p className="text-fluid-xl text-foreground mt-6 max-w-2xl font-serif text-balance">
        {siteConfig.tagline}.
      </p>

      <p className="text-fluid-lg text-muted mt-4 max-w-xl text-pretty">{siteConfig.description}</p>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <a
          href="#contacto"
          className="bg-accent-cyan text-background inline-flex min-h-11 items-center justify-center rounded-lg px-6 py-3 font-medium transition-transform hover:scale-[1.03] focus-visible:scale-[1.03]"
        >
          Cotiza tu proyecto
        </a>
        <a
          href="#contacto"
          className="border-border text-foreground hover:bg-surface inline-flex min-h-11 items-center justify-center rounded-lg border px-6 py-3 font-medium transition-colors"
        >
          Habla con un experto
        </a>
      </div>

      <p className="text-muted mt-16 max-w-md font-mono text-xs">
        Cimientos listos: Next.js 16 · TypeScript estricto · Tailwind v4 · tokens de diseño ·
        cabeceras de seguridad · accesibilidad base.
      </p>
    </main>
  );
}
