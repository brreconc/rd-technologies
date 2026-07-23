# Estrategia de QA y testing (Fase 6 — implementado)

Requisito §13. Suite instalada y en verde.

## Niveles

| Nivel                | Herramienta                          | Dónde                    | Cubre                                                                                                                               |
| -------------------- | ------------------------------------ | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| Unit / componentes   | Vitest + Testing Library (jsdom)     | `src/**/*.test.ts(x)`    | Validadores Zod, sanitize, rate-limit, anti-bot, respuestas, JSON-LD, render de primitivos.                                         |
| E2E funcional        | Playwright                           | `e2e/home.spec.ts`       | Navegación por anclas, toggle de tema, errores accesibles del formulario.                                                           |
| Experiencia (Fase 9) | Playwright                           | `e2e/experience.spec.ts` | Canvas del hero, texto íntegro de los títulos revelados, scroll-spy, sin JS y con movimiento reducido (sin errores de hidratación). |
| Seguridad (CSP)      | Playwright                           | `e2e/home.spec.ts`       | La CSP con nonce NO bloquea scripts: 0 violaciones ni errores de consola.                                                           |
| Cross-browser        | Playwright (Chromium/Firefox/WebKit) | `ALL_BROWSERS=1`         | Paridad entre motores.                                                                                                              |
| Responsive           | Playwright (320→2560)                | `e2e/responsive.spec.ts` | **Cero scroll horizontal** por breakpoint.                                                                                          |
| Accesibilidad        | @axe-core/playwright                 | `e2e/a11y.spec.ts`       | Sin violaciones críticas/serias (WCAG 2.0/2.1 A y AA), tema claro y oscuro.                                                         |
| Performance          | Lighthouse CI                        | `lighthouserc.json`      | Presupuestos CWV y categorías ≥ 95.                                                                                                 |

## Comandos

```bash
pnpm test          # unit (Vitest, una pasada)
pnpm test:watch    # unit en watch
pnpm test:e2e      # E2E Playwright (Chromium por defecto)
pnpm test:a11y     # solo accesibilidad
pnpm lhci          # Lighthouse CI (requiere build previo)
pnpm audit         # auditoría de dependencias de producción
```

> **E2E contra producción:** Playwright arranca `pnpm start` (no dev) para probar
> contra la **CSP estricta con nonce** real (ADR-009). Requiere `pnpm build` antes.

## Motores de navegador

Chromium se ejecuta en cualquier entorno. **Firefox y WebKit** se activan con
`ALL_BROWSERS=1 pnpm test:e2e`; requieren librerías de sistema (en CI sobre Ubuntu
se instalan con `playwright install --with-deps`). En un dev host sin esas
librerías solo corre Chromium (los tres se declaran en `playwright.config.ts`).

## Notas de accesibilidad en los tests

- Antes de escanear con axe se **estabiliza** la página (`settle()`): se fuerzan
  los reveals a su estado final y se anulan transiciones, para que axe mida
  colores definitivos y no valores mezclados de una animación en curso.
- Se **excluyen del escaneo los adornos `aria-hidden="true"`** (números de paso
  decorativos, resplandores): están fuera del árbol de accesibilidad y son texto
  decorativo, exento del contraste (WCAG 1.4.3). Ver [a11y-guidelines](../06-accessibility/a11y-guidelines.md).

## Definición de "probado"

Una función no está lista hasta pasar sus pruebas **y** verificarse en móvil,
tablet, desktop y TV/4K, en los tres motores. La suite responsive cubre 320→2560px;
el cross-browser completo corre en CI (`ALL_BROWSERS=1`).

## Regresiones que vigila `experience.spec.ts` (Fase 9)

Estos tests existen porque cada uno destapó (o pudo destapar) un fallo real:

1. **Texto íntegro de los títulos.** `TextReveal` parte cada título en `<span>` por palabra; el test
   comprueba que el texto accesible sigue siendo la frase completa.
2. **Movimiento reducido sin errores de hidratación.** Bifurcar el markup según
   `useReducedMotion()` provocaba React #418 (el hook devuelve `null` en el servidor). El test falla
   ante cualquier error de consola con `prefers-reduced-motion` activo. Ver ADR-011.
3. **Sin JavaScript, nada queda oculto.** Comprueba que el `<noscript>` deja `.reveal` en
   `transform:none` / `opacity:1`; si no, las palabras enmascaradas quedarían invisibles.
4. **El canvas del hero se dimensiona** (no colapsa a 0×0) y el scroll-spy marca `aria-current`.

## Resultados (última corrida local, Chromium)

- **Unit (Vitest):** 49 tests en verde (incluye el motor de la malla neuronal).
- **E2E + responsive + a11y (Playwright):** 18 tests en verde.
- **Lighthouse (build indexable):** Performance **99**, Accessibility **100**,
  Best Practices **96**, SEO **100**; LCP 0,8 s · CLS 0 · TBT 0 ms.
- **`pnpm audit --prod`:** sin vulnerabilidades.

## Pendiente

- Correr el cross-browser completo (Firefox/WebKit) en CI.
- Regresión visual por screenshots (§13, `[RECOMENDADO]`).
- Integrar la suite en el workflow de CI (Fase 7).
