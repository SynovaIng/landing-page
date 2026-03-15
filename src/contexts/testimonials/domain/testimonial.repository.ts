import type { Testimonial } from "./testimonial.entity";

export interface CreateTestimonialInput {
  text: string;
  authorName: string;
  authorInitials: string;
  authorLocation: string;
  rating: number;
  isPublished: boolean;
}

export abstract class TestimonialRepository {
  abstract getAll(): Promise<Testimonial[]>;
  abstract getById(id: string): Promise<Testimonial | null>;
  abstract create(input: CreateTestimonialInput): Promise<Testimonial>;
}
