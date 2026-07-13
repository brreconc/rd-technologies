import { z } from "zod";

/**
 * Validación de variables de entorno con Zod (§9.2).
 *
 * Se usa en código de SERVIDOR (route handlers, server actions) para fallar
 * temprano si falta o es inválida una variable crítica. No importar en
 * componentes de cliente para no inflar el bundle.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),

  // Integraciones futuras del formulario (Fase 4+). OPCIONALES: si no están, la
  // capa de servicios usa el canal de log local. Cuando existan, `contact.service`
  // seleccionará el canal real (Resend) sin tocar la UI ni los handlers.
  RESEND_API_KEY: z.string().min(1).optional(),
  CONTACT_TO_EMAIL: z.email().optional(),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
});

export type Env = z.infer<typeof envSchema>;
