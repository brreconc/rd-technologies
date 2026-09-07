# Guía de contenido

## Dónde vive el copy

- **Marca y datos globales:** [`src/config/site.ts`](../../src/config/site.ts) (nombre, tagline,
  descripción, navegación, contacto, redes, keywords).
- **Contenido de secciones** (propuesta de valor, servicios, diferenciadores, proceso, casos de
  uso, testimonios, FAQ): tipado en `src/lib/constants` (un archivo por sección). Editar ahí, no
  en el JSX. Los iconos se referencian como componentes de Lucide dentro de cada constante.

El copy oficial de las secciones proviene de `Prompt.md` (brief del cliente). **No inventar
mensajes de marca**; ajustar solo con aprobación.

> **Excepción registrada (Fase 14).** El copy de "Propuesta de valor" **se reescribió a petición
> expresa del cliente**. Queda anotado aquí para que quien recoja el proyecto sepa que ese texto ya
> no es el de `Prompt.md`. Ver [ADR-017](../01-architecture/decisions/ADR-017-value-props-manifesto.md).

### Sección "Propuesta de valor" (Fase 14)

Contenido en [`lib/constants/value-props.ts`](../../src/lib/constants/value-props.ts). Es el
**manifiesto**: lo primero que se lee después del hero, y lo único que hay que leer para entender
quién es la empresa.

La regla que fija el reparto con la sección siguiente, y que es la razón de ser de esta:

> **"Propuesta de valor" cuenta el CRITERIO. "Servicios" cuenta el CATÁLOGO.**

Antes no era así: los tres pilares de aquí se llamaban _Desarrollo_, _Seguridad_ y _Soporte_, que es
literalmente lo que "Servicios" despliega diez centímetros más abajo. Ahora los tres estratos hablan
de **cómo se trabaja** (_a medida, no de plantilla_; _seguro desde el diseño_; _preparado para
crecer_), no de qué se vende. Hay un test que falla si los títulos vuelven a solaparse.

Reglas de redacción:

- **El titular, 10 palabras como mucho**, y con las tres ideas dentro (a medida · seguro · escala).
  `value-props.test.ts` lo comprueba.
- **La entradilla, dos frases y 40 palabras como mucho.** El copy anterior tenía 73 en un solo
  párrafo y era el motivo de rehacer la sección; el tope existe para que no vuelva a crecer.
- **Una línea por estrato, 16 palabras como mucho.** Si una descripción necesita dos líneas, la idea
  es demasiado grande para esta sección y pertenece a "Servicios".
- **El fragmento resaltado del titular** (`highlight`) tiene que aparecer _tal cual_ en `title`. Si
  no, no se resalta nada y el fallo es silencioso — por eso hay un test.
- **Los tres acentos se usan como color de texto** en los ordinales, así que cualquier color nuevo
  tiene que superar 4.5:1 sobre `--bg`. El test lo calcula.
- **Son afirmaciones sin prueba, y hay que tratarlas como tales.** Nada de cifras ni de nombres de
  cliente aquí mientras no haya casos reales (§19).

### Sección "Plataformas" (Fases 10–11)

Contenido en [`lib/constants/platforms.ts`](../../src/lib/constants/platforms.ts). Responde a la
pregunta que el cliente trae en la cabeza —"¿pueden hacer LO MÍO?"— para los cinco destinos: **Web,
E-commerce, Android, iOS y Escritorio (Windows · macOS · Linux)**.

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
  [component-catalog](../03-components/component-catalog.md#deck-multiplataforma-sectionsplatforms--fases-10-y-11).

> **Nada se retiró al añadirla.** "Plataformas" se intercala entre "Servicios" (qué hacemos) y
> "Por qué elegirnos"; el resto de secciones sigue intacto y en el mismo orden.

#### El texto de dentro de los mock-ups

Los mock-ups del dispositivo llevan etiquetas en español ("Ruta de reparto 12", "bascula-01",
"Compilación completada · 4 módulos"). Dos reglas, y son importantes:

1. **Son ambientación, nunca una afirmación.** No pueden nombrar clientes reales, ni dar cifras que
   suenen a resultados nuestros, ni prometer nada. Si una frase de un mock-up se pudiera citar en
   una reunión comercial, sobra.
2. **Nada de _lorem ipsum_.** Es exactamente lo que hacía que la versión anterior se leyera como una
   maqueta sin terminar. Etiquetas plausibles y del dominio, siempre.
3. **Cortas, porque la columna es estrecha.** Dentro de un teléfono compiten con el icono y con la
   etiqueta de estado; cualquier rótulo largo acaba en puntos suspensivos, que se lee como un fallo.
   Si hace falta, se acorta el texto antes que estrechar la etiqueta.
4. **Los precios y los datos del escaparate son ambientación, igual que el resto.** Ningún importe,
   descuento ni valoración de `EcommerceMockup` describe una oferta real.

> Al generar diseño con herramientas de IA, revisa el copy línea por línea antes de portarlo: en
> este proyecto una de ellas coló "seguridad de grado bancario", una afirmación que no podemos
> sostener y que en una empresa de ciberseguridad nos pueden exigir demostrar. El copy sale de
> `platforms.ts` y solo de ahí.

## Tono

Profesional pero cercano · seguro y tranquilizador · innovador sin tecnicismos · orientado a
soluciones (§8).

## Cómo editar

Cambiar el texto en `config/site.ts` o `lib/constants` — nunca hardcodeado en el JSX. Esto
facilita la edición y una futura internacionalización (i18n, §19.2).

## Pendiente de confirmar (§19)

Datos reales de contacto/redes, testimonios/logos reales vs placeholders.
