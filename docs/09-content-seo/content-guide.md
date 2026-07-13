# Guía de contenido

## Dónde vive el copy

- **Marca y datos globales:** [`src/config/site.ts`](../../src/config/site.ts) (nombre, tagline,
  descripción, navegación, contacto, redes, keywords).
- **Contenido de secciones** (servicios, proceso, FAQ, testimonios): en `src/lib/constants`
  (tipado) — se crea en las Fases 2–3.

El copy oficial de las secciones proviene de `Prompt.md` (brief del cliente). **No inventar
mensajes de marca**; ajustar solo con aprobación.

## Tono

Profesional pero cercano · seguro y tranquilizador · innovador sin tecnicismos · orientado a
soluciones (§8).

## Cómo editar

Cambiar el texto en `config/site.ts` o `lib/constants` — nunca hardcodeado en el JSX. Esto
facilita la edición y una futura internacionalización (i18n, §19.2).

## Pendiente de confirmar (§19)

Datos reales de contacto/redes, testimonios/logos reales vs placeholders.
