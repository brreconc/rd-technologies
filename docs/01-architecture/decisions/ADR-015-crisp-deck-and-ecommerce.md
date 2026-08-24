# ADR-015 — Nitidez del mock-up, bisel del dispositivo y el destino E-commerce

- **Estado:** Aceptada
- **Fecha:** 2026-08-24
- **Fase:** 12
- **Sustituye parcialmente:** [ADR-013 §3](./ADR-013-platform-deck.md) (la inclinación 3D del dispositivo)

## Contexto

Tres cosas, encontradas por el cliente al usar el deck de la Fase 11:

1. **Al pasar el puntero por encima, el mock-up perdía definición.** Justo al revés de lo que debe
   pasar: acercarse a mirar tiene que dar MÁS detalle, no menos.
2. **En Android e iOS el borde curvo del teléfono se comía la información** de la barra de estado y
   de la navegación inferior.
3. Faltaba un destino: el catálogo no cubría **E-commerce**, que es una de las peticiones más
   frecuentes y no se responde bien con "Web".

El primer punto se midió antes de tocar nada, comparando la matriz de transformación en reposo y con
el puntero encima:

```
REPOSO  matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, -0.0009, 0, 0, 0, 1)   → identidad
HOVER   matrix3d(0.993961, 0.010327, -0.109249, …)                        → rotación 3D real
```

Y con capturas a 3× de densidad, que confirmaron que el texto de 6–10 px pasaba de nítido a borroso.

## Decisión

### 1. El dispositivo deja de inclinarse en 3D

**Causa raíz.** Chromium promociona a capa propia todo elemento con transformación 3D, lo rasteriza
**una sola vez** y luego deja que la GPU remuestree esa textura para cada fotograma de la rotación.
El resultado es aceptable en superficies grandes y desastroso en tipografía de 6–10 px, que es
exactamente de lo que está hecho el interior del mock-up.

**No tiene arreglo por ajuste.** No hay `will-change`, `backface-visibility` ni truco de escala que
suba la resolución de esa textura: el factor de rasterizado se deriva de la matriz hacia pantalla, y
para una rotación pura no pasa de 1. Mientras haya `rotateX`/`rotateY` sobre el elemento que contiene
el texto, el remuestreo ocurre. Se descartó, por tanto, conservar la inclinación.

**Qué la sustituye.** La respuesta al puntero se reparte entre capas donde el remuestreo no se nota,
y gana información en el cambio:

| Capa               | Qué hace ahora                                                                 |
| ------------------ | ------------------------------------------------------------------------------ |
| `.deck-floor-wrap` | Paralaje del suelo en perspectiva (±22 px). Es un degradado: da igual el filo. |
| `.deck-stage-glow` | Sigue al puntero, como ya hacía.                                               |
| `.deck-cross`      | **Mira de inspección**: dos filetes de 1px y una lectura `x … · y …`.          |
| `.deck-device`     | Se enciende el canto (borde y luz), **sin ninguna transformación**.            |

La mira es el cambio que hace que esto sea una mejora y no una renuncia: en vez de deformar la
imagen, **mide sobre ella** —en píxeles nominales del destino, coherente con la cota de ADR-014—, que
es el lenguaje de toda la sección. Se escribe por `ref` y no por estado: pasarla por React
re-renderizaría el deck entero a 60 Hz mientras se mueve el ratón.

**Regla que queda en vigor:** `.deck-device` no admite `transform` de ningún tipo. Está escrita en el
CSS junto a la clase y protegida por un E2E que comprueba la matriz calculada con el puntero encima.

### 2. El dispositivo tiene bisel

`.deck-screen` se mete hacia dentro `clamp(3px, 1.9cqw, 9px)` en los destinos de esquina redonda, y
su radio es el del marco menos ese bisel. El hueco que queda muestra el fondo del dispositivo, así
que se lee como el marco físico del aparato. Sobre eso, las barras que viven en la primera y la
última fila (`.mk-status`, `.mk-navbar`, `.mk-tabbar`, `.mk-ec-pay`) llevan un margen lateral extra:
una esquina de radio R recorta un arco de radio R, y sin ese margen la hora y la batería caen dentro.

En unidades de contenedor a propósito: un teléfono tiene marco de teléfono a 320 px y a 4K.

### 3. E-commerce entra como segundo destino

Se coloca entre Web y Android, con acento propio `#ff5f9e` y un mock-up de **escaparate en tablet
vertical** (834 × 1194) que no se parece a ninguno de los otros cuatro: cabecera con carrito,
campaña, filtros, rejilla de producto con precio tachado y barra de existencias, y barra de pago
fija. Es el único mock-up con animación propia —el contador del carrito y el aviso "añadido al
carrito", sincronizados— porque es el único destino cuyo argumento es la **conversión**.

