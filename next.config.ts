import type { NextConfig } from "next";
import { getStaticSecurityHeaders } from "./src/lib/security/headers";

const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Salida "standalone" (§16, Fase 7): genera `.next/standalone` con un
  // `server.js` mínimo y solo las dependencias necesarias. Es la base de la
  // imagen Docker (ver Dockerfile y docs/10-deployment). No afecta a `dev`.
  output: "standalone",
  // No revelar la tecnología del servidor.
  poweredByHeader: false,
  images: {
    // Formatos modernos para el presupuesto de performance (§11).
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        // Cabeceras de seguridad ESTÁTICAS para todas las rutas (§9).
        // La CSP NO está aquí: se aplica en `src/proxy.ts` con nonce por
        // petición (ver ADR-009).
        source: "/:path*",
        headers: getStaticSecurityHeaders(isDev),
      },
    ];
  },
};

export default nextConfig;
