import { Rocket, Building2, Landmark, HeartPulse, type LucideIcon } from "lucide-react";

export interface UseCase {
  icon: LucideIcon;
  title: string;
  description: string;
}

/** Sección "Casos de uso" (§8.6). Copy oficial de Prompt.md. */
export const useCases = [
  {
    icon: Rocket,
    title: "Startups",
    description: "Llevamos tu idea al mercado rápidamente con tecnología escalable.",
  },
  {
    icon: Building2,
    title: "Pymes",
    description: "Digitalizamos y optimizamos tus procesos internos.",
  },
  {
    icon: Landmark,
    title: "Corporaciones",
    description: "Desarrollamos sistemas robustos y seguros para grandes volúmenes de datos.",
  },
  {
    icon: HeartPulse,
    title: "Fintech y salud",
    description: "Cumplimos con los más altos estándares de seguridad y regulaciones.",
  },
] satisfies UseCase[];
