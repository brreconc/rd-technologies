# ADR-019 — El hero pasa de malla neuronal a CONSOLA DE COMPILACIÓN

- **Estado:** Aceptada
- **Fecha:** 2026-09-21
- **Decisores:** R&D Technologies (dirección de producto), desarrollo
- **Reemplaza a:** [ADR-011](./ADR-011-secure-system-scenography.md) y
  [ADR-018](./ADR-018-living-neural-hero.md) en lo relativo al **fondo del hero**
  (la malla neuronal y toda su interacción se retiran por completo).

## Contexto

El fondo del hero era una malla neuronal en `<canvas>` (ADR-011 → 018) que llegó
a incorporar virus, agentes cazadores e interacción con el puntero. Dirección
decide **cambiar la temática**: nada de redes neuronales. En su lugar, algo que
demuestre literalmente lo que hace la empresa —**crear software seguro**— de forma
cinematográfica: una consola que escribe código, compila y aplica ciberseguridad.

Restricciones intactas: **cero dependencias nuevas** (CSP estricta, ADR-009,
presupuesto de JS), `prefers-reduced-motion`, el `<h1>` sigue siendo el LCP y se
pinta al instante, CLS 0 y **60 fps**.

## Opciones consideradas

1. **Vídeo/lottie de una terminal.** Fácil de ver "de película". ❌ Peso alto,
   no responde a la temática real, difícil de mantener y de hacer accesible.
2. **Terminal simulada en el DOM, dirigida por una línea temporal.** Teclea
   código real, compila y asegura, con un ejemplo distinto por plataforma y por
   recarga. ✅ Ligera (texto + CSS), temática exacta, accesible y probada.

## Decisión

**Opción 2.** Se elimina `animations/NeuralNetwork` (componente + motor + tests)
y `Hero/HeroBackdrop`. El hero pasa a **dos columnas**: a la izquierda la
**`CodeConsole`**, a la derecha el mensaje de marca ("Transformamos tus ideas…");
en móvil se apilan (mensaje primero).

`CodeConsole` es un componente de cliente que:

