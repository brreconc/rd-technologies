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

## Variantes compartidas

En [`lib/animations/framer-variants.ts`](../../src/lib/animations/framer-variants.ts): `EASE_OUT`,
`fadeUp`, `staggerContainer`.

## Pendiente / opcional (Fase 3+)

Efectos pesados opcionales (partículas / Three.js) quedan **fuera** por ahora para proteger el
presupuesto (ADR-003). Si se añaden, será con `next/dynamic` + fallback estático y desactivables
por `prefers-reduced-motion`.
