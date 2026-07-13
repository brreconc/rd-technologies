import type { z } from "zod";

/**
 * Barrel de validadores (§7: `lib/utils/validators`). Fuente única de verdad de
 * los esquemas Zod compartidos por cliente y servidor.
 */
export * from "./contact";
export * from "./newsletter";
export * from "./anti-bot";

/** Errores por campo, tal como los consume el cliente (RHF `setError`). */
export type FieldErrors = Record<string, string>;

/**
 * Reduce un `ZodError` a un mapa `{ campo: primer_mensaje }`.
 *
 * Escrito sobre `error.issues` (estable entre versiones de Zod) en lugar de
 * `.flatten()`, para no depender de una API concreta. Solo se queda con el
 * primer error de cada campo de primer nivel, que es lo que muestra la UI.
 */
export function fieldErrorsFromZod(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key !== "string") continue;
    if (!(key in errors)) errors[key] = issue.message;
  }
  return errors;
}
