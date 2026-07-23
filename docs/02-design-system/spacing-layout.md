# Spacing y layout

## Principios

- **Escala de spacing** basada en múltiplos de 4/8px (la escala por defecto de Tailwind).
- **Contenedores fluidos** con `max-width` + padding seguro; nada con ancho fijo en px que
  pueda desbordar (§5.3).
- **Grid/Flex** con `min-width: 0` en hijos cuando sea necesario para evitar desbordes.

## `Container` / `Section`

[`components/ui/container`](../../src/components/ui/container/index.tsx) es la única fuente del
ancho de lectura y de los márgenes laterales:

| Elemento    | Reglas                                                                       |
| ----------- | ---------------------------------------------------------------------------- |
| `Container` | `mx-auto w-full max-w-7xl` + gutter **`px-4` → `sm:px-6` → `lg:px-8`**.      |
| `Section`   | `py-16 sm:py-24` + `scroll-mt-20` (compensa la cabecera fija en las anclas). |

> El gutter de 16px por debajo de `sm` no es cosmético: a 320px es lo que permite que la cabecera
> (logo + switch de tema + menú) y el contenido entren sin scroll horizontal (§5.3.4). Está cubierto
> por [`e2e/responsive.spec.ts`](../../e2e/responsive.spec.ts), que falla si el documento desborda a
> 320, 375, 768, 1280, 1920 o 2560px.

## Pendiente

- Tokens de radios, sombras y z-index nombrados (sin números mágicos).
- Reglas de escalado para TV/4K (`≥2xl`).
