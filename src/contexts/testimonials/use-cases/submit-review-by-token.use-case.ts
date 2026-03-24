import { Service } from "diod";

import type { Testimonial } from "@/contexts/testimonials/domain/testimonial.entity";
import type { SubmitReviewByTokenInput } from "@/contexts/testimonials/domain/testimonial.repository";
import { TestimonialRepository } from "@/contexts/testimonials/domain/testimonial.repository";

@Service()
export class SubmitReviewByTokenUseCase {
  constructor(private readonly testimonialRepository: TestimonialRepository) {}

  async execute(token: string, input: SubmitReviewByTokenInput): Promise<Testimonial> {
    return this.testimonialRepository.submitByToken(token, input);
  }
}
