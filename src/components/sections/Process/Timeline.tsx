"use client";

import * as React from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useMounted } from "@/lib/hooks/use-mounted";
import { processSteps, TRAVEL_MS, DWELL_MS } from "@/lib/constants/process";

/** Radios de luz que salen de un hito al detonar. */
const SPOKES = 10;

const pad2 = (n: number) => String(n + 1).padStart(2, "0");

/**
 * LÍNEA DE TIEMPO HORIZONTAL DEL PROCESO (ADR-016).
 *
 * Sustituye al recorrido vertical ligado al scroll de la Fase 9. Aquel pedía
 * seis pantallas de bajada para contar seis pasos; este cabe en una y **se
 * cuenta solo**: un cometa recorre el raíl de un hito al siguiente y, al llegar,
 * el hito DETONA —onda de choque, radios de luz y floración de color— mientras
 * toda la sección se retiñe con el color de ese paso. Los seis colores recorren
 * el círculo cromático, así que el conjunto se lee como un viaje aunque no se
 * lea una palabra.
 *
 * ## Cómo está construido
 *
 * El estado en React es UN entero: el hito activo. Todo lo demás —relleno del
 * tramo, vuelo del cometa, encendido del hito, retinte del panel— lo resuelve el
 * CSS desde `data-*` y dos variables. No hay un solo cálculo de animación en
 * JavaScript, ni `requestAnimationFrame`, ni medición del DOM.
 *
 * La detonación se remonta con `key={activeIndex}`: es lo que hace que su
 * animación CSS vuelva a dispararse en cada llegada.
 *
 * ## Estructura y accesibilidad (§10)
 *
 * Dos piezas con papeles distintos, y es deliberado:
 *
 * 1. El **raíl** es un grupo de seis botones. Son controles, se alcanzan con el
 *    tabulador y se activan con Intro o Espacio. Nada de `tabindex` rotatorio:
 *    son botones, y ese es el comportamiento que se espera de ellos.
 * 2. La **`<ol>`** lleva los seis pasos COMPLETOS —número, título y
 *    descripción—, en orden y siempre en el DOM. El carrusel es puramente
 *    visual: las seis tarjetas comparten celda de rejilla y solo una está opaca.
 *    Un lector de pantalla recibe la lista entera de una vez y **nadie tiene que
 *    esperar a que el recorrido llegue a un paso para poder leerlo**.
 *
 * **WCAG 2.2.2 (Pausar, detener, ocultar).** El recorrido arranca solo y dura
 * más de cinco segundos, así que hay que poder pararlo. Por triplicado: botón
 * explícito, pausa al pasar el puntero o enfocar dentro, y elegir un hito a mano
 * lo detiene definitivamente. Con `prefers-reduced-motion` no llega a existir.
 *
 * ## Hidratación (ADR-011)
 *
 * El markup NO se bifurca según la preferencia de movimiento. La política vive
 * entera en CSS; lo único que decide el cliente —si corre el temporizador— se
 * consulta con `matchMedia` dentro de un efecto, que no viaja en el HTML. El
 * botón de pausa va detrás de `useMounted()`, que devuelve `false` en el
 * servidor y en el primer render de cliente.
 *
 * ## Rendimiento (§11)
 *
 * Cero dependencias nuevas y **cero Framer Motion**: la versión anterior movía
 * `useScroll` + `useSpring` + `useTransform` en cada fotograma de scroll. Aquí
 * todo lo que se anima es `transform`/`opacity` en CSS, que compone la GPU.
 * Fuera de pantalla no queda ni un temporizador vivo (`IntersectionObserver`).
 */
