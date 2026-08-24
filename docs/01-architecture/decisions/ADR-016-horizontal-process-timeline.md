# ADR-016 — El proceso como recorrido horizontal que se cuenta solo

- **Estado:** Aceptada
- **Fecha:** 2026-08-24
- **Fase:** 13
- **Sustituye:** la línea de tiempo vertical de [ADR-011 §"Línea de tiempo del proceso"](./ADR-011-secure-system-scenography.md)

## Contexto

La sección "Proceso" contaba seis pasos en **vertical**, con un raíl que se rellenaba conforme el
visitante bajaba. Funcionaba, pero tenía dos problemas:

1. **Ocupaba muchísimo.** Seis bloques apilados son casi tres pantallas de scroll para decir seis
   frases cortas. En una landing donde debajo vienen casos de uso, preguntas frecuentes y contacto,
   ese peso no se lo gana.
2. **Solo se contaba si el visitante bajaba.** La animación estaba atada al scroll: quien se paraba
   a leer no veía nada moverse, y quien pasaba de largo se lo perdía entero.

El encargo fue explícito: horizontal, compacto, **que se ejecute solo**, y que el salto de un hito al
siguiente sea un espectáculo de color.

## Decisión

### 1. Recorrido horizontal de seis hitos, con el texto en un panel compartido

El raíl es una rejilla de seis columnas iguales **desde 320px**. Cabe porque los hitos son números
(`01`…`06`), no rótulos: el título aparece bajo cada hito solo a partir de `sm`, y el texto completo
del paso vive en un panel debajo.

Eso es lo que hace la sección compacta: en lugar de seis bloques de texto apilados se enseña **uno
cada vez**, el del paso al que ha llegado el recorrido.

### 2. Se cuenta solo, y el viaje es lo que se ve

Un **cometa** recorre el tramo entre dos hitos —760 ms— dejando el tramo relleno con un degradado que
va del color del paso anterior al del siguiente. Al llegar, el hito **detona** en tres capas:

| Capa         | Qué hace                                                                   |
| ------------ | -------------------------------------------------------------------------- |
| `.ptl-bloom` | Floración radial del color, que inunda y se desvanece (1,15 s).            |
| `.ptl-shock` | Dos ondas de choque anulares desfasadas 130 ms, adelgazando al expandirse. |
| `.ptl-spoke` | Diez radios de luz que salen del centro y se apagan (0,85 s).              |

Y entonces toda la sección se retiñe con el color de ese paso: hito, rótulo, panel y el tramo
siguiente.

### 3. El color es el argumento, no el adorno

Cada paso tiene acento propio y los seis **recorren el círculo cromático**:

| Paso           | Acento    |
| -------------- | --------- |
| 01 Escuchamos  | `#00f5ff` |
| 02 Diseñamos   | `#a78bfa` |
| 03 Construimos | `#ff5f9e` |
| 04 Probamos    | `#fb923c` |
| 05 Lanzamos    | `#ffd93d` |
| 06 Acompañamos | `#4ade80` |

Cuando el recorrido termina, el raíl entero queda pintado como un espectro de cian a verde: **el
conjunto se lee como un viaje aunque no se lea una palabra**. Es la razón de que el color viva en
`process.ts` y no en el CSS — es dato del contenido, no estilo.

Los seis superan AA sobre `--bg`, porque se usan como color de **texto** en el rótulo del panel y bajo
el hito. `process.test.ts` calcula el contraste y lo exige.

### 4. Todo el movimiento es CSS; React solo guarda un entero

El estado es el índice del hito activo. El relleno del tramo, el vuelo del cometa, el encendido del
hito y el retinte del panel los resuelve el CSS desde `data-state`, `data-filled` y dos variables. No
hay cálculo de animación en JavaScript, ni `requestAnimationFrame`, ni medición del DOM.

Dos detalles que sostienen esto:

- **El cometa se mueve con `translate`, no con `left`.** Ocupa el tramo entero y lleva el punto
  pintado en su borde izquierdo, así que trasladarlo el 100% de su **propio** ancho lo lleva de un
  hito al otro exactamente. Se compone en GPU y no repinta.
- **El tramo se coloca con porcentajes de su columna** (`right: 50%; left: -50%`), así que el raíl
  nunca necesita medir nada.

La detonación se remonta con `key={activeIndex}`: es lo que hace que su animación CSS se dispare de
nuevo en cada llegada.

**Se retira Framer Motion de esta sección.** La versión anterior movía `useScroll` + `useSpring` +
`useTransform` en cada fotograma de scroll; ahora no hay nada de eso.

## Accesibilidad (§10) — la parte que decide el diseño

El riesgo obvio de un carrusel es dejar el contenido detrás de la animación. Aquí no ocurre, y es
deliberado: la pieza son **dos cosas con papeles distintos**.

