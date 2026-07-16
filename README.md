# R&D Technologies — Landing Page

Landing page corporativa de **R&D Technologies** (desarrollo de software y ciberseguridad).
Construida con Next.js 16 (App Router), React 19, TypeScript estricto y Tailwind CSS v4.

> **Estado:** Fases 0–7 completadas. Landing completa, probada y **dockerizada**, lista para que
> el equipo la despliegue a producción (ver la sección **Despliegue** más abajo).
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
| `pnpm test`         | Tests unitarios (Vitest).                 |
| `pnpm test:e2e`     | E2E/responsive/a11y (Playwright).         |
| `pnpm lhci`         | Lighthouse CI (presupuestos).             |
| `pnpm audit`        | Auditoría de dependencias de producción.  |

## 🐳 Despliegue (producción)

El proyecto está **dockerizado**. Para levantarlo:

```bash
cp .env.production.example .env     # editar: dominio real, INDEXABLE=true, ...
docker compose up -d --build
curl http://localhost:3000/api/health
```

> ⚠️ Las variables `NEXT_PUBLIC_*` (dominio, indexación) se **hornean en el build**: si las
> cambias, reconstruye la imagen. Guía completa (reverse proxy, secretos, escalado, checklist):
> **[`docs/10-deployment/future-deployment.md`](./docs/10-deployment/future-deployment.md)**.

## 📚 Documentación

Toda la documentación vive en [`docs/`](./docs). Empieza por [`docs/README.md`](./docs/README.md).

- **Cómo empezar:** [`docs/00-getting-started`](./docs/00-getting-started)
- **Arquitectura y decisiones (ADRs):** [`docs/01-architecture`](./docs/01-architecture)
- **Sistema de diseño:** [`docs/02-design-system`](./docs/02-design-system)
- **Responsive / multiplataforma:** [`docs/04-responsive`](./docs/04-responsive)
- **Seguridad:** [`docs/05-security`](./docs/05-security)
- **Testing / QA:** [`docs/08-testing`](./docs/08-testing)
- **Despliegue (Docker):** [`docs/10-deployment`](./docs/10-deployment)

## 🧱 Stack principal

Next.js 16 · React 19 · TypeScript (strict) · Tailwind CSS v4 · Framer Motion · next-themes ·
Zod · React Hook Form · Radix/shadcn (próxima fase) · Lucide.

## 📄 Licencia

Propietario — R&D Technologies. Uso interno.
