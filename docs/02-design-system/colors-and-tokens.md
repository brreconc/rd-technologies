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

## Paleta (tema oscuro único)

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

## Tema único oscuro (Fase 10 — [ADR-012](../01-architecture/decisions/ADR-012-single-dark-theme.md))

El sitio tiene **un solo tema**. Ya no hay alternador, ni clase `.light`/`.dark` en `<html>`, ni
`next-themes`: la paleta se declara una vez en `:root`, con `color-scheme: dark`.

La **indirección por variables se mantiene** y es la regla que no se negocia: los componentes usan
`bg-background`, `text-foreground`, `border-border`… **nunca** un color literal. Cambiar la paleta
—o reintroducir un segundo tema en el futuro— es editar el bloque `:root` de `globals.css`, no
rastrear componentes.

- `--on-accent` (`#0a0a0a`) da texto legible sobre los acentos brillantes (p. ej. el botón primario
  cian).
- `color-scheme: dark` hace que el navegador pinte en oscuro lo que no controlamos: barras de
  desplazamiento, autocompletado del formulario y controles nativos. Sin él aparecerían cajas
  blancas dentro de la interfaz.
- Un tema menos **no relaja el contraste**: sigue siendo obligatorio AA sobre la paleta oscura, y se
  sigue verificando con axe en E2E.

### Acentos por plataforma (deck de §8)

El deck multiplataforma ([ADR-013](../01-architecture/decisions/ADR-013-platform-deck.md)) tiñe toda
su escena desde una única variable, `--platform-accent`, que fija el componente según el destino
activo. Los valores viven en [`lib/constants/platforms.ts`](../../src/lib/constants/platforms.ts):

| Destino    | Acento    | Contraste sobre `#0a0a0a` |
| ---------- | --------- | ------------------------- |
| Web        | `#00f5ff` | ~15:1                     |
| Android    | `#4ade80` | ~11:1                     |
| iOS        | `#a78bfa` | ~8:1                      |
| Escritorio | `#ffd93d` | ~14:1                     |

Todos superan AA con holgura. Si se añade un destino nuevo, su acento debe validarse igual: se usa
como **texto** en la línea "Entregable:".

#### `--deck-dim`: un único gris atenuado

Dentro del deck, todo el texto secundario (kickers, números de canal, chips, cotas, etiquetas del
mock-up) usa `--deck-dim: #8a8a8a` y **nunca** opacidades sobre blanco. El motivo es práctico: con
`color: rgb(255 255 255 / 0.3)` es trivial colar texto por debajo de AA sin darse cuenta, y el
diseño de partida lo hacía en una docena de sitios. Con un token medido (≥5:1 sobre `#0a0a0a`,
`#141414` y `#1a1a1a`) el suelo de contraste está garantizado por construcción.

#### Radio 0 en el deck

El deck es la única zona del sitio con esquinas rectas — salvo los teléfonos y la tablet del
escenario y los puntos de estado. Es deliberado: se lee como un instrumento dentro de una página de
tarjetas redondeadas. Si se toca, hay que tocarlo entero o no tocarlo.
Ver [ADR-014](../01-architecture/decisions/ADR-014-instrument-deck.md).

En los destinos con radio > 0 ese radio **no es solo estético**: activa el bisel del dispositivo
(`.deck-device[data-rounded]`), que es lo que impide que la curva del marco recorte la barra de
estado y la navegación inferior del mock-up. Ver
[ADR-015](../01-architecture/decisions/ADR-015-crisp-deck-and-ecommerce.md).

Acentos por paso del proceso (`lib/constants/process.ts`): `#00f5ff` → `#a78bfa` → `#ff5f9e` →
`#fb923c` → `#ffd93d` → `#4ade80`. Recorren el círculo cromático a propósito: cuando el recorrido
termina, el raíl queda pintado como un espectro y la sección se lee como un viaje sin leer una
palabra. Los seis pasan AA sobre `#0a0a0a` porque se usan como color de **texto**, y hay un test
unitario que lo calcula. Ver
[ADR-016](../01-architecture/decisions/ADR-016-horizontal-process-timeline.md).

Acentos por destino: web `#00f5ff` · e-commerce `#ff5f9e` · android `#4ade80` · ios `#a78bfa` ·
escritorio `#ffd93d`. Los cinco superan AA sobre `#0a0a0a`, porque se usan como color de texto.

Ver [ADR-004](../01-architecture/decisions/ADR-004-tailwind-v4-tokens.md) (tokens en CSS con
Tailwind v4) y [ADR-006](../01-architecture/decisions/ADR-006-fase1-defaults.md) (decisión original
de incluir tema claro, superada por ADR-012).
