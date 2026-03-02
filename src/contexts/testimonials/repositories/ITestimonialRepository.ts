import type { Testimonial } from "../domain/Testimonial";

export interface ITestimonialRepository {
  getAll(): Promise<Testimonial[]>;
  getById(id: string): Promise<Testimonial | null>;
}
