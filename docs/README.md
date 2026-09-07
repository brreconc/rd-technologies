# Documentación — R&D Technologies

Índice maestro de la documentación del proyecto. El objetivo (§15 del prompt maestro):
**cualquier desarrollador debe poder entender y continuar el proyecto leyendo estos documentos.**

## Mapa de la documentación

| Carpeta                                      | Contenido                                                       |
| -------------------------------------------- | --------------------------------------------------------------- |
| [`00-getting-started`](./00-getting-started) | Instalación local, scripts, resolución de problemas.            |
| [`01-architecture`](./01-architecture)       | Visión general, estructura de carpetas y **decisiones (ADRs)**. |
| [`02-design-system`](./02-design-system)     | Colores/tokens, tipografía, spacing, movimiento.                |
| [`03-components`](./03-components)           | Catálogo de componentes y convenciones.                         |
| [`04-responsive`](./04-responsive)           | Estrategia multiplataforma y anti-desbordamiento.               |
| [`05-security`](./05-security)               | Defensa en profundidad, headers, CSP, formularios.              |
| [`06-accessibility`](./06-accessibility)     | Guía WCAG 2.2 AA.                                               |
| [`07-performance`](./07-performance)         | Presupuestos y técnicas.                                        |
| [`08-testing`](./08-testing)                 | Estrategia de QA.                                               |
| [`09-content-seo`](./09-content-seo)         | Contenido/copy y SEO.                                           |
| [`10-deployment`](./10-deployment)           | Guía preparada para el despliegue futuro.                       |

## Convenciones de la documentación

- Cada decisión técnica relevante se registra como **ADR** en [`01-architecture/decisions`](./01-architecture/decisions).
- La documentación se actualiza **en el mismo commit** que el código que describe.
- Los documentos marcados _(pendiente — Fase N)_ se completarán cuando esa parte se construya.

## Estado por fases (§18 del prompt maestro)

- ✅ **Fase 0 — Cimientos:** scaffold, tooling, estructura, tokens de diseño, layout raíz,
  cabeceras de seguridad, accesibilidad base. **Completada.**
- ✅ **Fase 1 — Sistema de diseño y primitivos:** tokens de color/tipografía, primitivos `ui/`
  (Button, Card, Container, Input, Accordion) y Header/Footer/Navegación accesibles. **Completada.**
  _(El tema claro y su alternador que se construyeron aquí se retiraron en la Fase 10 —
  [ADR-012](./01-architecture/decisions/ADR-012-single-dark-theme.md).)_
- ✅ **Fase 2 — Estructura y contenido estático:** las 9 secciones de la landing con el copy
  oficial, responsive y accesibles (contenido en `lib/constants`). **Completada.**
- ✅ **Fase 3 — Capa de motion:** reveals al scroll con stagger (Framer Motion optimizado con
  LazyMotion), entrada del hero, aurora CSS y hover-lift; respeta `prefers-reduced-motion` y el
  presupuesto de JS (~199 KB Brotli). **Completada.**
- ✅ **Fase 4 — Formularios y "backend" local:** `ContactForm` (en el CTA) y `NewsletterForm`
  (en el pie) con validación Zod doble (cliente+servidor), honeypot + time-trap, rate limiting por
  IP, verificación de origen (CSRF) y sanitización; route handlers `/api/{contact,newsletter,health}`
  con capa de servicios (log local, lista para Resend/BD). Mejora progresiva con `mailto` de
  respaldo. Verificado con smoke tests de seguridad. **Completada.**
- ✅ **Fase 5 — SEO, metadata y pulido:** política de indexación única
  (`config/seo.ts`, [ADR-008](./01-architecture/decisions/ADR-008-indexing-policy.md)),
  JSON-LD (`Organization`/`WebSite`/`FAQPage`), imagen OG/Twitter con `next/og`,
  `sitemap.ts`/`robots.ts`/`manifest.ts`, `viewport` (theme-color por esquema) y
  estados `loading`/`not-found`/`error`/`global-error`. En local: `noindex` +
  `Disallow: /` + sitemap vacío. Verificado con smoke tests. **Completada.**
- ✅ **Fase 6 — QA final y hardening:** **CSP estricta con nonce por petición**
  ([ADR-009](./01-architecture/decisions/ADR-009-csp-nonce.md), sin `'unsafe-inline'` en scripts),
  suite **Vitest** (35 unit) + **Playwright** (E2E, responsive 320→2560 sin scroll horizontal,
  axe a11y en ambos temas, CSP sin violaciones), **Lighthouse CI** con presupuestos (Perf 99 /
  A11y 100 / BP 96 / SEO 100) y **`pnpm audit --prod` limpio**. **Completada.**
