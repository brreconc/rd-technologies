# Estrategia de QA y testing

Requisito §13. Herramientas se instalan en la **Fase 6** (para mantener la base ligera).

## Niveles

| Nivel              | Herramienta                            | Cubre                                              |
| ------------------ | -------------------------------------- | -------------------------------------------------- |
| Unit / componentes | Vitest + React Testing Library         | Lógica, utils, validadores Zod, render.            |
| E2E funcional      | Playwright                             | Navegación, formularios, CTAs, toggle de tema.     |
| Cross-browser      | Playwright (Chromium, Firefox, WebKit) | Paridad entre motores.                             |
| Responsive         | Playwright (320→4K)                    | **Cero scroll horizontal**, layout por breakpoint. |
| Accesibilidad      | @axe-core/playwright                   | Sin violaciones críticas.                          |
| Performance        | Lighthouse CI                          | Presupuestos CWV y bundle.                         |
| Regresión visual   | Playwright screenshots                 | Cambios visuales no intencionados.                 |

## Definición de "probado"

Una función no está lista hasta pasar sus pruebas **y** verificarse en móvil, tablet, desktop y
TV/4K, en los tres motores.

## Verificación ya realizada (Fase 0, manual)

`pnpm typecheck` ✅ · `pnpm lint` ✅ · `pnpm build` ✅ · `pnpm start` + verificación de cabeceras
de seguridad y render de contenido ✅.
