import { cn } from "@/lib/utils/cn";

interface SectionHeadingProps {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

/** Encabezado consistente de sección (eyebrow + h2 + descripción). */
export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  centered = false,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", centered && "mx-auto text-center", className)}>
      {eyebrow && (
        <p
          className={cn(
            "text-muted mb-3 flex items-center gap-2.5 font-mono text-xs tracking-widest uppercase",
            centered && "justify-center",
          )}
        >
          <span
            aria-hidden="true"
            className="from-accent-cyan to-accent-purple h-px w-8 bg-gradient-to-r"
          />
          {eyebrow}
        </p>
      )}
      <h2 id={id} className="font-display text-fluid-2xl font-bold tracking-tight text-balance">
        {title}
      </h2>
      {description && <p className="text-fluid-lg text-muted mt-4 text-pretty">{description}</p>}
    </div>
  );
}
