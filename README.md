# R&D Technologies — Landing Page

Landing page corporativa de **R&D Technologies** (desarrollo de software y ciberseguridad).
Construida con Next.js 16 (App Router), React 19, TypeScript estricto y Tailwind CSS v4.

> **Estado:** Fase 0 completada (cimientos). Desarrollo **100% local**; sin despliegue todavía.
> El plan y las decisiones se rigen por [`../DOCS/PROMPT_MAESTRO.md`](../DOCS/PROMPT_MAESTRO.md).

---

## 🚀 Arranque rápido

```bash
# 1. Node correcto (ver .nvmrc)
nvm use            # Node 22 LTS (o >= 20.9)

# 2. Instalar dependencias
pnpm install

# 3. Entorno local (opcional en esta fase)
cp .env.example .env.local

# 4. Desarrollo
pnpm dev           # http://localhost:3000
```

## 📜 Scripts

| Script              | Descripción                               |
| ------------------- | ----------------------------------------- |
| `pnpm dev`          | Servidor de desarrollo (Turbopack).       |
| `pnpm build`        | Build de producción.                      |
| `pnpm start`        | Sirve el build de producción.             |
| `pnpm lint`         | ESLint (incluye reglas de accesibilidad). |
| `pnpm lint:fix`     | ESLint con autofix.                       |
| `pnpm format`       | Prettier (escribe cambios).               |
| `pnpm format:check` | Prettier (solo verifica).                 |
| `pnpm typecheck`    | `tsc --noEmit`.                           |

## 📚 Documentación

Toda la documentación vive en [`docs/`](./docs). Empieza por [`docs/README.md`](./docs/README.md).

- **Cómo empezar:** [`docs/00-getting-started`](./docs/00-getting-started)
- **Arquitectura y decisiones (ADRs):** [`docs/01-architecture`](./docs/01-architecture)
- **Sistema de diseño:** [`docs/02-design-system`](./docs/02-design-system)
- **Responsive / multiplataforma:** [`docs/04-responsive`](./docs/04-responsive)
- **Seguridad:** [`docs/05-security`](./docs/05-security)

## 🧱 Stack principal

Next.js 16 · React 19 · TypeScript (strict) · Tailwind CSS v4 · Framer Motion · next-themes ·
Zod · React Hook Form · Radix/shadcn (próxima fase) · Lucide.

## 📄 Licencia

Propietario — R&D Technologies. Uso interno.
