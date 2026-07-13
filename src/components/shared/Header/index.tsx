import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { siteConfig } from "@/config/site";
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

        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {siteConfig.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-muted hover:bg-surface hover:text-foreground rounded-md px-3 py-2 text-sm transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <a href="#contacto">Cotiza tu proyecto</a>
          </Button>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
