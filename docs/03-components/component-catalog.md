# Catálogo de componentes

> Formato por componente: propósito, ubicación, notas de accesibilidad/animación.

## Primitivos UI (`src/components/ui`)

| Componente                                        | Ubicación      | Notas                                                                                                                                           |
| ------------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`                                          | `ui/button`    | Variantes (`primary`/`secondary`/`outline`/`ghost`) y tallas con `cva`. `asChild` (Radix Slot) para renderizar como `<a>`. Touch target ≥ 44px. |
| `Card` (+ `CardHeader/Title/Description/Content`) | `ui/card`      | Superficie con borde; composición por subpartes.                                                                                                |
| `Container` / `Section`                           | `ui/container` | Ancho máximo + padding fluido; `Section` añade espaciado vertical y `scroll-mt` para anclas.                                                    |
| `Input` / `Label`                                 | `ui/input`     | Campo y etiqueta base para formularios (usados por la Fase 4).                                                                                  |
| `Textarea`                                        | `ui/textarea`  | Área multilínea (mensaje de contacto). `resize-y`, sin desbordar en anchos pequeños.                                                            |
| `Accordion` (+ `Item/Trigger/Content`)            | `ui/accordion` | Sobre Radix Accordion (teclado + ARIA). Para la FAQ (Fase 2).                                                                                   |

## Compartidos (`src/components/shared`)

| Componente    | Ubicación                 | Notas                                                                                 |
| ------------- | ------------------------- | ------------------------------------------------------------------------------------- |
| `Header`      | `shared/Header`           | Cabecera fija (sticky) con nav por anclas, `ThemeToggle` y CTA. Server Component.     |
| `MobileNav`   | `shared/Header/MobileNav` | Menú móvil (< lg) con Radix Dialog (trampa de foco, Escape, ARIA). Cliente.           |
| `Footer`      | `shared/Footer`           | Logo, navegación, redes (si hay datos), `NewsletterForm` y copyright.                 |
| `ThemeToggle` | `shared/ThemeToggle`      | Alterna claro/oscuro (`next-themes`); usa `useMounted` para evitar mismatch. Cliente. |
| `Logo`        | `shared/Logo`             | Wordmark tipográfico enlazado al inicio (sin logo gráfico aún, §19.5).                |

## Hooks (`src/lib/hooks`)

| Hook            | Uso                                                                          |
| --------------- | ---------------------------------------------------------------------------- |
| `useMounted`    | `true` tras hidratar (vía `useSyncExternalStore`). Evita mismatches de tema. |
| `useMediaQuery` | Suscribe un media query (SSR-safe).                                          |

## App

| Componente   | Ubicación               | Estado                                     |
| ------------ | ----------------------- | ------------------------------------------ |
| `RootLayout` | `src/app/layout.tsx`    | Fuentes, tema, skip link, Header + Footer. |
| `Providers`  | `src/app/providers.tsx` | Theming (next-themes).                     |
| `HomePage`   | `src/app/page.tsx`      | Compone las 9 secciones (one-page).        |

## Secciones (`src/components/sections`) — Fase 2

Contenido tipado en `src/lib/constants` (no hardcodeado). Helpers: `SectionHeading`, `IconBadge`.

| Sección           | Ancla                 | Fuente de contenido                 |
| ----------------- | --------------------- | ----------------------------------- |
| `Hero`            | —                     | copy inline (oficial)               |
| `ValueProps`      | `#propuesta-de-valor` | `constants/value-props`             |
| `Services`        | `#servicios`          | `constants/services`                |
| `Differentiators` | `#por-que-elegirnos`  | `constants/differentiators`         |
| `Process`         | `#proceso`            | `constants/process`                 |
| `UseCases`        | `#casos-de-uso`       | `constants/use-cases`               |
| `Testimonials`    | `#testimonios`        | `constants/testimonials` (ejemplos) |
| `FAQ`             | `#faq`                | `constants/faq` (Accordion)         |
| `FinalCTA`        | `#contacto`           | copy inline (oficial)               |

> Todas las secciones usan HTML semántico (`section` + `aria-labelledby`, listas, headings
> jerárquicos) y animaciones de entrada (ver abajo).

## Animaciones (`src/components/animations`) — Fase 3

| Componente                | Uso                                                                                 |
| ------------------------- | ----------------------------------------------------------------------------------- |
| `Reveal`                  | Entrada fade+subida al hacer scroll (`mode="scroll"`) o al montar (`mode="mount"`). |
| `Stagger` / `StaggerItem` | Lista con entrada escalonada de sus ítems.                                          |

Detalle completo en [design-system/motion](../02-design-system/motion.md). Framer Motion
optimizado con `LazyMotion` + `m.*` + carga diferida del motor (§11).

## Formularios (`src/components/forms`) — Fase 4

Clientes (`"use client"`). Validan con el mismo esquema Zod que el servidor
(`lib/utils/validators`) y envían por JSON a los route handlers. Seguridad y
accesibilidad detalladas en [05-security/forms-hardening](../05-security/forms-hardening.md).

| Componente       | Ubicación              | Notas                                                                                           |
| ---------------- | ---------------------- | ----------------------------------------------------------------------------------------------- |
| `ContactForm`    | `forms/ContactForm`    | Nombre/email/empresa/mensaje. Errores accesibles, estados pending/éxito/error. En el CTA final. |
| `NewsletterForm` | `forms/NewsletterForm` | Email + suscripción, formato compacto para el pie de página.                                    |
| `AntiBotFields`  | `forms/anti-bot`       | Honeypot + input de tiempo (time-trap) ocultos. Hook `useAntiBot` + `readAntiBotPayload`.       |
| `postForm`       | `forms/post-form`      | POST JSON same-origin; normaliza la respuesta del servidor a un `SubmitResult` tipado.          |

Endpoints (`src/app/api`): `contact/route.ts`, `newsletter/route.ts`,
`health/route.ts` (runtime Node). Lógica de guardias en `src/lib/api`.
