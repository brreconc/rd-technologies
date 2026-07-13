/**
 * Sanitización de entradas de usuario (§9.2).
 *
 * Módulo puro (sin dependencias ni APIs de Node) para poder usarse en cualquier
 * runtime. NO sustituye a la validación Zod: se aplica DESPUÉS de validar, justo
 * antes de entregar los datos a la capa de servicios/almacenamiento.
 *
 * Objetivos:
 * - Normalizar Unicode (evita homoglifos/formas equivalentes).
 * - Eliminar caracteres de control (incluye NUL y los usados en inyección de
 *   cabeceras de correo: CR/LF en campos de una sola línea).
 * - Recortar y limitar longitud como última barrera anti-abuso.
 *
 * No hacemos escape de HTML aquí: el contenido se renderiza por React (que
 * escapa por defecto) o se registra como texto plano. Si en el futuro se
 * inyecta en HTML/emails crudos, hágase el escape en ese punto de salida.
 */

const CONTROL_CHARS = /[\x00-\x1F\x7F]/g;
const CR_LF = /[\r\n]+/g;

/** Sanitiza un texto de una sola línea (nombre, email, empresa). */
export function sanitizeSingleLine(input: string, maxLength: number): string {
  return input
    .normalize("NFC")
    .replace(CONTROL_CHARS, "")
    .replace(CR_LF, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

/** Sanitiza un texto multilínea (mensaje): conserva saltos de línea. */
export function sanitizeMultiline(input: string, maxLength: number): string {
  return input
    .normalize("NFC")
    .replace(/\r\n?/g, "\n") // normaliza CRLF/CR a LF antes de podar controles
    .replace(/[\x00-\x09\x0B-\x1F\x7F]/g, "") // conserva \n (0x0A), barre el resto de controles
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n") // colapsa saltos excesivos
    .trim()
    .slice(0, maxLength);
}

/** Normaliza un correo: minúsculas + limpieza de una línea. */
export function sanitizeEmail(input: string, maxLength: number): string {
  return sanitizeSingleLine(input, maxLength).toLowerCase();
}
