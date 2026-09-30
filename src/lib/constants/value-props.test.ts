import { describe, expect, it } from "vitest";
import { valueProps } from "./value-props";
import { services } from "./services";

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

const words = (text: string) => text.split(/\s+/).filter(Boolean).length;

describe("propuesta de valor", () => {
  /**
   * El motivo de rehacer la sección fue justamente este: 73 palabras en un
   * párrafo centrado que nadie termina de leer. El tope evita que el copy
   * vuelva a crecer sin que nadie se dé cuenta.
   */
  it("dice lo suyo en pocas palabras", () => {
    expect(words(valueProps.title)).toBeLessThanOrEqual(10);
    expect(words(valueProps.lead)).toBeLessThanOrEqual(40);
  });

  /**
   * `TextReveal` parte el titular por palabras y solo tiñe el fragmento si lo
   * encuentra TAL CUAL. No falla si no está —simplemente no resalta nada—, así
   * que sin esta prueba una errata pasaría desapercibida en silencio.
   */
  it("resalta un fragmento que existe de verdad en el titular", () => {
    expect(valueProps.title).toContain(valueProps.highlight);
  });

  it("tiene tres estratos, en orden y sin repetir etiqueta", () => {
    expect(valueProps.strata).toHaveLength(3);
    expect(new Set(valueProps.strata.map((s) => s.tag)).size).toBe(3);
    expect(new Set(valueProps.strata.map((s) => s.title)).size).toBe(3);
  });

  it.each(valueProps.strata)("$tag tiene el contenido que la fila espera", (stratum) => {
    expect(stratum.title.length).toBeGreaterThan(0);
    expect(stratum.description.endsWith(".")).toBe(true);
    // La descripción es UNA línea: si crece, la fila deja de leerse de un vistazo.
    expect(words(stratum.description)).toBeLessThanOrEqual(16);
  });

  /**
   * El acento de cada estrato se usa como color de TEXTO en su ordinal
   * (`01`, `02`…) sobre el fondo de la página, así que le aplica el 4.5:1 de
   * AA. El `#8b5cf6` de la paleta base se queda en 4.68 y no sobrevive a un
   * fondo levemente más claro; por eso el estrato de seguridad usa el mismo
   * violeta claro que ya emplea el recorrido del proceso.
   */
  it.each(valueProps.strata)("$tag tiene un acento legible sobre el fondo", (stratum) => {
    expect(contrast(stratum.accent, BG)).toBeGreaterThanOrEqual(4.5);
  });

  it("no repite dos veces el mismo acento", () => {
    expect(new Set(valueProps.strata.map((s) => s.accent)).size).toBe(3);
  });

  /**
   * La razón de ser de esta sección es NO ser un adelanto de "Servicios".
   * Antes ambas se titulaban con las mismas tres palabras (Desarrollo,
   * Seguridad, Soporte) y la primera sobraba. Si alguien vuelve a alinear los
   * títulos, esta prueba lo dice.
   */
  it("no duplica los títulos de la sección Servicios", () => {
    const catalogo = new Set(services.map((s) => s.title.toLowerCase()));
    for (const stratum of valueProps.strata) {
      expect(catalogo.has(stratum.title.toLowerCase())).toBe(false);
    }
  });
});
