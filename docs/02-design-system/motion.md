# Movimiento (motion)

## Principios (§6.5)

- **Con propósito:** cada animación comunica jerarquía, feedback o continuidad. Nada decorativo
  que distraiga.
- **Duraciones:** 150–400ms para micro-interacciones; easing consistente.
- **No bloqueante:** ninguna animación bloquea la interacción ni el contenido.
- **Respeto por `prefers-reduced-motion`:** ya aplicado globalmente en
  [`globals.css`](../../src/app/globals.css) (reduce animaciones/transiciones a ~0).

## Arquitectura

Ver [ADR-003](../01-architecture/decisions/ADR-003-animation-strategy.md): Framer Motion como
motor principal; GSAP/Three/partículas/Lottie diferidos y opcionales.

## Catálogo de animaciones

_(Se completará en la Fase 3: cada animación documentada con qué hace, qué librería usa, cómo se
configura y cómo se desactiva.)_
