export interface FaqItem {
  question: string;
  answer: string;
}

/** Sección "Preguntas frecuentes" (§8.8). Preguntas oficiales de Prompt.md. */
export const faq = [
  {
    question: "¿Qué tecnologías utilizan para desarrollar?",
    answer:
      "Elegimos la tecnología según tu proyecto, priorizando estándares modernos, estables y con soporte a largo plazo. Cubrimos desarrollo web, móvil (Android e iOS) y sistemas empresariales, siempre con una arquitectura escalable y mantenible.",
  },
  {
    question: "¿Cómo garantizan la seguridad de mi proyecto?",
    answer:
      "Aplicamos seguridad desde el diseño (Secure by Design): validación y protección de datos, buenas prácticas de código y revisión continua de calidad y vulnerabilidades a lo largo de todo el ciclo de desarrollo.",
  },
  {
    question: "¿Cuánto tiempo toma desarrollar una aplicación?",
    answer:
      "Depende del alcance y la complejidad. Tras una primera conversación definimos objetivos y una hoja de ruta con fases y estimaciones claras, para que sepas qué esperar en cada etapa.",
  },
  {
    question: "¿Ofrecen soporte después del lanzamiento?",
    answer:
      "Sí. El lanzamiento no es el final: ofrecemos mantenimiento, actualizaciones y soporte técnico continuo, y evolucionamos tu producto a medida que crece tu negocio.",
  },
  {
    question: "¿Pueden trabajar con mi equipo interno?",
    answer:
      "Por supuesto. Nos integramos con tu equipo de forma transparente, compartiendo documentación y buenas prácticas para que la colaboración sea fluida.",
  },
  {
    question: "¿Qué pasa si necesito cambios después de finalizar el proyecto?",
    answer:
      "Los productos digitales evolucionan. Incorporamos mejoras y nuevas funcionalidades de forma planificada, manteniendo la calidad y la seguridad del sistema.",
  },
] satisfies FaqItem[];
