import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Proxy (antes "middleware") — defensa en profundidad (§9).
 *
 * En Next.js 16 la convención `middleware` se renombró a `proxy`.
 *
 * Las cabeceras de seguridad principales se aplican en `next.config.ts`. Aquí
 * se refuerzan las más críticas.
 *
 * NOTA (Fase 4): el rate limiting por IP NO vive aquí. Se implementa dentro de
 * los route handlers (`/api/contact`, `/api/newsletter`), que corren en runtime
 * Node, donde el estado en memoria del limitador es fiable — a diferencia del
 * runtime edge del proxy. Es también el límite real de la mutación. Ver ADR-007.
 */
export function proxy(_request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  // Se excluyen los assets estáticos para no penalizar su entrega.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
