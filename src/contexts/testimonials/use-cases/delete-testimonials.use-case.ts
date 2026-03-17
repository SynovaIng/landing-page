import { Service } from "diod";

import { TestimonialRepository } from "@/contexts/testimonials/domain/testimonial.repository";

@Service()
export class DeleteTestimonialsUseCase {
  constructor(private readonly testimonialRepository: TestimonialRepository) {}

  async execute(ids: string[]): Promise<void> {
    await this.testimonialRepository.deleteMany(ids);
  }
}
