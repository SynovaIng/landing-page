import { Service } from "diod";

import type { Testimonial } from "@/contexts/testimonials/domain/testimonial.entity";
import { TestimonialRepository } from "@/contexts/testimonials/domain/testimonial.repository";

@Service()
export class GetReviewByTokenUseCase {
  constructor(private readonly testimonialRepository: TestimonialRepository) {}

  async execute(token: string): Promise<Testimonial | null> {
    return this.testimonialRepository.getByToken(token);
  }
}
