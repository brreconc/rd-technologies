import { describe, expect, it } from "vitest";
import { heroScenarios, pickScenario } from "./hero-console";

describe("hero-console — escenarios de la consola", () => {
  it("cubre las cuatro plataformas pedidas", () => {
    expect(heroScenarios.map((s) => s.id).sort()).toEqual(["android", "ios", "web", "windows"]);
  });

  it("cada escenario está completo (código, logs, seguridad y resultado)", () => {
    for (const s of heroScenarios) {
      expect(s.label.length).toBeGreaterThan(0);
      expect(s.init.length).toBeGreaterThan(0);
      expect(s.buildCmd.length).toBeGreaterThan(0);
      expect(s.code.length).toBeGreaterThanOrEqual(6);
      expect(s.logs.length).toBeGreaterThanOrEqual(3);
      expect(s.security.length).toBeGreaterThanOrEqual(4);
      expect(s.result.metrics.length).toBeGreaterThanOrEqual(2);
      for (const m of s.result.metrics) {
        expect(m.label.length).toBeGreaterThan(0);
        expect(m.value.length).toBeGreaterThan(0);
      }
    }
  });

  it("pickScenario es determinista con un random inyectado y siempre válido", () => {
    expect(pickScenario(() => 0)).toBe(heroScenarios[0]);
    expect(pickScenario(() => 0.99)).toBe(heroScenarios[heroScenarios.length - 1]);
    for (const r of [0, 0.25, 0.5, 0.75, 0.999]) {
      expect(heroScenarios).toContain(pickScenario(() => r));
    }
  });
});
