# Catálogo de componentes

> Formato por componente: propósito, ubicación, notas de accesibilidad/animación.

## Primitivos UI (`src/components/ui`)

| Componente                                        | Ubicación           | Notas                                                                                                                                           |
| ------------------------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`                                          | `ui/button`         | Variantes (`primary`/`secondary`/`outline`/`ghost`) y tallas con `cva`. `asChild` (Radix Slot) para renderizar como `<a>`. Touch target ≥ 44px. |
| `Card` (+ `CardHeader/Title/Description/Content`) | `ui/card`           | Superficie con borde; composición por subpartes.                                                                                                |
| `Container` / `Section`                           | `ui/container`      | Ancho máximo + padding fluido; `Section` añade espaciado vertical y `scroll-mt` para anclas.                                                    |
| `Input` / `Label`                                 | `ui/input`          | Campo y etiqueta base para formularios (usados por la Fase 4).                                                                                  |
| `Textarea`                                        | `ui/textarea`       | Área multilínea (mensaje de contacto). `resize-y`, sin desbordar en anchos pequeños.                                                            |
| `Accordion` (+ `Item/Trigger/Content`)            | `ui/accordion`      | Sobre Radix Accordion (teclado + ARIA). Para la FAQ (Fase 2).                                                                                   |
| `SpotlightCard`                                   | `ui/spotlight-card` | Tarjeta "viva": spotlight que sigue al cursor, tilt 3D ≤6°, borde de gradiente y esquinas de HUD. Cliente.                                      |

## Compartidos (`src/components/shared`)

| Componente    | Ubicación                   | Notas                                                                                        |
| ------------- | --------------------------- | -------------------------------------------------------------------------------------------- |
| `Header`      | `shared/Header`             | Cabecera sticky: `Logo`, `NavLinks`, CTA y `MobileNav`. Server Component.                    |
| `HeaderShell` | `shared/Header/HeaderShell` | Envoltorio cliente: transparente arriba del todo, cristal + sombra + línea al hacer scroll.  |
| `NavLinks`    | `shared/Header/NavLinks`    | Nav de escritorio (**≥ xl**) con scroll-spy (`aria-current`) y pastilla deslizante. Cliente. |
| `MobileNav`   | `shared/Header/MobileNav`   | Menú lateral (**< xl**) con Radix Dialog (trampa de foco, Escape, ARIA). Cliente.            |
| `Footer`      | `shared/Footer`             | Logo, navegación, redes (si hay datos), `NewsletterForm` y copyright.                        |
| `Logo`        | `shared/Logo`               | Marca gráfica de grafo (SVG) + wordmark con gradiente animado; nunca parte de línea.         |

> El corte de la navegación está en `xl` (1280px), no en `lg`: con seis destinos, los rótulos
> completos no caben a 1024px y se partían en varias líneas. Entre 1024 y 1279px manda el menú
> lateral. Ver [ADR-013](../01-architecture/decisions/ADR-013-platform-deck.md).
>
> Ya **no hay `ThemeToggle`**: el sitio tiene tema oscuro único
> ([ADR-012](../01-architecture/decisions/ADR-012-single-dark-theme.md)).

## Hooks (`src/lib/hooks`)

| Hook            | Uso                                                                          |
| --------------- | ---------------------------------------------------------------------------- |
| `useMounted`    | `true` tras hidratar (vía `useSyncExternalStore`). Evita mismatches de tema. |
| `useMediaQuery` | Suscribe un media query (SSR-safe).                                          |

## App

| Componente    | Ubicación                  | Estado                                                        |
| ------------- | -------------------------- | ------------------------------------------------------------- |
| `RootLayout`  | `src/app/layout.tsx`       | Fuentes, tema, skip link, Header + Footer, `viewport`.        |
| `Providers`   | `src/app/providers.tsx`    | Theming + `LazyMotion` + `MotionConfig reducedMotion="user"`. |
| `HomePage`    | `src/app/page.tsx`         | Compone las 9 secciones + JSON-LD (one-page).                 |
| `Loading`     | `src/app/loading.tsx`      | Indicador de carga accesible (Suspense de segmento raíz).     |
| `NotFound`    | `src/app/not-found.tsx`    | 404 con rutas de recuperación (Server Component).             |
| `Error`       | `src/app/error.tsx`        | Error boundary de segmento; `unstable_retry()` (Next 16.2).   |
| `GlobalError` | `src/app/global-error.tsx` | Fallo del layout raíz; autocontenido (html/body propios).     |

### Rutas de metadata (Fase 5)

`app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`, `app/opengraph-image.tsx` y
`app/twitter-image.tsx`. Derivan su comportamiento de `config/seo.ts` (política de
indexación única, [ADR-008](../01-architecture/decisions/ADR-008-indexing-policy.md)).
Detalle en [09-content-seo/seo](../09-content-seo/seo.md).

## SEO (`src/components/seo`, `src/lib/seo`) — Fase 5

| Pieza                         | Ubicación               | Notas                                                                           |
| ----------------------------- | ----------------------- | ------------------------------------------------------------------------------- |
| `JsonLd`                      | `components/seo/JsonLd` | Server Component; `<script ld+json>` con escape de `<` (anti-inyección).        |
| `buildHomeJsonLd`             | `lib/seo/json-ld`       | `@graph` con Organization/WebSite/FAQPage (FAQ desde `constants/faq`).          |
| `renderOgImage`               | `lib/seo/og-image`      | Diseño 1200×630 compartido por `opengraph-image` y `twitter-image` (`next/og`). |
| `isIndexable` / `absoluteUrl` | `config/seo`            | Fuente única de la política de indexación y de las URLs absolutas.              |

## Secciones (`src/components/sections`) — Fase 2

Contenido tipado en `src/lib/constants` (no hardcodeado). Helpers: `SectionHeading`, `IconBadge`.

| Sección           | Ancla                 | Fuente de contenido                                |
| ----------------- | --------------------- | -------------------------------------------------- |
| `Hero`            | —                     | copy inline (oficial) + `HeroBackdrop`/`HeroStage` |
| `TechMarquee`     | —                     | `constants/tech`                                   |
| `ValueProps`      | `#propuesta-de-valor` | `constants/value-props`                            |
| `Services`        | `#servicios`          | `constants/services`                               |
| `Platforms`       | `#plataformas`        | `constants/platforms` (deck interactivo, Fase 10)  |
| `Differentiators` | `#por-que-elegirnos`  | `constants/differentiators`                        |
| `Process`         | `#proceso`            | `constants/process` (línea de tiempo con scroll)   |
| `UseCases`        | `#casos-de-uso`       | `constants/use-cases`                              |
| `Testimonials`    | `#testimonios`        | `constants/testimonials` (ejemplos)                |
| `FAQ`             | `#faq`                | `constants/faq` (Accordion)                        |
| `FinalCTA`        | `#contacto`           | copy inline (oficial)                              |

