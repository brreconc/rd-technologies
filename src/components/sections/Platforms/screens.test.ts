import { describe, it, expect } from "vitest";
import { screens, type Shape } from "./screens";
import { platforms } from "@/lib/constants/platforms";

/**
 * Los mock-ups son datos puros, así que se validan sin montar nada (ni jsdom ni
 * SVG). Lo que se protege aquí es lo que se rompe al editarlos a ojo: figuras
 * que sobresalen del `viewBox` y `viewBox` que dejan de cuadrar con la
 * proporción del dispositivo (el mock-up saldría deformado o descentrado).
 */

/** Caja envolvente de una figura, en coordenadas del `viewBox`. */
function bounds(shape: Shape) {
  return shape.t === "rect"
    ? { x1: shape.x, y1: shape.y, x2: shape.x + shape.w, y2: shape.y + shape.h }
    : {
        x1: shape.x - shape.rad,
        y1: shape.y - shape.rad,
        x2: shape.x + shape.rad,
        y2: shape.y + shape.rad,
      };
}

describe("mock-ups del deck multiplataforma", () => {
  it("hay una pantalla por plataforma", () => {
    expect(Object.keys(screens).sort()).toEqual(platforms.map((p) => p.id).sort());
  });

  for (const platform of platforms) {
    describe(platform.id, () => {
      const screen = screens[platform.id];

      it("ninguna figura se sale del viewBox", () => {
        const desbordan = screen.shapes
          .map((shape, index) => ({ index, ...bounds(shape) }))
          .filter((b) => b.x1 < 0 || b.y1 < 0 || b.x2 > screen.vw || b.y2 > screen.vh);
        expect(desbordan, `viewBox 0 0 ${screen.vw} ${screen.vh}`).toEqual([]);
      });

      it("no hay figuras degeneradas (ancho o alto cero)", () => {
        for (const shape of screen.shapes) {
          if (shape.t === "rect") {
            expect(shape.w).toBeGreaterThan(0);
            expect(shape.h).toBeGreaterThan(0);
          } else {
            expect(shape.rad).toBeGreaterThan(0);
          }
        }
      });

      it("la capa flotante existe y no está vacía", () => {
        expect(screen.floatFrom).toBeGreaterThan(0);
        expect(screen.floatFrom).toBeLessThan(screen.shapes.length);
      });

      it("el viewBox cuadra con la proporción del dispositivo", () => {
        // `frame.width/height` son porcentajes del escenario, cuya proporción
        // está fijada en el componente (`STAGE_RATIO`). Si el viewBox se
        // desviara, `preserveAspectRatio` dejaría márgenes visibles a los lados.
        const STAGE_RATIO = 10 / 9; // ancho / alto del escenario
        const pct = (value: string) => Number.parseFloat(value) / 100;
        const deviceRatio = (pct(platform.frame.width) * STAGE_RATIO) / pct(platform.frame.height);
        const viewBoxRatio = screen.vw / screen.vh;
        expect(Math.abs(deviceRatio - viewBoxRatio)).toBeLessThan(0.06);
      });
    });
  }
});
