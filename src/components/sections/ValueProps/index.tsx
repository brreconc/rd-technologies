import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/animations/Reveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import { rowIn } from "@/lib/animations/framer-variants";
import { valueProps } from "@/lib/constants/value-props";

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
 * Tres gestos, todos de entrada y ninguno en bucle: las palabras del titular
 * suben tras su máscara, los estratos entran escalonados desde la izquierda
 * (`rowIn`, sin giro 3D: dentro de un panel con borde se notaría el despegue)
 * y la espina se dibuja de arriba abajo atada al scroll con CSS puro. Con
 * `prefers-reduced-motion` no queda ninguno en pie.
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
              <p className="text-fluid-lg text-muted mt-6 text-pretty">{valueProps.lead}</p>
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

          <Stagger as="ol" className="vpx-strata">
            {valueProps.strata.map((stratum, index) => (
              <StaggerItem
                key={stratum.title}
                variants={rowIn}
                className="vpx-stratum"
                style={{ "--own-accent": stratum.accent } as CSSProperties}
              >
                {/* Columna del nodo. La espina que baja hasta el siguiente
                    estrato es el `::after` de este raíl, no un nodo suelto:
                    así mide sola lo que mida la fila. */}
                <span aria-hidden="true" className="vpx-rail">
                  <span className="vpx-node">
                    <stratum.icon className="size-5" />
                  </span>
                </span>

                <div className="vpx-body">
                  <p className="vpx-tag" aria-hidden="true">
                    <span className="vpx-ord">{String(index + 1).padStart(2, "0")}</span>
                    {stratum.tag}
                  </p>
                  <h3 className="vpx-title font-display">{stratum.title}</h3>
                  <p className="vpx-desc">{stratum.description}</p>
                </div>

                <span aria-hidden="true" className="vpx-edge" />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </Section>
  );
}
