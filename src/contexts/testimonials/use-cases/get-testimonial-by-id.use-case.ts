import { Service } from "diod";

import type { Testimonial } from "@/contexts/testimonials/domain/testimonial.entity";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports -- Value import required for emitDecoratorMetadata (DIOD autowiring)
import { TestimonialRepository } from "@/contexts/testimonials/domain/testimonial.repository";

@Service()
export class GetTestimonialByIdUseCase {
  constructor(private readonly repository: TestimonialRepository) {}

  async execute(id: string): Promise<Testimonial | null> {
    return this.repository.getById(id);
  }
}
