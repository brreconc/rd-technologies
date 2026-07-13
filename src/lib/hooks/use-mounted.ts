"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * `true` una vez hidratado en cliente, `false` en el render de servidor.
 * Útil para evitar mismatches de hidratación en componentes que dependen de
 * estado solo-cliente (p. ej. el tema activo).
 *
 * Se usa `useSyncExternalStore` (en lugar de `useState`+`useEffect`) porque es
 * la forma idiomática de leer "estamos en cliente" sin provocar renders en
 * cascada dentro de un efecto.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // snapshot en cliente
    () => false, // snapshot en servidor
  );
}
