# Estilos (`src/styles/`)

CSS de la landing, **troceado por responsabilidad**. Sustituye al antiguo
`globals.css` monolítico (3.2k líneas). Objetivo: orden, velocidad de edición y
que el archivo **nunca vuelva a crecer sin control**.

> Regla dura del proyecto: **ningún archivo de estilos supera ~600 líneas.**
> Cuando uno se acerque, se parte (ver _"Cómo añadir estilos"_).

## Mapa

| Archivo                         | Contiene                                                                     |
| ------------------------------- | ---------------------------------------------------------------------------- |
| `../app/globals.css`            | **Entrada.** Solo `@import`s en orden de cascada. No lleva reglas propias.   |
| `tokens.css`                    | Paleta `:root`, `@theme` de Tailwind v4 y tipografía fluida.                 |
| `base.css`                      | Capa base (reset, foco, selección), movimiento reducido global, `@utility`.  |
| `motion.css`                    | Efectos de **página / transversales**: aurora, costuras, marquee, HUD…       |
| `sections/value-props.css`      | Sección Propuesta de valor · `.vpx-*` (ADR-017).                             |
| `sections/process-timeline.css` | Sección Proceso · `.ptl-*` (ADR-016).                                        |
| `sections/platform-deck.css`    | Sección Plataformas (deck) · `.deck-*` (ADR-013/014/015).                    |
| `sections/mockups/*.css`        | Interior del deck · `.mk-*`, un archivo por plataforma.                      |
| `reduced-motion.css`            | Anulaciones de movimiento reducido por componente. **Se importa el último.** |

## Principios

1. **Una sección = un archivo** en `sections/`. El CSS de una sección de la
   landing no vive en `motion.css` ni en `base.css`.
2. **Transversal vs. de sección.** Si un efecto lo usan varias secciones o es de
   página completa → `motion.css`. Si es de una sola → su archivo de sección.
3. **Los tokens mandan.** Ningún color/tamaño hardcodeado: usa variables de
   `tokens.css`. Cambiar la paleta debe ser editar solo ese archivo.
4. **El orden es la cascada.** El orden de los `@import` en `globals.css` es el
   orden en que se aplican las reglas. No lo reordenes sin entender el efecto.
5. **Movimiento reducido al final.** Toda animación nueva se neutraliza en
   `reduced-motion.css` (o en el bloque global de `base.css` si es genérica),
   que se importa el último para ganar la cascada (WCAG 2.3.3).

## Cómo añadir estilos (checklist)

**Sección o rediseño nuevo:**

1. Crea `src/styles/sections/<mi-seccion>.css` con una cabecera que diga qué es,
   su prefijo de clase (`.mi-seccion-*`) y el ADR asociado.
2. Añade su `@import` en `globals.css`, en el bloque _"3 · Secciones"_.
3. Si neutraliza animaciones, añade sus reglas de `prefers-reduced-motion` a
   `reduced-motion.css`.

**Un archivo se acerca a 600 líneas:**

- Pártelo en una subcarpeta por piezas, igual que `sections/mockups/`
  (`base.css` + un archivo por variante), e importa los trozos en orden en
  `globals.css`. La base/compartido va **antes** que las variantes.

**Efecto de página nuevo (no de una sección):** va en `motion.css`.

## Notas técnicas

- Tailwind v4 (**sin `tailwind.config`**, config en CSS). El `@import
"tailwindcss"` va el **primero** en `globals.css`; `@theme`/`@utility`
  funcionan dentro de los parciales importados porque Tailwind resuelve los
  `@import` en tiempo de build.
- Los estilos se importan **una sola vez**, desde el layout raíz
  (`src/app/layout.tsx`) y `global-error.tsx`, vía `globals.css`. No importes
  parciales sueltos desde componentes.
- Verifica el orden final con `pnpm build` (en dev el orden puede diferir).
