# Performance — presupuestos

Requisito §11.

## Presupuestos

- **Lighthouse ≥ 95** en Performance, Accessibility, Best Practices y SEO (móvil y desktop).
- **Core Web Vitals:** LCP < 2.5s · INP < 200ms · CLS < 0.1.
- **JS inicial** objetivo **< 200KB** gzip en la ruta principal; lo pesado (3D, GSAP, partículas,
  Lottie) va con `next/dynamic` fuera del bundle crítico.

## Técnicas (aplicadas / previstas)

- ✅ `next/font` self-host con `display: swap` (sin FOUT, sin peticiones externas).
- ✅ Server Components por defecto (menos JS al cliente).
- ✅ `next/image` con AVIF/WebP configurado en [`next.config.ts`](../../next.config.ts).
- ⬜ `next/dynamic` para animaciones pesadas (Fase 3).
- ⬜ Auditoría con **Lighthouse CI** y `@next/bundle-analyzer` (Fases 3/6).

## Cómo medir

`pnpm build` muestra el tamaño por ruta. En Fase 6 se añade Lighthouse CI con presupuestos que
fallan la build si se exceden.
