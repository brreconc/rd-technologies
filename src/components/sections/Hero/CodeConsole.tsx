"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { Check, ShieldCheck, Terminal } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  heroScenarios,
  type ConsoleLang,
  type ConsoleScenario,
} from "@/lib/constants/hero-console";
import { GlobeEmblem, MobileEmblem, RobotEmblem, WindowEmblem } from "./logos";
import { AppDemo } from "./AppDemo";

/**
 * Identidad de la consola por plataforma: cada entorno de desarrollo tiene su
 * propia terminal, así que cambia el rótulo de herramienta, el símbolo del prompt
 * y el emblema. El color lo aporta `scenario.accent` (misma fuente que la demo).
 */
const PLATFORM = {
  web: { Logo: GlobeEmblem, tool: "zsh", prompt: '"❯ "' },
  android: { Logo: RobotEmblem, tool: "gradle", prompt: '"$ "' },
  ios: { Logo: MobileEmblem, tool: "xcodebuild", prompt: '"% "' },
  windows: { Logo: WindowEmblem, tool: "PowerShell", prompt: '"PS❯ "' },
} as const;

const STORAGE_KEY = "rdt-hero-console-last";

// --- Ritmo de la "toma" (ms). Ajustado para que dure ~11 s: deliberada pero sin
//     hacer esperar. Todo se deriva de estos números, así que la animación queda
//     perfectamente sincronizada sea cual sea el escenario.
// Tecleo un 30 % más rápido (velocidades reducidas ×0.7).
const CMD_CHAR = 21; // tecleo de comandos de shell (por carácter)
const CODE_CHAR = 14; // tecleo de código (por carácter)
const LINE_PAUSE = 52; // respiro entre líneas de código
const COMPILE_MS = 2400; // ventana de compilación
const CHECK_MS = 260; // cada medida de seguridad que se marca

interface Timeline {
  initStart: number;
  initEnd: number;
  codeStart: number;
  lineStart: number[];
  codeEnd: number;
  buildStart: number;
  buildCmdEnd: number;
  compileStart: number;
  compileEnd: number;
  secStart: number;
  secEnd: number;
  resultAt: number;
  demoAt: number;
  total: number;
}

/** Precalcula todos los instantes de la coreografía a partir del contenido. */
function buildTimeline(s: ConsoleScenario): Timeline {
  let t = 300;
  const initStart = t;
  t += s.init.length * CMD_CHAR;
  const initEnd = t;
  t += 520;

  const codeStart = t;
  const lineStart: number[] = [];
  for (const line of s.code) {
    lineStart.push(t);
    t += Math.max(1, line.length) * CODE_CHAR + LINE_PAUSE;
  }
  const codeEnd = t;
  t += 620;

  const buildStart = t;
  t += s.buildCmd.length * CMD_CHAR;
  const buildCmdEnd = t;
  t += 320;

  const compileStart = t;
  t += COMPILE_MS;
  const compileEnd = t;
  t += 340;

  const secStart = t;
  t += s.security.length * CHECK_MS;
  const secEnd = t;
  t += 420;

  const resultAt = t;
  t += 1600;

  // La consola se convierte en la app creada (demo). Se SOSTIENE bien para que se
  // aprecie: el splash tarda ~2.4 s en desvelar la app (y el sello aparece a
  // 1.8 s), así que dejamos la app limpia en pantalla ~2.6 s más antes de que el
  // carrusel transicione. El total del "hold" cubre splash + revelado + reposo.
  const demoAt = t;
  t += 5200;

  return {
    initStart,
    initEnd,
    codeStart,
    lineStart,
    codeEnd,
    buildStart,
    buildCmdEnd,
    compileStart,
    compileEnd,
    secStart,
    secEnd,
    resultAt,
    demoAt,
    total: t,
  };
}

// --- Resaltado de sintaxis ligero -------------------------------------------
const KEYWORDS: Record<ConsoleLang, ReadonlySet<string>> = {
  tsx: new Set([
    "import",
    "from",
    "export",
    "default",
    "async",
    "await",
    "function",
    "const",
    "let",
    "return",
    "new",
    "interface",
    "type",
    "class",
    "extends",
  ]),
  kotlin: new Set([
    "class",
    "object",
    "private",
    "val",
    "var",
    "fun",
    "return",
    "import",
    "suspend",
    "is",
    "in",
    "override",
  ]),
  swift: new Set([
    "import",
    "struct",
    "class",
    "let",
    "var",
    "func",
    "throws",
    "try",
    "return",
    "private",
    "guard",
    "if",
    "self",
  ]),
  csharp: new Set([
    "using",
    "public",
    "private",
    "sealed",
    "class",
    "byte",
    "string",
    "return",
    "var",
    "new",
    "null",
    "static",
    "void",
  ]),
};

