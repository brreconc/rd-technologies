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
