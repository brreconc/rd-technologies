# Estrategia multiplataforma y responsive

Requisito central del cliente (§5): verse **perfecto en cualquier navegador, SO, dispositivo y
resolución — del móvil de 320px al televisor 4K — sin un solo desbordamiento**.

## Matriz objetivo

- **Navegadores:** Chrome, Edge, Firefox, Safari, Opera, Samsung Internet, Brave (últimas 2 mayores).
- **SO:** Windows, macOS, Linux, Android, iOS/iPadOS, navegadores de Smart TV.
- **Dispositivos:** móvil, tablet, laptop, desktop, ultrawide, TV/4K.
- **Entrada:** táctil, ratón, teclado, mando de TV (foco direccional), stylus.

## Breakpoints

| Nombre  | Rango     | Uso                                       |
| ------- | --------- | ----------------------------------------- |
| `xs`    | 320–479   | Móviles pequeños                          |
| `sm`    | 480–767   | Móviles grandes                           |
| `md`    | 768–1023  | Tablets                                   |
| `lg`    | 1024–1439 | Laptop / desktop                          |
| `xl`    | 1440–1919 | Desktop grande                            |
| `2xl`   | 1920–2559 | Full HD                                   |
| `tv/4k` | ≥ 2560    | TV / 4K (se escalan tokens, no se estira) |

## Reglas anti-desbordamiento (ya aplicadas en la base)

Implementadas en [`globals.css`](../../src/app/globals.css):

1. **Cero scroll horizontal:** `body { overflow-x: clip }` (`clip` no rompe `position: sticky`
   como sí lo haría `hidden`). Se auditará con Playwright comparando `scrollWidth`/`clientWidth`.
2. **Tipografía fluida** con `clamp()` (tokens `--text-fluid-*`).
3. **Media contenida:** `img, picture, video, canvas, svg { max-width: 100%; height: auto }`.
4. **Contenido ancho** (tablas, código, carruseles) irá en su propio contenedor con
   `overflow-x: auto`; el `<body>` nunca desborda.
5. **Unidades de viewport modernas:** `100dvh` para evitar el salto de la barra de direcciones.
6. **`scrollbar-gutter: stable`** para que la barra no cause reflow.

## Dónde cambia la navegación (Fase 10)

La navegación de escritorio aparece a partir de **`xl` (1280px)**, no de `lg`. Con seis destinos
—Servicios, Plataformas, Proceso, Casos de uso, Preguntas frecuentes, Contacto— los rótulos
completos no caben a 1024px y se partían en varias líneas. Entre 1024 y 1279px manda el menú
lateral (`MobileNav`), que es una hoja completa con trampa de foco.

> Se prefirió mover el breakpoint antes que recortar los rótulos: el copy es del cliente.
> Ver [ADR-013](../01-architecture/decisions/ADR-013-platform-deck.md).

## El deck multiplataforma en cada tamaño

El deck ([`sections/Platforms`](../../src/components/sections/Platforms)) reordena su rejilla con
áreas explícitas en lugar de `order`, para que el orden de lectura tenga sentido en ambos casos:

| Tamaño      | Disposición                                                                      |
| ----------- | -------------------------------------------------------------------------------- |
| < `sm`      | Rail en **una columna** de 5 filas → escenario → panel de texto                  |
| `sm` – `lg` | Rail en **rejilla de 2 columnas**, el último ocupa la fila entera                |
| ≥ `lg`      | Rail vertical y panel a la izquierda; escenario a la derecha, pegajoso al scroll |

> **Por qué rejilla y no una tira deslizable.** El primer diseño usaba una tira con desplazamiento
> lateral, y a 375px dejaba **casi todos los destinos fuera de pantalla** sin ninguna pista de que
> existieran — en la sección cuyo mensaje entero es "los hacemos todos". Hay un E2E que lo vigila:
> comprueba que las cinco pestañas caben enteras dentro del viewport a 375px.
>
> **Por qué una sola columna por debajo de `sm`.** Con el quinto destino, a dos columnas
> "E-commerce" no cabe en un teléfono y se recortaba como "E-comme…". Recortar el nombre de la
> plataforma es justo lo contrario de lo que la sección va a hacer, así que el rail baja a una
> columna antes que perder la palabra. Un E2E comprueba que **ningún rótulo se recorta** a 320, 375
> y 768px comparando `scrollWidth` con `clientWidth`.

