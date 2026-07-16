# Scripts del proyecto

Definidos en [`package.json`](../../package.json).

| Script         | Comando                | Para qué sirve                                                 |
| -------------- | ---------------------- | -------------------------------------------------------------- |
| `dev`          | `next dev`             | Desarrollo con Turbopack y HMR.                                |
| `build`        | `next build`           | Build de producción optimizada.                                |
| `start`        | `next start`           | Sirve el build de producción (requiere `build` previo).        |
| `lint`         | `eslint`               | Analiza el código (Next core-web-vitals + TS + accesibilidad). |
| `lint:fix`     | `eslint --fix`         | Corrige automáticamente lo que puede.                          |
| `format`       | `prettier --write .`   | Formatea todo el repo.                                         |
| `format:check` | `prettier --check .`   | Falla si algo no está formateado (útil en CI).                 |
| `typecheck`    | `tsc --noEmit`         | Verifica tipos sin emitir archivos.                            |
| `test`         | `vitest run`           | Tests unitarios/componentes (una pasada).                      |
| `test:watch`   | `vitest`               | Tests unitarios en modo watch.                                 |
| `test:e2e`     | `playwright test`      | E2E/responsive/a11y (arranca `pnpm start`; requiere `build`).  |
| `test:a11y`    | `playwright test a11y` | Solo la suite de accesibilidad (axe).                          |
| `lhci`         | `lhci autorun`         | Lighthouse CI con presupuestos (requiere `build`).             |
| `audit`        | `pnpm audit --prod`    | Auditoría de vulnerabilidades de dependencias de producción.   |
| `prepare`      | `husky`                | Instala los git hooks (se ejecuta solo tras `pnpm install`).   |

> **E2E cross-browser:** `ALL_BROWSERS=1 pnpm test:e2e` añade Firefox y WebKit (requieren
> librerías de sistema; en CI: `playwright install --with-deps`). Sin la variable, solo Chromium.

## Git hooks (Husky)

- **`pre-commit`** → ejecuta `lint-staged` (ESLint + Prettier solo sobre lo staged).
- **`commit-msg`** → valida el mensaje con **commitlint** (Conventional Commits).

Formato de commits: `tipo(scope): descripción` — p. ej. `feat(hero): añade CTA principal`.
Tipos válidos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

## Scripts previstos para fases futuras

- `analyze` (bundle analyzer) — opcional.
