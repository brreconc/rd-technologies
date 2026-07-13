import { preflightFormRequest } from "@/lib/api/form-guards";
import { ok, validationError, serverError } from "@/lib/api/responses";
import { RATE_LIMITS } from "@/lib/security/rate-limit";
import { sanitizeEmail, sanitizeMultiline, sanitizeSingleLine } from "@/lib/security/sanitize";
import { getContactChannel, type ContactMessage } from "@/lib/services/contact.service";
import { CONTACT_LIMITS, contactFormSchema, fieldErrorsFromZod } from "@/lib/utils/validators";

/**
 * POST /api/contact — recepción del formulario de contacto (§9.2).
 *
 * Runtime Node (no edge): el rate limiter en memoria y el logging del servicio
 * necesitan un proceso estable. `force-dynamic` porque leemos cabeceras/cuerpo.
 *
 * Flujo: preflight de seguridad (origen, content-type, rate limit, anti-bot) →
 * validación Zod (mismo esquema que el cliente) → sanitización → capa de
 * servicios. Nunca confía en la validación de cliente.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  const pre = await preflightFormRequest(request, { key: "contact", ...RATE_LIMITS.contact });
  if (!pre.ok) return pre.response;

  const parsed = contactFormSchema.safeParse(pre.ctx.body);
  if (!parsed.success) return validationError(fieldErrorsFromZod(parsed.error));

  const data = parsed.data;
  const message: ContactMessage = {
    name: sanitizeSingleLine(data.name, CONTACT_LIMITS.name.max),
    email: sanitizeEmail(data.email, CONTACT_LIMITS.email.max),
    company: data.company
      ? sanitizeSingleLine(data.company, CONTACT_LIMITS.company.max)
      : undefined,
    message: sanitizeMultiline(data.message, CONTACT_LIMITS.message.max),
    meta: pre.ctx.meta,
  };

  try {
    const { id } = await getContactChannel().deliverContactMessage(message);
    return ok(id);
  } catch (error) {
    console.error("[contact] fallo en la entrega", error);
    return serverError();
  }
}
