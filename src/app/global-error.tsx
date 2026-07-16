"use client";

import { useEffect } from "react";
import "./globals.css";

/**
 * Error global (§18): captura fallos del propio layout raíz, que `error.tsx`
 * no cubre. Reemplaza al layout, por lo que DEBE aportar sus propios `<html>`
 * y `<body>`. Se mantiene autocontenido (estilos inline mínimos) por si el
 * fallo impidiera cargar dependencias.
 */
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: "32rem", textAlign: "center" }} role="alert">
          <h1 style={{ fontSize: "1.75rem", margin: "0 0 0.75rem" }}>Se produjo un error grave</h1>
          <p style={{ color: "#b0b0b0", margin: "0 0 1.5rem", lineHeight: 1.6 }}>
            La aplicación no pudo continuar. Intenta recargar; si el problema persiste, vuelve más
            tarde.
          </p>
          <button
            type="button"
            onClick={() => unstable_retry()}
            style={{
              minHeight: "44px",
              padding: "0 1.5rem",
              borderRadius: "0.5rem",
              border: "none",
              background: "#00f5ff",
              color: "#0a0a0a",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
