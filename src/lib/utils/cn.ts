import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Une clases de Tailwind resolviendo conflictos (la última gana).
 * Uso estándar del proyecto para clases condicionales (§14).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
