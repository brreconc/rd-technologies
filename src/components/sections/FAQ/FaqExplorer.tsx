"use client";

import * as React from "react";
import type { CSSProperties } from "react";
import { ChevronRight } from "lucide-react";
import { faq } from "@/lib/constants/faq";

/**
 * FAQ como EXPLORADOR de dos paneles (patrón de pestañas accesible), en vez del
 * acordeón anterior. A la izquierda, la lista de preguntas numeradas; al elegir
 * una, el panel de la derecha revela su respuesta con una entrada cinematográfica
 * y un gran signo de interrogación de fondo. Cada pregunta tiene su propio color
 * de acento (misma familia cromática del sitio), lo que hace la sección
 * escaneable y atractiva para explorar.
 *
 * Accesibilidad: `role="tablist"`/`tab`/`tabpanel` con `aria-selected` y
 * `aria-controls`; tabindex rotatorio y navegación con flechas. El contenido
 * también vive como datos estructurados (FAQPage JSON-LD), así que el SEO no
 * depende de esta capa visual. En móvil la rejilla se apila: lista arriba,
 * respuesta debajo.
 */
const ACCENTS = ["#00f5ff", "#a78bfa", "#4fb3ff", "#34e5c4", "#ffd93d", "#ff5f9e"] as const;
const accentOf = (i: number) => ACCENTS[i % ACCENTS.length];
const pad2 = (n: number) => String(n + 1).padStart(2, "0");

export function FaqExplorer() {
  const [active, setActive] = React.useState(0);
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const focusTab = (i: number) => {
    setActive(i);
    tabRefs.current[i]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      focusTab((i + 1) % faq.length);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      focusTab((i - 1 + faq.length) % faq.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusTab(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusTab(faq.length - 1);
    }
  };

  return (
    <div className="faqx" style={{ "--faq-accent": accentOf(active) } as CSSProperties}>
      <div
        className="faqx-list"
        role="tablist"
        aria-label="Preguntas frecuentes"
        aria-orientation="vertical"
      >
        {faq.map((item, i) => (
          <button
            key={item.question}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`faqx-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`faqx-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className="faqx-q"
            data-active={i === active ? "true" : undefined}
            style={{ "--faq-accent": accentOf(i) } as CSSProperties}
          >
            <span aria-hidden="true" className="faqx-q-n">
              {pad2(i)}
            </span>
            <span className="faqx-q-t">{item.question}</span>
            <ChevronRight className="faqx-q-caret size-4" aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="faqx-stage">
        {faq.map((item, i) => (
          <div
            key={item.question}
            role="tabpanel"
            id={`faqx-panel-${i}`}
            aria-labelledby={`faqx-tab-${i}`}
            hidden={i !== active}
            className="faqx-panel"
            style={{ "--faq-accent": accentOf(i) } as CSSProperties}
          >
            <span aria-hidden="true" className="faqx-panel-mark">
              ?
            </span>
            <p className="faqx-panel-k">Pregunta {pad2(i)}</p>
            <h3 className="faqx-panel-q font-display">{item.question}</h3>
            <p className="faqx-panel-a">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
