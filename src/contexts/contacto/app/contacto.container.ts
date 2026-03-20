import type { ContainerBuilder } from "diod";

import { SendContactFormUseCase } from "@/contexts/contacto/use-cases/send-contact-form.use-case";

export const registerContactoContainer = (builder: ContainerBuilder): void => {
  builder.registerAndUse(SendContactFormUseCase);
};
