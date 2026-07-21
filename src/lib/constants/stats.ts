/**
 * Banda de métricas de confianza del hero (Fase 8). Valores ILUSTRATIVOS,
 * pendientes de confirmar con el cliente (§19) — igual que testimonios. Editar
 * aquí; el componente CountUp los anima al entrar en pantalla.
 */
export interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
}

export const stats: Stat[] = [
  { value: 50, suffix: "+", label: "Proyectos entregados" },
  { value: 99.9, suffix: "%", decimals: 1, label: "Disponibilidad media" },
  { value: 10, suffix: "+", label: "Años de experiencia" },
  { value: 24, suffix: "/7", label: "Soporte y monitorización" },
];
