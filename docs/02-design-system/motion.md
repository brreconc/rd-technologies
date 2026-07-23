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

| Animación                           | Dónde                                                                                              | Cómo funciona                                                                                                                                                         | Cómo se desactiva                                                               |
| ----------------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **Malla neuronal segura** ⭐        | Fondo del hero ([`animations/NeuralNetwork`](../../src/components/animations/NeuralNetwork))       | Secuencia de arranque (barrido + ignición en onda + aristas que se dibujan), paquetes de datos, **intrusiones interceptadas por nodos escudo** y reacción al puntero. | `useReducedMotion` dentro del efecto → 1 fotograma con la red ya construida.    |
| **Barrido de arranque del titular** | `h1` del hero (`.text-gradient-animated`)                                                          | Barrido rápido del degradado (1,5 s) y después vaivén lento. Solo color → **no toca el LCP**.                                                                         | Regla global reduced-motion.                                                    |
| **Título palabra a palabra**        | [`animations/TextReveal`](../../src/components/animations/TextReveal) (todos los `SectionHeading`) | Cada palabra sube desde detrás de su máscara (`overflow:hidden` + `translateY`).                                                                                      | Clase `reveal` → neutralizada por CSS (markup idéntico).                        |
| **Entrada 3D de tarjetas**          | `cardIn` en [`framer-variants`](../../src/lib/animations/framer-variants.ts)                       | Desde abajo, desenfocada y con giro `rotateX`; la lista aporta la `perspective`.                                                                                      | Igual que Reveal.                                                               |
| **Línea de tiempo del proceso**     | [`sections/Process/Timeline`](../../src/components/sections/Process/Timeline.tsx)                  | Raíl que se rellena con el scroll (`useScroll`) + luz que viaja marcando la lectura.                                                                                  | El relleno se mantiene (es progreso); se desactiva el suavizado por muelle.     |
| **Salida del hero**                 | [`sections/Hero/HeroStage`](../../src/components/sections/Hero/HeroStage.tsx)                      | Al bajar, el contenido se aleja y se funde (paralaje ligado al scroll).                                                                                               | `useReducedMotion` pone los recorridos a cero (sin cambiar el markup).          |
| **Costura entre secciones**         | `.section-edge` en `globals.css`                                                                   | Hilo de gradiente que **se dibuja al entrar la sección** con `animation-timeline: view()` — sin JavaScript.                                                           | Dentro de `@supports` + `no-preference`; sin soporte, queda pintado.            |
| **Cabecera reactiva**               | [`shared/Header/HeaderShell`](../../src/components/shared/Header/HeaderShell.tsx)                  | Transparente arriba del todo; al hacer scroll aparecen cristal, sombra y línea de gradiente.                                                                          | Solo transiciones de color → reduced-motion las neutraliza.                     |
| **Nav con pastilla deslizante**     | [`shared/Header/NavLinks`](../../src/components/shared/Header/NavLinks.tsx)                        | Una sola pastilla viaja con muelle al enlace con puntero/foco o a la sección activa (scroll-spy).                                                                     | `useReducedMotion` → salto sin muelle. `aria-current` + subrayado se mantienen. |
| **Esquinas de HUD**                 | `.hud-corners` en `SpotlightCard`                                                                  | Ocho franjas de 1px con gradientes; se despliegan al hover/focus.                                                                                                     | Solo transición → neutralizada.                                                 |
| **SpotlightCard** (glow + tilt)     | [`ui/spotlight-card`](../../src/components/ui/spotlight-card)                                      | El puntero fija `--mx/--my` (resplandor CSS) y un tilt 3D ≤6° con muelle.                                                                                             | `useReducedMotion` → **no se registran los listeners** (markup idéntico).       |
| **Radar del CTA final**             | `.radar-sweep`                                                                                     | Gradiente cónico enmascarado que gira lentamente.                                                                                                                     | Regla global reduced-motion.                                                    |
| **Indicador de scroll**             | `.scroll-cue` (hero)                                                                               | Gota de luz que cae por un hilo.                                                                                                                                      | Regla global reduced-motion.                                                    |
| **Switch de tema premium**          | [`shared/ThemeToggle`](../../src/components/shared/ThemeToggle)                                    | Pomo deslizante sol/luna con resplandor; el icono visible es el tema al que se cambiaría. `role="switch"`.                                                            | `useReducedMotion` → el pomo salta sin muelle.                                  |
| **Barra de progreso de scroll**     | [`animations/ScrollProgress`](../../src/components/animations/ScrollProgress)                      | `useScroll` + `useSpring` → `scaleX` de una barra fija superior.                                                                                                      | `aria-hidden`; reduced-motion neutraliza la transición.                         |
| **Botón magnético**                 | [`animations/MagneticButton`](../../src/components/animations/MagneticButton)                      | El CTA se desplaza hacia el cursor con muelle; no altera foco ni tabulación.                                                                                          | `useReducedMotion` → sin listeners (markup idéntico).                           |
| **Brillo de botón**                 | `.btn-shine`                                                                                       | Barrido diagonal blanco al hover (`::after`).                                                                                                                         | Regla global reduced-motion.                                                    |
| **Borde de gradiente**              | `.gradient-border`                                                                                 | Gradiente enmascarado a un borde de 1px, visible en hover/focus.                                                                                                      | Estático.                                                                       |
| **Marquee de stack**                | [`sections/TechMarquee`](../../src/components/sections/TechMarquee) + `.marquee`                   | Pista flex con contenido duplicado que se desplaza -50% en bucle (CSS puro).                                                                                          | Pausa al hover; reduced-motion la detiene; copia `aria-hidden`.                 |
| **CountUp** (métricas)              | [`animations/CountUp`](../../src/components/animations/CountUp)                                    | Cuenta de 0 al valor al entrar en pantalla. El HTML contiene siempre el valor final.                                                                                  | `useReducedMotion` → no anima (el número ya está pintado).                      |

## Variantes compartidas

En [`lib/animations/framer-variants.ts`](../../src/lib/animations/framer-variants.ts): `EASE_OUT`,
`fadeUp`, `cardIn`, `staggerContainer`, `staggerWords`, `wordUp`.

## Pendiente / opcional

Efectos pesados (Three.js, GSAP, Lottie) quedan **fuera** para proteger el presupuesto
(ADR-003/010/011): el impacto se logra con transform/opacity/filter y un canvas 2D propio. Si algún
día se añaden, será con `next/dynamic` + fallback estático y desactivables por
`prefers-reduced-motion`.
