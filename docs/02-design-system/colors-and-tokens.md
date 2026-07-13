# Colores y tokens de diseño

Los tokens son la **fuente única de verdad** visual. Se declaran en el bloque `@theme` de
[`src/app/globals.css`](../../src/app/globals.css) (Tailwind v4). **Nunca** se hardcodean
colores o tamaños en los componentes.

## Cómo funcionan (Tailwind v4)

Un token en `@theme` genera automáticamente utilidades y una variable CSS:

| Token                                       | Variable CSS               | Utilidades generadas                                        |
| ------------------------------------------- | -------------------------- | ----------------------------------------------------------- |
| `--color-accent-cyan: #00f5ff`              | `var(--color-accent-cyan)` | `bg-accent-cyan`, `text-accent-cyan`, `border-accent-cyan`… |
| `--font-display: var(--font-space-grotesk)` | `var(--font-display)`      | `font-display`                                              |
| `--text-fluid-hero: clamp(...)`             | `var(--text-fluid-hero)`   | `text-fluid-hero`                                           |

## Paleta (tema oscuro por defecto)

| Token                   | Valor               | Uso                             |
| ----------------------- | ------------------- | ------------------------------- |
| `--color-background`    | `#0a0a0a`           | Fondo base (negro absoluto).    |
| `--color-surface`       | `#141414`           | Superficies / cards.            |
| `--color-surface-2`     | `#1a1a1a`           | Superficies elevadas.           |
| `--color-border`        | `#262626`           | Bordes sutiles.                 |
| `--color-foreground`    | `#ffffff`           | Texto principal.                |
| `--color-muted`         | `#b0b0b0`           | Texto secundario.               |
| `--color-accent-cyan`   | `#00f5ff`           | Tecnología / acento primario.   |
| `--color-accent-purple` | `#8b5cf6`           | Gradiente.                      |
| `--color-accent-red`    | `#ff6b6b`           | Seguridad.                      |
| `--color-accent-yellow` | `#ffd93d`           | Innovación.                     |
| `--color-ring`          | `#00f5ff`           | Anillo de foco.                 |
| Gradiente marca         | `#00f5ff → #8b5cf6` | Utilidad `text-gradient-brand`. |

## Tipografía fluida (sin saltos entre breakpoints)

`clamp(mín, ideal con vw, máx)` — escala suave de móvil a TV/4K (§5.3):

| Token               | Uso                  |
| ------------------- | -------------------- |
| `--text-fluid-lg`   | Párrafos destacados. |
| `--text-fluid-xl`   | Subtítulos.          |
| `--text-fluid-2xl`  | Títulos de sección.  |
| `--text-fluid-hero` | Título del hero.     |

## Fuentes

Auto-hospedadas con `next/font` (sin peticiones externas → mejor CSP y CWV). Definidas en
[`layout.tsx`](../../src/app/layout.tsx) y mapeadas en `@theme`:

- `font-sans` → Inter (cuerpo). `font-display` → Space Grotesk (títulos).
- `font-serif` → Fraunces (contraste). `font-mono` → JetBrains Mono (código/números).

## Accesibilidad de color

Todo par texto/fondo debe cumplir **WCAG AA** (≥ 4.5:1 texto normal, ≥ 3:1 texto grande). Los
acentos neón sobre negro se validan antes de usarse como texto; para texto largo se prefiere
`--color-foreground`/`--color-muted`. Validación automatizada con axe en Fase 6.

## Tema claro (pendiente — §19.3)

Hoy es dark-first (valores directos en `@theme`). El toggle está preparado (`next-themes` +
`@custom-variant dark`). Para un tema claro completo se migrará a indirección por variables
(`:root` claro, `.dark` oscuro). Ver [ADR-004](../01-architecture/decisions/ADR-004-tailwind-v4-tokens.md).
