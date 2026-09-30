# Estrategia de QA y testing (Fase 6 — implementado)

Requisito §13. Suite instalada y en verde.

## Niveles

| Nivel                | Herramienta                          | Dónde                     | Cubre                                                                                                                                                                          |
| -------------------- | ------------------------------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Unit / componentes   | Vitest + Testing Library (jsdom)     | `src/**/*.test.ts(x)`     | Validadores Zod, sanitize, rate-limit, anti-bot, respuestas, JSON-LD, render de primitivos.                                                                                    |
| E2E funcional        | Playwright                           | `e2e/home.spec.ts`        | Navegación por anclas, paleta oscura única, errores accesibles del formulario.                                                                                                 |
| Experiencia (Fase 9) | Playwright                           | `e2e/experience.spec.ts`  | Canvas del hero, texto íntegro de los títulos revelados, scroll-spy, sin JS y con movimiento reducido (sin errores de hidratación).                                            |
| Deck (Fases 10–11)   | Playwright                           | `e2e/platforms.spec.ts`   | Patrón de pestañas, teclado, cota y mock-up por destino, recorrido detenible (WCAG 2.2.2), 375px, 320px y movimiento reducido.                                                 |
| Manifiesto (Fase 14) | Playwright                           | `e2e/value-props.spec.ts` | Titular íntegro pese al troceado por palabras, `<ol>` completa desde el primer render, ordinales fuera del árbol de accesibilidad, copy corto, 320→2560 y movimiento reducido. |
| Seguridad (CSP)      | Playwright                           | `e2e/home.spec.ts`        | La CSP con nonce NO bloquea scripts: 0 violaciones ni errores de consola.                                                                                                      |
| Cross-browser        | Playwright (Chromium/Firefox/WebKit) | `ALL_BROWSERS=1`          | Paridad entre motores.                                                                                                                                                         |
| Responsive           | Playwright (320→2560)                | `e2e/responsive.spec.ts`  | **Cero scroll horizontal** por breakpoint.                                                                                                                                     |
| Accesibilidad        | @axe-core/playwright                 | `e2e/a11y.spec.ts`        | Sin violaciones críticas/serias (WCAG 2.0/2.1 A y AA), también con el deck en otro acento.                                                                                     |
| Performance          | Lighthouse CI                        | `lighthouserc.json`       | Presupuestos CWV y categorías ≥ 95.                                                                                                                                            |

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

## Regresiones que vigila el deck (Fases 10–11)

### `platforms.test.ts` — unit, sin montar nada

El contrato que se verifica es **la geometría**, porque es donde vive el riesgo real: el rótulo de
cota sobre el escenario anuncia la resolución del destino (`An 1440 × Al 900`) y el marco del
dispositivo se calcula a partir de ese mismo dato. Si alguien cambia uno y no el otro, el
instrumento estaría mintiendo. Se comprueba destino por destino:

- El marco dibujado tiene **exactamente** la proporción que anuncia su `readout`, corrigiendo por la
  proporción del escenario (5/4), que no es cuadrado.
- El dispositivo **cabe** dentro del escenario en ambos ejes.
- Apaisados y verticales están donde toca, y solo los dispositivos con marco llevan esquinas
  redondeadas. El radio no es decorativo: es lo que decide si el dispositivo recibe bisel.
- Cada destino anuncia una resolución distinta de las demás.
- El catálogo está completo: cinco destinos, identificadores y acentos únicos, tres capacidades por
  panel (la rejilla está pensada para tres) y ningún campo de copy vacío.

> Sustituye a `screens.test.ts`, que validaba los mock-ups SVG retirados en la Fase 11
> ([ADR-014](../01-architecture/decisions/ADR-014-instrument-deck.md)).

### `platforms.spec.ts` — E2E

1. **El recorrido automático avanza solo Y se puede detener.** Cubre WCAG 2.2.2: comprueba que
   cambia de destino sin intervención y que, tras pulsar el botón, deja de cambiar. Se ejecuta con
   la **ventana más baja que el deck**, que es la regresión concreta que vigila: el observador
   pedía ver el 30% del elemento, y esa fracción tiene como techo `alturaVentana/alturaDeck`, así
   que al crecer la sección se volvió inalcanzable y el recorrido dejó de arrancar.
2. **Teclado.** Flechas, `Inicio` y `Fin` recorren el rail moviendo foco y selección a la vez.
   Regresión concreta que vigila: el diseño de partida traía un candado temporal de 700 ms que se
   tragaba las pulsaciones y hacía inalcanzables dos de los destinos.
3. **La cota y el mock-up cambian con el destino**, y nunca hay dos mock-ups montados a la vez.
4. **Los cinco destinos se ven a la vez a 375px** — se mide la caja de cada pestaña contra el
   viewport. Regresión que vigila: con el rail como tira deslizable, casi todos quedaban fuera de
   pantalla sin ninguna pista de que existieran.
