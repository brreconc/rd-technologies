import type { NextConfig } from "next";
import { getStaticSecurityHeaders } from "./src/lib/security/headers";

const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
