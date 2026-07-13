# ADR-003 — Estrategia de animación consolidada

- **Estado:** Aceptada
- **Fecha:** 2026-07-12
- **Decisores:** Frontend Senior, Performance, UI

## Contexto

El borrador exigía un bundle `< 200KB` mientras obligaba a usar 6+ librerías de animación
(Framer Motion, GSAP, Three.js, React Spring, React Particles, Lottie, Morph SVG). Eso es
**incompatible** con el presupuesto de performance.

## Decisión

Una arquitectura de motion **coherente y con carga diferida**:

- **Framer Motion** — motor principal (micro-interacciones, reveals, transiciones). ~80% de casos.
- **GSAP + ScrollTrigger** — **solo** para secuencias de scroll complejas; vía `next/dynamic`.
- **Lottie** — íconos/ilustraciones JSON puntuales; lazy-loaded.
- **Three.js / R3F** — opcional, aislado al hero, `next/dynamic` + `ssr:false` + fallback estático.
- **Partículas** — implementación ligera, lazy-loaded, desactivable con `prefers-reduced-motion`.
- ❌ Se elimina **React Spring** (redundante con Framer) y **Morph SVG** como dependencia pesada
  (se logra con SVG + CSS/Framer nativo).

Reglas: nada bloquea el render inicial ni el LCP; todo respeta `prefers-reduced-motion`.

## Consecuencias

- ✅ Impacto visual alto sin romper el presupuesto de JS inicial.
- ✅ Degradación elegante en gama baja / datos reducidos.
- ⚠️ Cada librería pesada que se active debe justificar su coste midiendo antes/después (Fase 3).
