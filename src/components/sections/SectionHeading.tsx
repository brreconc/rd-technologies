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
        <p className="text-muted mb-3 font-mono text-xs tracking-widest uppercase">{eyebrow}</p>
      )}
      <h2 id={id} className="font-display text-fluid-2xl font-bold tracking-tight text-balance">
        {title}
      </h2>
      {description && <p className="text-fluid-lg text-muted mt-4 text-pretty">{description}</p>}
    </div>
  );
}
