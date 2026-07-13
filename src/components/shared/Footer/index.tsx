import { Container } from "@/components/ui/container";
import { Logo } from "@/components/shared/Logo";
import { siteConfig } from "@/config/site";

/** Enlaces de redes definidos y no vacíos (los datos reales están pendientes, §19.8). */
const socialLinks = Object.entries(siteConfig.social).filter(([, href]) => href.length > 0);

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-border bg-surface/40 border-t">
      <Container className="flex flex-col gap-10 py-12 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <Logo />
          <p className="text-muted mt-3 text-sm">{siteConfig.description}</p>
        </div>

        <nav aria-label="Enlaces del pie" className="flex flex-col gap-2">
          <h2 className="font-display text-foreground text-sm font-semibold">Navegación</h2>
          {siteConfig.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-muted hover:text-foreground text-sm transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {socialLinks.length > 0 && (
          <nav aria-label="Redes sociales" className="flex flex-col gap-2">
            <h2 className="font-display text-foreground text-sm font-semibold">Síguenos</h2>
            {socialLinks.map(([name, href]) => (
              <a
                key={name}
                href={href}
                className="text-muted hover:text-foreground text-sm capitalize transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {name}
              </a>
            ))}
          </nav>
        )}
      </Container>

      <div className="border-border border-t">
        <Container className="text-muted py-6 text-xs">
          © {year} {siteConfig.name}. Todos los derechos reservados.
        </Container>
      </div>
    </footer>
  );
}