> Todas las secciones usan HTML semántico (`section` + `aria-labelledby`, listas, headings
> jerárquicos) y animaciones de entrada (ver abajo).

### Deck multiplataforma (`sections/Platforms`) — Fase 10

La sección más interactiva del sitio. Responde de un vistazo a "¿pueden hacer LO MÍO?"
compilando el destino elegido delante del cliente. Ver
[ADR-013](../01-architecture/decisions/ADR-013-platform-deck.md).

| Fichero            | Qué es                                                                                                                                                    |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.tsx`        | Server Component: encabezado, marco y el párrafo de cierre. Solo el deck baja al cliente.                                                                 |
| `PlatformDeck.tsx` | Cliente. Patrón `tablist`/`tab`/`tabpanel`, morfismo del dispositivo, retinte por acento, inclinación 3D con el puntero y recorrido automático detenible. |
| `screens.ts`       | Los mock-ups como **datos** (rectángulos y círculos por `viewBox`), no como JSX. Añadir una pantalla es añadir datos.                                     |
| `screens.test.ts`  | Verifica sin montar nada que ninguna figura se sale de su `viewBox` y que cada `viewBox` cuadra con la proporción del dispositivo.                        |

**Cómo añadir una plataforma:**

1. Añade la entrada en [`lib/constants/platforms.ts`](../../src/lib/constants/platforms.ts) con su
   acento (valida el contraste sobre `#0a0a0a`: se usa como texto) y su `frame` en porcentajes del
   escenario.
2. Añade su pantalla en `screens.ts` con un `viewBox` cuya proporción cuadre con ese `frame`.
3. Ejecuta `pnpm test`: `screens.test.ts` avisa si la proporción no cuadra o si alguna figura se
   sale. No hay que tocar `PlatformDeck.tsx`.

## Animaciones (`src/components/animations`)

| Componente                | Uso                                                                                                         |
| ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `Reveal`                  | Entrada fade+subida al hacer scroll (`mode="scroll"`) o al montar (`mode="mount"`); opción `blur`.          |
| `Stagger` / `StaggerItem` | Lista con entrada escalonada 3D de sus ítems (variante `cardIn`).                                           |
| `TextReveal`              | Título revelado **palabra a palabra** desde detrás de su máscara. Usado por todos los `SectionHeading`.     |
| `NeuralNetwork`           | Malla neuronal del hero en `<canvas>`: arranque, tráfico de datos e intrusiones interceptadas. Ver ADR-011. |
| `ScrollProgress`          | Barra de progreso de lectura fija arriba (`aria-hidden`).                                                   |
| `MagneticButton`          | El CTA se desplaza hacia el cursor con muelle; sin listeners con movimiento reducido.                       |
| `CountUp`                 | Cuenta de 0 al valor al entrar en pantalla; el HTML contiene siempre el valor final.                        |
| `Marquee`                 | Cinta infinita en CSS puro con copia `aria-hidden` para no duplicar contenido.                              |

La lógica de la malla vive aparte, **sin DOM**, en `animations/NeuralNetwork/engine.ts` (probada con
Vitest en `engine.test.ts`).

Detalle completo en [design-system/motion](../02-design-system/motion.md). Framer Motion
optimizado con `LazyMotion` + `m.*` + carga diferida del motor (§11).

> ⚠️ **Al escribir un componente animado nuevo:** nunca cambies el markup según
> `useReducedMotion()` — ver la regla de oro en
> [motion](../02-design-system/motion.md#política-de-prefers-reduced-motion-adr-011-️-importante).

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
