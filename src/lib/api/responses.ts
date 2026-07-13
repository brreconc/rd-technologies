import type { FieldErrors } from "@/lib/utils/validators";

/**
 * Respuestas JSON tipadas de los formularios. Contrato único que consume el
 * cliente para mapear errores por campo o mostrar un mensaje general.
 */
export type FormResponse =
  | { ok: true; id: string }
  | { ok: false; error: "validation"; fieldErrors: FieldErrors }
  | { ok: false; error: "rate_limit" }
  | { ok: false; error: "bad_request" }
  | { ok: false; error: "server" };

function json(body: FormResponse, status: number, headers?: HeadersInit): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...headers },
  });
}

export const ok = (id: string) => json({ ok: true, id }, 200);

export const validationError = (fieldErrors: FieldErrors) =>
  json({ ok: false, error: "validation", fieldErrors }, 422);

export const rateLimited = (retryAfterMs: number) =>
  json({ ok: false, error: "rate_limit" }, 429, {
    "retry-after": String(Math.ceil(retryAfterMs / 1000)),
  });

/** 400 genérico: origen/content-type/JSON inválido o anti-bot. No revela el motivo. */
export const badRequest = () => json({ ok: false, error: "bad_request" }, 400);

export const serverError = () => json({ ok: false, error: "server" }, 500);
