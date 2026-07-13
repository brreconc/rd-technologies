import { Code2, ShieldCheck, Headset, type LucideIcon } from "lucide-react";

export interface Service {
  icon: LucideIcon;
  title: string;
  features: string[];
}

/** Sección "Servicios" — 3 pilares (§8.3). Copy oficial de Prompt.md. */
export const services = [
  {
    icon: Code2,
    title: "Desarrollo de Software a Medida",
    features: [
      "Aplicaciones móviles para Android e iOS",
      "Plataformas web y sistemas empresariales",
      "Soluciones multiplataforma y nativas",
      "Arquitectura escalable y preparada para el futuro",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Código Seguro desde el Origen",
    features: [
      "Prácticas de desarrollo con seguridad integrada (Secure by Design)",
      "Protección de datos y cumplimiento normativo",
      "Monitoreo constante de calidad y vulnerabilidades",
      "Tu tranquilidad es nuestra prioridad",
    ],
  },
  {
    icon: Headset,
    title: "Soporte y Evolución Continua",
    features: [
      "Mantenimiento y actualizaciones constantes",
      "Escalamiento de soluciones a medida que crece tu negocio",
      "Soporte técnico especializado",
      "Nos convertimos en tu aliado tecnológico a largo plazo",
    ],
  },
] satisfies Service[];
