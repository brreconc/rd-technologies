import { z } from "zod";

/**
 * Fragmento anti-bot compartido por los formularios (§9.2).
 *
 * Dos capas independientes de las validaciones de negocio:
 *
 * 1. **Honeypot** (`company_url`): campo oculto para humanos (fuera de pantalla,
 *    `aria-hidden`, sin foco). Un bot que rellena todos los campos lo completa;
 *    un humano nunca. Si llega con contenido → se descarta el envío.
 * 2. **Time-trap** (`elapsed_ms`): milisegundos que el usuario tardó en enviar
 *    el formulario (medidos en cliente entre montaje y submit). Los bots envían
 *    casi instantáneamente; por debajo del umbral se descarta el envío.
 *
 * Es **defensa en profundidad**, no la única barrera (spoofable): se combina con
 * rate limiting por IP y verificación de origen en el servidor.
 */

/** Nombre del campo honeypot. Con pinta de real para atraer a los bots. */
export const HONEYPOT_FIELD = "company_url" as const;

/** Nombre del campo del time-trap. */
export const ELAPSED_FIELD = "elapsed_ms" as const;

/** Tiempo mínimo (ms) que se considera "humano" al rellenar el formulario. */
export const MIN_FILL_MS = 1500;

/** Tope defensivo del elapsed para evitar números absurdos en el payload. */
const MAX_ELAPSED_MS = 1000 * 60 * 60 * 6; // 6 h

/**
 * Esquema de los campos anti-bot. Se valida SOLO en el servidor (los campos son
 * ocultos y no forman parte del formulario visible que valida el cliente).
 */
export const antiBotSchema = z.object({
  [HONEYPOT_FIELD]: z.string().max(0, "Envío rechazado.").optional().default(""),
  [ELAPSED_FIELD]: z.coerce.number().int().min(0).max(MAX_ELAPSED_MS).optional().default(0),
});

export type AntiBotFields = z.infer<typeof antiBotSchema>;

/** `true` si el envío parece un bot por honeypot relleno o rapidez inhumana. */
export function looksLikeBot(fields: AntiBotFields): boolean {
  const honeypot = fields[HONEYPOT_FIELD] ?? "";
  const elapsed = fields[ELAPSED_FIELD] ?? 0;
  return honeypot.length > 0 || elapsed < MIN_FILL_MS;
}
