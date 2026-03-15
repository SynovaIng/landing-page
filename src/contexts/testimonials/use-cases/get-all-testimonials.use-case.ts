import { Service } from "diod";

import type { Testimonial } from "@/contexts/testimonials/domain/testimonial.entity";
import { TestimonialRepository } from "@/contexts/testimonials/domain/testimonial.repository";

@Service()
export class GetAllTestimonialsUseCase {
  constructor(private readonly repository: TestimonialRepository) {}

  async execute(): Promise<Testimonial[]> {
    return this.repository.getAll();
  }
}
