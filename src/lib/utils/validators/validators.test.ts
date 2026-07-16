import { describe, it, expect } from "vitest";
import { contactFormSchema } from "./contact";
import { newsletterFormSchema } from "./newsletter";
import { antiBotSchema, looksLikeBot, MIN_FILL_MS } from "./anti-bot";
import { fieldErrorsFromZod } from "./index";

describe("contactFormSchema", () => {
  const valid = {
    name: "Ana Pérez",
    email: "ana@example.com",
    company: "",
    message: "Hola, me gustaría más información sobre sus servicios.",
  };

  it("acepta un envío válido", () => {
    expect(contactFormSchema.safeParse(valid).success).toBe(true);
  });

  it("rechaza email inválido", () => {
    const r = contactFormSchema.safeParse({ ...valid, email: "no-es-email" });
    expect(r.success).toBe(false);
  });

  it("rechaza nombre demasiado corto y mensaje demasiado corto", () => {
    const r = contactFormSchema.safeParse({ ...valid, name: "A", message: "corto" });
    expect(r.success).toBe(false);
    if (!r.success) {
      const errs = fieldErrorsFromZod(r.error);
      expect(errs.name).toBeTruthy();
      expect(errs.message).toBeTruthy();
    }
  });
});

describe("newsletterFormSchema", () => {
  it("acepta email válido y rechaza inválido", () => {
    expect(newsletterFormSchema.safeParse({ email: "a@b.com" }).success).toBe(true);
    expect(newsletterFormSchema.safeParse({ email: "x" }).success).toBe(false);
  });
});

describe("fieldErrorsFromZod", () => {
  it("se queda con el primer error por campo", () => {
    const r = contactFormSchema.safeParse({ name: "", email: "x", company: "", message: "" });
    expect(r.success).toBe(false);
    if (!r.success) {
      const errs = fieldErrorsFromZod(r.error);
      expect(typeof errs.name).toBe("string");
      expect(typeof errs.email).toBe("string");
    }
  });
});

describe("anti-bot", () => {
  it("el esquema rechaza un honeypot relleno (max 0) antes de llegar a la lógica", () => {
    const r = antiBotSchema.safeParse({ company_url: "http://spam", elapsed_ms: 5000 });
    expect(r.success).toBe(false);
  });

  it("looksLikeBot marca honeypot relleno como bot (barrera redundante)", () => {
    expect(looksLikeBot({ company_url: "http://spam", elapsed_ms: 5000 })).toBe(true);
  });

  it("marca envío demasiado rápido como bot", () => {
    const fields = antiBotSchema.parse({ company_url: "", elapsed_ms: MIN_FILL_MS - 1 });
    expect(looksLikeBot(fields)).toBe(true);
  });

  it("acepta envío humano (honeypot vacío + tiempo suficiente)", () => {
    const fields = antiBotSchema.parse({ company_url: "", elapsed_ms: MIN_FILL_MS + 500 });
    expect(looksLikeBot(fields)).toBe(false);
  });

  it("aplica defaults cuando faltan los campos", () => {
    const fields = antiBotSchema.parse({});
    // Sin datos → elapsed 0 → se considera bot (conservador).
    expect(looksLikeBot(fields)).toBe(true);
  });
});