El número de canal (`Canal 01`…) solo aparece a partir de `lg`: por debajo, la fila es demasiado
estrecha y competía con el rótulo.

El dispositivo se dimensiona en **porcentajes de su escenario**, y el escenario tiene proporción
fija (5/4). Por eso el morfismo entre destinos no cambia la altura de la página (**CLS 0**) y
funciona igual a 320px que a 4K sin números mágicos en píxeles. El interior del mock-up escala con
**unidades de contenedor** (`cqh`), no con media queries, porque el dispositivo cambia de tamaño sin
que cambie el viewport. `e2e/platforms.spec.ts` comprueba que **ningún destino desborda a 320px**.

El **bisel** de los destinos de esquina redonda también va en unidades de contenedor
(`clamp(3px, 1.9cqw, 9px)`): un teléfono tiene marco de teléfono a 320px y a 4K. Sin él, el arco de
la esquina se comía la barra de estado y la navegación inferior. Ver
[ADR-015](../01-architecture/decisions/ADR-015-crisp-deck-and-ecommerce.md).

## El manifiesto de la propuesta de valor en cada tamaño

| Tamaño | Disposición                                                                           |
| ------ | ------------------------------------------------------------------------------------- |
| < `lg` | Apilado: primero el texto, después el panel de estratos a ancho completo.             |
| ≥ `lg` | Dos columnas **desiguales**, 5 (texto) / 7 (panel), centradas verticalmente entre sí. |

La asimetría no es capricho: dos mitades iguales devolverían la sección al bloque centrado que era
antes de la Fase 14 ([ADR-017](../01-architecture/decisions/ADR-017-value-props-manifesto.md)).

Dentro del panel no hay un solo breakpoint. Cada fila es una rejilla de dos columnas —nodo y texto—
donde el nodo mide `clamp(2.5rem, 6vw, 2.875rem)` y el relleno vive en `--vpx-pad-y`, así que todo
escala con el viewport de forma continua. El texto se envuelve solo; a 320px las descripciones pasan
de una a tres líneas y la fila crece, que es justo lo que debe hacer.

`e2e/value-props.spec.ts` comprueba a **320, 375, 768, 1024, 1440 y 2560px** que no desborda ni el
documento ni el panel.

## El recorrido del proceso en cada tamaño

El raíl es una rejilla de **seis columnas iguales desde 320px**, y cabe porque los hitos son números
en un círculo, no rótulos. Lo que cambia con el ancho es el texto:

| Tamaño  | Qué se ve                                                                  |
| ------- | -------------------------------------------------------------------------- |
| < `sm`  | Seis hitos numerados; el título del paso vive solo en la tarjeta de abajo. |
| ≥ `sm`  | Aparece además el título bajo cada hito.                                   |
| ≥ `2xl` | El raíl deja de estirarse (`max-width: 62rem`) y se centra.                |

El tope de ancho no es estético: sin él, a 2560px los hitos quedan tan separados que dejan de leerse
como una secuencia y el recorrido pierde el sentido.

El tamaño del hito es `clamp(2.15rem, 7.2vw, 3.25rem)`, así que el raíl escala con el viewport sin un
solo breakpoint. `e2e/process.spec.ts` recorre los seis pasos a 320px comprobando que **ninguno
provoca scroll horizontal**.

## Pendiente por fase

- ~~**Container Queries** para componentes que dependen de su contenedor~~ — hecho en la Fase 11
  para el interior del deck (`container-type: size` en `.deck-device`, todo el mock-up en `cqh`).
  Sigue pendiente valorarlas en el resto de tarjetas.
- **Safe-area insets** (`env(safe-area-inset-*)`) en header/footer fijos (Fase 1).
- **Touch targets ≥ 44×44px** y `@media (hover: hover)` para no dejar acciones solo-hover en
  táctil (Fases 1–2). El shell ya usa `min-h-11` (44px) en los CTAs.
- **Escalado TV/4K:** aumentar tokens base en `≥2xl` (Fase 2).
- **Auditoría responsive automatizada** en Playwright (viewports 320→4K) — Fase 6.
