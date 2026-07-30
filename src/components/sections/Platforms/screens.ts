import type { PlatformId } from "@/lib/constants/platforms";

/**
 * Mock-ups de interfaz que "compila" el deck multiplataforma (ADR-013).
 *
 * Se describen como DATOS, no como JSX, por tres motivos:
 *  1. El renderizador es un único `map` — se añade una pantalla nueva sin tocar
 *     el componente.
 *  2. El escalonado de entrada sale del índice del array; no hay retardos
 *     escritos a mano que se desincronicen al editar.
 *  3. Se pueden verificar en un test unitario (`screens.test.ts`) sin montar
 *     nada: que ninguna figura se salga de su `viewBox` es el equivalente aquí
 *     del contrato de "cero desbordamiento" de §5.3.
 *
 * Cada `viewBox` está calculado para la proporción del `frame` de su plataforma
 * en `lib/constants/platforms.ts`; si se cambia una, hay que cambiar la otra.
 */

/** Tono de la figura. `accent` toma el color del destino activo. */
export type Tone = "wire" | "wire2" | "accent";

export type Shape =
  | { t: "rect"; x: number; y: number; w: number; h: number; r?: number; k?: Tone; o?: number }
  | { t: "circle"; x: number; y: number; rad: number; k?: Tone; o?: number };

export interface Screen {
  /** Ancho y alto del `viewBox` (siempre con origen 0 0). */
  vw: number;
  vh: number;
  shapes: Shape[];
  /**
   * Índice a partir del cual las figuras van en la CAPA FLOTANTE, separada en
   * profundidad (`translateZ`) del resto. Es lo que hace que el mock-up se
   * despegue en 3D al mover el puntero sobre el dispositivo.
   */
  floatFrom: number;
}

const rect = (
  x: number,
  y: number,
  w: number,
  h: number,
  r = 4,
  k: Tone = "wire",
  o?: number,
): Shape => ({ t: "rect", x, y, w, h, r, k, ...(o === undefined ? {} : { o }) });

const circle = (x: number, y: number, rad: number, k: Tone = "wire", o?: number): Shape => ({
  t: "circle",
  x,
  y,
  rad,
  k,
  ...(o === undefined ? {} : { o }),
});

/** Navegador de escritorio: cromo, héroe con CTA y una fila de tarjetas. */
const web: Screen = {
  vw: 470,
  vh: 262,
  shapes: [
    rect(0, 0, 470, 28, 0, "wire", 0.5), // barra del navegador
    circle(18, 14, 4, "accent"),
    circle(34, 14, 4, "wire2"),
    circle(50, 14, 4, "wire2"),
    rect(72, 8, 180, 12, 6, "wire2"), // barra de direcciones
    rect(24, 50, 250, 16, 4, "accent"), // titular
    rect(24, 76, 196, 9, 4, "wire2"),
    rect(24, 93, 152, 9, 4, "wire"),
    rect(24, 116, 88, 24, 12, "accent"), // CTA
    rect(300, 46, 146, 96, 8, "wire"), // imagen del héroe
    rect(24, 166, 122, 72, 8, "wire"), // tarjeta 1
    rect(174, 166, 122, 72, 8, "wire"), // tarjeta 2
    rect(324, 166, 122, 72, 8, "wire"), // tarjeta 3
    rect(38, 180, 30, 6, 3, "accent"),
    rect(188, 180, 30, 6, 3, "accent"),
    rect(338, 180, 30, 6, 3, "accent"),
  ],
  // Flotan el CTA, la imagen del héroe y la fila de tarjetas.
  floatFrom: 8,
};

/** Teléfono Android: barra de estado, app bar, lista, FAB y navegación inferior. */
const android: Screen = {
  vw: 236,
  vh: 424,
  shapes: [
    rect(0, 0, 236, 20, 0, "wire", 0.5), // barra de estado
    rect(14, 7, 26, 6, 3, "wire2"),
    rect(196, 7, 8, 6, 2, "wire2"),
    rect(208, 7, 8, 6, 2, "wire2"),
    rect(0, 20, 236, 48, 0, "accent", 0.16), // app bar
    rect(16, 37, 92, 14, 4, "accent"),
    rect(16, 84, 204, 28, 14, "wire"), // buscador
    rect(16, 128, 204, 52, 10, "wire"), // fila 1
    rect(16, 192, 204, 52, 10, "wire"), // fila 2
    rect(16, 256, 204, 52, 10, "wire"), // fila 3
    circle(44, 154, 15, "wire2"),
    circle(44, 218, 15, "wire2"),
    circle(44, 282, 15, "wire2"),
    rect(70, 145, 116, 9, 4, "wire2"),
    rect(70, 160, 78, 7, 3, "wire"),
    rect(70, 209, 116, 9, 4, "wire2"),
    rect(70, 224, 78, 7, 3, "wire"),
    rect(70, 273, 116, 9, 4, "wire2"),
    rect(70, 288, 78, 7, 3, "wire"),
    rect(0, 380, 236, 44, 0, "wire", 0.5), // navegación inferior
    rect(26, 392, 18, 18, 5, "accent"),
    rect(80, 392, 18, 18, 5, "wire2"),
    rect(134, 392, 18, 18, 5, "wire2"),
    rect(188, 392, 18, 18, 5, "wire2"),
    circle(194, 340, 22, "accent"), // FAB
  ],
  // Flotan la navegación inferior y el FAB.
  floatFrom: 19,
};