1. El **raíl** es un grupo de seis `<button>`. Son controles: tabulador para alcanzarlos, Intro o
   Espacio para activarlos, y `aria-current="step"` marca el actual. Nada de `tabindex` rotatorio —
   son botones en un grupo, y ese es el comportamiento que se espera.
2. La **`<ol>`** lleva los seis pasos completos —número, título y descripción—, en orden y **siempre
   en el DOM**. Las seis tarjetas comparten celda de rejilla y solo una está opaca. Un lector de
   pantalla recibe la lista entera de una vez: **nadie tiene que esperar a que el recorrido llegue a
   un paso para poder leerlo**. Hay un E2E que lo comprueba buscando la descripción del paso 06 nada
   más cargar.

**WCAG 2.2.2 (Pausar, detener, ocultar).** El recorrido arranca solo y dura más de cinco segundos, así
que hay que poder pararlo. Por triplicado: botón explícito, pausa al pasar el puntero o enfocar
dentro, y elegir un hito a mano lo detiene definitivamente. Con `prefers-reduced-motion` no llega a
existir, y la sección se maneja como lo que ya es sin animación: seis botones y un panel.

**Nombres de control desambiguados.** La página tiene ahora **dos** recorridos automáticos —este y el
deck de plataformas—. Sus botones se llamaban casi igual, lo que los hace indistinguibles para quien
navega por lista de controles, así que pasan a ser "Detener el recorrido **del proceso**" y "Detener
el recorrido **de plataformas**".

**Hidratación (ADR-011).** El markup no se bifurca según la preferencia de movimiento. La política
vive en CSS; lo único que decide el cliente —si corre el temporizador— se consulta con `matchMedia`
dentro de un efecto, que no viaja en el HTML. El botón de pausa va detrás de `useMounted()`.

## Consecuencias

**A favor**

- La sección pasa de casi tres pantallas a **una**, y se cuenta sola.
- **CLS 0**: las seis tarjetas comparten celda, así que el alto lo fija la más larga y cambiar de paso
  no mueve nada. Hay un E2E que compara la caja antes y después.
- Cero dependencias nuevas y **cero Framer Motion** en esta sección.
- Lighthouse se mantiene: **99 · 100 · 96 · 100**, LCP 0,9 s, CLS 0, TBT 0 ms. El peso sube ~1 KB de
  JS y ~1 KB de CSS.

**En contra / riesgos asumidos**

- **Solo se ve un paso a la vez** en pantalla. Es el precio de la compacidad. Se compensa con que los
  seis están en el DOM, los seis hitos son clicables y el recorrido completo dura 24 s.
- **Un segundo contenido en movimiento automático** en la misma página. Cada uno tiene su control y su
  nombre propio, pero es superficie de accesibilidad que hay que mantener.
- Los títulos bajo los hitos **desaparecen por debajo de `sm`**. A seis columnas en un teléfono no
  caben sin partirse; el título está en la tarjeta.
- La detonación mete 13 elementos animados a la vez, pero solo en el hito activo y solo durante ~1 s.
  Son `transform`/`opacity`: se midió y el TBT sigue en 0 ms.

## Alternativas descartadas

| Alternativa                                              | Por qué no                                                                                                              |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Mantener el vertical y solo comprimirlo                  | El problema no era el alto de cada bloque sino que hubiera seis; y seguiría sin contarse solo.                          |
| Tira horizontal con desplazamiento lateral               | Dejaría hitos fuera de pantalla sin pista de que existen. Ya nos pasó en el deck (ADR-013) y hubo que rehacerlo.        |
| Seguir atado al scroll, pero en horizontal               | Quien se para a leer no ve nada, y el encargo era justamente que se ejecutara solo.                                     |
| Partículas en `<canvas>`                                 | Un canvas más que arrancar, medir y limpiar, para algo que el CSS compone en GPU sin JavaScript.                        |
| `display: contents` en los `<li>` para compartir rejilla | Históricamente ha roto la semántica de lista en varios navegadores. Se separó raíl y lista, que además se lee mejor.    |
| Un color único de marca para los seis pasos              | El viaje se pierde: el raíl acabado no diría nada. La progresión cromática ES el mensaje de la sección.                 |
| Animar el cometa con `left`                              | Repinta el tramo en cada fotograma. Con `translate` del 100% del propio ancho se consigue lo mismo y lo compone la GPU. |

## Referencias

- [ADR-011](./ADR-011-secure-system-scenography.md) — escenografía v3 y regla de oro de hidratación.
- [ADR-015](./ADR-015-crisp-deck-and-ecommerce.md) — de donde sale la lección del `rootMargin`.
- [`docs/02-design-system/motion.md`](../../02-design-system/motion.md)
- [`docs/03-components/component-catalog.md`](../../03-components/component-catalog.md)
