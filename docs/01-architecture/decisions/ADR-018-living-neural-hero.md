# ADR-018 — El hero neuronal pasa a ser un "sistema vivo" interactivo

- **Estado:** Reemplazada por [ADR-019](./ADR-019-hero-code-console.md) — la malla
  neuronal del hero (y toda su interacción) se retiró en la Fase 16 a favor de una
  consola de compilación. Este ADR queda como registro histórico.
- **Fecha:** 2026-09-21
- **Decisores:** R&D Technologies (dirección de producto), desarrollo

## Contexto

El fondo del hero (malla neuronal en `<canvas>`, [ADR-011](./ADR-011-secure-system-scenography.md))
cumplía el relato de marca pero era **poco memorable**: se dibujaba una vez,
tenía latido ambiental y apenas reaccionaba al cursor (solo brillo). Dirección lo
calificó de "5.5/10" y pidió una entrada **legendaria**: mucho más impacto en la
carga y una interacción con la que el visitante pueda **jugar**.

Restricciones que no se negocian: **cero dependencias nuevas** (CSP estricta,
ADR-009, y presupuesto de JS ya ajustado, §11), `prefers-reduced-motion`, el
`<h1>` sigue siendo el LCP y se pinta al instante, y CLS 0.

## Opciones consideradas

1. **Librería de partículas/WebGL (tsParticles, three.js…).** Máximo impacto con
   poco código propio. ❌ Rompe el presupuesto de bundle, complica la CSP y añade
   superficie de mantenimiento; contradice el resto del proyecto (todo vanilla).
2. **Retoques al canvas actual** (más partículas, más brillo). ✅ Barato. ❌ No
   llega al salto de calidad pedido; sigue siendo pasivo.
3. **Reescribir la simulación como "campo vivo" interactivo, en el mismo canvas
   vanilla.** Arranque cinematográfico, física de desplazamiento (pozo del
   cursor, parallax por profundidad, tirón al arrastrar) e interacción expresiva
   (cascada de señal al clic, carga/detonación al mantener pulsado). ✅ Máximo
   impacto sin dependencias. ❌ Más lógica propia que probar y perfilar.

## Decisión

**Opción 3.** La lógica pura (curvas, profundidad, BFS de la cascada) vive en
`engine.ts` y está cubierta por Vitest; el pintado y la interacción, en
`index.tsx`. Los campos nuevos de `SceneNode` (`z`, `dx/dy`, `dvx/dvy`,
`chargedAt`) son **opcionales**: no rompen el contrato previo ni los tests.

Gestos: **tap** = inyecta una señal que recorre el grafo salto a salto; **mantener
pulsado** = carga y detona (revienta la zona y planta un nodo, hasta un tope);
**arrastrar** = empuja/lanza la malla. Una pista discreta (`HeroBackdrop`) los
anuncia y se desvanece tras la primera interacción (solo con puntero fino).

## Consecuencias

- **Positivas:** entrada mucho más impactante y "jugable"; sigue sin librerías
  (CSP intacta, ~0 KB de dependencias); toda la lógica nueva es testeable y está
  probada; degradación automática a `lowPower` (menos partículas, sin parallax ni
  HUD de nodo) para equipos lentos.
- **Negativas / deuda:** más coste por fotograma que la versión pasiva (mitigado
  por el modo `lowPower` y la pausa fuera de viewport); la física de
  desplazamiento añade constantes a calibrar (`SPRING`, `WELL_FORCE`, `DAMP`…).
- **A revisar:** medir FPS reales en gama baja y en móvil; si hace falta, bajar el
  tope de nodos o el umbral de `lowPower`. Confirmar presupuestos con Lighthouse
  antes de fusionar a `main`.

## Evolución (Fase 15.1)

Tres ajustes sobre lo anterior, sin cambiar la arquitectura:

- **Distribución pareja de la malla.** `createNodes` deja el random puro (que
  dejaba huecos y racimos, más tejida de un lado que de otro) por una **rejilla
  con jitter**: un nodo por celda, desordenado dentro de ella. Cubre toda la
  pantalla de forma uniforme pero orgánica, en cualquier proporción de viewport.
- **Caza del virus.** Sustituye a las viejas "intrusiones" de ruta fija por una
  persecución sobre el grafo: un **virus rojo** hace un _random walk_ huyendo del
  agente más cercano e infecta los nodos que toca (se curan con el tiempo);
  **agentes cazadores** lo persiguen usando `bfsDepths` desde el nodo del virus
  (descenso voraz por la malla) y lo destruyen por proximidad; luego renace otro
  en bucle. Sigue avisando al HUD vía `onThreatBlocked`. Salvaguardas: respawn si
  el grafo está desconectado, menos agentes en `lowPower`, y nada de esto existe
  con `prefers-reduced-motion`.
- **Selección de texto.** La sección del hero lleva `select-none`: arrastrar
  sobre la malla ya no selecciona el titular. El resto de la página no cambia.

## Evolución (Fase 15.2)

Sube el listón de "sistema vivo" sin cambiar la arquitectura:

- **Malla más densa y repartida.** Se sube el nº de nodos (`nodeCountFor`, hasta
  104 en escritorio / 42 en móvil) y la distancia de conexión (`connectDistanceFor`,
  ~2.05× el espaciado): la red llena la pantalla y tiene muchas más conexiones.
- **Varios virus a la vez.** El virus único pasa a un array de **hasta 3**
  simultáneos (`MAX_VIRUSES`), cada uno con su propio BFS; reaparecen escalonados
  para mantener 2–3 activos. La persecución dura varios segundos a propósito: los
  agentes son solo un poco más rápidos que el virus, que **huye** del más cercano.
- **Más agentes y captura "pro".** 5 agentes (`HUNTERS`) que **eligen el virus más
  cercano** y descienden su BFS; línea de rastreo al acercarse. Al capturar, una
  animación de un segundo: **implosión de esquirlas + destello + tres ondas**.
- **Atrapar con el puntero.** Mantener pulsado **sobre un virus** lo apresa: queda
  pinzado al cursor dentro de una "jaula", **forcejea** con tirones crecientes y a
  los ~2,6 s (o al soltar) **se zafa** con un estallido. Mientras está preso, los
  agentes convergen y pueden rematarlo. Este gesto tiene prioridad sobre la
  cascada/detonación del clic.
