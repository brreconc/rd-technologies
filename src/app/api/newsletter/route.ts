import { preflightFormRequest } from "@/lib/api/form-guards";
import { ok, validationError, serverError } from "@/lib/api/responses";
import { RATE_LIMITS } from "@/lib/security/rate-limit";
import { sanitizeEmail } from "@/lib/security/sanitize";
import { getContactChannel, type NewsletterSubscription } from "@/lib/services/contact.service";
import {
  NEWSLETTER_LIMITS,
  fieldErrorsFromZod,
  newsletterFormSchema,
} from "@/lib/utils/validators";

/**
 * POST /api/newsletter — alta en la newsletter (§9.2).
 * Misma tubería de seguridad y validación que /api/contact.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  const pre = await preflightFormRequest(request, { key: "newsletter", ...RATE_LIMITS.newsletter });
  if (!pre.ok) return pre.response;

  const parsed = newsletterFormSchema.safeParse(pre.ctx.body);
  if (!parsed.success) return validationError(fieldErrorsFromZod(parsed.error));

  const subscription: NewsletterSubscription = {
    email: sanitizeEmail(parsed.data.email, NEWSLETTER_LIMITS.email.max),
    meta: pre.ctx.meta,
  };

  try {
    const { id } = await getContactChannel().deliverNewsletterSubscription(subscription);
    return ok(id);
  } catch (error) {
    console.error("[newsletter] fallo en la entrega", error);
    return serverError();
  }
}