/** iPhone: isla dinámica, título grande, control segmentado, tarjetas y tab bar. */
const ios: Screen = {
  vw: 236,
  vh: 424,
  shapes: [
    rect(88, 10, 60, 18, 9, "wire2"), // isla dinámica
    rect(18, 50, 124, 18, 5, "accent"), // título grande
    rect(18, 82, 200, 28, 9, "wire"), // control segmentado
    rect(21, 85, 97, 22, 7, "accent", 0.35),
    rect(18, 124, 200, 86, 16, "wire"), // tarjeta 1
    rect(34, 142, 96, 10, 4, "wire2"),
    rect(34, 159, 140, 8, 4, "wire"),
    rect(34, 180, 62, 16, 8, "accent"),
    rect(18, 222, 200, 86, 16, "wire"), // tarjeta 2
    rect(34, 240, 96, 10, 4, "wire2"),
    rect(34, 257, 140, 8, 4, "wire"),
    rect(34, 278, 62, 16, 8, "accent"),
    rect(0, 364, 236, 60, 0, "wire", 0.5), // tab bar
    circle(38, 390, 9, "accent"),
    circle(98, 390, 9, "wire2"),
    circle(158, 390, 9, "wire2"),
    circle(206, 390, 9, "wire2"),
    rect(88, 412, 60, 4, 2, "wire2"), // indicador de inicio
  ],
  // Flotan la tab bar, sus iconos y el indicador de inicio.
  floatFrom: 12,
};

/** Escritorio: barra de título, barra lateral, herramientas, gráfico y tabla. */
const escritorio: Screen = {
  vw: 500,
  vh: 288,
  shapes: [
    rect(0, 0, 500, 26, 0, "wire", 0.5), // barra de título
    rect(16, 9, 90, 8, 4, "wire2"),
    circle(452, 13, 4, "wire2"),
    circle(468, 13, 4, "wire2"),
    circle(484, 13, 4, "accent"),
    rect(0, 26, 112, 262, 0, "wire", 0.35), // barra lateral
    rect(14, 44, 78, 10, 4, "accent"),
    rect(14, 70, 78, 10, 4, "wire2"),
    rect(14, 96, 78, 10, 4, "wire2"),
    rect(14, 122, 78, 10, 4, "wire2"),
    rect(14, 148, 78, 10, 4, "wire2"),
    rect(128, 42, 356, 26, 6, "wire"), // barra de herramientas
    rect(138, 49, 12, 12, 3, "wire2"),
    rect(158, 49, 12, 12, 3, "wire2"),
    rect(178, 49, 12, 12, 3, "wire2"),
    rect(420, 48, 56, 14, 7, "accent"),
    rect(128, 84, 224, 110, 8, "wire"), // panel del gráfico
    rect(368, 84, 116, 52, 8, "wire"), // métrica 1
    rect(368, 144, 116, 50, 8, "wire"), // métrica 2
    rect(128, 206, 356, 14, 4, "wire"), // filas de tabla
    rect(128, 230, 356, 14, 4, "wire"),
    rect(128, 254, 356, 14, 4, "wire"),
    rect(146, 140, 22, 40, 3, "accent", 0.55), // barras del gráfico
    rect(186, 116, 22, 64, 3, "accent", 0.7),
    rect(226, 150, 22, 30, 3, "accent", 0.45),
    rect(266, 102, 22, 78, 3, "accent"),
    rect(306, 128, 22, 52, 3, "accent", 0.6),
    rect(382, 98, 46, 12, 4, "accent"),
    rect(382, 158, 46, 12, 4, "accent"),
  ],
  // Flotan las barras del gráfico y las cifras de las métricas.
  floatFrom: 22,
};

export const screens: Record<PlatformId, Screen> = { web, android, ios, escritorio };
