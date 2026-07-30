# ADR-011 — Escenografía de "sistema seguro" y coreografía de scroll (Fase 9)

- **Estado:** Aceptada
- **Fecha:** 2026-07-23
- **Decisores:** Frontend Senior, Performance, UI, Accesibilidad
- **Sustituye parcialmente a:** [ADR-010](./ADR-010-cinematic-motion-system.md) (lo amplía; no lo deroga)
- **Ampliada por:** [ADR-013](./ADR-013-platform-deck.md) (movimiento v4 y deck multiplataforma)

> ⚠️ **Actualización (Fase 10, [ADR-012](./ADR-012-single-dark-theme.md)).** Las referencias a "ambos temas" y al `ThemeToggle` quedan obsoletas: hay un único tema oscuro. **La regla de oro de este ADR sigue plenamente vigente** y el deck de la Fase 10 la respeta.

## Contexto

Tras la Fase 8.1 el cliente pidió subir otro escalón: que al abrir la landing
ocurra "algo que deje boquiabierto", que el fondo **funda los dos mensajes de la
marca** (creación de software + ciberseguridad) en una sola imagen, y que el
scroll esté lleno de motivos para seguir bajando — todo sin sacrificar
seguridad ni rendimiento.

Los contratos no negociables siguen vigentes: LCP intacto (§11),
`prefers-reduced-motion`, funcionamiento sin JS (§3.2), cero desbordamiento
horizontal 320px→4K (§5.3.4), AA en ambos temas (§10), CSP estricta con nonce
(ADR-009) y **sin dependencias nuevas**.

## Decisión

### 1. El fondo del hero cuenta una historia (no es un adorno)

`NeuralNetwork` deja de ser "nodos que flotan" y pasa a ser una **malla que se
compila y se defiende sola**, con dos actos:

1. **Creación de software.** Al cargar, un barrido de escaneo recorre el hero,
   los nodos se **encienden en onda desde el centro** y las aristas **se dibujan
   progresivamente**: la red se construye delante del usuario. Es la secuencia de
   arranque que da el golpe de efecto, y ocurre **detrás** del `<h1>`, que se
   pinta de inmediato (ver §LCP más abajo).
2. **Ciberseguridad.** Ya en régimen, por la malla circulan paquetes de datos y
   cada pocos segundos entra una **intrusión** (roja) desde la periferia que un
   nodo **escudo** (hexágono) intercepta: destello, onda de choque y disolución en
   partículas. Un HUD discreto abajo a la izquierda refleja el recuento.

El HUD se rotula explícitamente como **"Simulación"**: es parte del relato
visual, no una métrica de negocio. Nunca debe presentarse como dato real.

La escena también **reacciona al usuario**: los nodos y enlaces próximos al
cursor se iluminan (linterna suave) y al hacer clic se emite una onda. Esto
convierte el fondo en algo vivo, no en un vídeo.

**Separación de responsabilidades:** toda la matemática vive en
[`engine.ts`](../../../src/components/animations/NeuralNetwork/engine.ts), un
módulo **sin DOM** (nodos, aristas, adyacencia, rutas de intrusión, curvas de la
línea temporal). Así se prueba con Vitest sin canvas
([`engine.test.ts`](../../../src/components/animations/NeuralNetwork/engine.test.ts))
y el componente queda legible.

### 2. El scroll como narración

- **`TextReveal`**: cada título de sección se revela **palabra a palabra**, cada
  una subiendo desde detrás de su máscara. Es el gesto que abre cada sección.
- **`cardIn`**: las tarjetas entran desde abajo, desenfocadas y con un giro 3D
  leve (la lista aporta la `perspective`), y se asientan enfocándose.
