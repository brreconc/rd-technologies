"use client";

import * as React from "react";
import { m } from "framer-motion";
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
 */
export function TextReveal({ text, className, as = "h2", id, delay = 0 }: TextRevealProps) {
  const Tag = as;
  const words = React.useMemo(() => text.split(" ").filter(Boolean), [text]);

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
              <m.span className="reveal inline-block" variants={wordUp}>
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
