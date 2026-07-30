import { Globe, Smartphone, TabletSmartphone, MonitorCog, type LucideIcon } from "lucide-react";

export type PlatformId = "web" | "android" | "ios" | "escritorio";

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
  /**
   * Geometría del dispositivo dentro del escenario, en PORCENTAJE del mismo:
   * así el morfismo es fluido en cualquier viewport sin números mágicos en px.
   */
  frame: { width: string; height: string; radius: number };
}

/**
 * Sección "Plataformas" (§8) — los cuatro destinos que sabemos construir.
 *
 * El mensaje es deliberadamente breve: el cliente no viene a leer, viene a
 * comprobar de un vistazo que cubrimos su pantalla. El peso lo lleva el deck
 * interactivo (`PlatformDeck`), que compila un mock-up del destino elegido.
 *
 * Los `viewBox` de los mock-ups (ver `DeviceScreens`) están calculados para la
 * proporción de cada `frame`; si se cambia uno hay que cambiar el otro.
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
    frame: { width: "98%", height: "60.7%", radius: 14 },
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
    frame: { width: "47%", height: "94%", radius: 28 },
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
    frame: { width: "47%", height: "94%", radius: 40 },
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
    frame: { width: "96%", height: "61.4%", radius: 10 },
  },
] satisfies Platform[];

/** Plataforma que se muestra al cargar (y en el HTML del servidor). */
export const defaultPlatformId: PlatformId = platforms[0].id;
