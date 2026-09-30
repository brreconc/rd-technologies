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

| Sección           | Ancla                 | Fuente de contenido                                     |
| ----------------- | --------------------- | ------------------------------------------------------- |
| `Hero`            | —                     | copy inline (oficial) + `CodeConsole`/`HeroStage`       |
| `TechMarquee`     | —                     | `constants/tech`                                        |
| `ValueProps`      | `#propuesta-de-valor` | `constants/value-props` (manifiesto editorial, Fase 14) |
| `Services`        | `#servicios`          | `constants/services`                                    |
| `Platforms`       | `#plataformas`        | `constants/platforms` (deck interactivo, Fases 10–11)   |
| `Differentiators` | `#por-que-elegirnos`  | `constants/differentiators`                             |
| `Process`         | `#proceso`            | `constants/process` (recorrido horizontal, Fase 13)     |
| `UseCases`        | `#casos-de-uso`       | `constants/use-cases`                                   |
| `Testimonials`    | `#testimonios`        | `constants/testimonials` (ejemplos)                     |
| `FAQ`             | `#faq`                | `constants/faq` (Accordion)                             |
| `FinalCTA`        | `#contacto`           | copy inline (oficial)                                   |

> Todas las secciones usan HTML semántico (`section` + `aria-labelledby`, listas, headings
> jerárquicos) y animaciones de entrada (ver abajo).

### Manifiesto de la propuesta de valor (`sections/ValueProps`) — Fase 14

Composición **editorial asimétrica**: a la izquierda el texto (antetítulo, titular corto con dos
palabras teñidas con el degradado de marca, entradilla de dos frases y un enlace al proceso); a la
derecha un **panel de estratos** de una sola pieza con tres afirmaciones engarzadas por una espina de
luz. Ver [ADR-017](../01-architecture/decisions/ADR-017-value-props-manifesto.md).

Es un **Server Component completo**: lo único de cliente son los envoltorios de animación de entrada
que ya existían (`Reveal`, `TextReveal`, `Stagger`). Se retiró `SpotlightCard` de esta sección.

| Pieza CSS      | Qué es                                                                               |
| -------------- | ------------------------------------------------------------------------------------ |
| `.vpx`         | La rejilla 5/7 a partir de `lg`; apilada por debajo.                                 |
| `.vpx-strata`  | El panel: `<ol>` con borde, halo frío y un hilo de luz en el canto superior.         |
| `.vpx-stratum` | Una fila. Conoce su color en `--own-accent` y su relleno vertical en `--vpx-pad-y`.  |
| `.vpx-rail`    | La columna del nodo. Su `::after` es la **espina** que baja hasta el nodo siguiente. |
| `.vpx-edge`    | El filo de acento que se dibuja bajo la fila al posarse encima o enfocar dentro.     |

**Tres invariantes que hay que respetar al tocar esto:**

1. **La espina llega al nodo siguiente gracias a un margen negativo**
   (`margin-bottom: calc(-2 * var(--vpx-pad-y))`). El raíl solo mide la caja de contenido de su
   fila; sin ese margen la línea se para en el aire y parece rota. Si cambias el relleno de la fila,
   cámbialo **en la variable**, no en el `padding` a pelo.
2. **El acento de cada estrato se usa como color de TEXTO** en su ordinal, así que tiene que pasar
   AA sobre `--bg`. `value-props.test.ts` lo calcula y falla si no.
3. **Los estratos no pueden llamarse como los servicios.** Aquí va el criterio, en "Servicios" el
   catálogo; hay un test que compara los títulos de las dos secciones y falla si se solapan.

### Recorrido del proceso (`sections/Process`) — Fase 13

Seis pasos en un raíl **horizontal que se cuenta solo**: un cometa vuela de un hito al siguiente y
cada llegada detona en el color de ese paso. Ver
[ADR-016](../01-architecture/decisions/ADR-016-horizontal-process-timeline.md).

| Fichero        | Qué es                                                                                                               |
| -------------- | -------------------------------------------------------------------------------------------------------------------- |
| `index.tsx`    | Server Component: encabezado y marco.                                                                                |
| `Timeline.tsx` | Cliente. El ÚNICO estado es el índice del hito activo; el resto lo resuelve el CSS desde `data-state`/`data-filled`. |

**Tres invariantes que hay que respetar al tocar esto:**

1. **Las seis tarjetas comparten celda de rejilla** (`grid-area: 1 / 1`). Es lo que hace que el alto
   lo fije la más larga y que cambiar de paso no mueva nada (**CLS 0**). Si alguien las apila o las
   posiciona en absoluto, vuelve el desplazamiento.
2. **Los seis pasos están SIEMPRE en el DOM**, en una `<ol>` y en orden. La animación es una capa
   visual, nunca la única forma de llegar al texto. Hay E2E que lo vigila.
3. **El acento de cada paso se usa como color de TEXTO**, así que tiene que pasar AA sobre `--bg`.
   `process.test.ts` calcula el contraste y falla si no.

**Cómo añadir o reordenar un paso:** toca solo
[`lib/constants/process.ts`](../../src/lib/constants/process.ts) — título, descripción, icono y
acento. El raíl saca sus columnas de `--steps`, que el componente fija desde ese mismo array, así que
no hay que tocar el CSS. Ejecuta `pnpm test` (el contraste del acento nuevo se comprueba solo) y mira
el raíl a 320px: los hitos son círculos con un número y a partir de siete empiezan a apretarse.

### Deck multiplataforma (`sections/Platforms`) — Fases 10 a 12

