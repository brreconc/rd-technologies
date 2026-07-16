import { describe, it, expect } from "vitest";
import { envSchema } from "./env";

/**
 * Regresión (Fase 7): `docker compose` pasa las variables sin rellenar como
 * CADENA VACÍA, no ausentes. La validación debe tratar `""` como `undefined`
 * en los campos opcionales; de lo contrario todo el `env` peta al arrancar el
 * contenedor y rutas como robots.txt/sitemap.xml devuelven 500.
 */
describe("envSchema — vacíos de despliegue", () => {
  it("acepta secretos opcionales como cadena vacía (los trata como ausentes)", () => {
    const r = envSchema.safeParse({
      NODE_ENV: "production",
      NEXT_PUBLIC_SITE_URL: "https://www.rdtechnologies.com",
      NEXT_PUBLIC_SITE_INDEXABLE: "true",
      RESEND_API_KEY: "",
      CONTACT_TO_EMAIL: "",
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.RESEND_API_KEY).toBeUndefined();
      expect(r.data.CONTACT_TO_EMAIL).toBeUndefined();
      expect(r.data.NEXT_PUBLIC_SITE_INDEXABLE).toBe(true);
    }
  });

  it("un NEXT_PUBLIC_SITE_URL vacío cae al valor por defecto (no rompe z.url)", () => {
    const r = envSchema.safeParse({ NEXT_PUBLIC_SITE_URL: "" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.NEXT_PUBLIC_SITE_URL).toBe("http://localhost:3000");
  });

  it("sigue validando valores presentes no vacíos", () => {
    const ok = envSchema.safeParse({ CONTACT_TO_EMAIL: "ventas@rdtechnologies.com" });
    expect(ok.success).toBe(true);
    const bad = envSchema.safeParse({ CONTACT_TO_EMAIL: "no-es-email" });
    expect(bad.success).toBe(false);
  });
});
