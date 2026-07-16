import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

/**
 * Imagen social compartida por `opengraph-image` y `twitter-image` (§12).
 *
 * Generada con `next/og` (satori). Se usa la fuente por defecto que trae
 * `next/og` (Geist) para no depender de ficheros externos y mantener la build
 * autocontenida. Estática: se genera en build y se cachea.
 *
 * Reglas de satori a recordar: todo contenedor con varios hijos necesita
 * `display: flex`; no hay cascada CSS (estilos inline por elemento).
 */
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";
export const OG_ALT = `${siteConfig.name} — ${siteConfig.tagline}`;

const CYAN = "#00f5ff";
const PURPLE = "#8b5cf6";

export function renderOgImage(): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0a0a0a",
        color: "#ffffff",
        padding: "80px",
        fontFamily: "sans-serif",
      }}
    >
      {/* Resplandor de marca */}
      <div
        style={{
          position: "absolute",
          top: "-160px",
          right: "-120px",
          width: "560px",
          height: "560px",
          borderRadius: "560px",
          background: `radial-gradient(circle, ${CYAN}33, transparent 70%)`,
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-200px",
          left: "-140px",
          width: "560px",
          height: "560px",
          borderRadius: "560px",
          background: `radial-gradient(circle, ${PURPLE}33, transparent 70%)`,
          display: "flex",
        }}
      />

      {/* Wordmark */}
      <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
        <div
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "6px",
            background: `linear-gradient(135deg, ${CYAN}, ${PURPLE})`,
            display: "flex",
          }}
        />
        <div style={{ fontSize: "34px", letterSpacing: "-0.5px" }}>{siteConfig.name}</div>
      </div>

      {/* Titular */}
      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        <div
          style={{
            display: "flex",
            fontSize: "68px",
            lineHeight: 1.1,
            letterSpacing: "-1.5px",
            maxWidth: "900px",
          }}
        >
          {siteConfig.tagline}
        </div>
        <div style={{ display: "flex", fontSize: "30px", color: "#b0b0b0", maxWidth: "860px" }}>
          {siteConfig.description}
        </div>
      </div>

      {/* Pie: barra de acento */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div
          style={{
            width: "120px",
            height: "8px",
            borderRadius: "8px",
            background: `linear-gradient(90deg, ${CYAN}, ${PURPLE})`,
            display: "flex",
          }}
        />
        <div style={{ display: "flex", fontSize: "24px", color: "#b0b0b0" }}>
          Desarrollo de software · Ciberseguridad
        </div>
      </div>
    </div>,
    { ...OG_SIZE },
  );
}
