import type { Testimonial } from "./testimonial.entity";

export abstract class TestimonialRepository {
  abstract getAll(): Promise<Testimonial[]>;
  abstract getById(id: string): Promise<Testimonial | null>;
}
