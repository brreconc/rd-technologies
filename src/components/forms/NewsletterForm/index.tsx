"use client";

import { useId, useState, type BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AntiBotFields, readAntiBotPayload, useAntiBot } from "@/components/forms/anti-bot";
import { postForm } from "@/components/forms/post-form";
import {
  NEWSLETTER_DEFAULTS,
  NEWSLETTER_LIMITS,
  newsletterFormSchema,
  type NewsletterFormValues,
} from "@/lib/utils/validators";

type Status = "idle" | "submitting" | "success" | "rate_limit" | "error";

/**
 * Suscripción a la newsletter (§9.2). Mismo modelo de seguridad y accesibilidad
 * que el formulario de contacto, en formato compacto para el pie de página.
 */
export function NewsletterForm() {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: NEWSLETTER_DEFAULTS,
    mode: "onTouched",
  });

  const [status, setStatus] = useState<Status>("idle");
  const timingRef = useAntiBot();
  const fieldId = useId();
  const errorId = `${fieldId}-email-error`;
  const statusId = `${fieldId}-status`;

  async function onSubmit(values: NewsletterFormValues, event?: BaseSyntheticEvent) {
    setStatus("submitting");

    const antiBot = readAntiBotPayload(
      event?.target as HTMLFormElement | undefined,
      event?.timeStamp ?? 0,
    );
    const result = await postForm("/api/newsletter", { ...values, ...antiBot });

    switch (result.status) {
      case "success":
        setStatus("success");
        reset();
        break;
      case "validation":
        setStatus("error");
        if (result.fieldErrors.email) {
          setError("email", { type: "server", message: result.fieldErrors.email });
          setFocus("email");
        }
        break;
      case "rate_limit":
        setStatus("rate_limit");
        break;
      default:
        setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-2">
      <Label htmlFor={`${fieldId}-email`} className="text-foreground text-sm font-semibold">
        Newsletter
      </Label>
      <p className="text-muted text-sm">Novedades sobre desarrollo seguro. Sin spam.</p>

      <AntiBotFields timingRef={timingRef} />

      <div className="mt-1 flex flex-col gap-2 sm:flex-row">
        <Input
          id={`${fieldId}-email`}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          maxLength={NEWSLETTER_LIMITS.email.max}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? errorId : undefined}
          {...register("email")}
        />
        <Button type="submit" variant="secondary" disabled={isSubmitting} className="shrink-0">
          {isSubmitting ? "Enviando…" : "Suscribirme"}
        </Button>
      </div>

      {errors.email && (
        <p id={errorId} role="alert" className="text-danger text-sm">
          {errors.email.message}
        </p>
      )}

      <p id={statusId} aria-live="polite" className="text-sm">
        {status === "success" && (
          <span className="text-success">¡Listo! Revisa tu correo para confirmar.</span>
        )}
        {status === "rate_limit" && (
          <span className="text-danger">Demasiados intentos. Prueba en un minuto.</span>
        )}
        {status === "error" && !errors.email && (
          <span className="text-danger">No se pudo completar. Inténtalo de nuevo.</span>
        )}
      </p>
    </form>
  );
}
