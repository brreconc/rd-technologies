# ADR-008 — Política de indexación con fuente única de verdad

- **Estado:** Aceptada
- **Fecha:** 2026-07-16
- **Decisores:** Arquitecto Senior, AppSec, Especialista SEO

## Contexto

§12 exige `sitemap.ts`, `robots.ts` y metadata (`<meta robots>`) coherentes. El
riesgo clásico es la **desincronización**: que `robots.txt` permita rastreo pero
la metadata diga `noindex`, o que el sitemap anuncie URLs de un entorno que no
debe indexarse. Además, el proyecto está en **fase local sin desplegar**: NO debe
aparecer en buscadores todavía.

Las tres piezas se evalúan en contextos distintos (metadata en el render de
servidor, `robots.txt`/`sitemap.xml` como route handlers cacheados), por lo que
necesitan leer **el mismo dato** sin duplicar la lógica.

## Decisión

1. Una **fuente única de verdad**: `src/config/seo.ts` exporta `isIndexable`,
   derivada de la variable de entorno pública `NEXT_PUBLIC_SITE_INDEXABLE`
   (validada y coaccionada a booleano en `config/env.ts`, por defecto `false`).
2. Los tres consumidores derivan su comportamiento de ese flag:
   - `config/metadata.ts` → `robots: index/follow` vs `noindex, nofollow`.
   - `app/robots.ts` → `Allow: /` (+ sitemap) vs `Disallow: /`.
   - `app/sitemap.ts` → lista de URLs vs **sitemap vacío**.
3. La variable es **pública** (`NEXT_PUBLIC_`) a propósito: los tres puntos se
   resuelven en cliente/edge y deben ver el mismo valor inlined en build.
4. Activación de indexación = **decisión explícita de despliegue**
   (`NEXT_PUBLIC_SITE_INDEXABLE=true`), nunca un efecto colateral.

## Consecuencias

- ✅ Imposible que las tres piezas se contradigan: cambian juntas desde un flag.
- ✅ En local: `noindex` + `Disallow: /` + sitemap vacío, verificado por smoke test.
- ✅ El paso a producción es un cambio de una sola variable de entorno.
- ⚠️ Al desplegar hay que **recordar** poner el flag a `true`; documentado en
  `docs/09-content-seo/seo.md` y en la guía de despliegue (Fase 7).
- 🔁 `absoluteUrl()` centraliza la construcción de URLs absolutas sobre
  `siteConfig.url`, evitando URLs mal formadas en sitemap/robots/JSON-LD.
