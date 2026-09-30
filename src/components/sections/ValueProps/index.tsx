import { ArrowUpRight } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/animations/Reveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { valueProps } from "@/lib/constants/value-props";
import { StrataTimeline } from "./StrataTimeline";

/**
 * Sección "Propuesta de valor" (§8.2) — el MANIFIESTO de la casa (ADR-017).
 *
 * ## Qué cambió y por qué
 *
 * Antes era un bloque centrado: un titular y un párrafo de 73 palabras a nueve
 * líneas, y debajo tres tarjetas iguales tituladas *Desarrollo*, *Seguridad* y
 * *Soporte* — exactamente los tres pilares que la sección siguiente,
 * "Servicios", vuelve a desplegar con todo detalle. Se leía como un trámite
 * antes del contenido de verdad.
 *
 * Ahora es una composición EDITORIAL asimétrica:
 *
 * - **Columna de entrada** (izquierda a partir de `lg`): antetítulo, titular
 *   corto con dos palabras teñidas con el degradado de marca, dos frases y un
 *   enlace al proceso. Es lo único que hay que leer para entender la empresa.
 * - **Panel de estratos** (derecha): tres afirmaciones sobre CÓMO se trabaja,
 *   engarzadas en una sola pieza de vidrio por una espina de luz que las
 *   atraviesa. Cada estrato tiene color propio, y el suyo se enciende al
 *   posarse encima o al enfocarlo con el teclado.
 *
 * El reparto de contenido con "Servicios" queda limpio: aquí va el CRITERIO
 * (a medida, seguro por diseño, preparado para crecer), allí el CATÁLOGO.
 *
 * ## Semántica y accesibilidad (§10)
 *
 * Los estratos son una `<ol>` real: son tres, van en orden y ese orden dice
 * algo (primero el producto, luego cómo se protege, luego cómo dura). Los
 * ordinales `01…03` que se ven son `aria-hidden`, porque la lista ya los
 * aporta y leerlos dos veces solo estorba. Nada del panel es interactivo, así
 * que no hay controles que nombrar; el único foco de la sección es el enlace
 * al proceso. Los realces responden a `:hover` y a `:focus-within` por igual.
 *
 * ## Movimiento (§5.4, ADR-011)
 *
 * De entrada: las palabras del titular suben tras su máscara, los estratos
 * entran escalonados desde la izquierda (`rowIn`) y la espina se dibuja atada al
 * scroll. En reposo, el panel corre una LÍNEA DE TIEMPO en bucle (01 → 02 → 03)
 * gestionada por `StrataTimeline`: el estado se deriva en CSS y se detiene fuera
 * del viewport. Con `prefers-reduced-motion` no hay bucle (queda el primer
 * estrato resaltado, quieto).
 */
export function ValueProps() {
  return (
    <Section id="propuesta-de-valor" aria-labelledby="value-title" className="section-edge">
      <Container>
        <div className="vpx">
          <div className="vpx-lede">
            <Reveal y={12}>
              <p className="vpx-eyebrow">
                <span aria-hidden="true" className="vpx-eyebrow-rule" />
                {valueProps.eyebrow}
              </p>
            </Reveal>

            <TextReveal
              id="value-title"
              text={valueProps.title}
              highlight={valueProps.highlight}
              delay={0.08}
              className="font-display text-fluid-2xl mt-4 font-bold tracking-tight text-balance"
            />

            <Reveal delay={0.18} y={16}>
              {/* Justificado (con guionado) para que el bloque se lea ordenado,
                  con los bordes izquierdo y derecho alineados. */}
              <p className="text-fluid-lg text-muted mt-6 text-justify hyphens-auto">
                {valueProps.lead}
              </p>
            </Reveal>

            <Reveal delay={0.28} y={12}>
              <a href="#proceso" className="vpx-link group">
                Así trabajamos
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </Reveal>
          </div>

          <StrataTimeline />
        </div>
      </Container>
    </Section>
  );
}