export function Timeline({ className }: { className?: string }) {
  const mounted = useMounted();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [autoplay, setAutoplay] = React.useState(true);
  const [paused, setPaused] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [reduce, setReduce] = React.useState(false);

  const rootRef = React.useRef<HTMLDivElement>(null);
  const active = processSteps[activeIndex];

  // Preferencia de movimiento leída en un efecto, no en el render: así no entra
  // en el markup y no puede provocar un desajuste de hidratación (ADR-011).
  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // El recorrido solo avanza cuando la sección está a la vista.
  //
  // `rootMargin` y no `threshold`: un umbral por fracción del elemento tiene como
  // techo `alturaVentana / alturaSección`, así que se vuelve inalcanzable en
  // cuanto la sección es más alta que la ventana. Ese fallo ya nos dejó sin
  // recorrido automático en el deck (ADR-015); aquí se evita desde el principio.
  React.useEffect(() => {
    const host = rootRef.current;
    if (!host) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: "-15% 0px -15% 0px",
      threshold: 0,
    });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (reduce || !autoplay || paused || !visible) return;
    const timer = window.setTimeout(
      () => setActiveIndex((i) => (i + 1) % processSteps.length),
      TRAVEL_MS + DWELL_MS,
    );
    return () => window.clearTimeout(timer);
  }, [reduce, autoplay, paused, visible, activeIndex]);

  /** Elegir un hito a mano cede el control al usuario y no se le vuelve a quitar. */
  const select = (index: number) => {
    setActiveIndex(index);
    setAutoplay(false);
  };

  return (
    <div
      ref={rootRef}
      className={cn("ptl", className)}
      // Un solo color retiñe raíl, cometa, detonación y tarjeta a la vez.
      style={
        {
          "--step-accent": active.accent,
          "--travel": `${TRAVEL_MS}ms`,
          // El raíl saca sus columnas de aquí: añadir o quitar un paso en
          // `process.ts` no obliga a tocar el CSS.
          "--steps": processSteps.length,
        } as React.CSSProperties
      }
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="ptl-rail" role="group" aria-label="Ir a un paso del proceso">
        {processSteps.map((step, index) => (
          <div
            key={step.title}
            className="ptl-slot"
            data-state={index === activeIndex ? "on" : index < activeIndex ? "done" : "next"}
            style={{ "--own-accent": step.accent } as React.CSSProperties}
          >
            {/* Tramo hacia el hito anterior. Va de un color al siguiente, así que
                el viaje ES la transición cromática entre los dos pasos. */}
            {index > 0 ? (
              <span
                aria-hidden="true"
                className="ptl-link"
                data-filled={index <= activeIndex ? "" : undefined}
                style={{ "--from-accent": processSteps[index - 1].accent } as React.CSSProperties}
              >
                <i className="ptl-link-fill" />
                <i key={activeIndex} className="ptl-comet" />
              </span>
            ) : null}

            <button
              type="button"
              onClick={() => select(index)}
              aria-current={index === activeIndex ? "step" : undefined}
              className="ptl-node"
            >
              <span aria-hidden="true" className="ptl-node-num">
                {pad2(index)}
              </span>
              {/* La detonación existe SOLO en el hito activo y se remonta con
                  `key`, que es lo que rearranca su animación en cada llegada. */}
              {index === activeIndex ? (
                <span key={activeIndex} aria-hidden="true" className="ptl-burst">
                  <i className="ptl-bloom" />
                  <i className="ptl-shock" />
                  <i className="ptl-shock ptl-shock-2" />
                  {Array.from({ length: SPOKES }, (_, s) => (
                    <i
                      key={s}
                      className="ptl-spoke"
                      style={{ "--a": `${(360 / SPOKES) * s}deg` } as React.CSSProperties}
                    />
                  ))}
                </span>
              ) : null}
              <span className="sr-only">
                Paso {index + 1}: {step.title}
              </span>
            </button>

            <span aria-hidden="true" className="ptl-caption">
              {step.title}
            </span>
          </div>
        ))}
      </div>

      {/* Contenido real: los seis pasos, en orden y siempre presentes. */}
      <ol className="ptl-cards">
        {processSteps.map((step, index) => (
          <li
            key={step.title}
            className="ptl-card"
            data-on={index === activeIndex ? "" : undefined}
            style={{ "--own-accent": step.accent } as React.CSSProperties}
          >
            <p className="ptl-card-k">
              <step.icon className="size-4" aria-hidden="true" />
              <span aria-hidden="true">Paso {pad2(index)}</span>
            </p>
            <h3 className="ptl-card-t font-display">{step.title}</h3>
            <p className="ptl-card-d">{step.description}</p>
          </li>
        ))}
      </ol>

      {/* Anuncio discreto: sin esto, los cambios del recorrido automático
          pasarían inadvertidos para un lector de pantalla. */}
      <p aria-live="polite" className="sr-only">
        Paso en pantalla: {active.title}
      </p>

      {mounted && !reduce ? (
        <div className="mt-7 flex justify-center">
          <button
            type="button"
            onClick={() => setAutoplay((on) => !on)}
            className="text-muted hover:text-foreground border-border hover:border-accent-cyan/50 inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs transition-colors"
          >
            {autoplay ? (
              <Pause className="size-3.5" aria-hidden="true" />
            ) : (
              <Play className="size-3.5" aria-hidden="true" />
            )}
            {/* El nombre dice DE QUÉ recorrido habla: la página tiene otro
                control igual en el deck de plataformas, y dos botones con el
                mismo nombre accesible son indistinguibles para quien navega por
                lista de controles. */}
            {autoplay ? "Detener el recorrido del proceso" : "Reanudar el recorrido del proceso"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
