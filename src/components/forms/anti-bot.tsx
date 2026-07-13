"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { ELAPSED_FIELD, HONEYPOT_FIELD, MIN_FILL_MS } from "@/lib/utils/validators";

/**
 * Capa anti-bot cliente: honeypot + time-trap (§9.2).
 *
 * Diseñada para cumplir las reglas del React Compiler (`react-hooks/purity` y
 * `react-hooks/refs`): NO se leen refs ni se llama a funciones impuras
 * (`Date.now`/`performance.now`) dentro del callback de `handleSubmit`. En su
 * lugar:
 *  - El instante de montaje se guarda en un input oculto vía `useEffect`.
 *  - En el envío, honeypot y tiempo se leen del `FormData` del propio evento y
 *    el "ahora" se toma de `event.timeStamp` (misma base que `performance.now`).
 */

/** Campo oculto (no enviado) que transporta el instante de montaje del form. */
const TIMING_FIELD = "form_render_ts";

/** Estilo para ocultar el honeypot a humanos sin usar `display:none`. */
const OFFSCREEN: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0,
};

/** Registra el instante de montaje en el input oculto de tiempo. */
export function useAntiBot(): React.RefObject<HTMLInputElement | null> {
  const timingRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (timingRef.current) timingRef.current.value = String(performance.now());
  }, []);
  return timingRef;
}

/** Campos ocultos anti-bot que se colocan dentro del `<form>`. */
export function AntiBotFields({ timingRef }: { timingRef: React.Ref<HTMLInputElement> }) {
  return (
    <div aria-hidden="true" style={OFFSCREEN}>
      <label htmlFor={HONEYPOT_FIELD}>No rellenar este campo</label>
      <input
        id={HONEYPOT_FIELD}
        name={HONEYPOT_FIELD}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
      <input ref={timingRef} name={TIMING_FIELD} type="hidden" defaultValue="" />
    </div>
  );
}

/** Extrae el payload anti-bot del formulario en el momento del envío. */
export function readAntiBotPayload(
  form: HTMLFormElement | undefined,
  submitTimeStamp: number,
): Record<string, unknown> {
  if (!form) return { [HONEYPOT_FIELD]: "", [ELAPSED_FIELD]: MIN_FILL_MS + 1 };

  const data = new FormData(form);
  const honeypot = String(data.get(HONEYPOT_FIELD) ?? "");
  const start = Number(data.get(TIMING_FIELD));
  const elapsed =
    Number.isFinite(start) && submitTimeStamp > 0
      ? Math.max(0, Math.round(submitTimeStamp - start))
      : MIN_FILL_MS + 1;

  return { [HONEYPOT_FIELD]: honeypot, [ELAPSED_FIELD]: elapsed };
}