- **`Process` → línea de tiempo**: la rejilla de 6 tarjetas se convierte en un
  recorrido vertical con un **raíl que se ilumina conforme se baja** y una luz que
  viaja marcando el punto de lectura. La forma refuerza el fondo ("de la idea al
  producto final") y da un motivo explícito para seguir bajando. Semánticamente
  sigue siendo `<ol>`/`<li>`.
- **`HeroStage`**: al abandonar el hero, el contenido se aleja y se funde
  (movimiento de cámara) dejando ver la malla.
- **Costuras entre secciones (`.section-edge`)**: el `border-t` plano se sustituye
  por un hilo de luz que **se dibuja al entrar la sección** usando
  `animation-timeline: view()` — animación ligada al scroll **con cero
  JavaScript**. Va dentro de `@supports`, así que donde no hay soporte (Safari)
  simplemente queda pintado en su estado final.
- **Cabecera reactiva (`HeaderShell`)**: transparente sobre el hero; al hacer
  scroll aparece el cristal esmerilado, la sombra y una línea de gradiente.
- **Nav con pastilla deslizante (`NavLinks`)**: una sola pastilla viaja con muelle
  hasta el enlace con puntero/foco o, si no hay ninguno, hasta la sección activa
  (scroll-spy). Animar **un** elemento mantiene el coste constante.
- **Tarjetas con esquinas de HUD (`.hud-corners`)**: ocho franjas de 1px dibujadas
  con gradientes que se despliegan al hover/focus — el guiño de "consola de
  seguridad" que hilvana toda la página.
- **`.radar-sweep`** en el CTA final: cierra el relato que abre el hero (empieza
  con una malla que se defiende, termina en un canal vigilado).

### 3. `prefers-reduced-motion`: el CSS es la fuente de verdad

**Cambio de política respecto a ADR-010.** Antes, cada componente bifurcaba su
**markup** según `useReducedMotion()`. Eso escondía un fallo real: ese hook
devuelve `null` en el servidor y `true` en el cliente, así que el HTML del
servidor y el primer render del cliente **no coincidían** → desajuste de
hidratación (React #418) y re-render completo del subárbol para justo los
usuarios que piden menos movimiento.

Política nueva, en tres capas:

1. **CSS.** La regla global de `prefers-reduced-motion` neutraliza animaciones y
   transiciones, y además fija `.reveal { opacity:1; transform:none; filter:none }`
   con `!important` — gana a los estilos en línea que Framer serializa. Es la
   misma regla que aplica el `<noscript>` del layout, así que "sin JS" y "sin
   movimiento" comparten mecanismo.
2. **`MotionConfig reducedMotion="user"`** en `providers.tsx`: Framer ignora las
   animaciones de transformación en todo el árbol.
3. **Los componentes NUNCA cambian su markup** según el hook. Pueden usarlo para
   lo que no viaja en el HTML: manejadores de eventos (`SpotlightCard`,
   `MagneticButton`), rangos de `useTransform` (`HeroStage`), configuración de
   muelles (`Timeline`, `ThemeToggle`, `NavLinks`) y bucles `requestAnimationFrame`
   dentro de efectos (`NeuralNetwork`).

Hay un e2e que lo vigila: carga con `prefers-reduced-motion` y falla si aparece
cualquier error de consola/hidratación.

### 4. Cuidados de rendimiento del canvas

La escena hace mucho más que antes y aun así cuesta menos por fotograma:

- **Sprites de resplandor pre-renderizados**: un `drawImage` en vez de crear un
  `createRadialGradient` por partícula y fotograma (era el mayor coste de la v1).
- **Aristas por lotes de opacidad**: 5 `stroke()` por fotograma en lugar de uno
  por arista (~150). La geometría se acumula en un `Float32Array` reutilizado.
- **Vecindad recalculada cada 30 fotogramas**, no en cada uno.
- **Nº de nodos acotado por área** (tope 26 en móvil, 54 en 4K) y **DPR ≤ 2**.
- **Pausa total** fuera del viewport (`IntersectionObserver`) y con la pestaña
  oculta (`visibilitychange`); el reloj de la escena solo avanza mientras se ve,
  así que reanudar no salta la secuencia de arranque.
- **Degradación automática**: si los fotogramas se encarecen (>32 ms sostenidos),
  baja partículas, quita la linterna y reduce los lotes de aristas.
- **Cambio de tamaño sin reconstruir**: las posiciones se reescalan, de modo que
  girar el móvil o colapsar la barra del navegador no vuelve a reproducir el
  arranque.

### 5. El LCP sigue intacto

El `<h1>` **no se anima**. Su resaltado solo anima **color**
(`background-position`): primero un barrido de "arranque" y después el vaivén
lento. El degradado se pinta en mosaico, así que el texto está coloreado desde el
primer fotograma — nunca hay un instante de texto invisible. `HeroStage` envuelve
el contenido pero en reposo está en su estado neutro.

Medición tras la fase (Lighthouse CI, preset desktop, 3 pasadas, build
indexable): **Performance 99 · Accesibilidad 100 · Best Practices 96 · SEO 100**,
con **LCP 0,8 s · CLS 0 · TBT 0 ms** — idéntico a la Fase 6 pese a la escena.

## Alternativas descartadas

- **Three.js / WebGL / partículas de librería.** Habría dado más realismo a costa
  del presupuesto de JS y de la superficie de CSP. El canvas 2D propio pesa 0 KB
  de dependencias y da el efecto buscado.
- **Overlay de "boot" a pantalla completa.** Es el recurso fácil para el efecto
  "wow" al abrir, pero tapa el LCP y empeora la percepción de carga. El golpe de
  efecto se consigue **detrás** del texto, no delante.
- **Cursor personalizado / scroll suavizado por JS (Lenis y similares).** Rompen
  accesibilidad y expectativas del sistema operativo; el anclaje nativo con
  `scroll-mt` ya aterriza exacto.

## Consecuencias

- ✅ El fondo comunica los dos mensajes de la marca sin una sola palabra.
- ✅ Se corrige un fallo real de hidratación que afectaba a los usuarios con
  `prefers-reduced-motion` (y que existía desde la Fase 3).
- ✅ Lighthouse, CWV, AA, CSP, sin overflow y sin dependencias nuevas: intactos.
- ⚠️ **Presupuesto de JS.** El First Load JS de `/` está en ~332 KB gzip /
  ~288 KB brotli, por encima del objetivo de <200 KB (§11). El desvío **no lo
  introduce esta fase** (aporta ~4 KB): viene de la Fase 8, cuando las tarjetas
  pasaron de servidor a cliente. Ver
  [performance-budgets](../../07-performance/performance-budgets.md) para la
  medición y el plan de reducción.
- ⚠️ **Sin JavaScript la página no se muestra.** Al ser ruta dinámica (el nonce de
  la CSP obliga a leer `headers()`), React transmite el contenido dentro de un
  `<div hidden>` que solo se revela con su script en línea. Es comportamiento del
  framework, previo a esta fase y no relacionado con las animaciones: la
  neutralización de `.reveal` sí funciona (hay e2e que lo comprueba). Ver
  [a11y-guidelines](../../06-accessibility/a11y-guidelines.md).
- ⚠️ El raíl de la línea de tiempo sigue rellenándose con el scroll incluso con
  `prefers-reduced-motion` (es un indicador de progreso, como la barra superior de
  lectura); lo que se desactiva es el suavizado por muelle.
