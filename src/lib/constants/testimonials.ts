export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

/**
 * Sección "Testimonios" (§8.7).
 * ⚠️ EJEMPLOS ILUSTRATIVOS — placeholders a reemplazar por testimonios reales
 * provistos por el cliente (§19.9). Se muestran con un aviso visible.
 */
export const testimonials = [
  {
    quote:
      "Entendieron nuestra visión desde el primer día y entregaron una plataforma sólida y segura. La comunicación fue clara en todo momento.",
    name: "Cliente anónimo",
    role: "Dirección de Tecnología · Fintech",
  },
  {
    quote:
      "El acompañamiento después del lanzamiento marcó la diferencia. Sentimos que tenemos un aliado tecnológico, no solo un proveedor.",
    name: "Cliente anónimo",
    role: "Gerencia de Operaciones · Pyme",
  },
  {
    quote:
      "La seguridad estuvo presente en cada etapa. Nos dio la tranquilidad de saber que nuestros datos están protegidos.",
    name: "Cliente anónimo",
    role: "Dirección General · Salud",
  },
] satisfies Testimonial[];
