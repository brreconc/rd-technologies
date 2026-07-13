# Scripts del proyecto

Definidos en [`package.json`](../../package.json).

| Script         | Comando              | Para qué sirve                                                 |
| -------------- | -------------------- | -------------------------------------------------------------- |
| `dev`          | `next dev`           | Desarrollo con Turbopack y HMR.                                |
| `build`        | `next build`         | Build de producción optimizada.                                |
| `start`        | `next start`         | Sirve el build de producción (requiere `build` previo).        |
| `lint`         | `eslint`             | Analiza el código (Next core-web-vitals + TS + accesibilidad). |
| `lint:fix`     | `eslint --fix`       | Corrige automáticamente lo que puede.                          |
| `format`       | `prettier --write .` | Formatea todo el repo.                                         |
| `format:check` | `prettier --check .` | Falla si algo no está formateado (útil en CI).                 |
| `typecheck`    | `tsc --noEmit`       | Verifica tipos sin emitir archivos.                            |
| `prepare`      | `husky`              | Instala los git hooks (se ejecuta solo tras `pnpm install`).   |

## Git hooks (Husky)

- **`pre-commit`** → ejecuta `lint-staged` (ESLint + Prettier solo sobre lo staged).
- **`commit-msg`** → valida el mensaje con **commitlint** (Conventional Commits).

Formato de commits: `tipo(scope): descripción` — p. ej. `feat(hero): añade CTA principal`.
Tipos válidos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

## Scripts previstos para fases futuras

- `test`, `test:e2e`, `test:a11y` (Vitest + Playwright + axe) — Fase 6.
- `analyze` (bundle analyzer) — Fase 3/6.
