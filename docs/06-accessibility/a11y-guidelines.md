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

## Automatización (Fase 6)

axe-core en Playwright + revisión manual con lector de pantalla.
