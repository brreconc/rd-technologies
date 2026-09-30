import { Target, ShieldCheck, Cpu, Handshake, Eye, type LucideIcon } from "lucide-react";

export interface Differentiator {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Color de marca del tema; tiñe su parada en la línea de tiempo (`--df-accent`). */
  accent: string;
}

/** Sección "Por qué elegirnos" (§8.4). Copy oficial de Prompt.md. */
export const differentiators = [
  {
    icon: Target,
    title: "Creamos con propósito",
    description:
      "No solo escribimos código, construimos soluciones que resuelven problemas reales.",
    accent: "#00f5ff",
  },
  {
    icon: ShieldCheck,
    title: "Seguridad desde el inicio",
    description: "Cada línea de código está pensada para proteger tu negocio y tus datos.",
    accent: "#a78bfa",
  },
  {
    icon: Cpu,
    title: "Tecnología moderna",
    description:
      "Usamos las herramientas más avanzadas para garantizar rendimiento y escalabilidad.",
    accent: "#4fb3ff",
  },
  {
    icon: Handshake,
    title: "Acompañamiento continuo",
    description: "Estamos contigo antes, durante y después del lanzamiento.",
    accent: "#34e5c4",
  },
  {
    icon: Eye,
    title: "Transparencia total",
    description: "Trabajamos de forma clara y comunicativa, sin sorpresas.",
    accent: "#ffd93d",
  },
] satisfies Differentiator[];
