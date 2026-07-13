import type { NextConfig } from "next";
import { getSecurityHeaders } from "./src/lib/security/headers";

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
        // Cabeceras de seguridad para todas las rutas (§9).
        source: "/:path*",
        headers: getSecurityHeaders(isDev),
      },
    ];
  },
};

export default nextConfig;
