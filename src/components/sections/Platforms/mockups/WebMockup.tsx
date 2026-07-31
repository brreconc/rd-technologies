import * as React from "react";
import { Glyph, type GlyphName } from "./Glyph";

const SIDEBAR: GlyphName[] = ["home", "chart", "grid", "users", "shield", "cog"];

const KPIS = [
  { value: "1.284", delta: "+12%", label: "Usuarios" },
  { value: "87,4%", delta: "+2,1%", label: "Retención" },
  { value: "42,8k", delta: "+18%", label: "Peticiones" },
  { value: "0,9 s", delta: "−0,4 s", label: "Carga" },
];

/** Alturas de las barras de cada sparkline, en tanto por uno. */
const SPARKS = [
  [0.35, 0.5, 0.4, 0.65, 0.55, 0.8, 0.7, 0.9, 0.75, 1, 0.85, 0.95],
  [0.6, 0.55, 0.7, 0.5, 0.75, 0.65, 0.8, 0.7, 0.85, 0.8, 0.9, 0.88],
  [0.3, 0.45, 0.35, 0.55, 0.7, 0.6, 0.8, 0.65, 0.9, 0.85, 1, 0.9],
  [0.9, 0.85, 0.7, 0.75, 0.6, 0.55, 0.5, 0.45, 0.4, 0.35, 0.3, 0.28],
];

const ROWS = [
  ["Portal de clientes", "Activo", "12,4k", 95],
  ["Panel de operaciones", "En revisión", "8,2k", 78],
  ["Pasarela de API", "Activo", "23,1k", 99],
  ["Buscador interno", "Pausado", "4,6k", 42],
  ["Servicio de cuentas", "Activo", "17,8k", 88],
  ["Procesador de logs", "Activo", "9,3k", 63],
] as const;

/** Curva del gráfico de área, en el espacio del viewBox 300×100. */
const CURVE = "M0 78 L30 70 L60 74 L90 55 L120 60 L150 41 L180 46 L210 28 L240 33 L270 16 L300 20";

/**
 * Mock-up del destino Web: un panel de analítica SaaS.
 *
 * Decorativo: el contenedor lo marca `aria-hidden`. Las etiquetas son plausibles
 * y en español a propósito — un mock-up en falso latín se lee como un hueco sin
 * terminar, que es justo lo que esta sección no puede permitirse.
 */
export function WebMockup() {
  return (
    <div className="mk mk-web">
      {/* Cromo del navegador */}
      <div className="mk-chrome">
        <span className="mk-chrome-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="mk-url">
          <Glyph name="lock" className="mk-ico" />
          panel.rdtechnologies.dev
        </span>
        <span className="mk-chrome-tools">
          <Glyph name="refresh" className="mk-ico" />
          <Glyph name="dots" className="mk-ico" />
        </span>
      </div>

      <div className="mk-web-body">
        {/* Barra lateral de iconos */}
        <nav className="mk-web-side">
          {SIDEBAR.map((name, index) => (
            <span key={name} className={index === 1 ? "mk-web-side-i mk-on" : "mk-web-side-i"}>
              <Glyph name={name} className="mk-ico" />
            </span>
          ))}
        </nav>

        <div className="mk-web-main">
          {/* Barra superior */}
          <div className="mk-web-top">
            <span className="mk-crumb">
              Operación <b>/</b> Rendimiento
            </span>
            <span className="mk-search">
              <Glyph name="search" className="mk-ico" />
              Buscar
            </span>
            <span className="mk-avatar" />
          </div>

          {/* Tarjetas de indicadores */}
          <div className="mk-kpis">
            {KPIS.map((kpi, index) => (
              <div key={kpi.label} className="mk-kpi">
                <span className="mk-kpi-v">{kpi.value}</span>
                <span className="mk-kpi-d">{kpi.delta}</span>
                <span className="mk-kpi-l">{kpi.label}</span>
                <span className="mk-spark">
                  {SPARKS[index].map((h, i) => (
                    <i key={i} style={{ height: `${h * 100}%` }} />
                  ))}
                </span>
              </div>
            ))}
          </div>

          {/* Gráfico de área */}
          <div className="mk-chart">
            <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="mk-chart-svg">
              <defs>
                <linearGradient id="mkWebArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--platform-accent)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--platform-accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={`${CURVE} L300 100 L0 100 Z`} fill="url(#mkWebArea)" stroke="none" />
              <path d={CURVE} className="mk-chart-line" />
            </svg>
            <span className="mk-chart-axis">ENE · FEB · MAR · ABR · MAY · JUN</span>
          </div>

          {/* Tabla */}
          <div className="mk-table">
            <div className="mk-tr mk-th">
              <span>Servicio</span>
              <span>Estado</span>
              <span>Peticiones</span>
              <span>Salud</span>
            </div>
            {ROWS.map(([name, state, reqs, health]) => (
              <div key={name} className="mk-tr">
                <span>{name}</span>
                <span>{state}</span>
                <span>{reqs}</span>
                <span>
                  <i className="mk-meter">
                    <i style={{ width: `${health}%` }} />
                  </i>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
