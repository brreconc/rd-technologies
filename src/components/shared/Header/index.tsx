import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { NavLinks } from "./NavLinks";
import { MobileNav } from "./MobileNav";

/**
 * Cabecera fija con navegación por anclas, toggle de tema y CTA.
 * Server Component; solo el toggle y el menú móvil son de cliente.
 */
export function Header() {
  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-40 border-b backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />

        <NavLinks />

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="sm" className="btn-shine hidden sm:inline-flex">
            <a href="#contacto">Cotiza tu proyecto</a>
          </Button>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
