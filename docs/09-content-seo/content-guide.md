# Guía de contenido

## Dónde vive el copy

- **Marca y datos globales:** [`src/config/site.ts`](../../src/config/site.ts) (nombre, tagline,
  descripción, navegación, contacto, redes, keywords).
- **Contenido de secciones** (propuesta de valor, servicios, diferenciadores, proceso, casos de
  uso, testimonios, FAQ): tipado en `src/lib/constants` (un archivo por sección). Editar ahí, no
  en el JSX. Los iconos se referencian como componentes de Lucide dentro de cada constante.

El copy oficial de las secciones proviene de `Prompt.md` (brief del cliente). **No inventar
mensajes de marca**; ajustar solo con aprobación.

### Sección "Plataformas" (Fase 10)

Contenido en [`lib/constants/platforms.ts`](../../src/lib/constants/platforms.ts). Responde a la
pregunta que el cliente trae en la cabeza —"¿pueden hacer LO MÍO?"— para los cuatro destinos: **Web,
Android, iOS y Escritorio (Windows · macOS · Linux)**.

Reglas de redacción para esta sección, que es deliberadamente breve:

- **Corto y concreto.** Tres capacidades por destino, cada una en una línea. El cliente no viene a
  leer; viene a comprobar de un vistazo que cubrimos su pantalla.
- **Hablar de resultados, no de tecnología.** El stack va en su propia fila de chips; las
  capacidades hablan de lo que el cliente obtiene ("Publicación y actualizaciones en Google Play",
  no "pipeline de CD con fastlane").
- **Siempre un entregable.** Cada destino cierra con qué recibe el cliente al final ("AAB firmado ·
  Ficha en Google Play"). Es lo que convierte la promesa en algo comprobable.
- Al añadir un destino hay que revisar también el contraste de su acento y el mock-up. El
  procedimiento está en
  [component-catalog](../03-components/component-catalog.md#deck-multiplataforma-sectionsplatforms--fase-10).

> **Nada se retiró al añadirla.** "Plataformas" se intercala entre "Servicios" (qué hacemos) y
> "Por qué elegirnos"; el resto de secciones sigue intacto y en el mismo orden.

## Tono

Profesional pero cercano · seguro y tranquilizador · innovador sin tecnicismos · orientado a
soluciones (§8).

## Cómo editar

Cambiar el texto en `config/site.ts` o `lib/constants` — nunca hardcodeado en el JSX. Esto
facilita la edición y una futura internacionalización (i18n, §19.2).

## Pendiente de confirmar (§19)

Datos reales de contacto/redes, testimonios/logos reales vs placeholders.
