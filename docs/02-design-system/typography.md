# Tipografía

## Familias (auto-hospedadas con `next/font`)

| Rol                | Fuente         | Utilidad Tailwind |
| ------------------ | -------------- | ----------------- |
| Cuerpo             | Inter          | `font-sans`       |
| Títulos/Display    | Space Grotesk  | `font-display`    |
| Serif de contraste | Fraunces       | `font-serif`      |
| Monoespaciada      | JetBrains Mono | `font-mono`       |

Definidas en [`layout.tsx`](../../src/app/layout.tsx) y expuestas como variables CSS mapeadas en
`@theme`.

## Escala fluida

Tokens `--text-fluid-*` con `clamp()` (ver [colors-and-tokens](./colors-and-tokens.md)). Escalan
suavemente entre breakpoints sin saltos.

## Reglas

- Títulos con `font-display`; cuerpo con `font-sans`; números/código con `font-mono`.
- `text-balance` en títulos y `text-pretty` en párrafos para mejor composición.
- Jerarquía de headings semántica y sin saltos (`h1` → `h2` → `h3`).

_(Se ampliará con la escala completa de pesos y line-heights en la Fase 1.)_
