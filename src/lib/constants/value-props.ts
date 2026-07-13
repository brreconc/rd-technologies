import { Code2, ShieldCheck, Handshake, type LucideIcon } from "lucide-react";

export interface Pillar {
  icon: LucideIcon;
  title: string;
  description: string;
}

/** Sección "Propuesta de valor" (§8.2). Copy oficial de Prompt.md. */
export const valueProps = {
  title: "Construimos el futuro digital de tu negocio con total confianza",
  text: "Somos una empresa de desarrollo de software especializada en crear soluciones personalizadas para cualquier necesidad tecnológica. Desde aplicaciones móviles y plataformas web hasta sistemas empresariales complejos, nos aseguramos de que cada producto que entregamos sea escalable, eficiente y esté protegido contra amenazas desde su concepción. Nuestro enfoque combina la excelencia en el desarrollo con prácticas de código seguro, garantizando que tu negocio esté siempre un paso adelante.",
  pillars: [
    {
      icon: Code2,
      title: "Desarrollo",
      description: "Software a medida, escalable y preparado para el futuro.",
    },
    {
      icon: ShieldCheck,
      title: "Seguridad",
      description: "Código seguro desde el origen y protección de datos.",
    },
    {
      icon: Handshake,
      title: "Soporte",
      description: "Acompañamiento y evolución continua a largo plazo.",
    },
  ],
} satisfies { title: string; text: string; pillars: Pillar[] };
