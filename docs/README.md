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
- ✅ **Fase 1 — Sistema de diseño y primitivos:** tema claro+oscuro con tokens, primitivos `ui/`
  (Button, Card, Container, Input, Accordion), Header/Footer/Navegación accesibles y ThemeToggle.
  **Completada.**
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
