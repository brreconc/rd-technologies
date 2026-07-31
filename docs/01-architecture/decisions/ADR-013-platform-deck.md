# ADR-013 — Deck multiplataforma y sistema de movimiento v4

- **Estado:** Aceptada — **§2 sustituida** por [ADR-014](./ADR-014-instrument-deck.md) (Fase 11)
- **Fecha:** 2026-07-30
- **Fase:** 10
- **Continúa:** [ADR-010](./ADR-010-cinematic-motion-system.md) y [ADR-011](./ADR-011-secure-system-scenography.md)

> ⚠️ **Vigencia.** El concepto del deck (§1), el sistema de movimiento v4 (§3) y todo lo de
> accesibilidad, rendimiento e hidratación siguen en vigor. Lo que ya **no** describe la realidad es
> la **§2, "Los mock-ups son DATOS, no JSX"**: en la Fase 11 los mock-ups SVG se sustituyeron por
> componentes de interfaz real y `screens.ts`/`screens.test.ts` se retiraron. El motivo y el
> contrato que ocupa su lugar están en [ADR-014](./ADR-014-instrument-deck.md).

## Contexto

La landing contaba **qué** hacemos (los tres pilares de "Servicios") pero no **dónde corre**. El
cliente que entra trae una pregunta muy concreta —"¿pueden hacer LO MÍO: mi web, mi app de Android,
mi programa de escritorio?"— y la página no la respondía de un vistazo. La lista de la tarjeta de
servicios ("Aplicaciones móviles para Android e iOS", "Plataformas web y sistemas empresariales")
lo mencionaba de pasada, enterrado en una viñeta.

Hacía falta una sección propia, corta y contundente, que además estuviera a la altura visual del
resto: la Fase 9 dejó el listón alto y una sección de texto plano habría sido un bache.

Restricciones heredadas, no negociables: **sin dependencias nuevas** (presupuesto de JS y superficie
de CSP), WCAG 2.2 AA, cero desbordamiento de 320px a 4K, y `prefers-reduced-motion` respetado sin
bifurcar el markup (la regla de oro de ADR-011).

## Decisión

### 1. El deck: en vez de contar las plataformas, se compila una delante del cliente

Se añade la sección `#plataformas` con cuatro destinos —**Web, Android, iOS y Escritorio
(Windows · macOS · Linux)**— presentados como un **deck de despliegue**. Al elegir un destino:

1. El **dispositivo del escenario se transforma**: proporción y radio de esquina pasan del navegador
   apaisado al teléfono vertical o al monitor, con un muelle.
2. **Toda la escena se retiñe** con el acento de esa plataforma, desde una única variable CSS
   (`--platform-accent`): marco, resplandor, mock-up, viñetas, chips y consola.
3. Un **barrido de compilación** recorre la pantalla y el **mock-up se dibuja pieza a pieza**, con
   una interfaz reconocible y distinta en cada destino (cromo de navegador, app bar y FAB de
   Android, isla dinámica y tab bar de iOS, barra lateral y gráfico de escritorio).
4. La **consola** de abajo anuncia el objetivo y su barra de progreso se rellena.

Y responde al usuario: mover el puntero **inclina el dispositivo en 3D**, y el mock-up está repartido
en **dos capas separadas en profundidad** (`translateZ`), de modo que al inclinarlo el holograma se
despliega. Es interacción real, no una animación que se mira.

**Por qué es defendible técnicamente:** no hay canvas, ni WebGL, ni librería de animación nueva. Son
dos `<svg>` estáticos y animaciones CSS de `transform`/`opacity` que compone la GPU. Solo hay un
destino montado a la vez.

### 2. Los mock-ups son DATOS, no JSX

Las figuras de cada pantalla viven en
[`screens.ts`](../../../src/components/sections/Platforms/screens.ts) como arrays de rectángulos y
círculos. El renderizador es un único `map`. Tres razones:

- Añadir una plataforma es añadir datos, no tocar el componente.
- El escalonado de entrada sale del **índice del array**, así que no hay retardos escritos a mano
  que se desincronicen al editar.
- Se pueden **verificar en un test unitario** sin montar nada: `screens.test.ts` comprueba que
  ninguna figura se sale de su `viewBox` y que cada `viewBox` cuadra con la proporción del
  dispositivo. Es el equivalente, dentro del mock-up, del contrato de "cero desbordamiento" de §5.3.
  Ese test ya cazó un fallo real durante el desarrollo (una capa flotante vacía en Android).

### 3. Movimiento v4: el paso entre secciones como cambio de plano

Tres capas nuevas, **todas en CSS puro y ligadas al scroll** (`animation-timeline`), sin un solo
manejador de scroll en JavaScript ni observadores:

| Capa        | Qué hace                                                                                                                                                                                                                                                                                                  |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Aurora**  | Una capa fija tras toda la página cuyos focos se desplazan con el avance del documento (`scroll(root)`). Da continuidad: la página se percibe como un espacio con iluminación propia.                                                                                                                     |
| **Costura** | El límite entre secciones deja de ser un borde: es un **hilo de luz con un nodo encendido en el centro** que se despliega hacia los lados al entrar la sección, acompañado de un resplandor que se hincha y queda en rescoldo. Tres capas de fondo en un solo pseudo-elemento, sin nodos extra en el DOM. |
| **Llegada** | Cada sección entra atenuada y algo desplazada, y alcanza su brillo pleno al subir (`view()`). Vive en la primitiva `Section`, así que **todas** las secciones la heredan sin repetir nada.                                                                                                                |

