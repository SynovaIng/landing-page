import { Service } from "diod";

import type { Testimonial } from "@/contexts/testimonials/domain/testimonial.entity";
import type { CreateTestimonialInput } from "@/contexts/testimonials/domain/testimonial.repository";
import { TestimonialRepository } from "@/contexts/testimonials/domain/testimonial.repository";

@Service()
export class CreateTestimonialUseCase {
  constructor(private readonly testimonialRepository: TestimonialRepository) {}

  async execute(input: CreateTestimonialInput): Promise<Testimonial> {
    return this.testimonialRepository.create(input);
  }
}
