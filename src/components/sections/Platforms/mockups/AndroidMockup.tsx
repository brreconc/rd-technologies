import * as React from "react";
import { Glyph, type GlyphName } from "./Glyph";

/** Tres y no cuatro: con cuatro, el último se corta contra el borde del marco. */
const CHIPS = ["Todas", "En curso", "Pendientes"];

/**
 * Seis filas, y con los rótulos cortos a propósito: la columna de la etiqueta de
 * estado se lleva su parte del ancho, y en un teléfono cualquier título más
 * largo que estos acaba en puntos suspensivos. Ver `content-guide.md`.
 */
const ITEMS: { icon: GlyphName; title: string; meta: string; tag: string }[] = [
  { icon: "check", title: "Ruta de reparto 12", meta: "Completada · 09:40", tag: "OK" },
  { icon: "refresh", title: "Inventario nave 3", meta: "Sincronizando · 68%", tag: "SYNC" },
  { icon: "clock", title: "Orden #4471", meta: "Pendiente de firma", tag: "ESPERA" },
  { icon: "wrench", title: "Mantenimiento B", meta: "Programado · mañana", tag: "PROG" },
  { icon: "alert", title: "Sensor térmico", meta: "Fuera de rango", tag: "AVISO" },
  { icon: "truck", title: "Carga muelle 2", meta: "En tránsito · 14 min", tag: "RUTA" },
];

const NAV: { icon: GlyphName; label: string }[] = [
  { icon: "home", label: "Inicio" },
  { icon: "list", label: "Órdenes" },
  { icon: "box", label: "Activos" },
  { icon: "user", label: "Perfil" },
];

/**
 * Mock-up del destino Android: una app de operaciones en campo, con la
 * gramática de Material 3 (barra superior, chips de filtro, tarjetas, FAB y
 * navegación inferior). Decorativo — ver `WebMockup`.
 */
export function AndroidMockup() {
  return (
    <div className="mk mk-android">
      {/* Barra de estado con cámara perforada */}
      <div className="mk-status">
        <span>09:41</span>
        <span className="mk-punch" />
        <span className="mk-status-r">
          <i className="mk-sig" />
          <i className="mk-batt" />
        </span>
      </div>

      <div className="mk-appbar">
        <span className="mk-appbar-t">Operaciones</span>
        <span className="mk-appbar-a">
          <Glyph name="bell" className="mk-ico" />
          <Glyph name="dots" className="mk-ico" />
        </span>
      </div>

      <div className="mk-field">
        <Glyph name="search" className="mk-ico" />
        Buscar orden o activo
      </div>

      <div className="mk-chips">
        {CHIPS.map((chip, index) => (
          <span key={chip} className={index === 0 ? "mk-chip mk-on" : "mk-chip"}>
            {chip}
          </span>
        ))}
      </div>

      <div className="mk-cards">
        {ITEMS.map((item, index) => (
          <div key={item.title} className={index === 0 ? "mk-card mk-on" : "mk-card"}>
            <span className="mk-card-i">
              <Glyph name={item.icon} className="mk-ico" />
            </span>
            <span className="mk-card-t">
              <b>{item.title}</b>
              <em>{item.meta}</em>
            </span>
            <span className="mk-tag">{item.tag}</span>
          </div>
        ))}
      </div>

      <span className="mk-fab">
        <Glyph name="plus" className="mk-ico" />
      </span>

      <div className="mk-navbar">
        {NAV.map((item, index) => (
          <span key={item.label} className={index === 0 ? "mk-nav-i mk-on" : "mk-nav-i"}>
            <Glyph name={item.icon} className="mk-ico" />
            <em>{item.label}</em>
          </span>
        ))}
      </div>
    </div>
  );
}
