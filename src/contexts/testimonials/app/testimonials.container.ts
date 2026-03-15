import type { ContainerBuilder } from "diod";

import { TestimonialRepository } from "@/contexts/testimonials/domain/testimonial.repository";
import { MockTestimonialRepository } from "@/contexts/testimonials/infrastructure/mock-testimonial.repository";
import { CreateTestimonialUseCase } from "@/contexts/testimonials/use-cases/create-testimonial.use-case";
import { GetAllTestimonialsUseCase } from "@/contexts/testimonials/use-cases/get-all-testimonials.use-case";
import { GetTestimonialByIdUseCase } from "@/contexts/testimonials/use-cases/get-testimonial-by-id.use-case";

export const registerTestimonialsContainer = (builder: ContainerBuilder): void => {
  // Domain & Infrastructure
  builder.register(TestimonialRepository).useClass(MockTestimonialRepository).asSingleton();

  // Use Cases
  builder.registerAndUse(CreateTestimonialUseCase);
  builder.registerAndUse(GetAllTestimonialsUseCase);
  builder.registerAndUse(GetTestimonialByIdUseCase);
};
