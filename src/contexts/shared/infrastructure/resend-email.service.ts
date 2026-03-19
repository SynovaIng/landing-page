import { Service } from "diod";
import { Resend } from "resend";

import { envs } from "@/config/envs";
import type { SendEmailInput } from "@/contexts/shared/domain/email.service";
import { EmailService } from "@/contexts/shared/domain/email.service";

@Service()
export class ResendEmailService extends EmailService {
  private readonly client: Resend | null;

  constructor() {
    super();
    this.client = envs.RESEND_API_KEY ? new Resend(envs.RESEND_API_KEY) : null;
  }

  async send(input: SendEmailInput): Promise<void> {
    if (!this.client) {
      throw new Error("RESEND_API_KEY no está configurada");
    }

    const response = await this.client.emails.send({
      from: input.from,
      to: input.to,
      subject: input.subject,
      react: input.react,
      html: input.html,
      text: input.text,
      replyTo: input.replyTo,
    });

    if (response.error) {
      throw new Error(response.error.message ?? "No se pudo enviar el correo");
    }
  }
}
