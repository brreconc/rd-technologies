/**
 * Stack tecnológico mostrado en la cinta (marquee) bajo el hero (Fase 8).
 * Refuerza credibilidad técnica sin imágenes externas (solo texto + color → CSP
 * estricta, cero peticiones de red, cero peso de imágenes).
 *
 * `color` es el color de MARCA real de cada tecnología (el nodo luminoso de su
 * pastilla lo usa), verificado contra la identidad oficial / Simple Icons:
 *   TypeScript #3178C6 · React #61DAFB · Node.js #5FA04E · PostgreSQL #4169E1
 *   AWS #FF9900 · Docker #2496ED · Kubernetes #326CE5 · GraphQL #E10098
 *   Python #3776AB · Terraform #7B42BC.
 * Dos marcas son MONOCROMAS (su logotipo oficial es negro y no se vería sobre el
 * fondo oscuro), así que usamos su equivalente reconocible:
 *   Next.js → blanco #FFFFFF (su inverso oficial para fondos oscuros).
 *   Rust    → naranja "óxido" #F74C00 (el color con el que se identifica; el
 *             logotipo oficial es monocromo).
 * Ajustar libremente al stack real (nombre + color de marca).
 */
export interface Tech {
  name: string;
  /** Color de marca oficial (hex). */
  color: string;
}

export const techStack: readonly Tech[] = [
  { name: "TypeScript", color: "#3178C6" },
  { name: "React", color: "#61DAFB" },
  { name: "Next.js", color: "#FFFFFF" },
  { name: "Node.js", color: "#5FA04E" },
  { name: "PostgreSQL", color: "#4169E1" },
  { name: "AWS", color: "#FF9900" },
  { name: "Docker", color: "#2496ED" },
  { name: "Kubernetes", color: "#326CE5" },
  { name: "GraphQL", color: "#E10098" },
  { name: "Python", color: "#3776AB" },
  { name: "Rust", color: "#F74C00" },
  { name: "Terraform", color: "#7B42BC" },
] as const;
