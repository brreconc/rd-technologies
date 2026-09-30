import { cn } from "@/lib/utils/cn";
import { Reveal } from "@/components/animations/Reveal";
import { TextReveal } from "@/components/animations/TextReveal";

interface SectionHeadingProps {
  id?: string;
  eyebrow?: string;
  title: string;
  /** Fragmento del título que se pinta con el degradado de marca (como en la
   *  propuesta de valor). Opcional; se pasa tal cual a `TextReveal`. */
  highlight?: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

/**
 * Encabezado consistente de sección (eyebrow + h2 + descripción).
 *
 * El título se revela palabra a palabra al entrar en pantalla (`TextReveal`,
 * ADR-011) y el eyebrow/descripción lo acompañan escalonados: es el gesto que
 * abre cada sección al hacer scroll. Todo degrada a texto plano con
 * `prefers-reduced-motion` y sin JavaScript.
 *
 * Nota de contraste (§10): el eyebrow NO se colorea con el cian de marca —
 * fallaría AA sobre el tema claro. El color lo aporta la línea decorativa.
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  highlight,
  description,
  centered = false,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", centered && "mx-auto text-center", className)}>
      {eyebrow && (
        <Reveal y={12}>
          <p
            className={cn(
              "text-muted mb-4 flex items-center gap-2.5 font-mono text-xs tracking-[0.2em] uppercase",
              centered && "justify-center",
            )}
          >
            <span
              aria-hidden="true"
              className="from-accent-cyan to-accent-purple h-px w-8 bg-gradient-to-r"
            />
            {eyebrow}
            {centered && (
              <span
                aria-hidden="true"
                className="from-accent-purple to-accent-cyan h-px w-8 bg-gradient-to-r"
              />
            )}
          </p>
        </Reveal>
      )}

      <TextReveal
        id={id}
        text={title}
        highlight={highlight}
        delay={0.08}
        className="font-display text-fluid-2xl font-bold tracking-tight text-balance"
      />

      {description && (
        <Reveal delay={0.18} y={16}>
          <p className="text-fluid-lg text-muted mt-4 text-pretty">{description}</p>
        </Reveal>
      )}
    </div>
  );
}
