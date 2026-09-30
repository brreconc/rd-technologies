# ADR-014 — El deck como instrumento: mock-ups de interfaz real y esquinas rectas

- **Estado:** Aceptada
- **Fecha:** 2026-07-31
- **Fase:** 11
- **Sustituye parcialmente:** [ADR-013 §2](./ADR-013-platform-deck.md) (los mock-ups como datos SVG)

## Contexto

El deck de la Fase 10 acertaba en la idea —compilar el destino delante del cliente— pero fallaba en
lo que se veía **dentro** del dispositivo. Los mock-ups eran arrays de rectángulos y círculos SVG:
formas grises que sugerían una interfaz sin llegar a serlo. El cliente los describió como "vectores
sin terminar, algo muy básico", y tenía razón: la sección promete que sabemos construir productos
para cuatro plataformas, y la prueba que enseñaba eran cajas de relleno.

Se exploraron dos generadores de diseño para elevar el listón. El primero (Google Stitch) devolvió
un fotograma estático con buenas ideas de lenguaje visual pero copy inventado —incluida una
afirmación no sostenible, "seguridad de grado bancario"—, contraste por debajo de AA y sin
responsive. Se descartó. El segundo (Kimi) devolvió una sección funcional completa cuyo concepto se
adoptó, y cuyos defectos se documentan más abajo porque su corrección forma parte de esta decisión.

Restricciones heredadas, intactas: sin dependencias nuevas, WCAG 2.2 AA, cero desbordamiento de
320px a 4K, y `prefers-reduced-motion` sin bifurcar el markup (regla de oro de ADR-011).

## Decisión

### 1. Los mock-ups pasan de datos SVG a componentes de interfaz real

Se retiran `screens.ts` y `screens.test.ts`. En su lugar,
[`mockups/`](../../../src/components/sections/Platforms/mockups) contiene un componente por destino
que construye una interfaz **creíble y específica de su plataforma**, con etiquetas reales en
español:

| Destino        | Qué se dibuja                                                                                                                           |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Web**        | Panel SaaS: cromo de navegador, barra lateral, cuatro indicadores con sparkline, gráfico de área con rejilla y tabla con medidores.     |
| **Android**    | App de operaciones Material 3: barra de estado con cámara perforada, app bar, buscador, chips, tarjetas con etiqueta, FAB y navbar.     |
| **iOS**        | App HIG: isla dinámica, título grande, control segmentado, lista agrupada con chevrons, gráfico semanal, tab bar e indicador de inicio. |
| **Escritorio** | Consola nativa: semáforos, barra de menú, árbol de plantas, tabla de equipos, consola de log y panel inspector.                         |

Se pierde la comprobación por test que ofrecían los datos SVG, y se compensa moviendo el contrato a
donde ahora vive el riesgo real: la geometría (ver §3).

**Por qué DOM y no SVG.** La densidad que hace creíble a un mock-up —una tabla de nueve filas, un
log con niveles, un inspector de propiedades— se escribe en DOM con flex y grid en una fracción del
esfuerzo que costaría posicionar cada `<rect>` a mano, y se adapta sola cuando el dispositivo se
transforma. Sigue sin haber canvas, WebGL ni librería nueva.

**Los iconos se dibujan a mano** en [`Glyph.tsx`](../../../src/components/sections/Platforms/mockups/Glyph.tsx)
en vez de tirar de `lucide-react`: dentro del dispositivo miden 6–10 px, ninguno llega a ser
identificable, y una docena de iconos reales solo engordaría el bundle para pintar manchas.

### 2. Escalado por unidades de contenedor

`.deck-device` declara `container-type: size` y **todo** el interior del mock-up dimensiona en `cqh`
con una única base (`font-size: 3.4cqh`), a partir de la cual el resto va en `em`. Consecuencia: la
interfaz escala con el marco al transformarse, y funciona igual a 320px que a 4K sin una sola media
query ni un número mágico dentro del mock-up.

### 3. La cota es el contrato, y hay un test que lo sostiene

El rótulo sobre el escenario anuncia la resolución nominal del destino (`An 1440 × Al 900`), y el
marco del dispositivo **se calcula a partir de ese mismo dato** mediante `deviceFrame()`: solo se
declara la dimensión dominante y la otra se deduce de la proporción anunciada.

Esto convierte la transformación en una **medida** en vez de un adorno, y hace imposible que rótulo
y marco se desincronicen. `platforms.test.ts` lo verifica destino por destino: es el heredero
directo del contrato que antes cubría `screens.test.ts`.

### 4. Lenguaje visual de instrumento, acotado a esta sección

- **Radio 0 en todo el deck**, salvo los teléfonos y los puntos de estado.
- **Ornamento funcional únicamente**: corchetes de encuadre, línea de cota, regla de ticks, hilo de
  señal punteado del canal activo al escenario, consola de estados con contador `Build 0n/04`.
- El rail deja de ser una lista y pasa a ser un **selector de canales numerados**.
- Profundidad por capas tonales y luz de canto; **nunca** por sombra proyectada.
- Un **suelo en perspectiva** bajo el dispositivo, recortado por el escenario.

**El radio 0 es una excepción deliberada y contenida.** El resto de la landing usa tarjetas
redondeadas; el deck se lee como un aparato dentro de esa página. Se valoró propagar las esquinas
rectas a todo el sitio y se descartó: obligaría a rehacer siete secciones para resolver una
disonancia que, acotada a una sola sección, se percibe como intención.

## Defectos del diseño de partida que se corrigieron aquí

