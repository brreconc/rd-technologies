import { z } from "zod";

/**
 * Esquema del formulario de contacto (§9.2).
 *
 * **Fuente única de verdad**: se usa TAL CUAL en el cliente (React Hook Form vía
 * `zodResolver`) y en el servidor (route handler). Así la validación es idéntica
 * en ambos lados y nunca se desincroniza.
 *
 * Solo cubre los campos de negocio visibles; los campos anti-bot viven en
 * `./anti-bot` y solo se validan en el servidor.
 */

/** Límites de longitud (también usados para `maxLength` en la UI). */
export const CONTACT_LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 120 },
  company: { max: 100 },
  message: { min: 10, max: 2000 },
} as const;

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.name.min, "Indícanos tu nombre (mínimo 2 caracteres).")
    .max(CONTACT_LIMITS.name.max, "El nombre es demasiado largo."),
  email: z
    .email("Introduce un correo electrónico válido.")
    .max(CONTACT_LIMITS.email.max, "El correo es demasiado largo."),
  company: z
    .string()
    .trim()
    .max(CONTACT_LIMITS.company.max, "El nombre de la empresa es demasiado largo.")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.message.min, "Cuéntanos un poco más (mínimo 10 caracteres).")
    .max(CONTACT_LIMITS.message.max, "El mensaje es demasiado largo."),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

/** Valores iniciales del formulario (para React Hook Form). */
export const CONTACT_DEFAULTS: ContactFormValues = {
  name: "",
  email: "",
  company: "",
  message: "",
};
