import Link from "next/link";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";

/**
 * Equipo fundador. Las FOTOS van en `public/team/` (p. ej. `brayan.webp`,
 * `cristian.webp`); mientras no existan se muestra un marco con iniciales, así
 * que basta con rellenar `photo` cuando estén disponibles.
 */
/** `origin` = transform-origin del recorte circular (encuadre por foto). */
const team: { name: string; role: string; photo: string; origin: string }[] = [
  {
    name: "Brayan Reconco",
    role: "Fundador · R&D Technologies",
    photo: "/team/brayan.webp",
    origin: "50% 0%",
  },
  {
    name: "Cristian Delcid",
    role: "Co-fundador · R&D Technologies",
    photo: "/team/cristian.jpg",
    origin: "50% 35%",
  },
];

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Pie de página (rediseño): marca + un eslogan tecnológico propio, el equipo
 * fundador con espacio para foto, y un bloque de copyright con acabado premium.
 * Sin newsletter, sin navegación y sin repetir el mensaje del hero.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-border bg-surface/40 relative overflow-hidden border-t">
      {/* Hairline superior encendida. */}
      <span
        aria-hidden="true"
        className="via-accent-cyan/50 pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent"
      />
      {/* Aurora ambiental superior. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-48"
        style={{
          background:
            "radial-gradient(45% 100% at 22% 0%, rgba(0,245,255,0.10), transparent 70%), radial-gradient(40% 100% at 88% 0%, rgba(139,92,246,0.10), transparent 70%)",
        }}
      />

      <Container className="relative py-11">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
          {/* IZQUIERDA: logo oficial grande (sin `scale` en hover para que no se
              vea borroso; solo un cambio de opacidad). */}
          <div className="flex justify-center lg:justify-start">
            <Link
              href="/"
              aria-label={`${siteConfig.name} — Inicio`}
              className="inline-block transition-opacity duration-300 hover:opacity-90"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo/logo-full.png"
                alt={siteConfig.name}
                className="h-40 w-auto drop-shadow-[0_12px_48px_rgba(0,245,255,0.24)] sm:h-48 lg:h-52"
              />
            </Link>
          </div>

          {/* DERECHA: eslogan + fundadores. */}
          <div className="flex flex-col items-center gap-7 text-center lg:items-start lg:text-left">
            <p className="font-display max-w-md text-[clamp(1.25rem,1rem+1.1vw,1.85rem)] leading-snug font-semibold tracking-tight text-balance">
              <span className="text-gradient-animated">Código que protege.</span> Tecnología que
              escala.
            </p>

            <div>
              <p className="text-muted mb-4 flex items-center justify-center gap-2.5 font-mono text-xs tracking-[0.2em] uppercase lg:justify-start">
                <span
                  aria-hidden="true"
                  className="from-accent-cyan to-accent-purple h-px w-8 bg-gradient-to-r"
                />
                Fundadores
              </p>

              <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 lg:justify-start">
                {team.map((person) => (
                  <li key={person.name} className="group flex items-center gap-3">
                    {/* Marco de foto (anillo de gradiente + glow). */}
                    <span className="from-accent-cyan to-accent-purple relative inline-flex size-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br p-[2.5px] shadow-[0_10px_30px_-12px_rgba(0,245,255,0.4)] transition-all duration-500 group-hover:-translate-y-0.5 group-hover:shadow-[0_14px_40px_-10px_rgba(0,245,255,0.6)] sm:size-20">
                      <span className="bg-surface text-foreground flex size-full items-center justify-center overflow-hidden rounded-full font-mono text-sm font-semibold">
                        {person.photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={person.photo}
                            alt={`${person.name}, ${person.role}`}
                            loading="lazy"
                            decoding="async"
                            // Encuadre por foto (`transform-origin`) para no cortar
                            // el cabello ni dejar la cara muy abajo.
                            style={{ transformOrigin: person.origin }}
                            className="size-full scale-[1.08] object-cover"
                          />
                        ) : (
                          initials(person.name)
                        )}
                      </span>
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-[2.5px] rounded-full ring-1 ring-white/10 ring-inset"
                      />
                    </span>
                    <div className="text-left">
                      <p className="text-foreground text-sm font-semibold">{person.name}</p>
                      <p className="text-muted text-xs">{person.role}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>

      {/* Copyright con acabado premium. */}
      <div className="border-border relative border-t">
        <span
          aria-hidden="true"
          className="via-accent-cyan/40 pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent"
        />
        <Container className="flex flex-col items-center gap-3 py-8 text-center">
          <span
            aria-hidden="true"
            className="from-accent-cyan to-accent-purple h-px w-16 bg-gradient-to-r"
          />
          <p className="font-display text-gradient-animated text-base font-bold tracking-[0.18em] uppercase">
            © {year} {siteConfig.name}
          </p>
          <p className="text-muted flex items-center gap-2.5 font-mono text-[0.7rem] tracking-[0.15em] uppercase">
            <span aria-hidden="true" className="bg-accent-cyan/60 size-1 rounded-full" />
            Todos los derechos reservados
            <span aria-hidden="true" className="bg-accent-purple/60 size-1 rounded-full" />
          </p>
        </Container>
      </div>
    </footer>
  );
}
