"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";

/**
 * Error boundary de segmento (§18, estados de error). DEBE ser Client Component.
 *
 * En Next 16.2 la recuperación se hace con `unstable_retry()` (reintenta el
 * render del subárbol) en lugar del antiguo `reset()`. El `digest` permite
 * cruzar el error con los logs del servidor sin exponer detalles al cliente.
 */
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // En producción solo llega un mensaje genérico + digest (Next no filtra PII).
    console.error(error);
  }, [error]);

  return (
    <main id="contenido-principal" className="flex-1">
      <Section className="flex min-h-[60vh] items-center" role="alert">
        <Container className="mx-auto max-w-xl text-center">
          <p className="text-danger font-mono text-sm tracking-widest">ALGO SALIÓ MAL</p>
          <h1 className="font-display text-fluid-2xl mt-3 font-bold tracking-tight text-balance">
            Se produjo un error inesperado
          </h1>
          <p className="text-muted text-fluid-lg mt-4 text-pretty">
            Lo sentimos. Puedes reintentar; si el problema persiste, vuelve a intentarlo más tarde.
          </p>
          {error.digest ? (
            <p className="text-muted mt-4 font-mono text-xs">
              Referencia: <span className="text-foreground">{error.digest}</span>
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button type="button" onClick={() => unstable_retry()}>
              Reintentar
            </Button>
            <Button type="button" variant="outline" onClick={() => window.location.assign("/")}>
              Ir al inicio
            </Button>
          </div>
        </Container>
      </Section>
    </main>
  );
}
