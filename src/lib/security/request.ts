/**
 * Utilidades de inspección de la petición para los route handlers (§9).
 * Módulo puro sobre la API `Request` estándar (Web Fetch).
 */

/**
 * Deriva una clave de cliente para el rate limiting a partir de las cabeceras
 * de proxy habituales. En local (sin proxy) no hay `x-forwarded-for`, así que
 * cae a un valor fijo — suficiente para la fase local y para probar el 429.
 *
 * A futuro (deploy), el proxy/CDN debe fijar `x-forwarded-for` de forma fiable;
 * confiar en él sin un proxy de confianza permitiría spoofear la IP.
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "local";
}

/**
 * Verificación de origen (defensa CSRF para endpoints JSON, §9.2).
 *
 * Compara el host del header `Origin` con el host real de la petición
 * (`X-Forwarded-Host` o `Host`). Una petición cross-site desde otro dominio
 * traería un `Origin` distinto (o, para `application/json`, ni siquiera podría
 * emitirse sin preflight CORS, que no permitimos). Si falta `Origin`, se
 * rechaza: nuestro cliente `fetch` siempre lo envía en un POST.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
