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
}

/** Sección "Proceso de trabajo" — 6 pasos (§8.5). Copy oficial de Prompt.md. */
export const processSteps = [
  {
    icon: MessagesSquare,
    title: "Escuchamos",
    description: "Analizamos tus necesidades, objetivos y desafíos.",
  },
  {
    icon: PencilRuler,
    title: "Diseñamos",
    description: "Creamos una hoja de ruta clara y una arquitectura robusta.",
  },
  {
    icon: Code2,
    title: "Construimos",
    description: "Desarrollamos con estándares de calidad y seguridad.",
  },
  {
    icon: FlaskConical,
    title: "Probamos",
    description: "Realizamos pruebas exhaustivas para garantizar un producto impecable.",
  },
  {
    icon: Rocket,
    title: "Lanzamos",
    description: "Entregamos tu solución y la ponemos en producción.",
  },
  {
    icon: Handshake,
    title: "Acompañamos",
    description: "Te damos soporte continuo y evolucionamos tu producto.",
  },
] satisfies ProcessStep[];
