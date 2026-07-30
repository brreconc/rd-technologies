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

| Tamaño | Disposición                                                                        |
| ------ | ---------------------------------------------------------------------------------- |
| < `lg` | Rail horizontal con desplazamiento y anclaje (`snap`) → escenario → panel de texto |
| ≥ `lg` | Rail vertical y panel a la izquierda; escenario a la derecha, pegajoso al scroll   |

El dispositivo se dimensiona en **porcentajes de su escenario**, y el escenario tiene proporción
fija. Por eso el morfismo entre destinos no cambia la altura de la página (**CLS 0**) y funciona
igual a 320px que a 4K sin números mágicos en píxeles. `e2e/platforms.spec.ts` comprueba que
**ningún destino desborda a 320px**.

## Pendiente por fase

- **Container Queries** para componentes que dependen de su contenedor (Fases 1–2).
- **Safe-area insets** (`env(safe-area-inset-*)`) en header/footer fijos (Fase 1).
- **Touch targets ≥ 44×44px** y `@media (hover: hover)` para no dejar acciones solo-hover en
  táctil (Fases 1–2). El shell ya usa `min-h-11` (44px) en los CTAs.
- **Escalado TV/4K:** aumentar tokens base en `≥2xl` (Fase 2).
- **Auditoría responsive automatizada** en Playwright (viewports 320→4K) — Fase 6.
