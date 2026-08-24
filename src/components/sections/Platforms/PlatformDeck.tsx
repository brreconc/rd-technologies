"use client";

import * as React from "react";
import { m, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useMounted } from "@/lib/hooks/use-mounted";
import {
  platforms,
  defaultPlatformId,
  deviceFrame,
  type PlatformId,
} from "@/lib/constants/platforms";
import { MOCKUPS } from "./mockups";

/** Milisegundos que permanece cada destino cuando el deck avanza solo. */
const AUTOPLAY_MS = 7000;
/**
 * Desplazamiento máximo del suelo en perspectiva, en px, cuando el puntero
 * recorre el escenario. Es lo que ha sustituido a la inclinación 3D del
 * dispositivo: la profundidad la ponen las capas de gráfico, no la pantalla.
 */
const PARALLAX = 22;
/** Marcas de la regla vertical del escenario. */
const RULER_TICKS = 9;

const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * DECK DE DESPLIEGUE MULTIPLATAFORMA (ADR-013) — la pieza interactiva de §8.
 *
 * Idea: en vez de contar en qué plataformas trabajamos, se COMPILA una delante
 * del cliente. El rail es un selector de canales; al elegir uno, el dispositivo
 * del escenario se transforma hasta la proporción real de ese destino, la escena
 * se retiñe con su acento desde una sola variable, un barrido de compilación
 * recorre la pantalla y dentro aparece una interfaz creíble de esa plataforma.
 *
 * El detalle que sostiene la metáfora es la COTA: el rótulo sobre el escenario
 * anuncia la resolución del destino y el marco se calcula a partir de ese mismo
 * dato (`deviceFrame`), así que la transformación es una medida, no un adorno.
 * Un test unitario impide que ambos se separen.
 *
 * Rendimiento (§11): cero dependencias nuevas, cero canvas y un solo mock-up
 * montado a la vez. Todo lo que se mueve es `transform`/`opacity`, salvo el
 * morfismo del dispositivo, que ocurre dentro de un campo de proporción fija
 * para que jamás desplace nada de la página (CLS 0). Fuera de pantalla no queda
 * ni un temporizador vivo (`IntersectionObserver`).
 *
 * Accesibilidad (§10):
 *  - Patrón `tablist`/`tab`/`tabpanel` de WAI-ARIA con `tabindex` rotatorio y
 *    navegación por flechas, Inicio y Fin, en los dos ejes (el rail es vertical
 *    en escritorio y una rejilla en móvil). No hay ningún candado temporal: cada
 *    pulsación se atiende, por rápida que llegue.
 *  - El avance automático es movimiento que arranca solo, así que WCAG 2.2.2
 *    exige poder pararlo: hay un botón explícito, se pausa al pasar el puntero o
 *    al enfocar dentro, y elegir un destino a mano lo detiene definitivamente.
 *    Con `prefers-reduced-motion` no llega a existir.
 *  - Toda la instrumentación (cotas, regla, consola, mock-up) es decorativa y va
 *    con `aria-hidden`: lo que importa está en el texto del panel.
 *
 * Hidratación (ADR-011): el markup NO se bifurca según `useReducedMotion()` —
 * el hook solo decide si se registran manejadores y si corre el temporizador,
 * cosas que viven en efectos y no viajan en el HTML. El único markup que depende
 * del cliente (el botón de pausa) se monta detrás de `useMounted()`, que
 * devuelve `false` tanto en el servidor como en el primer render de cliente.
 */
