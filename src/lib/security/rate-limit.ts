/**
 * Rate limiting por clave (IP) — ventana deslizante en memoria (§9.2).
 *
 * ⚠️ ALCANCE (decisión documentada, ver docs/05-security y ADR-007):
 * este limitador es **en memoria y por proceso**. Es correcto para la fase
 * LOCAL y como primera barrera, pero NO es distribuido: no sobrevive a
 * reinicios ni se comparte entre instancias. En producción multi-instancia se
 * sustituye por un backend compartido (Redis/Upstash) detrás de esta MISMA
 * interfaz, sin tocar los route handlers.
 */

export interface RateLimitOptions {
  /** Máximo de peticiones permitidas dentro de la ventana. */
  limit: number;
  /** Tamaño de la ventana en milisegundos. */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  /** Peticiones restantes en la ventana actual. */
  remaining: number;
  /** Ms hasta que se libere un hueco (0 si `allowed`). */
  retryAfterMs: number;
}

/** Marcas de tiempo (ms) de las peticiones recientes, por clave. */
const store = new Map<string, number[]>();

/** Cota de seguridad para que el mapa no crezca sin límite en local. */
const MAX_TRACKED_KEYS = 10_000;

/**
 * Registra una petición para `key` y decide si se permite.
 * Poda las marcas fuera de la ventana en cada acceso (auto-limpieza).
 */
export function checkRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const { limit, windowMs } = options;
  const now = Date.now();
  const windowStart = now - windowMs;

  if (store.size > MAX_TRACKED_KEYS) store.clear();

  const hits = (store.get(key) ?? []).filter((ts) => ts > windowStart);

  if (hits.length >= limit) {
    const retryAfterMs = Math.max(0, hits[0] + windowMs - now);
    store.set(key, hits);
    return { allowed: false, remaining: 0, retryAfterMs };
  }

  hits.push(now);
  store.set(key, hits);
  return { allowed: true, remaining: limit - hits.length, retryAfterMs: 0 };
}

/** Presupuestos por ruta. Conservadores; ajustables sin tocar la lógica. */
export const RATE_LIMITS = {
  contact: { limit: 5, windowMs: 60_000 },
  newsletter: { limit: 5, windowMs: 60_000 },
} as const satisfies Record<string, RateLimitOptions>;

/** Solo para pruebas: vacía el estado en memoria. */
export function __resetRateLimit(): void {
  store.clear();
}
