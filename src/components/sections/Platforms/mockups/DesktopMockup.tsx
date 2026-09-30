import * as React from "react";

const MENU = ["Archivo", "Editar", "Ver", "Dispositivos", "Ayuda"];

const TREE = [
  { label: "Planta Norte", depth: 0, open: true },
  { label: "Línea de envasado", depth: 1 },
  { label: "Básculas", depth: 1 },
  { label: "Etiquetadoras", depth: 1 },
  { label: "Planta Sur", depth: 0 },
  { label: "Almacén central", depth: 0 },
] as const;

const DEVICES = [
  ["bascula-01", "activo", "12 ms", "v2.4.0", "ok"],
  ["etiqueta-02", "inactivo", "—", "v2.3.1", "off"],
  ["lector-07", "activo", "8 ms", "v3.0.2", "ok"],
  ["bascula-04", "reconectando", "—", "v2.4.0", "warn"],
  ["impresora-11", "activo", "21 ms", "v1.9.4", "ok"],
  ["lector-09", "activo", "14 ms", "v3.0.2", "ok"],
  ["bascula-06", "activo", "9 ms", "v2.4.0", "ok"],
  ["etiqueta-05", "reconectando", "—", "v2.3.1", "warn"],
  ["terminal-03", "activo", "6 ms", "v4.1.0", "ok"],
] as const;

const LOG = [
  ["INFO", "Analizando dependencias · 128 paquetes"],
  ["OK", "Compilación completada · 4 módulos"],
  ["INFO", "Empaquetando para Windows, macOS y Linux"],
  ["OK", "Paquete firmado con certificado EV"],
  ["INFO", "Publicando en canal estable…"],
  ["OK", "17 equipos actualizados por política"],
  ["INFO", "Sin incidencias en el despliegue"],
] as const;

const PROPS = [
  ["Equipo", "bascula-01"],
  ["Dirección", "10.0.4.22"],
  ["Estado", "Activo"],
  ["Actividad", "14 d 7 h"],
  ["Temperatura", "42 °C"],
  ["Firmware", "v2.4.0"],
] as const;

/**
 * Mock-up del destino Escritorio: una consola de operaciones con cromo nativo
 * (semáforos + barra de menú), árbol de navegación, tabla de equipos, consola de
 * registro e inspector de propiedades. Decorativo — ver `WebMockup`.
 */
export function DesktopMockup() {
  return (
    <div className="mk mk-desk">
      <div className="mk-win">
        <span className="mk-win-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="mk-win-t">Consola de operaciones — R&amp;D</span>
      </div>

      <div className="mk-menu">
        {MENU.map((item, index) => (
          <span key={item} className={index === 0 ? "mk-menu-i mk-on" : "mk-menu-i"}>
            {item}
          </span>
        ))}
      </div>

      <div className="mk-split">
        <div className="mk-tree">
          {TREE.map((node, index) => (
            <span
              key={node.label}
              className={index === 0 ? "mk-tree-i mk-on" : "mk-tree-i"}
              style={{ paddingInlineStart: `${0.35 + node.depth * 0.7}em` }}
            >
              <i className={node.depth === 0 ? "mk-caret" : "mk-leaf"} />
              {node.label}
            </span>
          ))}
        </div>

        <div className="mk-center">
          <div className="mk-dt">
            <div className="mk-dtr mk-dth">
              <span>Equipo</span>
              <span>Estado</span>
              <span>Ping</span>
              <span>Firmware</span>
            </div>
            {DEVICES.map(([name, state, ping, fw, tone]) => (
              <div key={name} className="mk-dtr">
                <span>{name}</span>
                <span className={`mk-st mk-st-${tone}`}>
                  <i />
                  {state}
                </span>
                <span>{ping}</span>
                <span>{fw}</span>
              </div>
            ))}
          </div>

          <div className="mk-log">
            {LOG.map(([level, text], index) => (
              <span key={index} className="mk-log-l">
                <b>[{level}]</b> {text}
              </span>
            ))}
            <span className="mk-log-l mk-caret-line">
              <b>$</b> <i className="mk-cursor" />
            </span>
          </div>
        </div>

        <div className="mk-insp">
          {PROPS.map(([key, value]) => (
            <span key={key} className="mk-prop">
              <em>{key}</em>
              <b>{value}</b>
            </span>
          ))}
        </div>
      </div>

      <div className="mk-statusbar">
        <span className="mk-conn">
          <i />
          Conectado
        </span>
        <span>17 equipos · 3 plantas</span>
      </div>
    </div>
  );
}
