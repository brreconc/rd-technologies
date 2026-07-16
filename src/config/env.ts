import { z } from "zod";

/**
 * Validación de variables de entorno con Zod (§9.2).
 *
 * Se usa en código de SERVIDOR (route handlers, server actions) para fallar
 * temprano si falta o es inválida una variable crítica. No importar en
 * componentes de cliente para no inflar el bundle.
 */
/** Coacciona strings de entorno ("1"/"true"/"yes") a booleano. */
const envBoolean = z
  .string()
  .transform((v) => ["1", "true", "yes", "on"].includes(v.trim().toLowerCase()))
  .pipe(z.boolean());

/**
 * Normaliza el vacío a `undefined` ANTES de validar. Es clave en despliegue:
 * `docker compose` (y muchos orquestadores) pasan las variables no rellenadas
 * como **cadena vacía** `""`, no como ausentes. Sin esto, un `RESEND_API_KEY=""`
 * rompería `.optional()` (que solo admite `undefined`) y `z.email("")` fallaría,
 * tirando toda la validación de entorno. Ver docs/10-deployment.
 */
const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess((v) => (v === "" || v === undefined ? undefined : v), schema.optional());

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  // `""` → default (evita que un NEXT_PUBLIC_SITE_URL vacío rompa z.url()).
  NEXT_PUBLIC_SITE_URL: z.preprocess(
    (v) => (v === "" || v === undefined ? undefined : v),
    z.url().default("http://localhost:3000"),
  ),

  // Política de indexación (§12). Por defecto NO indexable mientras el proyecto
  // es local/no desplegado. Se activa explícitamente al desplegar poniendo
  // NEXT_PUBLIC_SITE_INDEXABLE=true. Público porque `robots.txt`, `sitemap.xml`
  // y el `<meta robots>` (que se emiten en cliente/edge) deben leer el MISMO valor.
  NEXT_PUBLIC_SITE_INDEXABLE: envBoolean.optional().default(false),

  // Integraciones futuras del formulario (Fase 4+). OPCIONALES: si no están (o
  // llegan vacías), la capa de servicios usa el canal de log local. Cuando
  // existan, `contact.service` selecciona Resend sin tocar UI ni handlers.
  RESEND_API_KEY: optional(z.string().min(1)),
  CONTACT_TO_EMAIL: optional(z.email()),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SITE_INDEXABLE: process.env.NEXT_PUBLIC_SITE_INDEXABLE,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
});

export type Env = z.infer<typeof envSchema>;
