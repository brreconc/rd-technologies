import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { siteConfig } from "@/config/site";

/**
 * Página 404 (§18, estados de error). Server Component. Next añade
 * automáticamente `noindex` en las respuestas 404.
 *
 * Mantiene Header/Footer del layout raíz y ofrece rutas de recuperación claras
 * (§UX: el usuario siempre sabe cómo volver).
 */
export const metadata: Metadata = {
  title: "Página no encontrada",
  description: "La página que buscas no existe o se ha movido.",
};

export default function NotFound() {
  return (
    <main id="contenido-principal" className="flex-1">
      <Section className="flex min-h-[60vh] items-center">
        <Container className="mx-auto max-w-xl text-center">
          <p className="text-accent-cyan font-mono text-sm tracking-widest">ERROR 404</p>
          <h1 className="font-display text-fluid-2xl mt-3 font-bold tracking-tight text-balance">
            No encontramos esta página
          </h1>
          <p className="text-muted text-fluid-lg mt-4 text-pretty">
            Puede que el enlace esté roto o que la página se haya movido. Volvamos a un lugar
            seguro.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild>
              <Link href="/">Ir al inicio</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/#contacto">Contactar</Link>
            </Button>
          </div>
          <p className="text-muted mt-6 text-sm">
            ¿Necesitas ayuda? Escríbenos a{" "}
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-foreground underline decoration-dotted underline-offset-4"
            >
              {siteConfig.contact.email}
            </a>
            .
          </p>
        </Container>
      </Section>
    </main>
  );
}
