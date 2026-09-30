# ADR-012 — Tema oscuro único (se retira el tema claro)

- **Estado:** Aceptada
- **Fecha:** 2026-07-30
- **Fase:** 10
- **Sustituye parcialmente a:** [ADR-006](./ADR-006-fase1-defaults.md) (que decidió incluir tema claro)

## Contexto

Desde la Fase 1 el sitio ofrecía dos temas —oscuro por defecto y claro— con la paleta declarada
por indirección (`:root, .dark` y `.light` en `globals.css`), `next-themes` alternando la clase en
`<html>` y un `ThemeToggle` en la cabecera.

Esa decisión tenía sentido cuando el sitio era sobre todo texto. Dejó de tenerlo a partir de la
Fase 8: la identidad de R&D Technologies se construyó sobre **luz sobre negro** —malla neuronal en
`<canvas>`, resplandores, degradados de acento, esquinas de HUD, barridos de radar—. En claro, todo
ese lenguaje o desaparece o hay que reinventarlo, y mantener los dos mundos salía caro:

- **Coste de diseño doble.** Cada efecto nuevo había que calibrarlo dos veces. El canvas del hero
  llevaba una rama de color por tema y un `MutationObserver` vigilando la clase de `<html>`.
- **Coste de verificación doble.** La suite de axe auditaba las dos paletas; cada contraste se
  validaba dos veces.
- **Coste en el cliente.** `next-themes` es JavaScript en el bundle crítico más un script inline
  anti-parpadeo en el `<head>`, que además había que firmar con el nonce de la CSP.
- **Riesgo real.** El tema claro era el camino menos recorrido: se probaba menos y se veía menos,
  así que era donde más fácil se colaba una regresión.

## Decisión

**El sitio tiene un único tema, oscuro.** Se retiran el tema claro, el alternador y la dependencia
`next-themes`.

Concretamente:

- `globals.css` declara la paleta una sola vez en `:root`, con `color-scheme: dark`. Desaparecen el
  bloque `.light` y el `@custom-variant dark` (no se usaba en ningún componente).
- `providers.tsx` se queda solo con `LazyMotion` + `MotionConfig`. Sin proveedor de tema.
- Se elimina `components/shared/ThemeToggle`.
- El `viewport` del layout declara un único `themeColor` (`#0a0a0a`) y `colorScheme: "dark"`.
- El canvas del hero pierde su rama por tema, el `readTheme()` y el `MutationObserver`. Los colores
  de las aristas pasan a ser la constante `EDGE`.

**La indirección por variables se mantiene.** Los componentes siguen usando `bg-background`,
`text-foreground`, `border-border`… nunca colores literales. Cambiar la paleta —o reintroducir un
tema mañana— sigue siendo editar un bloque de `globals.css`, no rastrear componentes.

## Consecuencias

**A favor**

- Una sola paleta que diseñar, calibrar y auditar. El presupuesto de atención va a un único
  resultado, que es el que se enseña al cliente.
- Menos JavaScript en el bundle crítico y un script inline menos en el `<head>` (una superficie
  menos que cubrir con el nonce de la CSP, §9).
- El canvas del hero pierde un observador del DOM y una rama de estado.
- La marca queda inequívoca: R&D Technologies se ve siempre igual.

**En contra / riesgos asumidos**

- **Se pierde la preferencia de tema del usuario.** Quien prefiera fondos claros no tiene opción.
  Se asume conscientemente: es una landing comercial de una sola pantalla de lectura, no una
  herramienta de uso prolongado.
- `prefers-color-scheme: light` se ignora. `color-scheme: dark` avisa al navegador para que pinte
  en oscuro los controles nativos, las barras de desplazamiento y el autocompletado del formulario,
  de modo que no aparezcan cajas blancas dentro de la interfaz.
- **Esto NO reduce la exigencia de contraste.** Sigue siendo obligatorio WCAG 2.2 AA (§10) sobre la
  paleta oscura, y sigue verificándose con axe en E2E. Un tema único no es una excusa: es un tema
  menos donde equivocarse.

## Alternativas descartadas

| Alternativa                                      | Por qué no                                                                                                                                              |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mantener los dos temas                           | Duplica el trabajo de diseño y verificación de cada efecto nuevo, sobre un tema que casi nadie usaba y que por eso mismo acumulaba riesgo de regresión. |
| Conservar `next-themes` con `forcedTheme="dark"` | Deja la dependencia, su JavaScript y su script inline en el sitio a cambio de nada: si solo hay un tema, no hay nada que alternar ni que persistir.     |
| Tema claro solo para impresión                   | No hay caso de uso: nadie imprime una landing. Si apareciera, se resuelve con `@media print` sin necesidad de un segundo tema completo.                 |

## Verificación

- E2E `home.spec.ts` → "el sitio se sirve con la paleta oscura única": comprueba el contrato
  observable (`color-scheme: dark`, fondo `#0a0a0a`) y que **no existe** ningún `role="switch"` de
  tema. Si alguien reintrodujera un alternador sin actualizar esta decisión, el test lo cazaría.
- E2E `a11y.spec.ts`: el escaneo de axe queda en una sola paleta, pero se amplía para auditar
  también el deck multiplataforma en su último destino (ADR-013), donde el acento cambia.
- Lighthouse tras el cambio: Performance 99 · Accessibility 100 · Best Practices 96 · SEO 100.

## Referencias

- [ADR-004](./ADR-004-tailwind-v4-tokens.md) — tokens en CSS con Tailwind v4 (la indirección se mantiene).
- [ADR-006](./ADR-006-fase1-defaults.md) — decisión original de incluir tema claro.
- [ADR-009](./ADR-009-csp-nonce.md) — CSP con nonce; el script inline de `next-themes` era uno de sus clientes.
- [`docs/02-design-system/colors-and-tokens.md`](../../02-design-system/colors-and-tokens.md)
