# ADR-017 — La propuesta de valor deja de ser un párrafo y pasa a ser un manifiesto

- **Estado:** Aceptada
- **Fecha:** 2026-09-06
- **Fase:** 14
- **Afecta a:** `sections/ValueProps`, `constants/value-props`, `animations/TextReveal`, `animations/Stagger`

## Contexto

La sección "Propuesta de valor" (§8.2) era el primer bloque de contenido después del hero y la
marquesina, y era lo más flojo de la página. Tres problemas, y ninguno era de estilo:

1. **Demasiado texto.** El copy de `Prompt.md` eran **73 palabras en un solo párrafo**: cuatro frases
   largas encadenadas que a 1440px ocupaban nueve líneas centradas. Un párrafo centrado de nueve
   líneas no se lee, se ojea; y todo lo que decía —a medida, escalable, seguro desde el origen— se
   perdía dentro.
2. **Todo centrado, sin jerarquía.** Título centrado, párrafo centrado y tres tarjetas centradas.
   Nada guiaba la mirada, y la sección no se distinguía de las otras cuatro que también son
   "encabezado centrado + rejilla de tarjetas".
3. **Duplicaba la sección siguiente.** Sus tres pilares se titulaban **Desarrollo**, **Seguridad** y
   **Soporte**. La sección inmediatamente posterior, "Servicios", se titula literalmente _"Tres
   pilares para tu producto digital"_ y despliega **Desarrollo, Seguridad y Soporte** con sus listas
   de prestaciones. Es decir: la sección existía para adelantar, con menos detalle, lo que se contaba
   diez centímetros más abajo.

El encargo fue: redacción más compacta y más profesional, y que deje de estar solo centrada — más
diseño, acabados más premium.

## Decisión

### 1. El copy baja de 73 a 29 palabras, y cambia de trabajo

| Antes                                                  | Ahora                                                    |
| ------------------------------------------------------ | -------------------------------------------------------- |
| Título de 9 palabras: "Construimos el futuro digital…" | "Software a medida que **nace seguro** y escala contigo" |
| Párrafo de 73 palabras, 4 frases                       | Entradilla de 29 palabras, 2 frases                      |
| 3 tarjetas: Desarrollo / Seguridad / Soporte           | 3 estratos: Producto / Seguridad / Escala                |

El titular es ahora una **afirmación con las tres ideas dentro** (a medida · seguro · escala), y los
tres estratos las desarrollan en una línea cada uno. La entrada se queda en dos frases, y la segunda
es la que de verdad diferencia a la empresa: _"La seguridad no es la última fase del proyecto, es la
primera decisión de arquitectura."_

`value-props.test.ts` pone tope a las palabras del titular (≤10) y de la entradilla (≤40): el copy no
puede volver a crecer sin que alguien lo vea.

### 2. Se reparte el contenido con "Servicios" en lugar de repetirlo

Regla nueva, y es la decisión de fondo:

> **"Propuesta de valor" cuenta el CRITERIO. "Servicios" cuenta el CATÁLOGO.**

Por eso los estratos ya no se llaman como los servicios. Dicen cómo se trabaja —_a medida, no de
plantilla_; _seguro desde el diseño_; _preparado para crecer_—, no qué se vende. Hay un test que
falla si alguien vuelve a alinear los títulos de las dos secciones.

### 3. Composición editorial asimétrica, 5 / 7

A partir de `lg` la sección se parte en dos columnas **desiguales**: el texto pesa 5 y el panel 7. La
asimetría es el punto — dos mitades iguales volverían a leerse como el bloque centrado que era. Por
debajo de `lg` se apila, texto arriba y panel debajo.

### 4. El panel de estratos: una pieza, no tres tarjetas

Tres tarjetas sueltas es exactamente el patrón del que había que salir, y además se repite en
Servicios, Casos de uso y Testimonios. Aquí los tres estratos van **dentro de una sola pieza de
vidrio**, separados por un filo de 1px y engarzados por una **espina de luz** que baja de un nodo al
siguiente.

Cada estrato tiene **color propio** (`--own-accent`) y con él se tiñen su nodo, su ordinal, su tramo
de espina y el filo que se dibuja bajo la fila al posarse encima. Los tres superan AA sobre `--bg`
porque el ordinal se pinta con ese color; `value-props.test.ts` lo calcula y lo exige. El violeta de
la paleta base (`#8b5cf6`, 4.68:1) se sustituye aquí por el `#a78bfa` que ya usa el recorrido del
proceso (7.27:1).

Detalle que costó encontrar: la espina es el `::after` del raíl de cada fila, con `flex: 1` para medir
lo que sobre. Pero el raíl solo ocupa la **caja de contenido** de su fila, así que la línea se paraba
en el aire, a medio camino del nodo siguiente, y parecía rota. Lo que la hace llegar es un
`margin-bottom: calc(-2 * var(--vpx-pad-y))` — cruza el relleno inferior de su fila y el superior de
la de abajo.

### 5. `TextReveal` aprende a resaltar un fragmento

El titular necesitaba dos palabras teñidas con el degradado de marca. `TextReveal` solo aceptaba
texto plano, porque lo parte por palabras para animarlo. En lugar de aceptar JSX —que rompería ese
troceado y obligaría a los `constants/*` a importar React—, se le añade `highlight?: string`: un
fragmento **contiguo** que se busca entre las palabras y se pinta.

Si el fragmento no aparece tal cual, no se resalta nada y el título sale como siempre. Como ese fallo
sería silencioso, hay un test que comprueba que `title` contiene `highlight`.