5. **El nombre de ningún destino se recorta** a 320, 375, 768 y 1024px — se compara `scrollWidth`
   con `clientWidth` en cada rótulo. Regresión: a dos columnas salía "E-comme…" en un teléfono.
6. **El dispositivo no se transforma con el puntero encima** — se lee la matriz calculada de
   `.deck-device` y se exige identidad. Es la guardia de la nitidez del mock-up: cualquier
   transformación 3D lo desenfoca ([ADR-015](../01-architecture/decisions/ADR-015-crisp-deck-and-ecommerce.md)).
7. **Ningún destino desborda a 320px** — se recorren los cinco midiendo `scrollWidth`.
8. **Movimiento reducido:** no hay recorrido automático, el botón no se ofrece, el contenido está
   completo y **no hay ni un error de consola** (guardia contra desajustes de hidratación).

### `process.test.ts` y `process.spec.ts` — el recorrido del proceso (Fase 13)

El acento de cada paso se usa como color de **texto**, así que `process.test.ts` calcula el contraste
real contra `#0a0a0a` y exige AA. Es la clase de fallo que a simple vista sobre negro no se ve: un
color bonito pero flojo pasa desapercibido hasta que alguien lo audita.

También comprueba que no haya dos pasos consecutivos del mismo color —sin degradado, el tramo entre
ellos se leería como una pausa— y que una vuelta completa dure menos de medio minuto: si se alargara,
quien llega al final de la página nunca habría visto el proceso entero.

En E2E ([`process.spec.ts`](../../e2e/process.spec.ts)):

1. **Los seis pasos están completos en el DOM desde el primer render** — se busca el título de los
   seis y la descripción del último. Es EL contrato de la sección: la animación es una capa visual,
   nunca la única forma de llegar al texto.
2. **El recorrido avanza solo Y se puede detener** (WCAG 2.2.2), con la ventana más baja que la
   sección.
3. **Elegir un hito a mano toma el control y no se lo devuelve.**
4. **Cambiar de paso no mueve nada de sitio** — se compara la caja del panel antes y después. Es la
   guardia de CLS 0: las seis tarjetas comparten celda de rejilla justamente para eso.
5. **Teclado:** los hitos se alcanzan con el tabulador y se activan con Intro.
6. **Ningún paso desborda a 320px**, recorriendo los seis.
7. **Movimiento reducido:** no hay recorrido, el control no se ofrece, el contenido está completo y no
   hay ni un error de consola.

### `value-props.test.ts`, `TextReveal.test.tsx` y `value-props.spec.ts` — el manifiesto (Fase 14)

Tres cosas que solo un test detecta a tiempo:

1. **El copy no puede volver a engordar.** La sección se rehízo porque tenía 73 palabras en un
   párrafo; ahora hay tope al titular (≤10 palabras), a la entradilla (≤40) y a cada estrato (≤16).
2. **`highlight` falla en silencio.** `TextReveal` solo tiñe el fragmento si lo encuentra tal cual;
   una errata no rompe nada, simplemente deja el titular sin resaltar y nadie se entera. Hay un test
   unitario que comprueba que `title` contiene `highlight`, y otro de componente que verifica qué
   palabras acaban pintadas —incluido el caso de la palabra con puntuación al final.
3. **La sección no puede volver a duplicar a "Servicios".** Un test compara los títulos de las dos y
   falla si se solapan. Ese solape era el problema de fondo, y es exactamente la clase de cosa que
   vuelve sola cuando alguien edita el copy meses después.

Y el contraste de los tres acentos contra `#0a0a0a`, igual que en el proceso: se usan como color de
texto en los ordinales.

En E2E ([`value-props.spec.ts`](../../e2e/value-props.spec.ts)) se protege lo que el troceado por
palabras podría romper —que el titular siga siendo **una frase** para lectores y para la búsqueda del
navegador—, que los tres estratos estén completos en la `<ol>` desde el primer render, que los
ordinales no se anuncien dos veces, que no haya desbordamiento a 320, 375, 768, 1024, 1440 y 2560px
(también del panel, no solo del documento) y que con `prefers-reduced-motion` las tres filas queden a
opacidad 1 y sin transformación, sin un solo error de consola.

## Resultados (última corrida local, Chromium)

- **Unit (Vitest):** 93 tests en verde (incluye los escenarios de la consola del hero y la geometría del deck).
- **E2E + responsive + a11y (Playwright):** 48 tests en verde.
- **Lighthouse (build indexable):** Performance **99**, Accessibility **100**,
  Best Practices **96**, SEO **100**; LCP 0,9 s · TBT 0 ms. CLS 0 en dos de las tres pasadas; la
  tercera marca el 0,372 del footer que sigue abierto desde la Fase 11 (ver
  [07-performance](../07-performance/performance-budgets.md)).
- **`pnpm audit --prod`:** sin vulnerabilidades.

## Pendiente

- Correr el cross-browser completo (Firefox/WebKit) en CI.
- Regresión visual por screenshots (§13, `[RECOMENDADO]`).
- Integrar la suite en el workflow de CI (Fase 7).
