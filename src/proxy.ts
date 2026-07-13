import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Proxy (antes "middleware") — defensa en profundidad (§9).
 *
 * En Next.js 16 la convención `middleware` se renombró a `proxy`.
 *
 * Las cabeceras de seguridad principales se aplican en `next.config.ts`. Aquí
 * se refuerzan las más críticas y se deja preparado el punto de extensión para
 * el rate limiting por IP de las rutas de formulario (Fase 4).
 */
export function proxy(_request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // TODO(Fase 4): rate limiting por IP en /api/contact y /api/newsletter.

  return response;
}

export const config = {
  // Se excluyen los assets estáticos para no penalizar su entrega.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
