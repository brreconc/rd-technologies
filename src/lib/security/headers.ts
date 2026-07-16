/**
 * Fuente única de verdad de las cabeceras de seguridad HTTP.
 * Requisito §9 del prompt maestro (defensa en profundidad).
 *
 * Reparto de responsabilidades (Fase 6):
 * - La **CSP** se genera aquí pero se APLICA en `src/proxy.ts`, porque en
 *   producción incorpora un **nonce por petición** (script-src sin
 *   'unsafe-inline'). Ver ADR-009.
 * - El resto de cabeceras (estáticas) se aplican en `next.config.ts` a todas
 *   las rutas vía `getStaticSecurityHeaders()`.
 *
 * Módulo puro (sin APIs de Node) para poder importarse desde cualquier runtime.
 */

export type SecurityHeader = { key: string; value: string };

/**
 * Construye la Content-Security-Policy según el entorno.
 *
 * - **Producción:** `script-src` SIN `'unsafe-inline'`; se autoriza solo con
 *   `'nonce-<n>'` + `'strict-dynamic'` (los scripts cargados por un script de
 *   confianza quedan permitidos → Next, sus chunks y Framer Motion funcionan).
 * - **Desarrollo:** Turbopack/React Refresh necesitan `'unsafe-inline'`,
 *   `'unsafe-eval'` y `ws:`; ahí no se usa nonce (no aporta seguridad en local
 *   y rompería el HMR).
 * - `style-src` mantiene `'unsafe-inline'` en ambos: hay estilos en atributos
 *   `style=""` (React) que un nonce NO cubre; el riesgo de inyección por estilo
 *   es muy inferior al de script.
 */
export function buildContentSecurityPolicy(isDev: boolean, nonce?: string): string {
  const scriptSrc = isDev
    ? ["'self'", "'unsafe-inline'", "'unsafe-eval'"]
    : ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'"];

  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "base-uri": ["'self'"],
    "object-src": ["'none'"],
    "frame-ancestors": ["'none'"],
    "form-action": ["'self'"],
    // Las fuentes se auto-hospedan con next/font → no se requieren orígenes externos.
    "font-src": ["'self'", "data:"],
    "img-src": ["'self'", "data:", "blob:"],
    "style-src": ["'self'", "'unsafe-inline'"],
    "script-src": scriptSrc,
    "connect-src": isDev ? ["'self'", "ws:", "wss:"] : ["'self'"],
    "worker-src": ["'self'", "blob:"],
    "manifest-src": ["'self'"],
    "media-src": ["'self'"],
  };

  if (!isDev) {
    directives["upgrade-insecure-requests"] = [];
  }

  return Object.entries(directives)
    .map(([directive, values]) => (values.length ? `${directive} ${values.join(" ")}` : directive))
    .join("; ");
}

/**
 * Cabeceras de seguridad ESTÁTICAS (todas menos la CSP), aplicadas a todas las
 * rutas desde `next.config.ts`. La CSP se aplica aparte en el proxy (nonce).
 */
export function getStaticSecurityHeaders(isDev: boolean): SecurityHeader[] {
  const headers: SecurityHeader[] = [
    { key: "X-Frame-Options", value: "DENY" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value: "geolocation=(), microphone=(), camera=(), interest-cohort=()",
    },
    { key: "X-DNS-Prefetch-Control", value: "on" },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  ];

  // HSTS solo tiene sentido bajo HTTPS (despliegue futuro), no en local http.
  if (!isDev) {
    headers.push({
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload",
    });
  }

  return headers;
}
