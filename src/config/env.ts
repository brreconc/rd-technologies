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
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

export type Env = z.infer<typeof envSchema>;
