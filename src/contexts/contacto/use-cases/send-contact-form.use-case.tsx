import { Service } from "diod";

import { envs } from "@/config/envs";
import { type ContactFormInput,contactFormSchema } from "@/contexts/contacto/domain/contact-form";
import ContactClientEmail from "@/contexts/contacto/presentation/emails/ContactClientEmail";
import ContactSynovaEmail from "@/contexts/contacto/presentation/emails/ContactSynovaEmail";
import { EmailService } from "@/contexts/shared/domain/email.service";

@Service()
export class SendContactFormUseCase {
  constructor(private readonly emailService: EmailService) {}

  async execute(input: ContactFormInput): Promise<void> {
    const parsed = contactFormSchema.safeParse(input);

    if (!parsed.success) {
      throw new Error("Datos del formulario inválidos");
    }

    const data = parsed.data;
    const serviceLabel = data.service && data.service.length > 0 ? data.service : "No especificado";
    const baseUrl = envs.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const logoUrl = `${baseUrl}/synova-al-lado-amarillo-blanco.svg`;

    await this.emailService.send({
      from: `SYNOVA <${envs.CONTACT_SENDER_EMAIL}>`,
      to: data.email,
      subject: "Recibimos tu solicitud en SYNOVA",
      replyTo: envs.CONTACT_REPLY_TO_EMAIL,
      react: (
        <ContactClientEmail
          logoUrl={logoUrl}
          name={data.name}
          service={serviceLabel}
          message={data.message}
          contactEmail={envs.CONTACT_REPLY_TO_EMAIL}
        />
      ),
    });

    await this.emailService.send({
      from: `SYNOVA Web <${envs.CONTACT_SENDER_EMAIL}>`,
      to: envs.CONTACT_NOTIFICATION_EMAIL,
      subject: `Nuevo contacto web: ${data.name}`,
      replyTo: data.email,
      react: (
        <ContactSynovaEmail
          logoUrl={logoUrl}
          name={data.name}
          email={data.email}
          phone={data.phone}
          service={serviceLabel}
          message={data.message}
        />
      ),
    });
  }
}
