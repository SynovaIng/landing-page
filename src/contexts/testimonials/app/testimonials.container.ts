import type { ContainerBuilder } from "diod";

import { TestimonialRepository } from "@/contexts/testimonials/domain/testimonial.repository";
import { SupabaseTestimonialRepository } from "@/contexts/testimonials/infrastructure/supabase-testimonial.repository";
import { CreateReviewLinkUseCase } from "@/contexts/testimonials/use-cases/create-review-link.use-case";
import { CreateTestimonialUseCase } from "@/contexts/testimonials/use-cases/create-testimonial.use-case";
import { DeleteTestimonialsUseCase } from "@/contexts/testimonials/use-cases/delete-testimonials.use-case";
import { GetAllTestimonialsUseCase } from "@/contexts/testimonials/use-cases/get-all-testimonials.use-case";
import { GetReviewByTokenUseCase } from "@/contexts/testimonials/use-cases/get-review-by-token.use-case";
import { GetTestimonialByIdUseCase } from "@/contexts/testimonials/use-cases/get-testimonial-by-id.use-case";
import { ReorderTestimonialsUseCase } from "@/contexts/testimonials/use-cases/reorder-testimonials.use-case";
import { SetTestimonialVisibilityUseCase } from "@/contexts/testimonials/use-cases/set-testimonial-visibility.use-case";
import { SubmitReviewByTokenUseCase } from "@/contexts/testimonials/use-cases/submit-review-by-token.use-case";
import { UpdateTestimonialUseCase } from "@/contexts/testimonials/use-cases/update-testimonial.use-case";

export const registerTestimonialsContainer = (builder: ContainerBuilder): void => {
  // Domain & Infrastructure
  builder.register(TestimonialRepository).useClass(SupabaseTestimonialRepository).asSingleton();

  // Use Cases
  builder.registerAndUse(CreateTestimonialUseCase);
  builder.registerAndUse(CreateReviewLinkUseCase);
  builder.registerAndUse(DeleteTestimonialsUseCase);
  builder.registerAndUse(GetAllTestimonialsUseCase);
  builder.registerAndUse(GetReviewByTokenUseCase);
  builder.registerAndUse(GetTestimonialByIdUseCase);
  builder.registerAndUse(ReorderTestimonialsUseCase);
  builder.registerAndUse(SetTestimonialVisibilityUseCase);
  builder.registerAndUse(SubmitReviewByTokenUseCase);
  builder.registerAndUse(UpdateTestimonialUseCase);
};
