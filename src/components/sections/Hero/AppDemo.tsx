import * as React from "react";
import type { ConsoleScenario } from "@/lib/constants/hero-console";
import type { PlatformId } from "@/lib/constants/platforms";
import { MOCKUPS } from "@/components/sections/Platforms/mockups";
import { GlobeEmblem, MobileEmblem, RobotEmblem, WindowEmblem } from "./logos";

/**
 * DEMO de la app creada (Fase 16.1/16.2, ADR-019). Cuando la consola termina de
 * compilar, esta capa la CUBRE y muestra la aplicación REAL "en ejecución":
 * reutiliza los mock-ups del deck de Plataformas (paneles, gráficos, tablas y
 * chrome real), así que se ve como una app de verdad y no un boceto. Un splash
 * de lanzamiento con el logo 3D se desvanece y la revela.
 *
 * Todo se tiñe desde `--hcd-accent`/`--platform-accent` (mismo color), de modo
 * que la escena y el mock-up convergen con la plataforma. Es puro markup + CSS
 * (sin estado ni temporizadores); vive dentro del `<canvas>`/consola padre, que
 * ya es `aria-hidden`.
 */

const LOGOS = {
  web: GlobeEmblem,
  android: RobotEmblem,
  ios: MobileEmblem,
  windows: WindowEmblem,
} as const;

/** Cada plataforma de la consola con el mock-up equivalente del deck. */
const MOCKUP_OF: Record<ConsoleScenario["id"], PlatformId> = {
  web: "web",
  android: "android",
  ios: "ios",
  windows: "escritorio",
};

export function AppDemo({ scenario }: { scenario: ConsoleScenario }) {
  const Logo = LOGOS[scenario.id];
  const Mockup = MOCKUPS[MOCKUP_OF[scenario.id]];
  const frameClass =
    scenario.id === "web" ? "hcd-browser" : scenario.id === "windows" ? "hcd-window" : "hcd-phone";

  const style = {
    "--hcd-accent": scenario.accent,
    "--platform-accent": scenario.accent,
  } as React.CSSProperties;

  return (
    <div className="hcd" style={style}>
      <span className="hcd-sweep" />
      <div className={`${frameClass} hcd-shadow`}>
        <div className="hcd-screen">
          {/* La app real (mock-up del deck), escalada por el contenedor. */}
          <Mockup />

          {/* Splash de lanzamiento: se desvanece y revela la app. */}
          <div className="hcd-splash">
            <span className="hcd-logo">
              <Logo />
            </span>
            <span className="hcd-splash-name">{scenario.appName}</span>
            <span className="hcd-splash-sub">
              <i />
              COMPILADO · EN EJECUCIÓN
            </span>
          </div>
        </div>
      </div>

      {/* Emblema persistente: el logo de la plataforma sigue presente en la app. */}
      <span className="hcd-badge">
        <Logo />
      </span>
    </div>
  );
}
