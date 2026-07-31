import { describe, expect, it } from "vitest";
import { platforms, defaultPlatformId, deviceFrame, STAGE_RATIO } from "./platforms";

const pct = (value: string) => Number.parseFloat(value);

describe("catálogo de plataformas", () => {
  it("cubre los cuatro destinos, sin identificadores repetidos", () => {
    expect(platforms).toHaveLength(4);
    expect(new Set(platforms.map((p) => p.id)).size).toBe(4);
  });

  it("arranca en un destino que existe", () => {
    expect(platforms.some((p) => p.id === defaultPlatformId)).toBe(true);
  });

  it("da a cada destino un acento propio y válido", () => {
    const accents = platforms.map((p) => p.accent);
    expect(new Set(accents).size).toBe(4);
    for (const accent of accents) expect(accent).toMatch(/^#[0-9a-f]{6}$/);
  });

  it.each(platforms)("$label tiene el contenido que el panel espera", (platform) => {
    expect(platform.label.length).toBeGreaterThan(0);
    expect(platform.kicker.length).toBeGreaterThan(0);
    expect(platform.headline.length).toBeGreaterThan(0);
    expect(platform.description.length).toBeGreaterThan(0);
    // Tres capacidades: la retícula del panel está pensada para exactamente tres.
    expect(platform.capabilities).toHaveLength(3);
    expect(platform.stack.length).toBeGreaterThanOrEqual(3);
    expect(platform.deliverable).toContain("·");
  });
});

describe("geometría del dispositivo", () => {
  /**
   * El corazón del deck: el rótulo de cota anuncia una resolución y el marco
   * debe tener EXACTAMENTE esa proporción. Si alguien toca una y no la otra, el
   * instrumento estaría mintiendo y este test lo impide.
   */
  it.each(platforms)("$label se dibuja con la proporción que anuncia", (platform) => {
    const frame = deviceFrame(platform);
    // Proporción real dentro del escenario, que no es cuadrado.
    const drawn = (pct(frame.width) * STAGE_RATIO) / pct(frame.height);
    const declared = platform.readout.w / platform.readout.h;
    expect(drawn).toBeCloseTo(declared, 5);
  });

  it.each(platforms)("$label cabe dentro del escenario", (platform) => {
    const frame = deviceFrame(platform);
    expect(pct(frame.width)).toBeGreaterThan(0);
    expect(pct(frame.width)).toBeLessThanOrEqual(100);
    expect(pct(frame.height)).toBeGreaterThan(0);
    expect(pct(frame.height)).toBeLessThanOrEqual(100);
  });

  it("distingue apaisados de verticales", () => {
    const orientation = (id: string) => {
      const platform = platforms.find((p) => p.id === id)!;
      return platform.readout.w > platform.readout.h ? "apaisado" : "vertical";
    };
    expect(orientation("web")).toBe("apaisado");
    expect(orientation("escritorio")).toBe("apaisado");
    expect(orientation("android")).toBe("vertical");
    expect(orientation("ios")).toBe("vertical");
  });

  it("solo redondea las esquinas de los teléfonos", () => {
    const radius = Object.fromEntries(platforms.map((p) => [p.id, p.fit.radius]));
    expect(radius.web).toBe(0);
    expect(radius.escritorio).toBe(0);
    expect(radius.android).toBeGreaterThan(0);
    expect(radius.ios).toBeGreaterThan(0);
  });
});