La ficha del producto **no lleva fotografía**: un plano de color con la geometría del artículo. Un
pantallazo inventado mentiría sobre trabajo que no existe (§19).

## Defectos corregidos por el camino

| Defecto                                                                                                                                                                                                                                                                                                    | Corrección                                                                                                                                     |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **El recorrido automático dejó de arrancar.** El observador pedía ver el 30% del deck, y esa fracción tiene como techo `alturaVentana/alturaDeck`. Con el quinto destino el deck pasó a 821 px contra 720 px de ventana: máximo alcanzable 0,293 frente a un umbral de 0,3. **Inalcanzable para siempre.** | `rootMargin: "-20% 0px -20% 0px"` con `threshold: 0`: la condición pasa a ser de POSICIÓN, no de tamaño. E2E con ventana más baja que el deck. |
| La lectura de la mira se salía por el borde del escenario.                                                                                                                                                                                                                                                 | `clamp()` sobre `top`/`left`, resuelto contra el propio campo.                                                                                 |
| "E-commerce" se partía por el guion, y a dos columnas no cabía en un teléfono.                                                                                                                                                                                                                             | Una sola columna por debajo de `sm`; `white-space: nowrap` en el rótulo.                                                                       |
| Android dejaba un hueco muerto entre la última tarjeta y la navegación, y truncaba dos títulos.                                                                                                                                                                                                            | Seis filas y rótulos cortos, con el porqué escrito en el propio archivo.                                                                       |

## Consecuencias

**A favor**

- El mock-up es **nítido al píxel en todo momento**, también con el puntero encima. Verificado por
  capturas a 3× y por E2E sobre la matriz calculada.
- La respuesta al puntero **añade** información en vez de degradarla.
- El interior de los teléfonos ya no lo recorta el marco.
- Se corrigió, de paso, un fallo de accesibilidad que habría pasado inadvertido: en cualquier portátil
  con la ventana algo más baja que el deck, el recorrido automático no arrancaba.
- Lighthouse se mantiene: **99 · 100 · 96 · 100**, LCP 0,9 s, **CLS 0 en las tres pasadas**, TBT 0 ms.

**En contra / riesgos asumidos**

- **Se pierde la inclinación 3D.** Era vistosa, y no hay forma de conservarla sin el desenfoque. La
  mira es una respuesta distinta, no la misma con otro nombre.
- El rail ocupa más alto en móvil (cinco filas de una columna en vez de una rejilla). Se prefirió eso
  a recortar el nombre de un destino.
- Un quinto destino alarga el recorrido automático completo a 35 s. Sigue siendo detenible.

## Accesibilidad (§10)

- La mira es decorativa (`aria-hidden`) y solo aparece en `(hover: hover)`: no añade nada que un
  teclado o una pantalla táctil deban alcanzar.
- Las animaciones nuevas del escaparate (`mk-ec-badge`, `mk-ec-toast`, `mk-ec-cta`) se anulan enteras
  con `prefers-reduced-motion`, dejando el aviso **visible y quieto** en vez de invisible.
- El acento `#ff5f9e` supera AA sobre `#0a0a0a`. Verificado con axe en E2E.

## Alternativas descartadas

| Alternativa                                              | Por qué no                                                                                                     |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Conservar la inclinación y "afinarla" con `will-change`  | El factor de rasterizado sale de la matriz hacia pantalla; no hay propiedad que lo suba para una rotación.     |
| Dibujar el mock-up al doble y reducirlo con `scale(0.5)` | Chromium calcula el rasterizado contra la transformación acumulada: mismos téxeles, cero ganancia.             |
| Inclinar solo el marco y dejar la pantalla plana         | Se despegan visualmente; el efecto pasa de sofisticado a roto.                                                 |
| Reducir la inclinación a 3°                              | El remuestreo no es proporcional al ángulo: con 3° el texto pequeño ya se ensucia.                             |
| E-commerce como una variante del mock-up Web             | Es la pregunta que más se repite; responderla con la misma pantalla de siempre desaprovecha la sección entera. |
| Foto de producto real en la ficha                        | No hay proyectos publicables (§19); un pantallazo inventado miente, un esquema no.                             |

## Referencias

- [ADR-014](./ADR-014-instrument-deck.md) — el deck como instrumento; esta ADR mantiene todo lo demás.
- [ADR-013](./ADR-013-platform-deck.md) — el deck original; esta ADR sustituye su §3.
- [ADR-011](./ADR-011-secure-system-scenography.md) — regla de oro de hidratación.
- [`docs/03-components/component-catalog.md`](../../03-components/component-catalog.md)
- [`docs/02-design-system/motion.md`](../../02-design-system/motion.md)
