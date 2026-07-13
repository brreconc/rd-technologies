import "server-only";

import { checkRateLimit, type RateLimitOptions } from "@/lib/security/rate-limit";
import { getClientIp, isSameOrigin } from "@/lib/security/request";
import { antiBotSchema, looksLikeBot } from "@/lib/utils/validators";
import { badRequest, rateLimited } from "./responses";
import type { SubmissionMeta } from "@/lib/services/contact.service";

/** Tope de tamaño del cuerpo, barrera anti-abuso previa al parseo (§9.2). */
const MAX_BODY_BYTES = 16 * 1024; // 16 KB — de sobra para estos formularios.

export interface PreflightContext {
  /** Cuerpo JSON ya parseado (objeto arbitrario, aún sin validar el negocio). */
  body: Record<string, unknown>;
  /** Metadatos derivados de la petición para la capa de servicios. */
  meta: SubmissionMeta;
}

export type PreflightResult =
  { ok: true; ctx: PreflightContext } | { ok: false; response: Response };

/**
 * Tubería de seguridad común a las mutaciones de formulario, en orden barato→caro
 * para fallar cuanto antes (§9.2):
 *
 *   1. Verificación de origen (CSRF).
 *   2. Content-Type `application/json`.
 *   3. Rate limiting por IP.
 *   4. Límite de tamaño + parseo JSON.
 *   5. Anti-bot (honeypot + time-trap) — genérico, sin revelar el motivo.
 *
 * Devuelve el cuerpo + metadatos si todo pasa, o una `Response` de error ya lista.
 * La validación de negocio (Zod) y la sanitización las hace cada route handler.
 */
export async function preflightFormRequest(
  request: Request,
  rateLimit: { key: string } & RateLimitOptions,
): Promise<PreflightResult> {
  // 1. CSRF / origen.
  if (!isSameOrigin(request)) return { ok: false, response: badRequest() };

  // 2. Content-Type.
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return { ok: false, response: badRequest() };
  }

  // 3. Rate limiting por IP.
  const ip = getClientIp(request);
  const rl = checkRateLimit(`${rateLimit.key}:${ip}`, {
    limit: rateLimit.limit,
    windowMs: rateLimit.windowMs,
  });
  if (!rl.allowed) return { ok: false, response: rateLimited(rl.retryAfterMs) };

  // 4. Tamaño + parseo JSON.
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > MAX_BODY_BYTES) return { ok: false, response: badRequest() };

  let raw: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) return { ok: false, response: badRequest() };
    raw = JSON.parse(text);
  } catch {
    return { ok: false, response: badRequest() };
  }
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, response: badRequest() };
  }
  const body = raw as Record<string, unknown>;

  // 5. Anti-bot (honeypot + time-trap).
  const antiBot = antiBotSchema.safeParse(body);
  if (!antiBot.success || looksLikeBot(antiBot.data)) {
    return { ok: false, response: badRequest() };
  }

  const meta: SubmissionMeta = {
    ip,
    submittedAt: new Date().toISOString(),
    userAgent: request.headers.get("user-agent") ?? undefined,
  };

  return { ok: true, ctx: { body, meta } };
}
