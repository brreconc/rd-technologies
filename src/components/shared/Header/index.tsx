import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { HeaderShell } from "./HeaderShell";
import { NavLinks } from "./NavLinks";
import { MobileNav } from "./MobileNav";

/**
 * Cabecera pegajosa con navegación por anclas, toggle de tema y CTA.
 * Server Component; solo el envoltorio reactivo al scroll (`HeaderShell`), la
 * navegación con pastilla, el toggle y el menú móvil son de cliente.
 */
export function Header() {
  return (
    <HeaderShell>
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
    </HeaderShell>
  );
}