La sección más interactiva del sitio. Responde de un vistazo a "¿pueden hacer LO MÍO?"
compilando el destino elegido delante del cliente. Ver
[ADR-013](../01-architecture/decisions/ADR-013-platform-deck.md) (concepto),
[ADR-014](../01-architecture/decisions/ADR-014-instrument-deck.md) (mock-ups y lenguaje visual) y
[ADR-015](../01-architecture/decisions/ADR-015-crisp-deck-and-ecommerce.md) (nitidez, bisel y
E-commerce).

| Fichero               | Qué es                                                                                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `index.tsx`           | Server Component: encabezado, marco y el párrafo de cierre. Solo el deck baja al cliente.                                                                    |
| `PlatformDeck.tsx`    | Cliente. Patrón `tablist`/`tab`/`tabpanel`, morfismo del dispositivo, retinte por acento, paralaje del suelo y mira de inspección, recorrido auto detenible. |
| `mockups/index.tsx`   | Mapa `PlatformId → componente`. Solo hay **un** mock-up montado a la vez.                                                                                    |
| `mockups/*Mockup.tsx` | Una interfaz creíble por destino: panel SaaS, escaparate, app Material 3, app HIG y consola de escritorio. Decorativas (`aria-hidden`).                      |
| `mockups/Glyph.tsx`   | Pictogramas de 1px dibujados a mano para el interior del mock-up. A 6–10 px no son identificables, así que no compensa arrastrar iconos reales al bundle.    |

**Cuatro invariantes que hay que respetar al tocar esto:**

1. **`container-type: size` en `.deck-device`** es lo que hace que el mock-up escale con el marco.
   Todo el interior dimensiona en `cqh` a partir de una única base (`font-size` de `.mk`) y de ahí
   en `em`. Si se quita, las unidades se resuelven contra el viewport y la interfaz revienta.
2. **`.deck-device` no admite NINGUNA transformación** — ni `rotate`, ni `scale`, ni `translate`.
   Chromium rasteriza una vez la capa transformada y la remuestrea, y el texto de 6–10 px del
   mock-up se convierte en una mancha. Lo que responde al puntero es `.deck-floor-wrap` (paralaje) y
   `.deck-cross` (mira). Hay un E2E que lee la matriz calculada con el puntero encima.
3. **La cota manda sobre la geometría.** `deviceFrame()` deriva el marco de `readout`, no al revés.
4. **El copy sale solo de `platforms.ts`.** Nada de texto de producto escrito dentro de un mock-up.

**Cómo añadir una plataforma:**

1. Añade la entrada en [`lib/constants/platforms.ts`](../../src/lib/constants/platforms.ts) con su
   acento (valida el contraste sobre `#0a0a0a`: se usa como texto), su `readout` (resolución
   nominal) y su `fit` (eje dominante, porcentaje del escenario y radio). **El radio no es
   decorativo:** si es mayor que 0, el dispositivo recibe bisel y sus barras superior e inferior
   necesitan margen lateral contra el arco de la esquina.
2. Crea su componente en `mockups/` y regístralo en `mockups/index.tsx`.
3. Ejecuta `pnpm test`: `platforms.test.ts` avisa si el marco no cuadra con la resolución que
   anuncia la cota o si el dispositivo no cabe en el escenario. No hay que tocar `PlatformDeck.tsx`.
4. **Mira el rail en un teléfono.** El nombre del destino no se parte ni se recorta: si no cabe, el
   rail baja a una sola columna antes que dejar "E-comme…" en pantalla.
5. Comprueba que el deck sigue avanzando solo con la ventana **más baja que el deck**. El observador
   usa `rootMargin`, no `threshold`, justamente porque un umbral por fracción se vuelve inalcanzable
   en cuanto la sección es más alta que la ventana.

## Animaciones (`src/components/animations`)

| Componente                | Uso                                                                                                                                                                                                                        |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Reveal`                  | Entrada fade+subida al hacer scroll (`mode="scroll"`) o al montar (`mode="mount"`); opción `blur`.                                                                                                                         |
| `Stagger` / `StaggerItem` | Lista con entrada escalonada de sus ítems. Por defecto `cardIn` (llegada 3D, para tarjetas sueltas); `StaggerItem` acepta otra variante — `rowIn` es la entrada lateral sin giro, para filas dentro de un panel con borde. |
| `TextReveal`              | Título revelado **palabra a palabra** desde detrás de su máscara. Usado por todos los `SectionHeading`. Con `highlight` tiñe un fragmento contiguo con el degradado de marca sin dejar de recibir texto plano.             |
| `ScrollProgress`          | Barra de progreso de lectura fija arriba (`aria-hidden`).                                                                                                                                                                  |
| `MagneticButton`          | El CTA se desplaza hacia el cursor con muelle; sin listeners con movimiento reducido.                                                                                                                                      |
| `CountUp`                 | Cuenta de 0 al valor al entrar en pantalla; el HTML contiene siempre el valor final.                                                                                                                                       |
| `Marquee`                 | Cinta infinita en CSS puro con copia `aria-hidden` para no duplicar contenido.                                                                                                                                             |

El hero (`sections/Hero`) muestra a la izquierda la **`CodeConsole`** (Fase 16, ADR-019): una
consola de compilación que teclea código, compila y aplica ciberseguridad, con un ejemplo distinto
por recarga (Web, Android, iOS o Windows). Al terminar, **`AppDemo`** cubre la consola y muestra la
app "en ejecución" en el marco de su dispositivo, con un **logo 3D** (emblemas originales en
`Hero/logos.tsx`). El contenido vive como datos en `lib/constants/hero-console.ts` (probado con
Vitest en `hero-console.test.ts`). El hero encaja exacto en el viewport (`calc(100svh - 4rem)`) sin
scroll.

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
