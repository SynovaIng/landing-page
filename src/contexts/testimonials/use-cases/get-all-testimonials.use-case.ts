import { Service } from "diod";

import type { Testimonial } from "@/contexts/testimonials/domain/testimonial.entity";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports -- Value import required for emitDecoratorMetadata (DIOD autowiring)
import { TestimonialRepository } from "@/contexts/testimonials/domain/testimonial.repository";

@Service()
export class GetAllTestimonialsUseCase {
  constructor(private readonly repository: TestimonialRepository) {}

  async execute(): Promise<Testimonial[]> {
    return this.repository.getAll();
  }
}
