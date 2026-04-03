"use server";

import { redirect } from "next/navigation";

import { container } from "@/config/container";
import { SendContactFormUseCase } from "@/contexts/contacto/use-cases/send-contact-form.use-case";
import { GetAllServicesUseCase } from "@/contexts/services/use-cases/get-all-services.use-case";
import { verifyTurnstileToken } from "@/lib/turnstile/verify-turnstile-token";

const toContactoError = (message: string): never => {
  redirect(`/contacto?error=${encodeURIComponent(message)}`);
};

export const sendContactFormAction = async (formData: FormData): Promise<void> => {
  const turnstileToken = String(formData.get("cf-turnstile-response") ?? "").trim();

  if (!turnstileToken) {
    toContactoError("Completa la validación anti-spam para continuar");
  }

  const turnstileValid = await verifyTurnstileToken(turnstileToken);
  if (!turnstileValid) {
    toContactoError("No se pudo validar la verificación anti-spam. Intenta nuevamente.");
  }

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const serviceId = String(formData.get("service") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  let service = "";
  if (serviceId === "otro") {
    service = "Otro";
  } else if (serviceId.length > 0) {
    const services = await container.get(GetAllServicesUseCase).execute();
    service = services.find((currentService) => currentService.id === serviceId)?.title ?? serviceId;
  }

  try {
    await container.get(SendContactFormUseCase).execute({
      name,
      phone,
      email,
      service,
      message,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "No se pudo enviar el formulario";
    toContactoError(errorMessage);
  }

  redirect("/contacto?sent=1");
};
