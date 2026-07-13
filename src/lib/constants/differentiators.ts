import { Target, ShieldCheck, Cpu, Handshake, Eye, type LucideIcon } from "lucide-react";

export interface Differentiator {
  icon: LucideIcon;
  title: string;
  description: string;
}

/** Sección "Por qué elegirnos" (§8.4). Copy oficial de Prompt.md. */
export const differentiators = [
  {
    icon: Target,
    title: "Creamos con propósito",
    description:
      "No solo escribimos código, construimos soluciones que resuelven problemas reales.",
  },
  {
    icon: ShieldCheck,
    title: "Seguridad desde el inicio",
    description: "Cada línea de código está pensada para proteger tu negocio y tus datos.",
  },
  {
    icon: Cpu,
    title: "Tecnología moderna",
    description:
      "Usamos las herramientas más avanzadas para garantizar rendimiento y escalabilidad.",
  },
  {
    icon: Handshake,
    title: "Acompañamiento continuo",
    description: "Estamos contigo antes, durante y después del lanzamiento.",
  },
  {
    icon: Eye,
    title: "Transparencia total",
    description: "Trabajamos de forma clara y comunicativa, sin sorpresas.",
  },
] satisfies Differentiator[];
