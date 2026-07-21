# Movimiento (motion)

## Principios (§6.5)

- **Con propósito:** cada animación comunica jerarquía, feedback o continuidad. Nada decorativo
  que distraiga.
- **No bloqueante:** ninguna animación bloquea la interacción ni el contenido. El `<h1>` del hero
  (elemento LCP) **no se anima**.
- **Accesible:** todo respeta `prefers-reduced-motion` (los componentes renderizan estático).
- **Seguro sin JS:** los elementos con entrada llevan la clase `reveal`; un `<noscript>` en el
  layout los fuerza visibles si no hay JavaScript (progressive enhancement).

## Arquitectura (ADR-003)

**Framer Motion** es el motor, optimizado para el presupuesto (§11):

- `LazyMotion` + componentes ligeros **`m.*`** (no `motion.*`), en modo `strict`.
- El motor `domAnimation` se carga **diferido** (chunk aparte) vía
  [`motion-features.ts`](../../src/lib/animations/motion-features.ts).

## Catálogo de animaciones (Fase 3)

| Animación                        | Dónde                                                                      | Cómo funciona                                                    | Cómo se desactiva                                            |
| -------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------ |
| **Reveal** (fade + subida)       | [`components/animations/Reveal`](../../src/components/animations/Reveal)   | `m.div` con `whileInView` (scroll) o `animate` (mount).          | `prefers-reduced-motion` → estático; `<noscript>` → visible. |
| **Stagger** (entrada escalonada) | [`components/animations/Stagger`](../../src/components/animations/Stagger) | `m.ul/ol` con `staggerChildren`; cada `StaggerItem` es `m.li`.   | Igual que Reveal.                                            |
| **Entrada del hero**             | `sections/Hero`                                                            | `Reveal mode="mount"` en badge, subtítulo y CTAs (el `h1` no).   | Igual que Reveal.                                            |
| **Aurora del hero**              | `sections/Hero` + `.hero-aurora` en `globals.css`                          | Gradiente cónico difuminado que gira (CSS `@keyframes`, sin JS). | `@media (prefers-reduced-motion)` → `animation: none`.       |
| **Hover-lift en cards**          | `components/ui/card`                                                       | `hover:-translate-y-1` + borde acento (CSS).                     | Reduced-motion desactiva la transición (salto instantáneo).  |
| **Acordeón FAQ**                 | `components/ui/accordion`                                                  | Estados de Radix (rotación del chevron).                         | Reduced-motion vía CSS global.                               |

## Catálogo v2 — sistema "cinematográfico" (Fase 8, ADR-010)

Ampliación de alto impacto **sin nuevas dependencias**: CSS puro + el Framer Motion que ya estaba.
Todo degrada a estático con `prefers-reduced-motion` y respeta el LCP, la CSP y el no-JS.

| Animación                        | Dónde                                                                            | Cómo funciona                                                                | Cómo se desactiva                                               |
| -------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **Gradiente de texto animado**   | Resaltado del `h1` (`.text-gradient-animated`)                                   | Anima `background-position` (solo color) → **no toca el LCP**.               | Regla global reduced-motion.                                    |
| **Orbes + rejilla + grano**      | Fondo del hero / CTA (`.orb`, `.grid-dots`, `.grain-overlay`)                    | Blobs difuminados que flotan; puntos y ruido SVG en `data:` URI (sin red).   | Reduced-motion detiene el flotado; son `aria-hidden`.           |
| **Anillo de luz giratorio**      | Badge del hero (`.animated-ring`)                                                | Conic-gradient enmascarado a un borde de 1px que gira.                       | Regla global reduced-motion.                                    |
| **Punto "disponible" con pulso** | Badge del hero (`.pulse-dot`)                                                    | Anillo que escala y se desvanece.                                            | Regla global reduced-motion.                                    |
| **Barra de progreso de scroll**  | [`animations/ScrollProgress`](../../src/components/animations/ScrollProgress)    | `useScroll` + `useSpring` → `scaleX` de una barra fija superior.             | Reduced-motion neutraliza la transición; es `aria-hidden`.      |
| **SpotlightCard** (glow+tilt)    | [`ui/spotlight-card`](../../src/components/ui/spotlight-card)                    | El puntero fija `--mx/--my` (resplandor CSS) y un tilt 3D ≤6° con muelle.    | `useReducedMotion` → tarjeta estática, **sin listeners**.       |
| **Botón magnético**              | [`animations/MagneticButton`](../../src/components/animations/MagneticButton)    | El CTA se desplaza hacia el cursor con muelle; no altera foco ni tabulación. | `useReducedMotion` → renderiza el hijo tal cual.                |
| **Brillo de botón**              | Botón primario / CTAs (`.btn-shine`)                                             | Barrido diagonal blanco al hover (`::after`).                                | Regla global reduced-motion.                                    |
| **Borde de gradiente**           | Tarjetas y CTA final (`.gradient-border`)                                        | Gradiente enmascarado a un borde de 1px, visible en hover/focus.             | Estático; sin animación que desactivar.                         |
| **Marquee de stack**             | [`sections/TechMarquee`](../../src/components/sections/TechMarquee) + `.marquee` | Pista flex con contenido duplicado que se desplaza -50% en bucle (CSS puro). | Pausa al hover; reduced-motion la detiene; copia `aria-hidden`. |
| **CountUp** (métricas)           | [`animations/CountUp`](../../src/components/animations/CountUp)                  | `useInView` (once) + `animate` cuentan de 0 al valor al entrar en pantalla.  | `useReducedMotion` → pinta el valor final directamente.         |

## Variantes compartidas

En [`lib/animations/framer-variants.ts`](../../src/lib/animations/framer-variants.ts): `EASE_OUT`,
`fadeUp`, `staggerContainer`.

## Pendiente / opcional (Fase 3+)

Efectos pesados opcionales (partículas / Three.js) quedan **fuera** para proteger el presupuesto
(ADR-003/ADR-010): el impacto "de otro mundo" se logró con transform/opacity/filter reutilizando
Framer. Si algún día se añaden, será con `next/dynamic` + fallback estático y desactivables por
`prefers-reduced-motion`.