interface Token {
  text: string;
  cls: string;
}

const TOKEN_RE =
  /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d[\d._]*\b)|([A-Za-z_$][\w$]*)|(\s+)|([^\w\s])/g;

/** Trocea una línea en tokens con clase de color. Barato (una línea corta). */
function tokenize(text: string, lang: ConsoleLang): Token[] {
  const out: Token[] = [];
  const kw = KEYWORDS[lang];
  let m: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(text)) !== null) {
    if (m[1]) out.push({ text: m[1], cls: "hc-com" });
    else if (m[2]) out.push({ text: m[2], cls: "hc-str" });
    else if (m[3]) out.push({ text: m[3], cls: "hc-num" });
    else if (m[4]) {
      const word = m[4];
      const after = text[TOKEN_RE.lastIndex];
      const cls = kw.has(word)
        ? "hc-kw"
        : after === "("
          ? "hc-fn"
          : /^[A-Z]/.test(word)
            ? "hc-type"
            : "";
      out.push({ text: word, cls });
    } else if (m[5]) out.push({ text: m[5], cls: "" });
    else out.push({ text: m[6], cls: "hc-punct" });
  }
  return out;
}

function Highlighted({ text, lang }: { text: string; lang: ConsoleLang }) {
  if (!text) return null;
  return (
    <>
      {tokenize(text, lang).map((tok, i) =>
        tok.cls ? (
          <span key={i} className={tok.cls}>
            {tok.text}
          </span>
        ) : (
          <React.Fragment key={i}>{tok.text}</React.Fragment>
        ),
      )}
    </>
  );
}

const Caret = () => <span aria-hidden="true" className="hc-caret" />;

/** Plataforma que se está reproduciendo (la escucha el hero para teñir la CTA). */
export interface HeroPlatform {
  id: ConsoleScenario["id"];
  accent: string;
}

/**
 * Baraja las cuatro tomas (Fisher–Yates) para el carrusel. La PRIMERA nunca
 * repite la última que se mostró en la carga anterior (se recuerda en
 * localStorage), así al recargar el sitio arranca con una plataforma distinta.
 */
function buildOrder(last: string | null): ConsoleScenario[] {
  const all = [...heroScenarios];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  if (all.length > 1 && all[0].id === last) {
    const k = 1 + Math.floor(Math.random() * (all.length - 1));
    [all[0], all[k]] = [all[k], all[0]];
  }
  return all;
}

interface CodeConsoleProps {
  className?: string;
  /** Se llama al cambiar de toma; el hero lo usa para teñir la CTA por plataforma. */
  onPlatform?: (platform: HeroPlatform) => void;
}

/**
 * CONSOLA DE COMPILACIÓN del hero (Fase 16, ADR-019). Sustituye a la antigua
 * malla neuronal. Una terminal de cine que se ejecuta sola: teclea código real,
 * lo compila (barra de progreso + logs), aplica medidas de ciberseguridad (tics
 * verdes) y entrega una app con sus métricas.
 *
 * - **Aleatoria por carga:** elige una de cuatro plataformas (Web, Android, iOS,
 *   Windows) al montar en el cliente, así una sesión ve UNA toma y al recargar
 *   sale otra. Se elige tras montar para no desajustar la hidratación.
 * - **Sincronía perfecta:** toda la coreografía se deriva de una línea temporal
 *   precalculada (`buildTimeline`) que un reloj `requestAnimationFrame` recorre;
 *   cada fotograma DERIVA lo visible del tiempo transcurrido → 60 fps estables.
 * - **Accesibilidad (§10):** decorativa (`aria-hidden`) — el mensaje del hero
 *   está en el `<h1>` y el texto de al lado. Con `prefers-reduced-motion` salta
 *   directa al estado final (código escrito, compilado y asegurado), sin bucle.
 * - **Rendimiento (§11):** el reloj se detiene al terminar y se pausa fuera del
 *   viewport (IntersectionObserver). Sin dependencias nuevas.
 */