### 6. `StaggerItem` admite otra variante de entrada

`cardIn` hace que la pieza llegue inclinada en 3D. Está bien para una tarjeta suelta, que no tiene
vecinos con los que alinearse; dentro de un panel con borde se ve el despegue, y además el rasterizado
en 3D de Chromium desenfoca el texto durante la entrada (la trampa de [ADR-015](./ADR-015-crisp-deck-and-ecommerce.md)).

Se añade `rowIn` —entrada lateral, sin giro ni desenfoque— y `StaggerItem` acepta la variante como
prop, manteniendo `cardIn` por defecto. Ninguna otra sección cambia.

## Accesibilidad (§10)

- Los tres estratos son una **`<ol>` real**: son tres, van en orden y ese orden significa algo
  (primero qué se construye, luego cómo se protege, luego cómo dura).
- Los ordinales visibles `01…03` son `aria-hidden`: la lista ya numera, y leerlos dos veces estorba.
  La espina y los nodos también, porque son dibujo.
- **Nada del panel es interactivo.** No hay pestañas, ni acordeón, ni autoplay: no hay controles que
  nombrar ni nada que pausar (§WCAG 2.2.2 no aplica aquí). El único elemento enfocable de la sección
  es el enlace "Así trabajamos", que lleva al recorrido del proceso.
- Los realces responden a `:hover` y a `:focus-within` por igual, así que el teclado percibe lo mismo
  que el ratón — aunque hoy el único foco posible dentro de una fila sería un enlace futuro.
- El enlace tiene 44px de alto de destino táctil sin caja visible alrededor.
- Auditoría axe: **100** en accesibilidad, sin incidencias nuevas.

## Movimiento (§5.4, ADR-011)

Tres gestos, **todos de entrada y ninguno en bucle**:

| Gesto                        | Cómo                                                    |
| ---------------------------- | ------------------------------------------------------- |
| Palabras del titular         | `TextReveal` (Framer, `whileInView`, `once`)            |
| Entrada de los tres estratos | `Stagger` + `rowIn` (lateral, sin 3D)                   |
| Dibujo de la espina          | CSS puro, `animation-timeline: view()` — sin JavaScript |

La espina usa el mismo mecanismo que la costura entre secciones: donde no hay `animation-timeline`
(Safari, navegadores antiguos) queda pintada entera, que es su estado final. El markup no se bifurca
según la preferencia de movimiento, y la regla global de `prefers-reduced-motion` detiene los tres.

## Consecuencias

**A favor**

- La sección deja de ser un trámite: se lee entera de un vistazo y ya no adelanta a "Servicios".
- Composición que no se repite en ninguna otra sección de la página.
- **Peso: 0 KB de JS.** Se retira `SpotlightCard` (cliente, con muelles) de esta sección y se cambian
  dos iconos de `lucide` por tres. Medido con el método fijado en la Fase 12: **268 KB brotli antes y
  después**. El CSS sube ~1 KB (14 → 15 KB).
- Lighthouse **99 · 100 · 96 · 100**, LCP 0,9 s, TBT 0 ms.

**En contra / riesgos asumidos**

- **Se cambia copy oficial de `Prompt.md`.** Era el encargo explícito, pero queda anotado en
  [`content-guide.md`](../../09-content-seo/content-guide.md) por si el cliente quiere revisarlo.
- Un bloque CSS más (`.vpx-*`, ~200 líneas) en `globals.css`, que ya va por 3.100 líneas. Partirlo en
  varios archivos es una tarea pendiente de la que esta fase no se hace cargo.
- Los tres estratos son afirmaciones **sin prueba**: no llevan dato ni caso. Cuando haya casos reales
  (§19), el sitio natural para enlazarlos es esta sección.

## Alternativas descartadas

| Alternativa                                           | Por qué no                                                                                                                     |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Acortar el párrafo y dejar las tres tarjetas          | Arregla la lectura pero no la duplicación con "Servicios", que era el problema de fondo.                                       |
| Eliminar la sección entera y quedarse con "Servicios" | Se perdería el único sitio donde la empresa dice quién es antes de enumerar lo que vende.                                      |
| Tarjetas apiladas en perspectiva 3D ("capas")         | Bonito en estático; en Chromium el rasterizado en 3D desenfoca el texto de forma irreparable (ADR-015).                        |
| Un diagrama animado a la izquierda en vez de texto    | La página ya tiene malla neuronal, deck de dispositivos y recorrido del proceso. Otro motivo en movimiento resta, no suma.     |
| Espina animada en bucle, como el cometa del proceso   | Repetiría el motivo del proceso y añadiría un tercer contenido en movimiento automático que habría que poder pausar.           |
| Pasar el fragmento resaltado del titular como JSX     | Rompe el troceado por palabras de `TextReveal` y obliga a `constants/value-props.ts` a importar React. `highlight` es un dato. |
| Columna izquierda `sticky`                            | La sección mide una pantalla escasa: no hay recorrido que acompañar, y el pegado se notaría como un tirón.                     |

## Referencias

- [ADR-011](./ADR-011-secure-system-scenography.md) — regla de oro de hidratación y política de movimiento.
- [ADR-015](./ADR-015-crisp-deck-and-ecommerce.md) — de donde sale la advertencia sobre transformaciones 3D y nitidez.
- [ADR-016](./ADR-016-horizontal-process-timeline.md) — el acento violeta `#a78bfa` viene de ahí.
- [`docs/09-content-seo/content-guide.md`](../../09-content-seo/content-guide.md)
- [`docs/03-components/component-catalog.md`](../../03-components/component-catalog.md)
