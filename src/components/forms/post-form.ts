import type { FieldErrors } from "@/lib/utils/validators";
import type { FormResponse } from "@/lib/api/responses";

/**
 * Resultado normalizado de un envío de formulario, tal como lo consume la UI.
 * (La `FormResponse` del servidor se mapea a estas variantes.)
 */
export type SubmitResult =
  | { status: "success" }
  | { status: "validation"; fieldErrors: FieldErrors }
  | { status: "rate_limit" }
  | { status: "error" };

/**
 * Envía `payload` como JSON al route handler y traduce la respuesta al contrato
 * `SubmitResult`. Cualquier fallo de red o respuesta inesperada cae a `error`,
 * de modo que la UI siempre tiene un estado que mostrar.
 *
 * `same-origin` + JSON encaja con la verificación de origen/CSRF del servidor.
 * `FormResponse` se importa solo como tipo: no arrastra runtime del servidor al
 * bundle del cliente.
 */
export async function postForm(
  url: string,
  payload: Record<string, unknown>,
): Promise<SubmitResult> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "same-origin",
    });

    if (response.status === 429) return { status: "rate_limit" };

    let body: FormResponse | undefined;
    try {
      body = (await response.json()) as FormResponse;
    } catch {
      body = undefined;
    }

    if (response.ok && body?.ok) return { status: "success" };
    if (body && !body.ok && body.error === "validation") {
      return { status: "validation", fieldErrors: body.fieldErrors };
    }
    return { status: "error" };
  } catch {
    return { status: "error" };
  }
}
