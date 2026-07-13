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
- ✅ Efectos de fondo por **CSS** (aurora del hero) en vez de JS.
- ⬜ Auditoría con **Lighthouse CI** y `@next/bundle-analyzer` (Fase 6).

## Medición actual (Fase 3, ruta `/`)

Medido sobre `pnpm start` (los `<script src>` reales de la ruta):

| Compresión                       | First Load JS                      |
| -------------------------------- | ---------------------------------- |
| gzip -9                          | ~228 KB                            |
| **Brotli** (lo que sirve un CDN) | **~199 KB** ✅ (objetivo < 200 KB) |

> Next 16 + Turbopack no imprime la tabla de tamaños en el build; se mide sirviendo la ruta.
> La validación formal (Lighthouse CI + budgets que fallan la build) se añade en la Fase 6.
