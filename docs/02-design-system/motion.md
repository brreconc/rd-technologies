# Movimiento (motion)

## Principios (§6.5)

- **Con propósito:** cada animación comunica jerarquía, feedback o continuidad. Nada decorativo
  que distraiga.
- **No bloqueante:** ninguna animación bloquea la interacción ni el contenido. El `<h1>` del hero
  (elemento LCP) **no se anima**.
- **Accesible:** todo respeta `prefers-reduced-motion` — ver la política más abajo.
- **Seguro sin JS:** los elementos con entrada llevan la clase `reveal`; un `<noscript>` en el
  layout los fuerza visibles si no hay JavaScript (progressive enhancement).

## Arquitectura (ADR-003)

**Framer Motion** es el motor, optimizado para el presupuesto (§11):

- `LazyMotion` + componentes ligeros **`m.*`** (no `motion.*`), en modo `strict`.
- El motor `domAnimation` se carga **diferido** (chunk aparte) vía
  [`motion-features.ts`](../../src/lib/animations/motion-features.ts).
- `MotionConfig reducedMotion="user"` en [`providers.tsx`](../../src/app/providers.tsx).

## Política de `prefers-reduced-motion` (ADR-011) ⚠️ importante

El **CSS es la fuente de verdad**, en tres capas:

1. **CSS global** ([`globals.css`](../../src/app/globals.css)): neutraliza animaciones y
   transiciones y fija `.reveal { opacity:1; transform:none; filter:none }` con `!important` —
   gana a los estilos en línea que Framer serializa en el HTML.
2. **`MotionConfig reducedMotion="user"`**: Framer ignora las animaciones de transformación.
3. **Los componentes NO bifurcan su markup** según `useReducedMotion()`.

