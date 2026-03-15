import type { ContainerBuilder } from "diod";

import { TestimonialRepository } from "@/contexts/testimonials/domain/testimonial.repository";
import { SupabaseTestimonialRepository } from "@/contexts/testimonials/infrastructure/supabase-testimonial.repository";
import { CreateTestimonialUseCase } from "@/contexts/testimonials/use-cases/create-testimonial.use-case";
import { GetAllTestimonialsUseCase } from "@/contexts/testimonials/use-cases/get-all-testimonials.use-case";
import { GetTestimonialByIdUseCase } from "@/contexts/testimonials/use-cases/get-testimonial-by-id.use-case";
import { UpdateTestimonialUseCase } from "@/contexts/testimonials/use-cases/update-testimonial.use-case";

export const registerTestimonialsContainer = (builder: ContainerBuilder): void => {
  // Domain & Infrastructure
  builder.register(TestimonialRepository).useClass(SupabaseTestimonialRepository).asSingleton();

  // Use Cases
  builder.registerAndUse(CreateTestimonialUseCase);
  builder.registerAndUse(GetAllTestimonialsUseCase);
  builder.registerAndUse(GetTestimonialByIdUseCase);
  builder.registerAndUse(UpdateTestimonialUseCase);
};