## Consecuencias

**A favor**

- Se responde de un vistazo a la pregunta comercial que más importa, y se responde demostrándolo.
- **Cero dependencias nuevas.** El coste medido en el bundle de la ruta es de ~2 KB netos: la
  sección entera casi se paga sola con la retirada de `next-themes` (ADR-012).
- Lighthouse no se movió: Performance 99 · A11y 100 · BP 96 · SEO 100, con **CLS 0** (el escenario
  tiene proporción fija, así que el morfismo del dispositivo no desplaza nada).
- El movimiento v4 no cuesta JavaScript: si el navegador no soporta `animation-timeline`, todo queda
  en su estado final y la página funciona igual.

**En contra / riesgos asumidos**

- **La nav de escritorio sube de `lg` a `xl`.** Con seis destinos, los rótulos completos
  ("Preguntas frecuentes", "Casos de uso") no caben a 1024px y se partían en varias líneas. Entre
  1024 y 1279px manda ahora el menú lateral. Se prefirió eso a recortar el copy del cliente.
- **`animation-timeline` no está en todos los navegadores.** Es mejora progresiva dentro de
  `@supports`: donde falta, no hay aurora ni llegada de sección, y la costura queda pintada.
- **El avance automático es contenido en movimiento que arranca solo**, y eso obliga a WCAG 2.2.2.
  Se cubre por triplicado (ver abajo), pero es complejidad que hay que mantener.
- Un `deck-el` por figura implica del orden de 30 animaciones CSS simultáneas al cambiar de destino.
  Son todas de `transform`/`opacity` sobre figuras SVG diminutas y duran medio segundo; se midió y
  no mueve el TBT (0 ms).

## Accesibilidad (§10)

- **Patrón `tablist`/`tab`/`tabpanel`** de WAI-ARIA con `tabindex` rotatorio. Se aceptan flechas en
  **los dos ejes** porque el rail es vertical en escritorio y horizontal en móvil, más `Inicio` y
  `Fin`. La selección mueve también el foco.
- **WCAG 2.2.2 (Pausar, detener, ocultar)** — el recorrido automático se detiene de tres formas:
  un **botón explícito**, al pasar el puntero o enfocar dentro del deck, y al elegir un destino a
  mano (el usuario ha tomado el control, no se le vuelve a arrebatar).
- Con `prefers-reduced-motion` **no llega a existir**: no hay temporizador y el botón no se ofrece.
- El mock-up es decorativo (`aria-hidden`): la información real está en el texto del panel. Una
  región `aria-live` discreta anuncia los cambios que provoca el avance automático, que si no
  pasarían inadvertidos para un lector de pantalla.
- Los cuatro acentos superan AA sobre `#0a0a0a`. Verificado con axe en E2E, **también con el deck
  en su último destino**, para que el escaneo no se quede solo con el acento inicial.

## Rendimiento (§11)

- El avance automático **no existe fuera de pantalla**: un `IntersectionObserver` lo apaga, así que
  una sección que no se ve no deja ni un temporizador vivo.
- El escenario tiene proporción fija → el morfismo del dispositivo no provoca reflujo de la página.
- Las animaciones ligadas al scroll corren fuera del hilo principal en los navegadores que las
  implementan; no hay listeners de `scroll`.

## Hidratación

Se respeta la regla de oro de [ADR-011](./ADR-011-secure-system-scenography.md): el markup **no** se
bifurca según `useReducedMotion()` —el hook solo decide si se registran manejadores y si corre el
temporizador, cosas que viven en efectos y no viajan en el HTML—. El destino inicial es una
constante (`defaultPlatformId`), así que servidor y cliente coinciden siempre. El único markup que
depende del cliente (el botón de pausa) se monta detrás de `useMounted()`, que devuelve `false`
tanto en el servidor **como en el primer render de cliente**, que es lo que React compara.

Hay un E2E que vigila esta regla: `platforms.spec.ts` carga la sección con movimiento reducido y
falla ante cualquier error de consola.

## Alternativas descartadas

| Alternativa                                | Por qué no                                                                                                                                            |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cuatro tarjetas con un icono y un párrafo  | Es exactamente "la landing de toda la vida". Cumple, pero no demuestra nada ni justifica una sección propia.                                          |
| Dispositivos en 3D real (Three.js / WebGL) | Rompe el presupuesto de JS de golpe, añade una dependencia enorme, complica la CSP y hay que construirle un camino alternativo para `reduced-motion`. |
| Capturas reales de proyectos               | No las hay todavía (§19, pendiente de contenido del cliente). Un mock-up esquemático no miente sobre lo que enseña; un pantallazo inventado sí.       |
| Vídeo de fondo mostrando las plataformas   | Megabytes, decodificación en el hilo principal, y no se puede retintar ni hacer interactivo.                                                          |
| Carrusel con arrastre                      | El patrón de pestañas es más accesible, más predecible con teclado y no compite con el scroll vertical de la página en móvil.                         |

## Referencias

- [ADR-010](./ADR-010-cinematic-motion-system.md) — sistema de movimiento cinematográfico.
- [ADR-011](./ADR-011-secure-system-scenography.md) — escenografía y regla de oro de hidratación.
- [ADR-012](./ADR-012-single-dark-theme.md) — tema oscuro único (paga buena parte del coste de esta sección).
- [`docs/02-design-system/motion.md`](../../02-design-system/motion.md) — catálogo de animaciones.
- [`docs/03-components/component-catalog.md`](../../03-components/component-catalog.md)
