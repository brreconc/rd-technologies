"use client";

import * as React from "react";
import { m, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useMounted } from "@/lib/hooks/use-mounted";
import { platforms, defaultPlatformId, type PlatformId } from "@/lib/constants/platforms";
import { screens, type Shape } from "./screens";

/** Milisegundos que permanece cada destino cuando el deck avanza solo. */
const AUTOPLAY_MS = 6000;
/** Inclinación 3D máxima del dispositivo, en grados. */
const TILT = 9;
/** Separación en profundidad entre las dos capas del mock-up (px). */
const BASE_Z = 14;
const FLOAT_Z = 34;

const TONE_CLASS = { wire: "deck-wire", wire2: "deck-wire-2", accent: "deck-accent" } as const;

/**
 * Una figura del mock-up. El retardo de entrada sale del índice, así que el
 * escalonado se mantiene solo al añadir o quitar piezas.
 */
function ShapeNode({ shape, index }: { shape: Shape; index: number }) {
  const common = {
    className: cn("deck-el", TONE_CLASS[shape.k ?? "wire"]),
    style: { "--d": `${index * 32}ms` } as React.CSSProperties,
    ...(shape.o === undefined ? {} : { opacity: shape.o }),
  };
  return shape.t === "rect" ? (
    <rect x={shape.x} y={shape.y} width={shape.w} height={shape.h} rx={shape.r} {...common} />
  ) : (
    <circle cx={shape.x} cy={shape.y} r={shape.rad} {...common} />
  );
}