export function CodeConsole({ className, onPlatform }: CodeConsoleProps) {
  const reduce = useReducedMotion();
  // Carrusel: `order` es la rotación barajada de las 4 plataformas; `index` la
  // que se reproduce; `cycle` sube en cada avance y REMONTA la escena (`key`),
  // que es lo que dispara la transición de entrada tipo carrusel.
  const [order, setOrder] = React.useState<ConsoleScenario[] | null>(null);
  const [index, setIndex] = React.useState(0);
  const [cycle, setCycle] = React.useState(0);
  const [elapsed, setElapsed] = React.useState(0);
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);

  // El orden se elige tras montar: no rompe la hidratación (en el servidor y el
  // primer render de cliente no hay ninguno) y cada recarga arranca en otra.
  React.useEffect(() => {
    let last: string | null = null;
    try {
      last = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      /* modo incógnito / almacenamiento bloqueado: se ignora */
    }
    const ord = buildOrder(last);
    try {
      window.localStorage.setItem(STORAGE_KEY, ord[0].id);
    } catch {
      /* se ignora */
    }
    // Estado cliente-only e intencionado (aleatorio por carga): fijarlo aquí es
    // justo lo que evita el desajuste de hidratación, no un efecto en cascada.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrder(ord);
  }, []);

  const scenario = order ? order[index] : null;
  const timeline = React.useMemo(() => (scenario ? buildTimeline(scenario) : null), [scenario]);

  // Informa al hero de la plataforma en pantalla (para teñir la CTA por color).
  React.useEffect(() => {
    if (scenario) onPlatform?.({ id: scenario.id, accent: scenario.accent });
  }, [scenario, onPlatform]);

  React.useEffect(() => {
    // Con movimiento reducido no se anima: el render deriva el estado final del
    // tiempo total (ver `e` más abajo), así que aquí no hay nada que programar.
    if (!scenario || !timeline || reduce) return;
    let raf = 0;
    let last = 0;
    let acc = 0;
    let running = true;

    const host = rootRef.current;
    const io = host
      ? new IntersectionObserver(([entry]) => (running = entry.isIntersecting), { threshold: 0 })
      : null;
    if (host && io) io.observe(host);

    const loop = (stamp: number) => {
      if (last === 0) last = stamp;
      const dt = Math.min(stamp - last, 50);
      last = stamp;
      if (running) {
        acc += dt;
        if (acc >= timeline.total) {
          // Fin de la toma → avanza a la siguiente plataforma. Al cambiar el
          // escenario este efecto se relanza desde cero y `cycle` remonta la
          // escena, disparando la transición de carrusel. No reprogramamos frame.
          setIndex((i) => (i + 1) % (order?.length ?? 1));
          setCycle((c) => c + 1);
          setElapsed(0);
          io?.disconnect();
          return;
        }
        setElapsed(acc);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, [scenario, timeline, reduce, order]);

  // Auto-scroll al fondo: la acción siempre queda a la vista, como una terminal.
  React.useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [elapsed]);

  // --- Derivación del fotograma actual --------------------------------------
  const s = scenario;
  const tl = timeline;
  // Con `prefers-reduced-motion` el reloj no corre: se muestra el estado final.
  const e = reduce && tl ? tl.total : elapsed;

  const initChars = s && tl ? clampCount((e - tl.initStart) / CMD_CHAR, s.init.length) : 0;
  const buildChars =
    s && tl && e >= tl.buildStart
      ? clampCount((e - tl.buildStart) / CMD_CHAR, s.buildCmd.length)
      : 0;

  const phase: "init" | "code" | "buildcmd" | "run" = !tl
    ? "init"
    : e < tl.initEnd
      ? "init"
      : e < tl.codeEnd
        ? "code"
        : e < tl.buildCmdEnd
          ? "buildcmd"
          : "run";

  const compileP = tl && e >= tl.compileStart ? clamp01((e - tl.compileStart) / COMPILE_MS) : 0;
  const compiled = tl ? e >= tl.compileEnd : false;
  const logsShown =
    s && tl && e >= tl.compileStart
      ? Math.min(s.logs.length, Math.floor(compileP * s.logs.length) + 1)
      : 0;
  const checksShown =
    s && tl && e >= tl.secStart ? clampCount((e - tl.secStart) / CHECK_MS, s.security.length) : 0;
  const showResult = tl ? e >= tl.resultAt : false;
  const showDemo = tl ? e >= tl.demoAt : false;
  const meta = s ? PLATFORM[s.id] : null;
  const BarLogo = meta?.Logo;
  // En los últimos instantes de la toma, la escena se despide (sale por la
  // izquierda) justo antes de que el carrusel remonte la siguiente.
  const leaving = !!(tl && !reduce && e > tl.total - 720);

  // Índice de la línea de código que se está tecleando ahora (para el cursor).
  let activeLine = -1;
  if (s && tl && phase === "code") {
    for (let i = 0; i < s.code.length; i++) {
      const revealed = clampCount((e - tl.lineStart[i]) / CODE_CHAR, s.code[i].length);
      if (tl.lineStart[i] <= e && revealed < s.code[i].length) {
        activeLine = i;
        break;
      }
      if (tl.lineStart[i] <= e) activeLine = i;
    }
  }

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={cn("hc", className)}
      data-platform={s?.id}
      style={
        s && meta
          ? ({ "--hc-accent": s.accent, "--hc-prompt": meta.prompt } as React.CSSProperties)
          : undefined
      }
    >
      <span className="hc-aura" />
      {/* Escena: se REMONTA en cada avance (`key={cycle}`) para disparar la
          transición de carrusel; contiene barra, cuerpo y la demo de la app. */}
      <div className={cn("hc-stage", leaving && "hc-leaving")} key={cycle}>
        <div className="hc-bar">
          <span className="hc-dots">
            <i />
            <i />
            <i />
          </span>
          {BarLogo && (
            <span className="hc-bar-logo">
              <BarLogo />
            </span>
          )}
          <span className="hc-name">
            {s && meta ? `${meta.tool} — ${s.filename}` : "rdt://console"}
          </span>
          {/* Indicador de carrusel: un punto por plataforma, el activo se alarga. */}
          {order && (
            <span className="hc-nav" aria-hidden="true">
              {order.map((sc, i) => (
                <i
                  key={sc.id}
                  className={cn(i === index && "is-on")}
                  style={{ "--dot": sc.accent } as React.CSSProperties}
                />
              ))}
            </span>
          )}
          <span className="hc-tag">{s ? s.label : "R&D"}</span>
        </div>

        <div ref={bodyRef} className="hc-body">
          {/* Comando de arranque */}
          {s && tl && e >= tl.initStart && (
            <p className="hc-prompt">
              {s.init.slice(0, initChars)}
              {phase === "init" && <Caret />}
            </p>
          )}

          {/* Código que se teclea, con números de línea */}
          {s && tl && e >= tl.codeStart && (
            <div className="mt-3">
              {s.code.map((line, i) => {
                if (e < tl.lineStart[i]) return null;
                const revealed = clampCount((e - tl.lineStart[i]) / CODE_CHAR, line.length);
                const shown = line.slice(0, revealed);
                return (
                  <div key={i} className="hc-line">
                    <span className="hc-ln">{i + 1}</span>
                    <span className="hc-code">
                      <Highlighted text={shown} lang={s.lang} />
                      {phase === "code" && i === activeLine && <Caret />}
                      {shown.length === 0 ? "​" : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Comando de compilación */}
          {s && tl && e >= tl.buildStart && (
            <p className="hc-prompt hc-shell">
              {s.buildCmd.slice(0, buildChars)}
              {phase === "buildcmd" && <Caret />}
            </p>
          )}

          {/* Compilación: barra de progreso + logs */}
          {s && tl && e >= tl.compileStart && (
            <div className="hc-build">
              <div className="hc-progress">
                <span
                  className="hc-progress-fill"
                  style={{ transform: `scaleX(${compiled ? 1 : compileP})` }}
                />
              </div>
              {s.logs.slice(0, logsShown).map((log, i) => (
                <p key={i} className="hc-log hc-in">
                  <span className="hc-log-dot" />
                  {log}
                </p>
              ))}
            </div>
          )}

          {/* Ciberseguridad: checklist */}
          {s && tl && e >= tl.secStart && (
            <>
              <p className="hc-sec-h">
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                Endureciendo seguridad
              </p>
              {s.security.slice(0, checksShown).map((item, i) => (
                <p key={i} className="hc-check hc-in">
                  <span className="hc-check-box">
                    <Check className="size-3" aria-hidden="true" />
                  </span>
                  {item}
                </p>
              ))}
            </>
          )}

          {/* Resultado */}
          {s && showResult && (
            <div className="hc-result hc-in">
              <p className="hc-result-h">
                <Terminal className="size-4 text-[var(--success)]" aria-hidden="true" />
                <b>✔ Build OK</b> · {s.result.title}
              </p>
              <div className="hc-metrics">
                {s.result.metrics.map((mtr) => (
                  <span key={mtr.label} className="hc-metric">
                    <b>{mtr.value}</b>
                    <span>{mtr.label}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* La consola SE CONVIERTE en la app creada: capa que la cubre al terminar. */}
        {s && showDemo && <AppDemo scenario={s} />}
      </div>
    </div>
  );
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}
/** Número de caracteres/pasos revelados, acotado a [0, max]. */
function clampCount(v: number, max: number): number {
  const n = Math.floor(v);
  return n < 0 ? 0 : n > max ? max : n;
}
