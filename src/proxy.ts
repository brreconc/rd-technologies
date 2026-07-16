import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { buildContentSecurityPolicy } from "@/lib/security/headers";

/**
 * Proxy (antes "middleware") — aplica la Content-Security-Policy (§9).
 *
 * En Next.js 16 la convención `middleware` se renombró a `proxy`.
 *
 * CSP con NONCE por petición (Fase 6, ADR-009): se genera un nonce aleatorio,
 * se inyecta en la cabecera `Content-Security-Policy` y en `x-nonce`. Next lo
 * extrae de la CSP y lo aplica automáticamente a sus scripts (framework, chunks,
 * inline propios); el layout lo pasa además a `next-themes`. Esto elimina
 * `'unsafe-inline'` de `script-src` en producción, pero obliga a render dinámico.
 *
 * El resto de cabeceras (X-Frame-Options, nosniff, HSTS…) se aplican en
 * `next.config.ts`. El rate limiting vive en los route handlers (ADR-007).
 */
export function proxy(request: NextRequest) {
  const isDev = process.env.NODE_ENV === "development";

  // Nonce por petición: base64 de un UUID (impredecible y de un solo uso).
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = buildContentSecurityPolicy(isDev, nonce);

  // Se propaga el nonce a la request para que el render de servidor lo use.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  matcher: [
    // Todas las rutas de página salvo API, assets estáticos y el favicon.
    // Se ignoran los prefetch de <Link> (no necesitan CSP y ahorran trabajo).
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
