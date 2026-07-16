import { Container, Section } from "@/components/ui/container";

/**
 * UI de carga (Suspense boundary a nivel de segmento raíz).
 * Minimal y sin JS: un indicador accesible mientras se transmite la página.
 * Respeta `prefers-reduced-motion` (la animación se neutraliza en globals.css).
 */
export default function Loading() {
  return (
    <Section aria-busy="true" aria-live="polite">
      <Container className="flex flex-col items-center gap-4 text-center">
        <span
          className="border-border border-t-accent-cyan size-8 animate-spin rounded-full border-2"
          aria-hidden="true"
        />
        <p className="text-muted text-sm">Cargando…</p>
      </Container>
    </Section>
  );
}
