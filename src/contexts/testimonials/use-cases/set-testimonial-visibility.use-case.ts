import { Service } from "diod";

import type { Testimonial } from "@/contexts/testimonials/domain/testimonial.entity";
import { TestimonialRepository } from "@/contexts/testimonials/domain/testimonial.repository";

@Service()
export class SetTestimonialVisibilityUseCase {
  constructor(private readonly testimonialRepository: TestimonialRepository) {}

  async execute(id: string, isPublished: boolean): Promise<Testimonial> {
    return this.testimonialRepository.setVisibility(id, isPublished);
  }
}
