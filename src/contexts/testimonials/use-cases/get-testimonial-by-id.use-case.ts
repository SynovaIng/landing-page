import { Service } from "diod";

import type { Testimonial } from "@/contexts/testimonials/domain/testimonial.entity";
import { TestimonialRepository } from "@/contexts/testimonials/domain/testimonial.repository";

@Service()
export class GetTestimonialByIdUseCase {
  constructor(private readonly repository: TestimonialRepository) {}

  async execute(id: string): Promise<Testimonial | null> {
    return this.repository.getById(id);
  }
}