> **Regla de oro:** `useReducedMotion()` devuelve `null` en el servidor y `true` en el cliente. Si
> un componente cambia lo que RENDERIZA en función del hook, el HTML del servidor y el primer
> render del cliente dejan de coincidir → desajuste de hidratación (React #418). Úsalo solo para lo
> que **no viaja en el HTML**: manejadores de eventos, rangos de `useTransform`, configuración de
> muelles y bucles `requestAnimationFrame` dentro de efectos.

Hay un e2e que vigila esta regla: [`e2e/experience.spec.ts`](../../e2e/experience.spec.ts) carga la
página con movimiento reducido y falla ante cualquier error de consola.

## Catálogo de animaciones (Fase 3)

| Animación                        | Dónde                                                                      | Cómo funciona                                                  | Cómo se desactiva                       |
| -------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------- | --------------------------------------- |
| **Reveal** (fade + subida)       | [`components/animations/Reveal`](../../src/components/animations/Reveal)   | `m.div` con `whileInView` (scroll) o `animate` (mount).        | Clase `reveal` → neutralizada por CSS.  |
| **Stagger** (entrada escalonada) | [`components/animations/Stagger`](../../src/components/animations/Stagger) | `m.ul/ol` con `staggerChildren`; cada `StaggerItem` es `m.li`. | Igual que Reveal.                       |
| **Hover-lift en cards**          | [`components/ui/card`](../../src/components/ui/card)                       | `hover:-translate-y-1` + borde acento (CSS).                   | Reduced-motion desactiva la transición. |
| **Acordeón FAQ**                 | [`components/ui/accordion`](../../src/components/ui/accordion)             | Estados de Radix (rotación del chevron).                       | Reduced-motion vía CSS global.          |

## Catálogo v3 — "escenografía de sistema seguro" (Fase 9, ADR-011)

Todo **sin dependencias nuevas**: CSS puro, un `<canvas>` propio y el Framer Motion que ya estaba.

| Animación                           | Dónde                                                                                                   | Cómo funciona                                                                                                                                                                                                                                                                      | Cómo se desactiva                                                                                                   |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Malla neuronal segura** ⭐        | Fondo del hero ([`animations/NeuralNetwork`](../../src/components/animations/NeuralNetwork))            | Secuencia de arranque (barrido + ignición en onda + aristas que se dibujan), paquetes de datos, **intrusiones interceptadas por nodos escudo** y reacción al puntero.                                                                                                              | `useReducedMotion` dentro del efecto → 1 fotograma con la red ya construida.                                        |
| **Barrido de arranque del titular** | `h1` del hero (`.text-gradient-animated`)                                                               | Barrido rápido del degradado (1,5 s) y después vaivén lento. Solo color → **no toca el LCP**.                                                                                                                                                                                      | Regla global reduced-motion.                                                                                        |
| **Título palabra a palabra**        | [`animations/TextReveal`](../../src/components/animations/TextReveal) (todos los `SectionHeading`)      | Cada palabra sube desde detrás de su máscara (`overflow:hidden` + `translateY`). Con `highlight` un fragmento contiguo se pinta con el degradado de marca — solo color, no cambia el gesto.                                                                                        | Clase `reveal` → neutralizada por CSS (markup idéntico).                                                            |
| **Entrada 3D de tarjetas**          | `cardIn` en [`framer-variants`](../../src/lib/animations/framer-variants.ts)                            | Desde abajo, desenfocada y con giro `rotateX`; la lista aporta la `perspective`.                                                                                                                                                                                                   | Igual que Reveal.                                                                                                   |
| **Entrada lateral de filas**        | `rowIn` en [`framer-variants`](../../src/lib/animations/framer-variants.ts)                             | Fade + deslizamiento desde la izquierda, **sin giro 3D ni desenfoque**. Para filas dentro de un panel con borde, donde `cardIn` despegaría el texto de la caja y además el rasterizado 3D de Chromium lo desenfocaría (ADR-015).                                                   | Igual que Reveal.                                                                                                   |
| **Recorrido del proceso** ⭐        | [`sections/Process/Timeline`](../../src/components/sections/Process/Timeline.tsx)                       | Raíl HORIZONTAL que se cuenta solo: un cometa vuela de un hito al siguiente (760 ms) y al llegar el hito DETONA —floración de color, dos ondas de choque y diez radios de luz—. Los seis pasos recorren el espectro. Todo en CSS; React solo guarda el índice activo. Ver ADR-016. | Con `prefers-reduced-motion` no hay recorrido: la detonación desaparece y el raíl queda pintado en su estado final. |
| **Salida del hero**                 | [`sections/Hero/HeroStage`](../../src/components/sections/Hero/HeroStage.tsx)                           | Al bajar, el contenido se aleja y se funde (paralaje ligado al scroll).                                                                                                                                                                                                            | `useReducedMotion` pone los recorridos a cero (sin cambiar el markup).                                              |
| **Espina del manifiesto** ⭐        | `.vpx-rail::after` en `globals.css` ([`sections/ValueProps`](../../src/components/sections/ValueProps)) | La línea que engarza los tres estratos **se dibuja de arriba abajo** con `animation-timeline: view()`. Sin JavaScript, sin observadores. Ver ADR-017.                                                                                                                              | Dentro de `@supports` + `no-preference`; sin soporte, queda pintada entera.                                         |
| **Costura entre secciones**         | `.section-edge` en `globals.css`                                                                        | Hilo de gradiente que **se dibuja al entrar la sección** con `animation-timeline: view()` — sin JavaScript.                                                                                                                                                                        | Dentro de `@supports` + `no-preference`; sin soporte, queda pintado.                                                |
| **Cabecera reactiva**               | [`shared/Header/HeaderShell`](../../src/components/shared/Header/HeaderShell.tsx)                       | Transparente arriba del todo; al hacer scroll aparecen cristal, sombra y línea de gradiente.                                                                                                                                                                                       | Solo transiciones de color → reduced-motion las neutraliza.                                                         |
| **Nav con pastilla deslizante**     | [`shared/Header/NavLinks`](../../src/components/shared/Header/NavLinks.tsx)                             | Una sola pastilla viaja con muelle al enlace con puntero/foco o a la sección activa (scroll-spy).                                                                                                                                                                                  | `useReducedMotion` → salto sin muelle. `aria-current` + subrayado se mantienen.                                     |
| **Esquinas de HUD**                 | `.hud-corners` en `SpotlightCard`                                                                       | Ocho franjas de 1px con gradientes; se despliegan al hover/focus.                                                                                                                                                                                                                  | Solo transición → neutralizada.                                                                                     |
| **SpotlightCard** (glow + tilt)     | [`ui/spotlight-card`](../../src/components/ui/spotlight-card)                                           | El puntero fija `--mx/--my` (resplandor CSS) y un tilt 3D ≤6° con muelle.                                                                                                                                                                                                          | `useReducedMotion` → **no se registran los listeners** (markup idéntico).                                           |
| **Radar del CTA final**             | `.radar-sweep`                                                                                          | Gradiente cónico enmascarado que gira lentamente.                                                                                                                                                                                                                                  | Regla global reduced-motion.                                                                                        |
| **Indicador de scroll**             | `.scroll-cue` (hero)                                                                                    | Gota de luz que cae por un hilo.                                                                                                                                                                                                                                                   | Regla global reduced-motion.                                                                                        |
| **Barra de progreso de scroll**     | [`animations/ScrollProgress`](../../src/components/animations/ScrollProgress)                           | `useScroll` + `useSpring` → `scaleX` de una barra fija superior.                                                                                                                                                                                                                   | `aria-hidden`; reduced-motion neutraliza la transición.                                                             |
| **Botón magnético**                 | [`animations/MagneticButton`](../../src/components/animations/MagneticButton)                           | El CTA se desplaza hacia el cursor con muelle; no altera foco ni tabulación.                                                                                                                                                                                                       | `useReducedMotion` → sin listeners (markup idéntico).                                                               |
| **Brillo de botón**                 | `.btn-shine`                                                                                            | Barrido diagonal blanco al hover (`::after`).                                                                                                                                                                                                                                      | Regla global reduced-motion.                                                                                        |
| **Borde de gradiente**              | `.gradient-border`                                                                                      | Gradiente enmascarado a un borde de 1px, visible en hover/focus.                                                                                                                                                                                                                   | Estático.                                                                                                           |
| **Marquee de stack**                | [`sections/TechMarquee`](../../src/components/sections/TechMarquee) + `.marquee`                        | Pista flex con contenido duplicado que se desplaza -50% en bucle (CSS puro).                                                                                                                                                                                                       | Pausa al hover; reduced-motion la detiene; copia `aria-hidden`.                                                     |
| **CountUp** (métricas)              | [`animations/CountUp`](../../src/components/animations/CountUp)                                         | Cuenta de 0 al valor al entrar en pantalla. El HTML contiene siempre el valor final.                                                                                                                                                                                               | `useReducedMotion` → no anima (el número ya está pintado).                                                          |

## Catálogo v4 — "cambio de plano" y deck multiplataforma (Fases 10–11, ADR-013 y ADR-014)

Todo lo de esta tanda es **CSS puro ligado al scroll** (`animation-timeline`) o `transform`/
`opacity` sobre SVG. **Cero JavaScript de scroll, cero observadores, cero dependencias nuevas.**
Donde el navegador no soporta `animation-timeline`, todo queda pintado en su estado final: es
mejora progresiva dentro de `@supports`.

| Animación                      | Dónde                                                                                         | Cómo funciona                                                                                                                                                                                                                                            | Cómo se desactiva                                                           |
| ------------------------------ | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **Aurora de página** ⭐        | `.aurora`, un `<div>` fijo en el layout                                                       | Dos focos de luz que se desplazan con el avance del documento (`animation-timeline: scroll(root)`). Da continuidad: la página se percibe como un espacio con iluminación propia.                                                                         | Dentro de `@supports` + `no-preference`; sin soporte queda estática.        |
| **Costura entre secciones** ⭐ | `.section-edge` en `globals.css`                                                              | Hilo de luz con un **nodo encendido en el centro** que se despliega hacia los dos lados al entrar la sección (`view()`), más un resplandor que se hincha y queda en rescoldo (`::after`).                                                                | Igual. Sin soporte, el hilo queda dibujado.                                 |
| **Llegada de sección** ⭐      | `.section-flow`, en la primitiva [`Section`](../../src/components/ui/container/index.tsx)     | La sección entra atenuada y desplazada y alcanza su brillo pleno al subir. Al vivir en la primitiva, **todas** las secciones la heredan.                                                                                                                 | Igual.                                                                      |
| **Morfismo del dispositivo**   | [`sections/Platforms/PlatformDeck`](../../src/components/sections/Platforms/PlatformDeck.tsx) | Al cambiar de destino, el dispositivo pasa de navegador apaisado a teléfono vertical o monitor (ancho, alto y radio con muelle). El escenario tiene proporción fija → **CLS 0**.                                                                         | `useReducedMotion` → duración 0 (el markup NO cambia).                      |
| **Retinte por plataforma**     | `--platform-accent` en `.deck`                                                                | Una sola variable CSS retiñe marco, resplandor, mock-up, viñetas, chips y consola a la vez.                                                                                                                                                              | Solo color → la regla global de reduced-motion neutraliza las transiciones. |
| **Barrido de compilación**     | `.deck-sweep`                                                                                 | Una banda de luz recorre la pantalla del dispositivo al cambiar de destino. Se reproduce por remontaje (`key`).                                                                                                                                          | Regla global reduced-motion.                                                |
| **Mock-up que se dibuja**      | `.mk > *` en cada componente de [`mockups/`](../../src/components/sections/Platforms/mockups) | Los bloques del mock-up entran escalonados al aterrizar en un destino, y el mock-up se remonta por `key`, así que la interfaz se "dibuja" cada vez.                                                                                                      | Regla global reduced-motion (incluido `animation-delay`, ver abajo).        |
| **Mira de inspección** ⭐      | `.deck-cross` + `.deck-floor-wrap` con muelles de Framer                                      | El puntero sobre el escenario arrastra el resplandor, desplaza el suelo en perspectiva (±22 px) y despliega una mira de 1px que **lee la posición en píxeles nominales del destino**. El dispositivo NO se transforma: ver la nota de nitidez más abajo. | `useReducedMotion` → no se registran los manejadores (markup idéntico).     |
| **Escaparate que convierte**   | `.mk-ec-badge`, `.mk-ec-toast`, `.mk-ec-cta` (mock-up E-commerce)                             | Contador del carrito, aviso de "añadido al carrito" y brillo del botón de pago, sincronizados en un ciclo de 4,5 s. Es el único mock-up con animación propia, porque es el único cuyo argumento es la conversión.                                        | Regla global + `animation: none`; el aviso queda **visible y quieto**.      |
| **Consola de compilación**     | `.deck-console`                                                                               | Punto que late y barra de progreso que se rellena al cambiar de destino.                                                                                                                                                                                 | Regla global reduced-motion.                                                |
| **Estados de la consola**      | `.deck-state-dot`                                                                             | Tres puntos que laten desfasados 0,35 s (compilando · firmado · desplegado). Bucle infinito, puramente ambiental.                                                                                                                                        | Regla global reduced-motion + `animation: none` explícito.                  |
| **Cursor del log**             | `.mk-cursor` (mock-up de escritorio)                                                          | Cursor de terminal parpadeando con `steps(1)`.                                                                                                                                                                                                           | Igual.                                                                      |

> **Nota sobre nitidez: `.deck-device` no admite transformaciones.** Chromium promociona a capa
> propia todo elemento con transformación 3D, lo rasteriza **una sola vez** y deja que la GPU
> remuestree esa textura. En superficies grandes no se nota; en el texto de 6–10 px del interior del
> mock-up es un desenfoque evidente, y aparecía justo cuando el visitante se acercaba a mirar. No hay
> `will-change` ni truco de escala que lo evite: el factor de rasterizado sale de la matriz hacia
> pantalla y para una rotación pura no pasa de 1. Por eso el movimiento con el puntero vive en el
> suelo y en la mira, y hay un E2E que lee la matriz calculada de `.deck-device` con el puntero
> encima. Ver [ADR-015](../01-architecture/decisions/ADR-015-crisp-deck-and-ecommerce.md).
>
> **Nota sobre `animation-delay`.** La regla global de `prefers-reduced-motion` fija también
> `animation-delay: 0.001ms`. Sin eso, una animación escalonada (`--d: 400ms`) dejaría su elemento
> en el fotograma inicial —invisible— durante ese retardo, aunque la duración ya fuera cero.

## Variantes compartidas

En [`lib/animations/framer-variants.ts`](../../src/lib/animations/framer-variants.ts): `EASE_OUT`,
`fadeUp`, `cardIn`, `staggerContainer`, `staggerWords`, `wordUp`.

## Pendiente / opcional

Efectos pesados (Three.js, GSAP, Lottie) quedan **fuera** para proteger el presupuesto
(ADR-003/010/011): el impacto se logra con transform/opacity/filter y un canvas 2D propio. Si algún
día se añaden, será con `next/dynamic` + fallback estático y desactivables por
`prefers-reduced-motion`.
