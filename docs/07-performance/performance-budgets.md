# Performance — presupuestos

Requisito §11.

## Presupuestos

- **Lighthouse ≥ 95** en Performance, Accessibility, Best Practices y SEO (móvil y desktop).
- **Core Web Vitals:** LCP < 2.5s · INP < 200ms · CLS < 0.1.
- **JS inicial** objetivo **< 200KB** gzip en la ruta principal; lo pesado (3D, GSAP, partículas,
  Lottie) va con `next/dynamic` fuera del bundle crítico.

## Técnicas (aplicadas / previstas)

- ✅ `next/font` self-host con `display: swap` (sin FOUT, sin peticiones externas).
- ✅ Server Components por defecto; los componentes de animación son el único cliente añadido.
- ✅ `next/image` con AVIF/WebP configurado en [`next.config.ts`](../../next.config.ts).
- ✅ **Framer Motion optimizado** (§11, Fase 3): `LazyMotion` + componentes ligeros `m.*` +
  **carga diferida del motor** `domAnimation` en un chunk aparte
  ([`motion-features.ts`](../../src/lib/animations/motion-features.ts)) → fuera del JS crítico.
- ✅ **El `<h1>` del hero no se anima** (elemento LCP): se pinta de inmediato.
- ✅ Efectos de fondo por **CSS** y por un **canvas 2D propio** (sin librerías) en vez de JS pesado.
- ✅ **Canvas del hero acotado** (ADR-011): sprites de resplandor pre-renderizados, aristas pintadas
  por lotes, DPR ≤ 2, nº de nodos por área, pausa fuera del viewport y degradación automática.
- ✅ **Lighthouse CI** con presupuestos que fallan la build ([`lighthouserc.json`](../../lighthouserc.json), Fase 6).

## Medición actual (Fase 10, ruta `/`)

Medido sobre `pnpm start`, sumando los `<script src>` reales de la ruta (17 ficheros):

| Compresión                       | First Load JS | Objetivo    |
| -------------------------------- | ------------- | ----------- |
| gzip -9                          | ~335 KB       | —           |
| **Brotli** (lo que sirve un CDN) | **~290 KB**   | < 200 KB ❌ |

> Next 16 + Turbopack no imprime la tabla de tamaños en el build; se mide sirviendo la ruta.

### ⚠️ Desvío abierto sobre el presupuesto de JS

El objetivo de **< 200 KB** (§11) está incumplido. Trazabilidad de la medición:

| Momento              | gzip    | brotli  |
| -------------------- | ------- | ------- |
| Fase 3               | ~228 KB | ~199 KB |
| Fase 8.1 (`ef94c15`) | ~328 KB | ~284 KB |
| Fase 9               | ~332 KB | ~288 KB |
| Fase 10              | ~335 KB | ~290 KB |

El salto lo produjo la **Fase 8**, cuando las tarjetas de sección pasaron de Server Components
(`Card`) a Client Components (`SpotlightCard`) y se añadieron formularios y menú interactivos. La
Fase 9 aportó ~4 KB.

**La Fase 10 aporta ~2 KB netos**, y eso incluye una sección entera nueva. El deck multiplataforma
casi se paga solo porque en la misma fase se retiró `next-themes` con el tema claro
([ADR-012](../01-architecture/decisions/ADR-012-single-dark-theme.md)). El deck no trajo ninguna
dependencia: son SVG estáticos y CSS ([ADR-013](../01-architecture/decisions/ADR-013-platform-deck.md)).

**Importante:** el desvío es de _bytes_, no de experiencia medida — Lighthouse sigue en
**Performance 99** con **LCP 0,8 s · CLS 0 · TBT 0 ms**, porque casi todo ese JS no bloquea el
pintado. Aun así, el presupuesto es un contrato y queda como deuda explícita.

**Plan de reducción propuesto (pendiente de aprobación, no ejecutado):**

1. Cargar el **formulario de contacto** (`react-hook-form` + `zod` + resolvers) y el **menú móvil**
   (`@radix-ui/react-dialog`) con `next/dynamic`, fuera del bundle crítico. Es la mayor partida.
2. Volver a `Card` (servidor) en las secciones donde el spotlight/tilt no aporte.
3. Revisar los iconos de `lucide-react` que acaban en cliente.

## Lighthouse CI

Presupuestos en [`lighthouserc.json`](../../lighthouserc.json): las cuatro categorías deben ser
**≥ 0,95** o la build de auditoría falla. Corrida local (`pnpm lhci`, preset desktop, 3 pasadas,
build indexable):

| Categoría      | Fase 6 | Fase 9 | **Fase 10** |
| -------------- | ------ | ------ | ----------- |
| Performance    | 99     | 99     | **99**      |
| Accessibility  | 100    | 100    | **100**     |
| Best Practices | 96     | 96     | **96**      |
| SEO            | 100    | 100    | **100**     |

Métricas de la Fase 10: **LCP 0,9 s · CLS 0 · TBT 0 ms · FCP 0,3 s · Speed Index 0,6 s**.

> Ni la escenografía de la Fase 9 (canvas del hero, revelados por scroll, línea de tiempo) ni el
> deck de la Fase 10 movieron ninguna métrica. El canvas se pinta después del texto y se pausa fuera
> de pantalla; el deck no usa canvas ni librerías, su escenario tiene **proporción fija** (por eso
> el morfismo del dispositivo mantiene **CLS 0**) y su recorrido automático **no existe fuera de
> pantalla**: un `IntersectionObserver` lo apaga y no deja ni un temporizador vivo.

### Nota sobre las animaciones ligadas al scroll

La aurora de página, la costura entre secciones y la llegada de cada sección usan
`animation-timeline` (CSS). En los navegadores que lo implementan corren **fuera del hilo
principal**, así que no hay ni un solo manejador de `scroll` en JavaScript para todo ese
movimiento. Donde no hay soporte, quedan en su estado final: no se degrada el contenido, solo el
adorno.

> Nota: Lighthouse audita un build **indexable** (`NEXT_PUBLIC_SITE_INDEXABLE=true`); con el sitio
> en `noindex` (local) la auditoría SEO penalizaría por diseño. Con la CSP por nonce las páginas se
> sirven dinámicas, sin impacto medible en estas métricas de laboratorio.