- ✅ **Fase 7 — Despliegue (Docker):** salida **standalone** (`output: "standalone"`),
  **Dockerfile** multi-stage (Node 22 slim, usuario sin privilegios, HEALTHCHECK `/api/health`),
  `.dockerignore`, **docker-compose.yml**, plantilla `.env.production.example` y workflow de CI
  (`.github/workflows/ci.yml`: calidad + E2E + build de imagen). Runtime standalone verificado en
  local con variables de producción. Guía completa para desplegar en
  [`10-deployment/future-deployment`](./10-deployment/future-deployment.md). **Completada.**
- ✅ **Fase 8 — Sistema de movimiento cinematográfico:** salto de impacto visual **sin nuevas
  dependencias** ([ADR-010](./01-architecture/decisions/ADR-010-cinematic-motion-system.md)):
  `SpotlightCard` (glow + tilt 3D), botones magnéticos, contadores, barra de progreso de scroll,
  marquee de stack, nav con scroll-spy, switch de tema premium y el primer fondo de red neuronal en
  `<canvas>`. **Completada.**
- ✅ **Fase 9 — Escenografía de "sistema seguro" y coreografía de scroll:**
  ([ADR-011](./01-architecture/decisions/ADR-011-secure-system-scenography.md)) el fondo del hero
  pasa a **narrar la marca** (la malla se compila sola y neutraliza intrusiones), los títulos se
  revelan palabra a palabra, el proceso se convierte en una **línea de tiempo que se ilumina con el
  scroll**, las costuras entre secciones se dibujan con `animation-timeline: view()` (sin JS) y la
  cabecera reacciona al scroll. Incluye la **corrección de un desajuste de hidratación** que
  afectaba a los usuarios con `prefers-reduced-motion` y una nueva política: el CSS es la fuente de
  verdad del movimiento reducido. Verificada con 49 unit + 18 E2E y Lighthouse 99/100/96/100.
  **Completada.**
- ✅ **Fase 10 — Deck multiplataforma y tema único:** dos decisiones que se pagan entre sí.
  ([ADR-012](./01-architecture/decisions/ADR-012-single-dark-theme.md)) se retira el **tema claro**,
  su alternador y `next-themes`: la identidad de la marca es luz sobre negro y mantener dos mundos
  duplicaba el diseño, la auditoría y el riesgo.
  ([ADR-013](./01-architecture/decisions/ADR-013-platform-deck.md)) entra la sección
  **`#plataformas`**, que en vez de contar dónde trabajamos **compila el destino elegido delante del
  cliente**: el dispositivo se transforma entre navegador, teléfono y monitor, la escena se retiñe
  con el acento de la plataforma, el mock-up se dibuja pieza a pieza y el puntero inclina un
  holograma de dos capas. Además, **movimiento v4**: aurora de página, costura entre secciones con
  nodo de luz y llegada de sección, todo ligado al scroll **en CSS puro**, sin un solo manejador en
  JavaScript. **Cero dependencias nuevas** (~2 KB netos en el bundle). Ninguna sección previa se
  retiró. Verificada con 66 unit + 24 E2E y Lighthouse 99/100/96/100 con **CLS 0**. **Completada.**
- ✅ **Fase 11 — El deck como instrumento:** se rehace el interior de `#plataformas`
  ([ADR-014](./01-architecture/decisions/ADR-014-instrument-deck.md)). Los mock-ups dejan de ser
  figuras SVG —"vectores sin terminar", en palabras del cliente— y pasan a ser **interfaces reales
  y específicas** de cada plataforma: panel SaaS con gráfico y tabla, app Material 3 con FAB, app
  HIG con isla dinámica, y consola de escritorio con árbol, log e inspector. El deck adopta un
  **lenguaje de instrumento**: esquinas rectas, selector de canales numerados, corchetes de
  encuadre, regla de ticks y una **cota que anuncia la resolución del destino y de la que se deriva
  el marco del dispositivo** (con test que impide que se desincronicen). El interior escala con
  **unidades de contenedor**, no con media queries. Se corrigen tres defectos graves del diseño de
  partida: teclado que descartaba pulsaciones, desbordamiento horizontal y solo un destino visible
  en móvil. **El bundle BAJA ~12 KB brotli.** Verificada con 66 unit + 26 E2E y Lighthouse
  99/100/96/100 con **CLS 0**. **Completada.**
