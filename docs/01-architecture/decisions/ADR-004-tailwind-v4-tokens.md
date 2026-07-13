# ADR-004 — Tailwind v4 y tokens en CSS

- **Estado:** Aceptada
- **Fecha:** 2026-07-12
- **Decisores:** UI, Frontend Senior

## Contexto

`create-next-app` generó **Tailwind CSS v4**, que abandona `tailwind.config.ts` en favor de una
configuración **basada en CSS** (`@import "tailwindcss"` + bloque `@theme`). El prompt maestro
mencionaba `tailwind.config.ts` (patrón de v3).

## Decisión

Adoptar el modelo de **Tailwind v4**:

- Los tokens (colores, fuentes, tipografía fluida, gradiente) se declaran en `@theme` dentro de
  [`src/app/globals.css`](../../../src/app/globals.css). Cada token genera utilidades
  automáticamente (p. ej. `--color-accent-cyan` → `bg-accent-cyan`, `text-accent-cyan`).
- Modo oscuro por clase con `@custom-variant dark (...)`, listo para el futuro tema claro.
- Utilidad de marca `text-gradient-brand` vía `@utility`.

## Consecuencias

- ✅ Menos archivos de config; tokens y estilos base en un único lugar versionado.
- ✅ Tipografía fluida (`clamp`) como tokens `--text-fluid-*`.
- ⚠️ La documentación/ejemplos de Tailwind v3 no aplican al 100%. Documentado en
  [design-system](../../02-design-system/colors-and-tokens.md).
- 🔁 Para un tema claro completo (§19.3) se migrará a indirección por variables (`:root` claro
  - `.dark` oscuro).
