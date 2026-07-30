# ADR-009 — CSP estricta con nonce por petición (render dinámico)

- **Estado:** Aceptada
- **Fecha:** 2026-07-16
- **Decisores:** AppSec, Arquitecto Senior, Ingeniero de Performance
- **Reemplaza:** la nota de ADR-005 que dejaba `'unsafe-inline'` en `script-src`.

> ⚠️ **Actualización (Fase 10, [ADR-012](./ADR-012-single-dark-theme.md)).** Al retirarse `next-themes` desapareció el único script inline propio que había que firmar. El mecanismo **no cambia**: el layout sigue llamando a `await headers()`, ahora únicamente para forzar el render dinámico que el nonce exige. No es una llamada muerta; si se quita, la CSP con nonce deja de funcionar.

## Contexto

§9/§12 exigen una CSP fuerte alineada con OWASP. La CSP inicial (Fase 0) mantenía
`script-src 'self' 'unsafe-inline'`, que **no protege frente a XSS** (permite
ejecutar cualquier script inline inyectado). Eliminar `'unsafe-inline'` de scripts
requiere autorizarlos con **nonce** o **hash**.

Tensión conocida: el nonce debe ser único por petición, lo que **obliga a render
dinámico** y sacrifica la generación estática y la cacheabilidad en CDN — algo
valioso para una landing (Lighthouse ≥ 95, §2). El cliente priorizó la
**seguridad** manteniendo intactas animaciones y aspecto visual (que no dependen
de estático vs dinámico).

## Decisión

1. **Nonce por petición** en `src/proxy.ts`: se genera un valor aleatorio, se
   inyecta en la cabecera `Content-Security-Policy` y en `x-nonce`. Next lo extrae
   y lo aplica automáticamente a sus scripts (framework, chunks, inline propios);
   el layout lo lee con `headers()` y lo pasa a `next-themes`.
2. **Producción:** `script-src 'self' 'nonce-<n>' 'strict-dynamic'` (sin
   `'unsafe-inline'`). `'strict-dynamic'` permite que los scripts de confianza
   carguen sus dependencias → Next y Framer Motion siguen funcionando.
3. **Desarrollo:** se mantiene `'unsafe-inline'`/`'unsafe-eval'` (Turbopack/React
   Refresh); el nonce no aporta seguridad en local y rompería el HMR.
4. `style-src` conserva `'unsafe-inline'`: hay estilos en atributos `style=""`
   (React) que un nonce no cubre; el riesgo por estilo es muy inferior al de script.
5. La CSP se aplica en el **proxy** (antes en `next.config.ts`); el resto de
   cabeceras estáticas siguen en `next.config.ts` (`getStaticSecurityHeaders`).

## Consecuencias

- ✅ `script-src` **sin `'unsafe-inline'`**: un `<script>` inyectado no se ejecuta
  sin el nonce (impredecible por petición). Verificado en navegador real
  (Playwright): 0 violaciones de CSP.
- ✅ Animaciones, tema y formularios **intactos** bajo la CSP estricta.
- ⚠️ Las **páginas HTML pasan a render dinámico** (`ƒ`); se pierde el prerender
  estático y la cacheabilidad de la home. Mitigado: las rutas de metadata
  (sitemap/robots/manifest/OG) siguen **estáticas** (`○`) y cacheables.
- ⚠️ Coste de servidor por petición mayor que un archivo estático; aceptable para
  una landing y revisable en despliegue (p. ej. cache corta + `strict-dynamic`).
- 🔁 Alternativa evaluada: **SRI/hashes** (`experimental.sri`) mantiene estático
  pero es experimental y no cubre scripts generados dinámicamente (next-themes);
  se descartó por fragilidad. Si en el futuro se prioriza CDN, reconsiderar.
