import {
  MessagesSquare,
  PencilRuler,
  Code2,
  FlaskConical,
  Rocket,
  Handshake,
  type LucideIcon,
} from "lucide-react";

export interface ProcessStep {
  icon: LucideIcon;
  title: string;
  description: string;
  /**
   * Color del paso. Recorre el círculo cromático de principio a fin, así que la
   * línea de tiempo no es solo un progreso: es un VIAJE, y se percibe como tal
   * aunque no se lea una palabra. Se propaga a toda la sección como
   * `--step-accent` (marcador, estela, detonación y panel).
   *
   * Los seis superan AA sobre `--bg` (#0a0a0a) porque se usan como color de
   * texto en el panel. Hay un test unitario que lo comprueba.
   */
  accent: string;
}

/** Sección "Proceso de trabajo" — 6 pasos (§8.5). Copy oficial de Prompt.md. */
export const processSteps = [
  {
    icon: MessagesSquare,
    title: "Escuchamos",
    description: "Analizamos tus necesidades, objetivos y desafíos.",
    accent: "#00f5ff",
  },
  {
    icon: PencilRuler,
    title: "Diseñamos",
    description: "Creamos una hoja de ruta clara y una arquitectura robusta.",
    accent: "#a78bfa",
  },
  {
    icon: Code2,
    title: "Construimos",
    description: "Desarrollamos con estándares de calidad y seguridad.",
    accent: "#ff5f9e",
  },
  {
    icon: FlaskConical,
    title: "Probamos",
    description: "Realizamos pruebas exhaustivas para garantizar un producto impecable.",
    accent: "#fb923c",
  },
  {
    icon: Rocket,
    title: "Lanzamos",
    description: "Entregamos tu solución y la ponemos en producción.",
    accent: "#ffd93d",
  },
  {
    icon: Handshake,
    title: "Acompañamos",
    description: "Te damos soporte continuo y evolucionamos tu producto.",
    accent: "#4ade80",
  },
] satisfies ProcessStep[];

/** Milisegundos que dura el viaje de un hito al siguiente. */
export const TRAVEL_MS = 760;
/** Milisegundos que el recorrido se detiene en cada hito antes de continuar. */
export const DWELL_MS = 3200;