/**
 * DECK DE DESPLIEGUE MULTIPLATAFORMA (ADR-013) — la pieza interactiva de §8.
 *
 * Idea: en vez de contar en qué plataformas trabajamos, se COMPILA una delante
 * del cliente. Al elegir un destino, el dispositivo del escenario se transforma
 * (proporción y radio), la escena entera se retiñe con el acento de esa
 * plataforma, un barrido de compilación recorre la pantalla y el mock-up se
 * dibuja pieza a pieza. Mover el puntero inclina el dispositivo y las dos capas
 * del mock-up se separan en profundidad: el holograma responde al usuario.
 *
 * Rendimiento (§11): cero dependencias nuevas y cero canvas. Son SVG estáticos
 * y animaciones CSS de `transform`/`opacity` que compone la GPU. Solo hay un
 * destino montado a la vez, y el avance automático no existe fuera de pantalla
 * (`IntersectionObserver`) — ahí no queda ni un temporizador vivo.
 *
 * Accesibilidad (§10):
 *  - Patrón `tablist`/`tab`/`tabpanel` de WAI-ARIA con `tabindex` rotatorio y
 *    navegación por flechas, Inicio y Fin. Se aceptan los dos ejes porque el
 *    rail es vertical en escritorio y horizontal en móvil.
 *  - El avance automático es movimiento que arranca solo, así que WCAG 2.2.2
 *    exige poder pararlo: hay un botón explícito, se pausa al pasar el puntero o
 *    al enfocar dentro, y elegir un destino a mano lo detiene (el usuario ha
 *    tomado el control). Con `prefers-reduced-motion` no llega a existir.
 *  - El mock-up es decorativo (`aria-hidden`): lo que importa está en el texto
 *    del panel. Una región `aria-live` discreta anuncia los cambios que provoca
 *    el avance automático, que si no pasarían desapercibidos.
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

  const active = platforms.find((p) => p.id === activeId) ?? platforms[0];
  const activeIndex = platforms.indexOf(active);
  const screen = screens[active.id];

  // --- Inclinación 3D del dispositivo, atada al puntero sobre el escenario.
  const rx = useSpring(useMotionValue(0), { stiffness: 140, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 140, damping: 20 });

  const handleStagePointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    event.currentTarget.style.setProperty("--mx", `${px * 100}%`);
    event.currentTarget.style.setProperty("--my", `${py * 100}%`);
    ry.set((px - 0.5) * TILT * 2);
    rx.set((0.5 - py) * TILT * 2);
  };

  const resetStage = () => {
    rx.set(0);
    ry.set(0);
  };

  // --- El deck solo avanza cuando está a la vista (§11).
  React.useEffect(() => {
    const host = rootRef.current;
    if (!host) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.35,
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
      {/* Rejilla explícita: en móvil el orden es rail → escenario → panel; en
          escritorio el escenario ocupa la columna derecha entera. */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-x-12 lg:gap-y-10">
        {/* ------------------------------------------------------- rail */}
        <div
          role="tablist"
          aria-label="Plataformas que desarrollamos"
          onKeyDown={handleKeyDown}
          className="deck-rail -mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-2 lg:col-start-1 lg:row-start-1 lg:mx-0 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:px-0 lg:pb-0"
        >
          {platforms.map((platform) => {
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
                className={cn("deck-tab snap-start", selected && "deck-tab-on")}
              >
                <span aria-hidden="true" className="deck-tab-mark">
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 text-left">
                  <span className="font-display block text-sm font-semibold whitespace-nowrap lg:text-base">
                    {platform.label}
                  </span>
                  <span className="text-muted hidden text-xs lg:block">{platform.kicker}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* -------------------------------------------------- escenario */}
        <div className="lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
          <div
            className="deck-stage"
            onPointerMove={reduce ? undefined : handleStagePointer}
            onPointerLeave={reduce ? undefined : resetStage}
          >
            {/* Campo de proporción fija donde vive el dispositivo: el morfismo
                nunca desplaza nada de la página (CLS 0). */}
            <div className="deck-stage-field">
              <span aria-hidden="true" className="deck-stage-glow" />
              <span aria-hidden="true" className="deck-stage-grid" />

              <m.div
                aria-hidden="true"
                className="deck-device"
                initial={false}
                animate={{
                  width: active.frame.width,
                  height: active.frame.height,
                  borderRadius: active.frame.radius,
                }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 210, damping: 26, mass: 0.9 }
                }
                style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
              >
                {/* Fondo de pantalla y barrido de compilación. Va aparte porque
                    recorta, y recortar aplana la cadena `preserve-3d`. */}
                <span className="deck-screen">
                  <span key={active.id} className="deck-sweep" />
                </span>

                {/* Las dos capas del mock-up, separadas en profundidad: es lo
                    que hace que el holograma se despliegue al inclinarlo. */}
                <svg
                  key={`${active.id}-base`}
                  viewBox={`0 0 ${screen.vw} ${screen.vh}`}
                  className="deck-layer"
                  style={{ transform: `translateZ(${BASE_Z}px)` }}
                >
                  {screen.shapes.slice(0, screen.floatFrom).map((shape, index) => (
                    <ShapeNode key={index} shape={shape} index={index} />
                  ))}
                </svg>
                <svg
                  key={`${active.id}-float`}
                  viewBox={`0 0 ${screen.vw} ${screen.vh}`}
                  className="deck-layer"
                  style={{ transform: `translateZ(${FLOAT_Z}px)` }}
                >
                  {screen.shapes.slice(screen.floatFrom).map((shape, index) => (
                    <ShapeNode key={index} shape={shape} index={screen.floatFrom + index} />
                  ))}
                </svg>
              </m.div>
            </div>

            {/* Consola de compilación: cierra la metáfora del deck. */}
            <p aria-hidden="true" className="deck-console">
              <span className="deck-console-dot" />
              <span className="font-mono text-[0.7rem] tracking-wide">
                compilando destino · {active.label}
              </span>
              <span key={active.id} className="deck-console-bar" />
            </p>
          </div>

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
                className="text-muted hover:text-foreground border-border hover:border-accent-cyan/50 inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs transition-colors"
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
          className="deck-panel rounded-xl lg:col-start-1 lg:row-start-2"
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
