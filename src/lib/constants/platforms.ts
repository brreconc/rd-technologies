import { Globe, Smartphone, TabletSmartphone, MonitorCog, type LucideIcon } from "lucide-react";

export type PlatformId = "web" | "android" | "ios" | "escritorio";

/**
 * Resolución nominal del destino. Es la fuente de verdad de DOS cosas a la vez:
 * el rótulo de cota que se lee sobre el escenario y la proporción real del
 * dispositivo. Un test unitario comprueba que no se separen — si alguien cambia
 * la resolución y no el marco, el instrumento estaría mintiendo.
 */
export interface Readout {
  /** Ancho nominal en px CSS. */
  w: number;
  /** Alto nominal en px CSS. */
  h: number;
  /** Segunda lectura, específica de la plataforma (densidad, escalado…). */
  note: string;
}

export interface Platform {
  id: PlatformId;
  /** Etiqueta corta de la pestaña. */
  label: string;
  /** Línea de apoyo bajo la etiqueta, en la pestaña. */
  kicker: string;
  icon: LucideIcon;
  /** Titular del panel (h3). */
  headline: string;
  /** Una frase que resume la propuesta. */
  description: string;
  /** Tres capacidades concretas. Corto y potente (§8). */
  capabilities: string[];
  /** Tecnologías con las que se construye. */
  stack: string[];
  /** Qué recibe el cliente al final — cierra el relato de "compilación". */
  deliverable: string;
  /**
   * Color de acento del destino. Se propaga como `--platform-accent` a todo el
   * deck (marco, resplandor, mock-up, chips), de modo que cambiar de plataforma
   * retiñe la escena entera. Todos superan AA sobre `--bg` (#0a0a0a).
   */
  accent: string;
  readout: Readout;
  /**
   * Geometría del dispositivo dentro del escenario, en PORCENTAJE del mismo:
   * así el morfismo es fluido en cualquier viewport sin números mágicos en px.
   * El escenario tiene proporción 5/4, y aquí solo se fija la dimensión
   * dominante: la otra la deduce `deviceFrame()` a partir de `readout`, que es
   * lo que garantiza que marco y rótulo cuenten lo mismo.
   */
  fit: { axis: "width" | "height"; pct: number; radius: number };
}

/**
 * Sección "Plataformas" (§8) — los cuatro destinos que sabemos construir.
 *
 * El mensaje es deliberadamente breve: el cliente no viene a leer, viene a
 * comprobar de un vistazo que cubrimos su pantalla. El peso lo lleva el deck
 * interactivo (`PlatformDeck`), que compila un mock-up del destino elegido.
 */
export const platforms = [
  {
    id: "web",
    label: "Web",
    kicker: "Apps, plataformas y landings",
    icon: Globe,
    headline: "Aplicaciones web y plataformas",
    description:
      "Desde una landing que convierte hasta el SaaS que sostiene tu operación, con la misma exigencia de rendimiento y seguridad.",
    capabilities: [
      "Landing pages y sitios corporativos que cargan en menos de un segundo",
      "Portales de cliente, paneles internos y productos SaaS a medida",
      "Instalable como app (PWA), con funcionamiento sin conexión",
    ],
    stack: ["Next.js", "React", "TypeScript", "PWA"],
    deliverable: "Despliegue continuo · SEO técnico · Auditoría de seguridad",
    accent: "#00f5ff",
    readout: { w: 1440, h: 900, note: "escala 1.0" },
    fit: { axis: "width", pct: 94, radius: 0 },
  },
  {
    id: "android",
    label: "Android",
    kicker: "Nativo y multiplataforma",
    icon: Smartphone,
    headline: "Apps Android listas para publicar",
    description:
      "Del prototipo a Google Play sin sorpresas: firmadas, revisadas y preparadas para actualizarse solas.",
    capabilities: [
      "Desarrollo nativo en Kotlin o multiplataforma con un solo código",
      "Cámara, GPS, notificaciones, pagos y trabajo sin conexión",
      "Publicación, versionado y actualizaciones en Google Play",
    ],
    stack: ["Kotlin", "Jetpack Compose", "React Native", "Flutter"],
    deliverable: "AAB firmado · Ficha en Google Play · Canal de actualizaciones",
    accent: "#4ade80",
    readout: { w: 412, h: 915, note: "420 dpi" },
    fit: { axis: "height", pct: 94, radius: 26 },
  },
  {
    id: "ios",
    label: "iOS",
    kicker: "iPhone y iPad",
    icon: TabletSmartphone,
    headline: "Apps para iPhone y iPad",
    description:
      "Experiencias nativas que pasan la revisión de Apple a la primera porque se diseñan siguiendo sus guías desde el día uno.",
    capabilities: [
      "Desarrollo nativo en Swift y SwiftUI, o multiplataforma",
      "Diseño alineado con las Human Interface Guidelines de Apple",
      "Firma, revisión y publicación en App Store gestionadas por nosotros",
    ],
    stack: ["Swift", "SwiftUI", "React Native"],
    deliverable: "IPA firmado · Ficha en App Store · TestFlight para tu equipo",
    accent: "#a78bfa",
    readout: { w: 393, h: 852, note: "@3x · 120 Hz" },
    fit: { axis: "height", pct: 94, radius: 38 },
  },
  {
    id: "escritorio",
    label: "Escritorio",
    kicker: "Windows · macOS · Linux",
    icon: MonitorCog,
    headline: "Software de escritorio para empresas",
    description:
      "Las herramientas que mueven tu operación, funcionando en los tres sistemas desde una sola base de código.",
    capabilities: [
      "Windows, macOS y Linux con un único desarrollo y un único mantenimiento",
      "Integración con impresoras, lectores, balanzas y equipos en planta",
      "Instalación silenciosa por política y actualizaciones automáticas",
    ],
    stack: ["Electron", "Tauri", ".NET", "Rust"],
    deliverable: "Instalador firmado · Despliegue por política · Actualización automática",
    accent: "#ffd93d",
    readout: { w: 1920, h: 1080, note: "escalado 125%" },
    fit: { axis: "width", pct: 97, radius: 0 },
  },
] satisfies Platform[];

/** Plataforma que se muestra al cargar (y en el HTML del servidor). */
export const defaultPlatformId: PlatformId = platforms[0].id;

/** Proporción del escenario (ancho / alto). Debe coincidir con `.deck-stage-field`. */
export const STAGE_RATIO = 5 / 4;

/**
 * Traduce `fit` + `readout` a los porcentajes que consume el morfismo.
 *
 * Solo se declara la dimensión dominante y la otra se DEDUCE de la resolución
 * nominal, así que el dispositivo siempre tiene la proporción que anuncia su
 * rótulo. Es el detalle que convierte la transformación en algo medido en vez
 * de decorativo, y hace imposible que marco y cota se desincronicen.
 */
export function deviceFrame(platform: Platform): { width: string; height: string } {
  const { axis, pct } = platform.fit;
  const aspect = platform.readout.w / platform.readout.h;
  return axis === "width"
    ? { width: `${pct}%`, height: `${(pct * STAGE_RATIO) / aspect}%` }
    : { width: `${(pct * aspect) / STAGE_RATIO}%`, height: `${pct}%` };
}
