"use client";

import { useId, useState, type BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Label } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AntiBotFields, readAntiBotPayload, useAntiBot } from "@/components/forms/anti-bot";
import { postForm } from "@/components/forms/post-form";
import {
  CONTACT_DEFAULTS,
  CONTACT_LIMITS,
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/utils/validators";

type Status = "idle" | "submitting" | "success" | "rate_limit" | "error";

/**
 * Formulario de contacto (§8.9 / §9.2).
 *
 * - Validación con el MISMO esquema Zod que el servidor (fuente única de verdad).
 * - Anti-bot: honeypot + time-trap (ms desde el montaje hasta el envío).
 * - Accesibilidad (§10): errores asociados por `aria-describedby`, `aria-invalid`,
 *   `role="alert"`, foco al primer error y región de estado `aria-live`.
 * - El servidor manda: si rechaza por validación, sus errores se pintan por campo.
 */
export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: CONTACT_DEFAULTS,
    mode: "onTouched",
  });

  const [status, setStatus] = useState<Status>("idle");
  const timingRef = useAntiBot();
  const fieldId = useId();

  const errId = (name: keyof ContactFormValues) => `${fieldId}-${name}-error`;

  async function onSubmit(values: ContactFormValues, event?: BaseSyntheticEvent) {
    setStatus("submitting");

    const antiBot = readAntiBotPayload(
      event?.target as HTMLFormElement | undefined,
      event?.timeStamp ?? 0,
    );
    const result = await postForm("/api/contact", { ...values, ...antiBot });

    switch (result.status) {
      case "success":
        setStatus("success");
        reset();
        break;
      case "validation": {
        setStatus("error");
        const fields = Object.keys(result.fieldErrors) as (keyof ContactFormValues)[];
        for (const name of fields) {
          setError(name, { type: "server", message: result.fieldErrors[name] });
        }
        if (fields[0]) setFocus(fields[0]);
        break;
      }
      case "rate_limit":
        setStatus("rate_limit");
        break;
      default:
        setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="border-success/40 bg-success/10 text-foreground rounded-xl border p-6 text-center"
      >
        <p className="font-display text-lg font-semibold">¡Mensaje enviado!</p>
        <p className="text-muted mt-1 text-sm">
          Gracias por escribirnos. Te responderemos lo antes posible.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => setStatus("idle")}
        >
          Enviar otro mensaje
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5 text-left">
      <AntiBotFields timingRef={timingRef} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${fieldId}-name`}>Nombre</Label>
          <Input
            id={`${fieldId}-name`}
            autoComplete="name"
            maxLength={CONTACT_LIMITS.name.max}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? errId("name") : undefined}
            {...register("name")}
          />
          {errors.name && (
            <p id={errId("name")} role="alert" className="text-danger mt-1.5 text-sm">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor={`${fieldId}-email`}>Correo electrónico</Label>
          <Input
            id={`${fieldId}-email`}
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={CONTACT_LIMITS.email.max}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? errId("email") : undefined}
            {...register("email")}
          />
          {errors.email && (
            <p id={errId("email")} role="alert" className="text-danger mt-1.5 text-sm">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor={`${fieldId}-company`}>
          Empresa <span className="text-muted font-normal">(opcional)</span>
        </Label>
        <Input
          id={`${fieldId}-company`}
          autoComplete="organization"
          maxLength={CONTACT_LIMITS.company.max}
          aria-invalid={!!errors.company}
          aria-describedby={errors.company ? errId("company") : undefined}
          {...register("company")}
        />
        {errors.company && (
          <p id={errId("company")} role="alert" className="text-danger mt-1.5 text-sm">
            {errors.company.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor={`${fieldId}-message`}>Mensaje</Label>
        <Textarea
          id={`${fieldId}-message`}
          maxLength={CONTACT_LIMITS.message.max}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? errId("message") : undefined}
          placeholder="Cuéntanos qué necesitas construir o proteger."
          {...register("message")}
        />
        {errors.message && (
          <p id={errId("message")} role="alert" className="text-danger mt-1.5 text-sm">
            {errors.message.message}
          </p>
        )}
      </div>

      {(status === "error" || status === "rate_limit") && (
        <p role="alert" className="text-danger text-sm">
          {status === "rate_limit"
            ? "Has enviado demasiados mensajes en poco tiempo. Espera un momento e inténtalo de nuevo."
            : "No se pudo enviar el mensaje. Revisa los datos e inténtalo de nuevo."}
        </p>
      )}

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Enviando…" : "Solicita una asesoría gratuita"}
        </Button>
        <p className="text-muted text-xs">Te responderemos por correo. No compartimos tus datos.</p>
      </div>
    </form>
  );
}
