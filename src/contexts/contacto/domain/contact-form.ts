import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Nombre inválido").max(120),
  phone: z.string().trim().min(7, "Teléfono inválido").max(30),
  email: z.email("Email inválido").trim().max(200),
  service: z.string().trim().max(120).optional(),
  message: z.string().trim().max(256),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
