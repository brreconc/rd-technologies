import { describe, it, expect } from "vitest";
import { sanitizeSingleLine, sanitizeMultiline, sanitizeEmail } from "./sanitize";

describe("sanitizeSingleLine", () => {
  it("elimina caracteres de control y NUL", () => {
    expect(sanitizeSingleLine("a\x00b\x1Fc", 50)).toBe("abc");
  });

  it("neutraliza CR/LF (anti-inyección de cabeceras de correo)", () => {
    const out = sanitizeSingleLine("nombre\r\nBcc: victima@x.com", 100);
    // Lo esencial: no queda ningún CR/LF con el que inyectar cabeceras.
    // Los CR/LF son caracteres de control y se eliminan antes de colapsar
    // espacios, así que las dos partes quedan pegadas (sin salto).
    expect(out).not.toMatch(/[\r\n]/);
    expect(out).toBe("nombreBcc: victima@x.com");
  });

  it("colapsa espacios y recorta", () => {
    expect(sanitizeSingleLine("  hola    mundo  ", 50)).toBe("hola mundo");
  });

  it("respeta la longitud máxima", () => {
    expect(sanitizeSingleLine("abcdefgh", 4)).toBe("abcd");
  });

  it("normaliza a NFC (formas Unicode equivalentes)", () => {
    // "é" descompuesta (e + combining acute) → compuesta
    expect(sanitizeSingleLine("é", 10)).toBe("é");
  });
});

describe("sanitizeMultiline", () => {
  it("conserva los saltos de línea", () => {
    expect(sanitizeMultiline("linea1\nlinea2", 100)).toBe("linea1\nlinea2");
  });

  it("colapsa 3+ saltos en un doble salto", () => {
    expect(sanitizeMultiline("a\n\n\n\nb", 100)).toBe("a\n\nb");
  });

  it("elimina otros controles pero no el \\n", () => {
    expect(sanitizeMultiline("a\x00\nb", 100)).toBe("a\nb");
  });
});

describe("sanitizeEmail", () => {
  it("pasa a minúsculas y limpia", () => {
    expect(sanitizeEmail("  Persona@Example.COM ", 120)).toBe("persona@example.com");
  });
});
