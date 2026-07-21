# ADR-010 — Sistema de movimiento "cinematográfico" v2 (Fase 8)

- **Estado:** Aceptada
- **Fecha:** 2026-07-21
- **Decisores:** Frontend Senior, Performance, UI, Accesibilidad

## Contexto

El cliente pidió un frontend "de otro mundo" (referencia explícita a los efectos
que se ven en ediciones de TikTok/Stitch), sin sacrificar animaciones ni
funciones, pero manteniendo la seguridad y el rendimiento ya conseguidos. La
landing de Fase 3 era correcta pero conservadora (fade-up + aurora + hover-lift).

El reto: subir varios niveles el impacto visual **sin** romper ninguno de los
contratos no negociables del prompt maestro:

- LCP intacto (el `<h1>` del hero se pinta al instante, §11).
- `prefers-reduced-motion` respetado en todo.
- Funciona sin JS (progressive enhancement, §3.2).
- JS inicial `< 200KB` (§11) — no añadir librerías nuevas.
- Cero desbordamiento horizontal 320px→4K (§5.3.4).
- Contraste AA en ambos temas (§10).
- CSP estricta con nonce vigente (ADR-009) — nada de scripts/estilos externos.

## Decisión

Construir un **sistema de movimiento propio** sobre lo que ya había (Framer Motion
con `LazyMotion` + CSS), **sin sumar dependencias**. Dos capas:

1. **CSS puro (coste casi nulo, sin JS)** en `globals.css`: orbes flotantes,
   rejilla de puntos enmascarada, grano/ruido (SVG en `data:` URI, no es una
   petición de red), gradiente de texto animado (solo color → no afecta al LCP),
   anillo de luz cónico giratorio, brillo diagonal en botones (`.btn-shine`),
   borde de gradiente al hover (`.gradient-border`) y **marquee** infinito.
   Todo se detiene solo con la regla global `prefers-reduced-motion`
   (`animation-duration: 0.001ms`).

2. **Framer Motion (el motor que ya estaba, sin coste extra de bundle)** para lo
   que necesita el puntero o el scroll: barra de progreso (`useScroll`+`useSpring`),
   tarjetas con **spotlight + tilt 3D** que siguen al cursor (`SpotlightCard`),
   **botones magnéticos** (`MagneticButton`) y **contadores** que animan al entrar
   en viewport (`CountUp`). Cada uno degrada a estático con `useReducedMotion` y
   **no registra listeners** si el usuario pide menos movimiento.

### Por qué NO se añadió GSAP / Three.js / partículas

ADR-003 los dejaba como opción futura con `next/dynamic`. Se descartan aquí: el
efecto "de otro mundo" se logra con transform/opacity/filter (que la GPU compone
gratis) reutilizando Framer. Meter Three.js/GSAP habría amenazado el presupuesto
de JS y la CSP por poco beneficio marginal.

### Cuidados de accesibilidad y rendimiento tomados

- El resaltado del hero usa `text-gradient-animated`: anima **solo** el color de
  fondo del texto (background-position), nunca opacidad/layout → el LCP no se
  retrasa. El `<h1>` sigue sin animación de entrada.
- El eyebrow de sección **no** se coloreó con el cian de marca (fallaría AA sobre
  el tema claro); el color lo aporta una línea de gradiente decorativa y el texto
  permanece en `text-muted` (AA en ambos temas).
- Spotlight y tilt responden también a `:focus-within`, así que el teclado percibe
  el mismo realce que el ratón.
- El tilt está limitado (≤6°) y todo fondo decorativo vive dentro de contenedores
  `overflow-hidden` (o del `overflow-x: clip` del body) → cero scroll horizontal.
- El marquee se pausa al hover y su copia es `aria-hidden` (`display:contents`)
  para no duplicar contenido al lector de pantalla.

## Consecuencias

- ✅ Salto de impacto visual grande sin nuevas dependencias ni riesgo de CSP.
- ✅ Se mantienen LCP, reduced-motion, no-JS, AA y presupuesto de JS.
- ✅ Primitivas reutilizables (`SpotlightCard`, `MagneticButton`, `Marquee`,
  `CountUp`, `ScrollProgress`) disponibles para futuras secciones/páginas.
- ⚠️ Las tarjetas de sección pasaron de `Card` (server) a `SpotlightCard`
  (client). El coste es marginal (comparten el motor `m.*` ya diferido) pero
  cualquier tarjeta nueva puramente estática puede seguir usando `Card`.
- ⚠️ Los valores de la banda de métricas (`stats.ts`) son ilustrativos y quedan
  pendientes de confirmar con el cliente (§19), igual que los testimonios.
