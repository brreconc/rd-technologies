import type { PlatformId } from "@/lib/constants/platforms";
import { WebMockup } from "./WebMockup";
import { EcommerceMockup } from "./EcommerceMockup";
import { AndroidMockup } from "./AndroidMockup";
import { IosMockup } from "./IosMockup";
import { DesktopMockup } from "./DesktopMockup";

/**
 * Interfaz simulada de cada destino. Solo hay UNA montada a la vez: el deck
 * cambia de mock-up al cambiar de plataforma, así que el coste en DOM es el de
 * una sola pantalla, no el de cinco.
 */
export const MOCKUPS: Record<PlatformId, () => React.JSX.Element> = {
  web: WebMockup,
  ecommerce: EcommerceMockup,
  android: AndroidMockup,
  ios: IosMockup,
  escritorio: DesktopMockup,
};
