import { describe, expect, it } from "vitest";
import { processSteps, TRAVEL_MS, DWELL_MS } from "./process";

/** Canal sRGB a luminancia lineal (WCAG 2.x). */
const linear = (channel: number) => {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};

const luminance = (hex: string) => {
  const n = Number.parseInt(hex.slice(1), 16);
  return (
    0.2126 * linear((n >> 16) & 255) + 0.7152 * linear((n >> 8) & 255) + 0.0722 * linear(n & 255)
  );
};

const contrast = (hex: string, background: string) => {
  const a = luminance(hex);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

/** Fondo de la página (`--bg` en globals.css). */
const BG = "#0a0a0a";

describe("pasos del proceso", () => {
  it("son los seis de §8.5, sin títulos repetidos", () => {
    expect(processSteps).toHaveLength(6);
    expect(new Set(processSteps.map((s) => s.title)).size).toBe(6);
  });

  it.each(processSteps)("$title tiene el contenido que la tarjeta espera", (step) => {
    expect(step.title.length).toBeGreaterThan(0);
    expect(step.description.length).toBeGreaterThan(0);
    expect(step.description.endsWith(".")).toBe(true);
  });

  /**
   * El acento de cada paso NO es decorativo: se usa como color de TEXTO en el
   * rótulo de la tarjeta ("PASO 03") y en el título bajo el hito. Si alguien
   * añade un color bonito pero flojo, ese texto baja de AA sin que se note a
   * simple vista sobre negro. Este test lo impide.
   */
  it.each(processSteps)("$title usa un acento legible sobre el fondo (AA)", (step) => {
    expect(step.accent).toMatch(/^#[0-9a-f]{6}$/);
    expect(contrast(step.accent, BG)).toBeGreaterThanOrEqual(4.5);
  });

  it("da a cada paso un color propio, y el conjunto recorre el espectro", () => {
    const accents = processSteps.map((s) => s.accent);
    expect(new Set(accents).size).toBe(6);
    // Dos pasos consecutivos nunca comparten color: si lo hicieran, el tramo
    // entre ellos no tendría degradado y el viaje se leería como una pausa.
    for (let i = 1; i < accents.length; i++) {
      expect(accents[i]).not.toBe(accents[i - 1]);
    }
  });
});

describe("ritmo del recorrido", () => {
  it("deja tiempo de sobra para leer cada paso", () => {
    // El vuelo tiene que ser perceptible pero no lento, y la parada tiene que
    // permitir leer una frase entera antes de continuar.
    expect(TRAVEL_MS).toBeGreaterThanOrEqual(400);
    expect(TRAVEL_MS).toBeLessThanOrEqual(1200);
    expect(DWELL_MS).toBeGreaterThanOrEqual(2500);
  });

  it("recorre los seis pasos en menos de medio minuto", () => {
    // Si una vuelta completa se alargara, el visitante que llega al final de la
    // página nunca habría visto el proceso entero.
    const vuelta = (TRAVEL_MS + DWELL_MS) * processSteps.length;
    expect(vuelta).toBeLessThan(30_000);
  });
});
