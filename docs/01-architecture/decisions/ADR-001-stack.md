# ADR-001 — Selección del stack tecnológico

- **Estado:** Aceptada
- **Fecha:** 2026-07-12
- **Decisores:** Arquitecto Senior, Frontend Senior, Performance, AppSec

## Contexto

Landing page corporativa que debe verse impecable en cualquier dispositivo/navegador, ser
segura, accesible y con excelente performance, y quedar documentada para traspaso a otro equipo.
Un borrador previo (DeepSeek) proponía un stack muy amplio y en parte contradictorio.

## Decisión

Stack **estable** (no canary):

- **Next.js 16 (App Router) + React 19** — SSR/RSC, imágenes/fuentes optimizadas, DX madura.
- **TypeScript strict** — seguridad de tipos como requisito (§3).
- **Tailwind CSS v4** — utilidades + tokens en CSS (`@theme`); ver [ADR-004](./ADR-004-tailwind-v4-tokens.md).
- **Framer Motion** como motor de animación principal; ver [ADR-003](./ADR-003-animation-strategy.md).
- **Radix UI + shadcn/ui** (Fase 1) — primitivos accesibles sin reinventar.
- **Zod + React Hook Form** — validación única cliente/servidor.
- **next-themes** — theming (oscuro por defecto, toggle preparado).
- **Lucide** — iconografía.
- Tooling: **ESLint + Prettier + Husky + lint-staged + commitlint**; Vitest/Playwright en Fase 6.
- Gestor: **pnpm**.

## Consecuencias

- ✅ Base moderna, estable y con gran ecosistema.
- ✅ Coherencia con los presupuestos de performance y accesibilidad.
- ⚠️ Next 16 es reciente: se migró `middleware`→`proxy` (ver [ADR-005](./ADR-005-security-headers.md))
  y Tailwind v4 cambia la configuración (ADR-004). Documentado.
- 🔁 Revisar versiones mayores (React/Next) antes del despliegue.
