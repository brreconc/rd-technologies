import { z } from "zod";

/**
 * Esquema de la suscripción a la newsletter (§9.2).
 * Fuente única de verdad compartida cliente/servidor, igual que el de contacto.
 */

export const NEWSLETTER_LIMITS = {
  email: { max: 120 },
} as const;

export const newsletterFormSchema = z.object({
  email: z
    .email("Introduce un correo electrónico válido.")
    .max(NEWSLETTER_LIMITS.email.max, "El correo es demasiado largo."),
});

export type NewsletterFormValues = z.infer<typeof newsletterFormSchema>;

export const NEWSLETTER_DEFAULTS: NewsletterFormValues = {
  email: "",
};
