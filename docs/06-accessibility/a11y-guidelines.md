# Accesibilidad (a11y)

**Objetivo:** WCAG 2.2 **AA** (§10).

## Ya aplicado (Fase 0)

- `<html lang="es">` y HTML semántico (`<main id="contenido-principal">`).
- **Skip link** ("Saltar al contenido") visible al enfocar con teclado.
- **Foco siempre visible:** estilo `:focus-visible` global con el color de anillo de marca.
- **`prefers-reduced-motion`** respetado globalmente.
- **Reglas ESLint jsx-a11y** activas (Next + refuerzos en [`eslint.config.mjs`](../../eslint.config.mjs)).
- CTAs con **touch target ≥ 44px** (`min-h-11`).

## Checklist por componente (Fases 1+)

- [ ] Navegable 100% por teclado, orden lógico.
- [ ] Roles/aria correctos (Radix ayuda en acordeones, menús, diálogos).
- [ ] `alt` descriptivos en imágenes; iconos decorativos con `aria-hidden`.
- [ ] Contraste AA verificado.
- [ ] Estados (hover/focus/active/disabled) perceptibles sin depender solo del color.

## Automatización (Fase 6 — implementado)

- **axe-core en Playwright** (`e2e/a11y.spec.ts`): sin violaciones críticas/serias (WCAG 2.0/2.1
  A y AA) en tema claro y oscuro. Complementa (no sustituye) la revisión manual con teclado y
  lector de pantalla.
- **Lighthouse Accessibility: 100** (Fase 6).
- **Adornos decorativos:** los números de paso "01"…, iconos y resplandores llevan
  `aria-hidden="true"`; están fuera del árbol de accesibilidad y, como texto decorativo, quedan
  exentos del contraste (WCAG 1.4.3). El escaneo axe los excluye a propósito; el contenido que sí
  leen las ayudas técnicas se audita al completo. Ver [08-testing](../08-testing/testing-strategy.md).

## Movimiento reducido (Fase 9 — ADR-011)

`prefers-reduced-motion` se garantiza **desde el CSS**, no desde JavaScript. El detalle y la regla
de oro para escribir componentes nuevos están en
[design-system/motion](../02-design-system/motion.md#política-de-prefers-reduced-motion-adr-011-️-importante).
Resumen:

- La regla global neutraliza animaciones/transiciones y fija `.reveal` en su estado final con
  `!important` (gana a los estilos en línea de Framer).
- `MotionConfig reducedMotion="user"` hace que Framer ignore las transformaciones.
- **Ningún componente cambia su markup según `useReducedMotion()`.** Hacerlo rompía la hidratación
  (el hook devuelve `null` en el servidor) justo para estos usuarios. Corregido en la Fase 9 y
  vigilado por [`e2e/experience.spec.ts`](../../e2e/experience.spec.ts).
- La malla neuronal del hero pinta **un único fotograma** (red ya construida, sin partículas) y no
  arranca el bucle `requestAnimationFrame`.
- El paralaje de salida del hero se anula por completo.

## Limitación conocida: página sin JavaScript

La landing es una **ruta dinámica** (la CSP con nonce obliga a leer `headers()`, ADR-009). React
transmite el contenido de la página dentro de un `<div hidden>` que revela su propio script en
línea, así que **con JavaScript totalmente desactivado el `<main>` no se muestra**. Es
comportamiento del framework, anterior a la Fase 9 y ajeno a las animaciones.

Lo que sí está garantizado (y cubierto por e2e): si el HTML se muestra, la neutralización de
`.reveal` funciona, de modo que **ningún texto queda escondido** por una animación de entrada que
nunca llegó a ejecutarse. Si en el futuro se quisiera servir la página sin JS habría que renunciar
al nonce por petición (CSP con hashes) para poder prerenderizarla estáticamente.
