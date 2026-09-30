"use client";

import * as React from "react";
import { m } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { staggerWords, wordUp } from "@/lib/animations/framer-variants";

interface TextRevealProps {
  /** Texto plano: se parte por palabras para revelarlas en cascada. */
  text: string;
  className?: string;
  /** Etiqueta semántica del título (por defecto `h2`). */
  as?: "h2" | "h3" | "p";
  id?: string;
  /** Retraso inicial en segundos. */
  delay?: number;
  /**
   * Fragmento CONTIGUO de `text` que se pinta con el degradado de marca.
   *
   * Se pasa como texto y no como JSX a propósito: el título tiene que seguir
   * siendo una cadena plana para poder partirse por palabras, y así el dato
   * (`constants/*`) no necesita saber nada de React. Si el fragmento no
   * aparece tal cual en `text`, no se resalta nada — nunca rompe el título.
   */
  highlight?: string;
}

/** Índices `[inicio, fin)` de `needle` dentro de `words`, o `null` si no está. */
function findWordRange(words: string[], needle?: string): [number, number] | null {
  if (!needle) return null;
  const target = needle.split(" ").filter(Boolean);
  if (target.length === 0) return null;
  // Se compara sin signos de puntuación para que "seguro" case también con
  // "seguro," al final de una cláusula.
  const bare = (w: string) => w.replace(/[.,;:—–-]+$/u, "");
  for (let i = 0; i + target.length <= words.length; i += 1) {
    if (target.every((t, k) => bare(words[i + k]) === bare(t))) return [i, i + target.length];
  }
  return null;
}

/**
 * Título que se revela PALABRA A PALABRA, cada una subiendo desde detrás de su
 * propia máscara (Fase 9, ADR-011). Es el gesto tipográfico que marca la entrada
 * de cada sección al hacer scroll.
 *
 * Salvaguardas:
 *  - `prefers-reduced-motion`: cada palabra lleva la clase `reveal`, que el CSS
 *    fija a `transform:none`, y `MotionConfig reducedMotion="user"` hace que
 *    Framer ignore la transformación → el título aparece completo y quieto. El
 *    markup NO cambia, así que la hidratación siempre coincide.
 *  - Sin JS: el `<noscript>` del layout aplica la misma neutralización.
 *  - El texto sigue siendo un nodo por palabra separado por espacios reales, así
 *    que lectores de pantalla, selección y búsqueda lo tratan con normalidad.
 *  - `highlight` solo cambia el COLOR de unas palabras (degradado de marca). No
 *    añade nodos ni altera el orden de lectura, y si el fragmento no aparece en
 *    el título el resultado es exactamente el de siempre.
 */
export function TextReveal({
  text,
  className,
  as = "h2",
  id,
  delay = 0,
  highlight,
}: TextRevealProps) {
  const Tag = as;
  const words = React.useMemo(() => text.split(" ").filter(Boolean), [text]);
  const range = React.useMemo(() => findWordRange(words, highlight), [words, highlight]);

  return (
    <Tag id={id} className={className}>
      <m.span
        className="inline"
        variants={staggerWords}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ delayChildren: delay }}
      >
        {words.map((word, index) => (
          <React.Fragment key={`${word}-${index}`}>
            {/* La máscara recorta la palabra; el relleno inferior deja sitio a
                los descendentes (g, j, p…) para que no se vean cortados. */}
            <span className="-mb-[0.16em] inline-block overflow-hidden pb-[0.16em] align-bottom">
              <m.span
                className={cn(
                  "reveal inline-block",
                  range && index >= range[0] && index < range[1] && "text-gradient-brand",
                )}
                variants={wordUp}
              >
                {word}
              </m.span>
            </span>
            {index < words.length - 1 ? " " : null}
          </React.Fragment>
        ))}
      </m.span>
    </Tag>
  );
}
