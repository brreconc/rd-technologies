# Spacing y layout

## Principios

- **Escala de spacing** basada en múltiplos de 4/8px (la escala por defecto de Tailwind).
- **Contenedores fluidos** con `max-width` + padding seguro; nada con ancho fijo en px que
  pueda desbordar (§5.3).
- **Grid/Flex** con `min-width: 0` en hijos cuando sea necesario para evitar desbordes.

## Pendiente (Fase 1)

- Componente `Container`/`Section` con anchos máximos por breakpoint y padding responsivo.
- Tokens de radios, sombras y z-index nombrados (sin números mágicos).
- Reglas de escalado para TV/4K (`≥2xl`).
