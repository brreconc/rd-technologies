import "server-only";

/**
 * Capa de servicios de contacto (§4.6).
 *
 * Aísla el "backend" del formulario tras una interfaz (`ContactChannel`). Los
 * route handlers dependen de esta abstracción, no de una implementación
 * concreta, así que enchufar email real (Resend/Nodemailer) o una base de datos
 * en el futuro **no obliga a tocar la UI ni los handlers** — solo se añade otra
 * implementación de `ContactChannel` y se selecciona en `getContactChannel()`.
 *
 * `server-only` garantiza que este módulo nunca acabe en el bundle del cliente.
 */

/** Metadatos que el handler adjunta a cada envío (para auditoría/anti-abuso). */
export interface SubmissionMeta {
  ip: string;
  submittedAt: string; // ISO 8601
  userAgent?: string;
}

/** Mensaje de contacto ya validado y sanitizado. */
export interface ContactMessage {
  name: string;
  email: string;
  company?: string;
  message: string;
  meta: SubmissionMeta;
}

/** Alta de newsletter ya validada y sanitizada. */
export interface NewsletterSubscription {
  email: string;
  meta: SubmissionMeta;
}

export interface DeliveryResult {
  /** Identificador del envío (para trazas/depuración). */
  id: string;
}

/**
 * Contrato del canal de entrega. Cualquier backend futuro (Resend, cola, BD)
 * implementa esta interfaz.
 */
export interface ContactChannel {
  readonly name: string;
  deliverContactMessage(message: ContactMessage): Promise<DeliveryResult>;
  deliverNewsletterSubscription(sub: NewsletterSubscription): Promise<DeliveryResult>;
}

function newId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ?? `id_${Date.now()}_${Math.random().toString(36).slice(2)}`
  );
}

/**
 * Implementación LOCAL: registra el envío en el log del servidor. No manda
 * correos ni persiste nada externo (fase local, §16). El email queda ofuscado
 * en el log para no volcar PII en claro.
 */
function createLogChannel(): ContactChannel {
  const maskEmail = (email: string): string => {
    const [user = "", domain = ""] = email.split("@");
    const head = user.slice(0, 2);
    return `${head}${"*".repeat(Math.max(1, user.length - 2))}@${domain}`;
  };

  return {
    name: "log",
    async deliverContactMessage(message) {
      const id = newId();
      console.info("[contact] nuevo mensaje", {
        id,
        name: message.name,
        email: maskEmail(message.email),
        company: message.company || undefined,
        messageLength: message.message.length,
        meta: message.meta,
      });
      return { id };
    },
    async deliverNewsletterSubscription(sub) {
      const id = newId();
      console.info("[newsletter] nueva suscripción", {
        id,
        email: maskEmail(sub.email),
        meta: sub.meta,
      });
      return { id };
    },
  };
}

let channel: ContactChannel | null = null;

/**
 * Devuelve el canal activo (singleton). Hoy siempre el de log (fase local).
 * Aquí se decidirá a futuro según entorno, p. ej.:
 *   if (env.RESEND_API_KEY) return createResendChannel(...)
 */
export function getContactChannel(): ContactChannel {
  channel ??= createLogChannel();
  return channel;
}