export function PlatformDeck() {
  const reduce = useReducedMotion();
  const mounted = useMounted();
  const [activeId, setActiveId] = React.useState<PlatformId>(defaultPlatformId);
  const [autoplay, setAutoplay] = React.useState(true);
  const [paused, setPaused] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  const rootRef = React.useRef<HTMLDivElement>(null);
  const tabsRef = React.useRef(new Map<PlatformId, HTMLButtonElement>());
  const probeRef = React.useRef<HTMLSpanElement>(null);

  const active = platforms.find((p) => p.id === activeId) ?? platforms[0];
  const activeIndex = platforms.indexOf(active);
  const frame = deviceFrame(active);
  const Mockup = MOCKUPS[active.id];

  /**
   * Paralaje del suelo en perspectiva, atado al puntero.
   *
   * NO se inclina el dispositivo. Chromium rasteriza UNA sola vez toda capa con
   * rotación 3D y luego la remuestrea en la GPU, así que un `rotateX/rotateY`
   * sobre el marco convertía el texto de 6–10 px del mock-up en una mancha justo
   * cuando el visitante se acercaba a mirarlo. La pantalla se queda sin ninguna
   * transformación —nítida al píxel siempre— y la profundidad la ponen el suelo,
   * el resplandor y la mira, que son degradados y filetes donde el remuestreo no
   * se nota. Ver ADR-015.
   */
  const fx = useSpring(useMotionValue(0), { stiffness: 120, damping: 22 });
  const fy = useSpring(useMotionValue(0), { stiffness: 120, damping: 22 });

  const handleStagePointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    event.currentTarget.style.setProperty("--mx", `${px * 100}%`);
    event.currentTarget.style.setProperty("--my", `${py * 100}%`);
    fx.set((0.5 - px) * PARALLAX * 2);
    fy.set((0.5 - py) * PARALLAX * 0.5);
    // Lectura de la mira, en píxeles NOMINALES del destino. Se escribe por `ref`
    // y no por estado: si esto provocara un render de React, el deck volvería a
    // renderizarse entero a 60 Hz mientras se mueve el ratón.
    if (probeRef.current) {
      probeRef.current.textContent = `x ${Math.round(px * active.readout.w)} · y ${Math.round(
        py * active.readout.h,
      )}`;
    }
  };

  const resetStage = () => {
    fx.set(0);
    fy.set(0);
  };

  // --- El deck solo avanza cuando está a la vista (§11).
  React.useEffect(() => {
    const host = rootRef.current;
    if (!host) return;
    /**
     * "A la vista" = el deck cruza la banda central del viewport.
     *
     * NO se usa un `threshold` por fracción del elemento: esa fracción tiene como
     * techo `alturaVentana / alturaDeck`, así que en cuanto el deck es más alto
     * que la ventana el umbral se vuelve inalcanzable y el recorrido automático
     * no arranca nunca. Pasó de verdad al añadir el quinto destino: 821 px de
     * deck contra 720 px de ventana daban un máximo de 0,293 frente a un umbral
     * de 0,3. Con `rootMargin` la condición depende de dónde está el deck, no de
     * lo que mide, que es lo que de verdad queríamos preguntar.
     */
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: "-20% 0px -20% 0px",
      threshold: 0,
    });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  // --- Avance automático.
  React.useEffect(() => {
    if (reduce || !autoplay || paused || !visible) return;
    const timer = window.setTimeout(
      () => setActiveId(platforms[(activeIndex + 1) % platforms.length].id),
      AUTOPLAY_MS,
    );
    return () => window.clearTimeout(timer);
  }, [reduce, autoplay, paused, visible, activeIndex]);

  /** Selección manual: fija el destino y cede el control al usuario. */
  const select = (id: PlatformId) => {
    setActiveId(id);
    setAutoplay(false);
  };

  /** Flechas / Inicio / Fin sobre el rail, moviendo también el foco. */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const last = platforms.length - 1;
    const step: Record<string, number> = {
      ArrowDown: activeIndex + 1,
      ArrowRight: activeIndex + 1,
      ArrowUp: activeIndex - 1,
      ArrowLeft: activeIndex - 1,
      Home: 0,
      End: last,
    };
    const raw = step[event.key];
    if (raw === undefined) return;
    event.preventDefault();
    const target = platforms[(raw + platforms.length) % platforms.length];
    select(target.id);
    tabsRef.current.get(target.id)?.focus();
  };

  return (
    <div
      ref={rootRef}
      className="deck mt-12 lg:mt-16"
      // El acento del destino activo tiñe TODO el deck desde una sola variable.
      style={{ "--platform-accent": active.accent } as React.CSSProperties}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-12 lg:gap-y-10">
        {/* ------------------------------------------------------- rail */}
        {/* Rejilla, nunca una tira deslizable: esa dejaba casi todos los destinos
            fuera de pantalla y sin ninguna pista de que existieran, justo en la
            sección cuyo mensaje es "los hacemos todos". Aquí se ven los cinco.
            Una sola columna por debajo de `sm`: a dos columnas, "E-commerce" no
            cabe en un teléfono y se recortaba con puntos suspensivos, que es
            precisamente la palabra que hay que poder leer. De `sm` a `lg` van a
            dos, y como son impares el último ocupa la fila entera. */}
        <div
          role="tablist"
          aria-label="Plataformas que desarrollamos"
          aria-orientation="vertical"
          onKeyDown={handleKeyDown}
          className="deck-rail grid grid-cols-1 gap-2 sm:grid-cols-2 lg:col-start-1 lg:row-start-1 lg:grid-cols-1 lg:gap-1"
        >
          {platforms.map((platform, index) => {
            const selected = platform.id === active.id;
            const Icon = platform.icon;
            return (
              <button
                key={platform.id}
                ref={(node) => {
                  if (node) tabsRef.current.set(platform.id, node);
                  else tabsRef.current.delete(platform.id);
                }}
                type="button"
                role="tab"
                id={`plataforma-tab-${platform.id}`}
                aria-selected={selected}
                aria-controls={`plataforma-panel-${platform.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(platform.id)}
                className={cn(
                  "deck-tab sm:last:col-span-2 lg:last:col-span-1",
                  selected && "deck-tab-on",
                )}
              >
                <span aria-hidden="true" className="deck-tab-mark">
                  <Icon className="size-5" />
                </span>
                <span className="deck-tab-text">
                  <span className="deck-tab-label">{platform.label}</span>
                  <span className="deck-tab-kicker">{platform.kicker}</span>
                </span>
                <span aria-hidden="true" className="deck-tab-channel">
                  Canal {pad2(index + 1)}
                </span>
              </button>
            );
          })}
        </div>

        {/* -------------------------------------------------- escenario */}
        <div className="lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
          {/* Cota: anuncia la resolución del destino, y el marco de abajo se
              calcula a partir de ese mismo dato. */}
          <p aria-hidden="true" className="deck-readout">
            <span>
              An {active.readout.w} × Al {active.readout.h}
            </span>
            <span className="deck-readout-rule" />
            <span className="deck-readout-note">{active.readout.note}</span>
          </p>

          <div
            className="deck-stage"
            onPointerMove={reduce ? undefined : handleStagePointer}
            onPointerLeave={reduce ? undefined : resetStage}
          >
            {/* Campo de proporción fija donde vive el dispositivo: el morfismo
                nunca desplaza nada de la página (CLS 0). */}
            <div className="deck-stage-field">
              <span aria-hidden="true" className="deck-stage-glow" />
              {/* El paralaje va en un envoltorio: el suelo ya usa su propio
                  `transform` para la perspectiva y no puede compartirlo. */}
              <m.span aria-hidden="true" className="deck-floor-wrap" style={{ x: fx, y: fy }}>
                <span className="deck-stage-floor" />
              </m.span>

              {/* Mira de inspección: sustituye a la inclinación como respuesta al
                  puntero y, a diferencia de ella, AÑADE información — lee la
                  posición en píxeles nominales del destino. */}
              <span aria-hidden="true" className="deck-cross">
                <i className="deck-cross-h" />
                <i className="deck-cross-v" />
                <span ref={probeRef} className="deck-cross-read" />
              </span>

              {/* Corchetes de encuadre y regla: ornamento funcional, no adorno. */}
              <span aria-hidden="true" className="deck-bracket deck-bracket-tl" />
              <span aria-hidden="true" className="deck-bracket deck-bracket-tr" />
              <span aria-hidden="true" className="deck-bracket deck-bracket-bl" />
              <span aria-hidden="true" className="deck-bracket deck-bracket-br" />
              <span aria-hidden="true" className="deck-ruler">
                {Array.from({ length: RULER_TICKS }, (_, i) => (
                  <i key={i} className={i % 4 === 0 ? "deck-tick deck-tick-long" : "deck-tick"} />
                ))}
              </span>

              <m.div
                aria-hidden="true"
                className="deck-device"
                initial={false}
                animate={{
                  width: frame.width,
                  height: frame.height,
                  borderRadius: active.fit.radius,
                }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 190, damping: 25, mass: 0.9 }
                }
                // Sin `transform`: es lo que mantiene el mock-up nítido al píxel.
                // `--dev-radius` deja que el bisel calcule el radio de la
                // pantalla interior (radio exterior menos el grosor del marco).
                style={{ "--dev-radius": `${active.fit.radius}px` } as React.CSSProperties}
                data-rounded={active.fit.radius > 0 ? "" : undefined}
              >
                {/* `key` remonta el mock-up para que su entrada escalonada y el
                    barrido de compilación vuelvan a correr en cada destino. */}
                <div key={active.id} className="deck-screen">
                  <Mockup />
                  <span className="deck-sweep" />
                </div>
              </m.div>
            </div>
          </div>

          {/* Consola de compilación. */}
          <p aria-hidden="true" className="deck-console">
            <span className="deck-console-states">
              <span className="deck-state">
                <i className="deck-state-dot" />
                compilando
              </span>
              <span className="deck-state">
                <i className="deck-state-dot" />
                firmado
              </span>
              <span className="deck-state">
                <i className="deck-state-dot" />
                desplegado
              </span>
            </span>
            <span key={active.id} className="deck-console-bar" />
            <span className="deck-console-build">
              Build {pad2(activeIndex + 1)}/{pad2(platforms.length)}
            </span>
          </p>

          {/* Anuncio discreto para lectores de pantalla: sin esto, los cambios
              del avance automático pasarían inadvertidos. */}
          <p aria-live="polite" className="sr-only">
            Plataforma en pantalla: {active.label}
          </p>

          {/* Control de reproducción (WCAG 2.2.2). Solo se monta en cliente y
              solo si hay movimiento que parar. */}
          {mounted && !reduce && (
            <div className="mt-4 flex justify-center lg:justify-end">
              <button
                type="button"
                onClick={() => setAutoplay((on) => !on)}
                className="text-muted hover:text-foreground border-border hover:border-accent-cyan/50 inline-flex items-center gap-2 border px-3.5 py-2 text-xs transition-colors"
              >
                {autoplay ? (
                  <Pause className="size-3.5" aria-hidden="true" />
                ) : (
                  <Play className="size-3.5" aria-hidden="true" />
                )}
                {autoplay ? "Detener el recorrido automático" : "Reanudar el recorrido automático"}
              </button>
            </div>
          )}
        </div>

        {/* ------------------------------------------------------ panel */}
        <div
          // `key` remonta el panel para que el texto vuelva a entrar escalonado.
          key={active.id}
          role="tabpanel"
          id={`plataforma-panel-${active.id}`}
          aria-labelledby={`plataforma-tab-${active.id}`}
          tabIndex={0}
          className="deck-panel lg:col-start-1 lg:row-start-2"
        >
          <h3
            className="font-display deck-el text-foreground text-xl font-semibold text-balance sm:text-2xl"
            style={{ "--d": "40ms" } as React.CSSProperties}
          >
            {active.headline}
          </h3>
          <p
            className="deck-el text-muted mt-3 text-pretty"
            style={{ "--d": "100ms" } as React.CSSProperties}
          >
            {active.description}
          </p>

          <ul className="mt-6 flex flex-col gap-3">
            {active.capabilities.map((capability, index) => (
              <li
                key={capability}
                className="deck-el text-muted flex gap-3"
                style={{ "--d": `${160 + index * 70}ms` } as React.CSSProperties}
              >
                <span aria-hidden="true" className="deck-bullet" />
                {capability}
              </li>
            ))}
          </ul>

          <ul
            className="deck-el mt-6 flex flex-wrap gap-2"
            style={{ "--d": "400ms" } as React.CSSProperties}
          >
            {active.stack.map((tech) => (
              <li key={tech} className="deck-chip">
                {tech}
              </li>
            ))}
          </ul>

          <p
            className="deck-el text-muted mt-6 font-mono text-xs tracking-wide text-pretty"
            style={{ "--d": "460ms" } as React.CSSProperties}
          >
            <span className="deck-accent-text">Entregable:</span> {active.deliverable}
          </p>
        </div>
      </div>
    </div>
  );
}
