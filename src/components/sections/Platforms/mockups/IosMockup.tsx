import * as React from "react";
import { Glyph, type GlyphName } from "./Glyph";

const SEGMENTS = ["Resumen", "Equipo", "Alertas"];

const ROWS: { icon: GlyphName; label: string; value: string }[] = [
  { icon: "user", label: "Cuenta", value: "R&D" },
  { icon: "bell", label: "Notificaciones", value: "12" },
  { icon: "shield", label: "Privacidad", value: "Activa" },
  { icon: "lock", label: "Face ID y código", value: "" },
];

/** Barras del gráfico semanal, en tanto por uno. */
const BARS = [0.45, 0.68, 0.52, 0.8, 0.6, 0.92, 0.74];
const DAYS = ["L", "M", "X", "J", "V", "S", "D"];

const TABS: { icon: GlyphName; label: string }[] = [
  { icon: "home", label: "Hoy" },
  { icon: "chart", label: "Datos" },
  { icon: "list", label: "Tareas" },
  { icon: "users", label: "Equipo" },
  { icon: "cog", label: "Ajustes" },
];

/**
 * Mock-up del destino iOS: título grande, control segmentado, lista agrupada
 * con isla dinámica y barra de pestañas, siguiendo la gramática de las Human
 * Interface Guidelines. Decorativo — ver `WebMockup`.
 */
export function IosMockup() {
  return (
    <div className="mk mk-ios">
      {/* Barra de estado con isla dinámica */}
      <div className="mk-status">
        <span>09:41</span>
        <span className="mk-island" />
        <span className="mk-status-r">
          <i className="mk-sig" />
          <i className="mk-batt" />
        </span>
      </div>

      <div className="mk-ios-nav">
        <span className="mk-ios-title">Panel</span>
        <span className="mk-ios-act">Editar</span>
      </div>

      <div className="mk-seg">
        {SEGMENTS.map((segment, index) => (
          <span key={segment} className={index === 0 ? "mk-seg-i mk-on" : "mk-seg-i"}>
            {segment}
          </span>
        ))}
      </div>

      <div className="mk-ios-group">
        {ROWS.map((row) => (
          <div key={row.label} className="mk-ios-row">
            <span className="mk-ios-ico">
              <Glyph name={row.icon} className="mk-ico" />
            </span>
            <span className="mk-ios-label">{row.label}</span>
            {row.value ? <em className="mk-ios-val">{row.value}</em> : null}
            <Glyph name="chevron" className="mk-ico mk-chev" />
          </div>
        ))}
      </div>

      <div className="mk-ios-card">
        <span className="mk-ios-card-h">
          Actividad semanal <b>+18%</b>
        </span>
        <span className="mk-bars">
          {BARS.map((h, index) => (
            <i key={index} style={{ height: `${h * 100}%` }}>
              <em>{DAYS[index]}</em>
            </i>
          ))}
        </span>
      </div>

      <div className="mk-tabbar">
        {TABS.map((tab, index) => (
          <span key={tab.label} className={index === 0 ? "mk-tab-i mk-on" : "mk-tab-i"}>
            <Glyph name={tab.icon} className="mk-ico" />
            <em>{tab.label}</em>
          </span>
        ))}
      </div>
      <span className="mk-home-ind" />
    </div>
  );
}
