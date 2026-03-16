import { Service } from "diod";

import type { Testimonial } from "@/contexts/testimonials/domain/testimonial.entity";
import type { GetAllTestimonialsOptions } from "@/contexts/testimonials/domain/testimonial.repository";
import { TestimonialRepository } from "@/contexts/testimonials/domain/testimonial.repository";

@Service()
export class GetAllTestimonialsUseCase {
  constructor(private readonly repository: TestimonialRepository) {}

  async execute(options?: GetAllTestimonialsOptions): Promise<Testimonial[]> {
    return this.repository.getAll(options);
  }
}