- **Elige una toma al azar por carga** entre cuatro plataformas —Desarrollo Web
  (Next.js/TSX), App Android (Kotlin), App iOS (Swift), App Windows (C#/.NET)—.
  La elección ocurre **tras montar** para no desajustar la hidratación: una sesión
  ve una animación; al recargar, otra. El contenido vive como datos tipados en
  `lib/constants/hero-console.ts` (probado con Vitest), fiel a la arquitectura de
  "contenido como datos".
- **Se ejecuta sola y perfectamente sincronizada:** toda la coreografía (teclear
  el comando, escribir el código, compilar con barra de progreso y logs, marcar
  las medidas de ciberseguridad y entregar la app con métricas) se **deriva de una
  línea temporal precalculada** (`buildTimeline`) que un reloj
  `requestAnimationFrame` recorre; cada fotograma calcula lo visible a partir del
  tiempo transcurrido, lo que da 60 fps estables y sincronía exacta.
- **Resalta la sintaxis** con un tokenizador ligero propio (sin librerías) por
  lenguaje.

Estilos en `src/styles/sections/hero-console.css` (prefijo `.hc-*`), importado por
`globals.css` en el bloque de secciones.

## Consecuencias

- **Positivas:** la entrada comunica el negocio de forma literal y cinematográfica;
  sigue sin dependencias (CSP intacta); ligera (texto + CSS) y con la lógica de
  datos testeada; se retira código de canvas relativamente pesado.
- **Negativas / deuda:** se pierde la interacción con el puntero del hero anterior
  (era decorativa); el resaltado de sintaxis es aproximado (suficiente para un
  fondo decorativo, no un editor real).
- **A revisar:** medir FPS reales en gama baja/móvil (el reloj se detiene al
  terminar y se pausa fuera del viewport); confirmar presupuestos con Lighthouse
  antes de fusionar a `main`. Los ejemplos de código son ilustrativos (§19).

## Evolución (Fase 16.1)

Tres mejoras sobre la consola inicial, sin cambiar la arquitectura:

- **La consola se convierte en la app.** Al terminar de compilar, una capa
  (`AppDemo`) **cubre la consola** y muestra la aplicación "en ejecución" dentro
  del **marco del dispositivo** de su plataforma —navegador (Web), teléfono
  (Android/iOS) o ventana (Windows)—, con su splash, chrome y un sello "en
  ejecución". Toda la demo se tiñe desde `--hcd-accent` (dato del escenario), así
  que converge con la plataforma. Aparece como una nueva fase de la misma línea
  temporal (`demoAt`), sin lógica nueva de reloj.
- **Logos 3D por plataforma.** Emblemas **originales** en inline SVG
  (`Hero/logos.tsx`) que evocan cada plataforma sin reproducir marcas registradas:
  robot (Android), tarjeta-móvil (iOS), ventana de paneles (Windows) y globo web.
  Gradientes + extrusión + flotación por CSS les dan volumen.
- **Encaje exacto en el viewport.** El hero mide `calc(100svh - 4rem)` (viewport
  menos la cabecera `sticky h-16`) y centra su contenido: en una laptop a 100 %
  todo se ve **sin scroll** y en monitores mayores la sección se extiende. Las
  métricas pasan a la columna de texto y el `h1` usa un `clamp` acotado para no
  desbordar a media columna; la consola se dimensiona en unidades de viewport
  (`svh`). Nada reflow-ea (la escritura ocurre dentro de un cuerpo de alto fijo).

## Evolución (Fase 16.2)

- **Apps realistas, no bocetos.** La demo deja de ser un splash con tarjetas
  vacías y pasa a mostrar la **app real**: reutiliza los mock-ups del deck de
  Plataformas (`components/sections/Platforms/mockups`) —panel SaaS con gráfico y
  tabla (Web), app Material (Android), app HIG (iOS) y consola de escritorio
  (Windows)— dentro del marco del dispositivo. La pantalla es un contenedor de
  tamaño (`container-type: size`) y comparte `--platform-accent`, así que el
  mock-up escala y se tiñe con la plataforma. Un **splash de lanzamiento** con el
  logo 3D se desvanece por CSS y revela la app (cine sin lógica de reloj nueva).
- **Encaje definitivo en el fold.** Se recorta el `h1` y los espaciados, y la demo
  **llena** el marco (sin huecos). Resultado: en una laptop a 100 % la creación del
  código y la app caben arriba, con las métricas, sin scroll; en monitores mayores
  se extiende.

## Evolución (Fase 16.3)

- **Bug de altura corregido.** El cuerpo de la consola tenía a la vez `flex: 1` y
  `height`; en una columna flex de altura indefinida, `flex-grow` resuelve la base
  a `auto` (todo el contenido) e **ignora `height`**, así que la consola se
  estiraba hasta abarcar el código entero y desbordaba el fold. Ahora la altura es
  **fija** (`clamp(16rem, 60svh, 34rem)`), medida en viewport.
- **Encaje garantizado en los 4 casos.** Como `60svh + cabecera(4rem) +
padding(~2rem)` < `100svh` para cualquier pantalla y el contenido se centra,
  Web/Android/iOS/Windows **nunca** provocan scroll; en pantallas altas la escena
  se agranda usando el espacio disponible.
- **Android/iOS más grandes.** Al fijar bien la altura, el teléfono (retrato)
  ocupa todo el alto de la consola y gana presencia frente a Web/Windows.

## Evolución (Fase 16.4)

- **Logos visibles y con animación 3D.** El emblema de la plataforma aparece en la
  barra de la consola (al teclear), entra en la demo con un **giro 3D + zoom con
  rebote** en el splash y queda como **distintivo persistente** en una esquina de
  la app. Son emblemas **originales**: no se reproducen los logotipos oficiales de
  Apple/Windows/Android (marcas registradas).
- **Consola distinta por entorno.** Cada plataforma tiñe la consola con su color
  (`--hc-accent` desde `scenario.accent`) y cambia el **símbolo del prompt**
  (`❯`, `$`, `%`, `PS❯`) y el **rótulo de herramienta** (zsh, gradle, xcodebuild,
  PowerShell): se lee que cada framework/terminal es diferente.
- **Aleatorio sin repetir.** La toma se guarda en `localStorage` y en la siguiente
  carga se elige entre las OTRAS tres, así cada recarga muestra una plataforma
  distinta (antes `Math.random` podía repetir).
- **Animaciones más pro.** Barra de compilación con **barrido de brillo**; el
  revelado de la app añade un **fogonazo de encendido**; el logo entra en 3D.
- **Un poco más grande.** La consola sube a `clamp(16rem, 63svh, 36rem)` (sigue
  garantizando el encaje sin scroll) para que los mock-ups se lean mejor.

## Evolución (Fase 16.6)

- **Logotipos oficiales (antes: emblemas originales).** A petición de dirección,
  las tomas usan ahora los **logotipos oficiales** aportados por el proyecto como
  imágenes en `public/logos/` (Android, Apple/iOS, React para Web y Windows). Se
  sirven como estáticos desde el mismo origen (CSP intacta, sin peticiones
  externas). `Hero/logos.tsx` deja de dibujar SVG y pasa a referenciar esos
  archivos (`<img>`); el tamaño lo siguen fijando los contenedores
  (`.hcd-logo`, `.hc-bar-logo`, `.hcd-badge`) con `object-fit: contain`. Esto
  **reemplaza** la decisión previa de usar emblemas originales (§16.1/§16.4).
  Son marcas de terceros: su uso en el sitio es responsabilidad del proyecto
  (respetar las guías de marca de cada propietario).
- **Presentación más premium.** El logo del splash gana un **halo** del color de
  la plataforma que respira detrás (pedestal luminoso), sobre la entrada 3D y la
  flotación que ya tenía.

## Evolución (Fase 16.5)

- **Carrusel infinito (antes: una toma por carga).** La consola ya no reproduce
  una sola plataforma y se detiene: al terminar una toma **encadena la
  siguiente** con una transición tipo carrusel. En el cliente se baraja el orden
  de las 4 (Fisher–Yates); la PRIMERA nunca repite la última carga
  (`localStorage`), así al recargar arranca en otra. La transición se dispara
  **remontando la escena** (`key={cycle}`): la actual se despide por la izquierda
  (`.hc-leaving`) y la nueva entra deslizándose (`hc-cycle-in`). Toda la lógica
  sigue derivada de la línea temporal; al avanzar, el efecto del reloj se relanza
  desde cero. Con `prefers-reduced-motion` no rota: se queda en el estado final.
  Un **indicador de puntos** (uno por plataforma, el activo se alarga y toma su
  color) hace evidente la rotación.
- **CTA teñida por plataforma.** El hero pasa a componente de cliente y mantiene
  la plataforma en curso (la consola la reporta con `onPlatform`). El botón
  "Cotiza tu proyecto" toma el **color de la plataforma que se está creando**
  (cian Web, verde Android, azul iOS, azul Windows) y transiciona suave en cada
  avance. El `<h1>` sigue en el HTML inicial (SSR) como LCP.
- **Tipografía de marca con más presencia.** El `<h1>` sube a
  `clamp(2.2rem, 1.25rem+3vw, 3.75rem)` y el subtítulo a
  `clamp(1.05rem, 0.95rem+0.55vw, 1.4rem)` para que el mensaje impacte.
- **Cinta de stack "ultra premium".** Rediseño de `TechMarquee`
  (`styles/sections/tech-marquee.css`): banda con luz ambiental y hairline
  encendida, píldoras de vidrio con **borde en degradado (anillo cónico)**, nodo
  luminoso con el **color de marca real** de cada tecnología (Docker azul, AWS
  naranja, GraphQL rosa…; verificado contra la identidad oficial y guardado como
  dato en `lib/constants/tech.ts`) que pulsa (desfasado por índice) y destello
  que las barre al hover; el anillo solo gira en la píldora bajo el cursor
  (barato). Tamaño de píldora ajustado para que no se recorten. Sin imágenes ni
  dependencias (CSP intacta).
