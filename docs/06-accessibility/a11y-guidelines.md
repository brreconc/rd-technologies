# Accesibilidad (a11y)

**Objetivo:** WCAG 2.2 **AA** (§10).

## Ya aplicado (Fase 0)

- `<html lang="es">` y HTML semántico (`<main id="contenido-principal">`).
- **Skip link** ("Saltar al contenido") visible al enfocar con teclado.
- **Foco siempre visible:** estilo `:focus-visible` global con el color de anillo de marca.
- **`prefers-reduced-motion`** respetado globalmente.
- **Reglas ESLint jsx-a11y** activas (Next + refuerzos en [`eslint.config.mjs`](../../eslint.config.mjs)).
- CTAs con **touch target ≥ 44px** (`min-h-11`).

## Checklist por componente (Fases 1+)

- [ ] Navegable 100% por teclado, orden lógico.
- [ ] Roles/aria correctos (Radix ayuda en acordeones, menús, diálogos).
- [ ] `alt` descriptivos en imágenes; iconos decorativos con `aria-hidden`.
- [ ] Contraste AA verificado.
- [ ] Estados (hover/focus/active/disabled) perceptibles sin depender solo del color.

## Automatización (Fase 6 — implementado)

- **axe-core en Playwright** (`e2e/a11y.spec.ts`): sin violaciones críticas/serias (WCAG 2.0/2.1
  A y AA). Complementa (no sustituye) la revisión manual con teclado y lector de pantalla. Desde la
  Fase 10 hay **una sola paleta** que auditar ([ADR-012](../01-architecture/decisions/ADR-012-single-dark-theme.md)),
  pero el escaneo se ejecuta **dos veces**: una con la página tal cual y otra con el deck
  multiplataforma en su último destino, porque ahí el acento de la escena es otro y el primer
  escaneo no lo vería.
- **Lighthouse Accessibility: 100** (Fase 6).
- **Adornos decorativos:** los números de paso "01"…, iconos y resplandores llevan
  `aria-hidden="true"`; están fuera del árbol de accesibilidad y, como texto decorativo, quedan
  exentos del contraste (WCAG 1.4.3). El escaneo axe los excluye a propósito; el contenido que sí
  leen las ayudas técnicas se audita al completo. Ver [08-testing](../08-testing/testing-strategy.md).

## Contenido que se mueve solo — WCAG 2.2.2 (Fase 10 — ADR-013)

El **deck multiplataforma** recorre sus cinco destinos por su cuenta. Eso es contenido en
movimiento que arranca automáticamente y dura más de cinco segundos, así que el criterio 2.2.2
(_Pausar, detener, ocultar_) obliga a que el usuario pueda pararlo. Se cubre por triplicado:

1. Un **botón explícito** ("Detener el recorrido automático") junto al escenario.
2. Se **pausa solo** al pasar el puntero por encima o al enfocar cualquier elemento del deck, para
   que nadie pierda de vista lo que está leyendo.
3. **Elegir un destino a mano lo detiene definitivamente**: si el usuario ha tomado el control, no
   se le vuelve a arrebatar.

Además, con `prefers-reduced-motion` el recorrido **no llega a existir** —no hay temporizador— y el
botón ni se ofrece, porque no habría nada que parar.

Regla para lo que venga: **cualquier cosa que se mueva sola y dure más de 5 s necesita un mando.**
Si no puedes ofrecerlo, no la pongas en marcha sola.

### Patrón de pestañas del deck

- `tablist` / `tab` / `tabpanel` de WAI-ARIA con `tabindex` rotatorio (solo la pestaña activa es
  tabulable; dentro se navega con flechas).
- Se aceptan **los dos ejes** de flechas (`←→` y `↑↓`) porque el rail es una rejilla en móvil y
  vertical en escritorio, más `Inicio` y `Fin`. La selección mueve también el foco.
- **Ninguna pulsación se descarta.** Sin candados temporales ni banderas de "animando": si el
  usuario pulsa cinco veces seguidas, se atienden las cinco. Suena obvio, pero el diseño del que
  partió la Fase 11 traía un bloqueo de 700 ms que hacía inalcanzables dos de los destinos
  desde el teclado. Hay un E2E que lo vigila.
- El mock-up del dispositivo es decorativo (`aria-hidden`): toda la información está en el texto del
  panel. Una región `aria-live="polite"` anuncia el destino en pantalla, porque si no los cambios
  del recorrido automático pasarían inadvertidos a un lector de pantalla.
- **Contraste por token, no por opacidad.** Todo el texto atenuado del deck usa `--deck-dim`
  (`#8a8a8a`, ≥5:1 sobre las superficies del deck) en vez de blanco con transparencia, que es la
  vía fácil para colar texto por debajo de AA sin enterarse. Ver
  [colors-and-tokens](../02-design-system/colors-and-tokens.md#--deck-dim-un-único-gris-atenuado).

## Movimiento reducido (Fase 9 — ADR-011)

`prefers-reduced-motion` se garantiza **desde el CSS**, no desde JavaScript. El detalle y la regla
de oro para escribir componentes nuevos están en
[design-system/motion](../02-design-system/motion.md#política-de-prefers-reduced-motion-adr-011-️-importante).
Resumen:

- La regla global neutraliza animaciones/transiciones y fija `.reveal` en su estado final con
  `!important` (gana a los estilos en línea de Framer).
- `MotionConfig reducedMotion="user"` hace que Framer ignore las transformaciones.
- **Ningún componente cambia su markup según `useReducedMotion()`.** Hacerlo rompía la hidratación
  (el hook devuelve `null` en el servidor) justo para estos usuarios. Corregido en la Fase 9 y
  vigilado por [`e2e/experience.spec.ts`](../../e2e/experience.spec.ts).
- La malla neuronal del hero pinta **un único fotograma** (red ya construida, sin partículas) y no
  arranca el bucle `requestAnimationFrame`.
- El paralaje de salida del hero se anula por completo.

## Limitación conocida: página sin JavaScript

La landing es una **ruta dinámica** (la CSP con nonce obliga a leer `headers()`, ADR-009). React
transmite el contenido de la página dentro de un `<div hidden>` que revela su propio script en
línea, así que **con JavaScript totalmente desactivado el `<main>` no se muestra**. Es
comportamiento del framework, anterior a la Fase 9 y ajeno a las animaciones.

Lo que sí está garantizado (y cubierto por e2e): si el HTML se muestra, la neutralización de
`.reveal` funciona, de modo que **ningún texto queda escondido** por una animación de entrada que
nunca llegó a ejecutarse. Si en el futuro se quisiera servir la página sin JS habría que renunciar
al nonce por petición (CSP con hashes) para poder prerenderizarla estáticamente.
