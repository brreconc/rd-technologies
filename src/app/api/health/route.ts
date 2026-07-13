/**
 * GET /api/health — sonda de vida (§7). Útil para smoke tests locales y, a
 * futuro, para health checks del orquestador de despliegue. Sin caché.
 */
export const dynamic = "force-dynamic";

export function GET(): Response {
  return Response.json(
    { status: "ok", timestamp: new Date().toISOString() },
    { headers: { "cache-control": "no-store" } },
  );
}
