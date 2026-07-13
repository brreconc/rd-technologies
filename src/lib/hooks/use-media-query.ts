"use client";

import { useEffect, useState } from "react";

/**
 * Suscribe un media query y devuelve si coincide. SSR-safe (arranca en `false`).
 * Ej.: `const isDesktop = useMediaQuery("(min-width: 1024px)")`.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
