# Catálogo de componentes

> Formato por componente: propósito, ubicación, notas de accesibilidad/animación.

## Primitivos UI (`src/components/ui`)

| Componente                                        | Ubicación      | Notas                                                                                                                                           |
| ------------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`                                          | `ui/button`    | Variantes (`primary`/`secondary`/`outline`/`ghost`) y tallas con `cva`. `asChild` (Radix Slot) para renderizar como `<a>`. Touch target ≥ 44px. |
| `Card` (+ `CardHeader/Title/Description/Content`) | `ui/card`      | Superficie con borde; composición por subpartes.                                                                                                |
| `Container` / `Section`                           | `ui/container` | Ancho máximo + padding fluido; `Section` añade espaciado vertical y `scroll-mt` para anclas.                                                    |
| `Input` / `Label`                                 | `ui/input`     | Campo y etiqueta base para formularios (Fase 4).                                                                                                |
| `Accordion` (+ `Item/Trigger/Content`)            | `ui/accordion` | Sobre Radix Accordion (teclado + ARIA). Para la FAQ (Fase 2).                                                                                   |

## Compartidos (`src/components/shared`)

| Componente    | Ubicación                 | Notas                                                                                 |
| ------------- | ------------------------- | ------------------------------------------------------------------------------------- |
| `Header`      | `shared/Header`           | Cabecera fija (sticky) con nav por anclas, `ThemeToggle` y CTA. Server Component.     |
| `MobileNav`   | `shared/Header/MobileNav` | Menú móvil (< lg) con Radix Dialog (trampa de foco, Escape, ARIA). Cliente.           |
| `Footer`      | `shared/Footer`           | Logo, navegación, redes (si hay datos) y copyright.                                   |
| `ThemeToggle` | `shared/ThemeToggle`      | Alterna claro/oscuro (`next-themes`); usa `useMounted` para evitar mismatch. Cliente. |
| `Logo`        | `shared/Logo`             | Wordmark tipográfico enlazado al inicio (sin logo gráfico aún, §19.5).                |

## Hooks (`src/lib/hooks`)

| Hook            | Uso                                                                          |
| --------------- | ---------------------------------------------------------------------------- |
| `useMounted`    | `true` tras hidratar (vía `useSyncExternalStore`). Evita mismatches de tema. |
| `useMediaQuery` | Suscribe un media query (SSR-safe).                                          |

## App

| Componente   | Ubicación               | Estado                                         |
| ------------ | ----------------------- | ---------------------------------------------- |
| `RootLayout` | `src/app/layout.tsx`    | Fuentes, tema, skip link, Header + Footer.     |
| `Providers`  | `src/app/providers.tsx` | Theming (next-themes).                         |
| `HomePage`   | `src/app/page.tsx`      | Hero provisional (secciones reales en Fase 2). |

## Próximos (Fase 2)

Secciones: `Hero`, `ValueProps`, `Services`, `Differentiators`, `Process`, `UseCases`,
`Testimonials`, `FAQ`, `FinalCTA`.