Se dejan escritos porque son las trampas que tiene este diseño y volverán a aparecer si alguien lo
rehace desde el original:

| Defecto                                                                                                                                            | Corrección                                                                                   |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Teclado inutilizable.** Un candado `isAnimating` de 700 ms se tragaba toda pulsación dentro de esa ventana: no se llegaba a iOS ni a Escritorio. | Sin candado. Cada pulsación se atiende; el estado de React ya serializa las transiciones.    |
| **Desbordamiento horizontal en casi todos los anchos** (hasta 287 px), por un suelo en perspectiva al 200% sin recortar.                           | El suelo vive dentro de `.deck-stage-field`, que tiene `overflow: hidden`.                   |
| **Solo un destino visible en móvil.** El rail era una tira deslizable que dejaba tres fuera de pantalla sin ninguna pista.                         | Rejilla 2×2 en móvil, 4 columnas en `sm`, vertical en `lg`. Cubierto por E2E.                |
| **Android e iOS medio vacíos**, con el contenido apelotonado en el tercio superior.                                                                | Los mock-ups llenan el marco; la lista y las tarjetas se reparten el alto con `flex: 1`.     |
| **Contraste por debajo de AA** en las etiquetas tenues (`white/30` sobre negro).                                                                   | Un único gris atenuado, `--deck-dim: #8a8a8a`, con ≥5:1 sobre las superficies del deck.      |
| **Huecos falsos dentro de las palabras** ("Us uarios") en el texto de 6–8 px.                                                                      | `text-rendering: geometricPrecision` en `.mk`, que anula el `optimizeLegibility` del `body`. |
| Emoji y glifos geométricos usados como iconos.                                                                                                     | `Glyph.tsx`.                                                                                 |
| Copy reescrito e inventado por el generador.                                                                                                       | El copy sale de `platforms.ts` y solo de ahí.                                                |

## Consecuencias

**A favor**

- El argumento de la sección por fin se sostiene: se reconoce la plataforma **con las etiquetas
  tapadas**, que era la prueba que había que pasar.
- **El bundle baja.** JS de cliente: 278,2 KB brotli, frente a 289,5 KB antes. Retirar los datos SVG
  y los iconos de `lucide` del interior del mock-up pagó de sobra los cuatro componentes nuevos.
- Lighthouse se mantiene: **99 · 100 · 96 · 100**, LCP 0,8–0,9 s, CLS 0, TBT 0 ms.
- Se conserva íntegro lo que ya funcionaba: transformación con muelle, inclinación con el puntero,
  recorrido automático detenible y respeto a `prefers-reduced-motion`.

**En contra / riesgos asumidos**

- **Más DOM dentro del dispositivo** que con los SVG (del orden de 120 nodos en el mock-up de
  escritorio, el más denso). Solo hay uno montado a la vez y se midió: TBT sigue en 0 ms.
- **`container-type: size` es indispensable.** Si alguien lo quita de `.deck-device`, todas las
  unidades `cqh` del mock-up se resuelven contra el viewport y la interfaz revienta.
- El mock-up ya no es verificable por test como lo eran los datos SVG. El contrato que sí se
  mantiene —y que era el importante— es la geometría (§3).
- Se pierde la separación en profundidad de las dos capas del holograma: con mock-ups en DOM,
  `preserve-3d` y el recorte a esquinas redondeadas son incompatibles. La inclinación se conserva
  sobre el dispositivo completo, que sobre una interfaz detallada se lee mejor que sobre cajas.

## Accesibilidad (§10)

Se mantiene lo de [ADR-013](./ADR-013-platform-deck.md) —patrón `tablist`, WCAG 2.2.2 por triplicado,
`aria-live`, mock-up decorativo— con dos refuerzos:

- **Ninguna pulsación de teclado se descarta.** Es la corrección del defecto más grave del diseño de
  partida, y hay E2E que recorre el rail con flechas, `Inicio` y `Fin`.
- **Un solo gris atenuado** (`--deck-dim`) en lugar de opacidades sobre blanco, para que no se pueda
  reintroducir texto por debajo de AA sin querer. Verificado con axe, también con el deck en su
  último destino.

## Alternativas descartadas

| Alternativa                                         | Por qué no                                                                                                                                               |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Portar el HTML del generador tal cual               | Traía CDN de Tailwind y de Google Fonts (incompatibles con la CSP, ADR-009), `h1` en una sección, copy inventado y cero responsive.                      |
| Conservar los mock-ups SVG y solo añadirles detalle | El problema no era la cantidad de figuras sino el medio: cada fila de una tabla son cuatro `<rect>` posicionados a mano que no se readaptan al morfismo. |
| Capturas reales dentro del dispositivo              | Siguen sin existir proyectos publicables (§19). Un esquema no miente sobre lo que enseña; un pantallazo inventado sí.                                    |
| Propagar el radio 0 a toda la landing               | Rehacer siete secciones para resolver una disonancia que, acotada, se lee como intención.                                                                |
| Escalar el mock-up con media queries                | El dispositivo cambia de tamaño **sin que cambie el viewport**: solo las unidades de contenedor responden a eso.                                         |

## Referencias

- [ADR-013](./ADR-013-platform-deck.md) — el deck original; esta ADR sustituye su §2.
- [ADR-011](./ADR-011-secure-system-scenography.md) — regla de oro de hidratación.
- [ADR-012](./ADR-012-single-dark-theme.md) — tema oscuro único.
- [`docs/03-components/component-catalog.md`](../../03-components/component-catalog.md)
- [`docs/02-design-system/motion.md`](../../02-design-system/motion.md)