- ✅ **Fase 12 — Nitidez, bisel y E-commerce:**
  ([ADR-015](./01-architecture/decisions/ADR-015-crisp-deck-and-ecommerce.md)). El dispositivo deja
  de inclinarse en 3D: Chromium rasteriza una sola vez toda capa con transformación 3D y la
  remuestrea, lo que **desenfocaba el texto del mock-up justo al acercarse a mirarlo**. Lo sustituyen
  un paralaje del suelo y una **mira de inspección** que lee la posición en píxeles nominales del
  destino, así que la interacción pasa a añadir información en vez de degradarla. Los teléfonos
  reciben **bisel**, de modo que la curva del marco ya no se come la barra de estado ni la
  navegación inferior. Entra un quinto destino, **E-commerce**, con escaparate en tablet y animación
  propia de conversión. De paso se corrige un fallo latente: el observador del recorrido automático
  usaba un umbral por fracción del elemento, inalcanzable en cuanto el deck creció más que la
  ventana. **+1 KB brotli.** Verificada con 70 unit + 28 E2E y Lighthouse 99/100/96/100 con **CLS 0
  en las tres pasadas**. **Completada.**
- ✅ **Fase 13 — El proceso se cuenta solo:**
  ([ADR-016](./01-architecture/decisions/ADR-016-horizontal-process-timeline.md)). `#proceso` pasa de
  un recorrido VERTICAL atado al scroll —casi tres pantallas para decir seis frases, y que solo se
  contaba si el visitante bajaba— a un **raíl horizontal que se ejecuta solo**. Un cometa vuela de un
  hito al siguiente y cada llegada **detona**: floración de color, dos ondas de choque y diez radios
  de luz. Los seis pasos tienen acento propio y **recorren el círculo cromático**, así que el raíl
  acabado se lee como un viaje sin leer una palabra. Toda la animación es CSS: React solo guarda el
  índice activo, y **se retira Framer Motion de la sección**. Las seis tarjetas comparten celda de
  rejilla → **CLS 0** al cambiar de paso, con E2E que lo mide. Los seis pasos siguen completos en el
  DOM en una `<ol>`: la animación nunca es la única forma de llegar al texto. **+1 KB de JS y +1 KB
  de CSS.** Verificada con 86 unit + 36 E2E y Lighthouse 99/100/96/100. **Completada.**
- ✅ **Fase 14 — La propuesta de valor pasa a ser un manifiesto:**
  ([ADR-017](./01-architecture/decisions/ADR-017-value-props-manifesto.md)). `#propuesta-de-valor`
  era el bloque más flojo de la página: **73 palabras en un párrafo centrado** de nueve líneas y tres
  tarjetas tituladas _Desarrollo_, _Seguridad_ y _Soporte_ — exactamente los tres pilares que la
  sección siguiente vuelve a desplegar con todo detalle. Ahora es una composición **editorial
  asimétrica (5/7)**: a la izquierda un titular corto con dos palabras teñidas con el degradado de
  marca y **29 palabras** de entradilla; a la derecha un **panel de estratos** de una sola pieza,
  con tres afirmaciones engarzadas por una espina de luz que se dibuja con el scroll y color propio
  por estrato. El reparto de contenido con "Servicios" queda fijado por escrito —aquí el CRITERIO,
  allí el CATÁLOGO— y hay un test que falla si vuelven a solaparse. `TextReveal` aprende a resaltar
  un fragmento del titular sin dejar de ser texto plano, y `StaggerItem` admite una entrada lateral
  (`rowIn`) para filas dentro de un panel. **0 KB de JS** (se retira `SpotlightCard` de la sección) y
  +1 KB de CSS. Verificada con 101 unit + 48 E2E y Lighthouse 99/100/96/100. **Completada.**

## Deuda técnica abierta

| Tema                               | Detalle                                                                                                                       |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Presupuesto de JS (§11)**        | ~268 KB brotli frente al objetivo < 200 KB. Origen y plan en [07-performance](./07-performance/performance-budgets.md).       |
| **La página no se muestra sin JS** | Consecuencia de la ruta dinámica que exige el nonce de la CSP. Ver [06-accessibility](./06-accessibility/a11y-guidelines.md). |
| **Contenido pendiente (§19)**      | Datos reales de contacto, testimonios y las métricas del hero (hoy ilustrativas).                                             |
