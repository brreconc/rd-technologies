/**
 * Fuente única de verdad de las cabeceras de seguridad HTTP.
 * Requisito §9 del prompt maestro (defensa en profundidad).
 *
 * Se consume desde `next.config.ts` (para aplicarlas a todas las respuestas).
 * Módulo puro (sin APIs de Node) para poder importarse desde cualquier runtime.
 *
 * NOTA sobre CSP: en desarrollo Next/Turbopack necesitan `'unsafe-eval'` e
 * inline para el HMR/React Refresh. En producción se endurece. La CSP con
 * `nonce` (eliminar `'unsafe-inline'` de scripts) queda planificada para la
 * fase de hardening (Fase 6) — ver docs/05-security.
 */

export type SecurityHeader = { key: string; value: string };

/** Construye la Content-Security-Policy según el entorno. */
export function buildContentSecurityPolicy(isDev: boolean): string {
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
    "script-src": isDev
      ? ["'self'", "'unsafe-inline'", "'unsafe-eval'"]
      : ["'self'", "'unsafe-inline'"],
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

/** Lista de cabeceras de seguridad aplicadas a todas las rutas. */
export function getSecurityHeaders(isDev: boolean): SecurityHeader[] {
  const headers: SecurityHeader[] = [
    { key: "Content-Security-Policy", value: buildContentSecurityPolicy(isDev) },
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
