import { Service } from "diod";

import type { Testimonial } from "@/contexts/testimonials/domain/testimonial.entity";
import type { UpdateTestimonialInput } from "@/contexts/testimonials/domain/testimonial.repository";
import { TestimonialRepository } from "@/contexts/testimonials/domain/testimonial.repository";

@Service()
export class UpdateTestimonialUseCase {
  constructor(private readonly testimonialRepository: TestimonialRepository) {}

  async execute(id: string, input: UpdateTestimonialInput): Promise<Testimonial> {
    return this.testimonialRepository.update(id, input);
  }
}
