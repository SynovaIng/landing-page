import type { Testimonial } from "./testimonial.entity";

export interface CreateTestimonialInput {
  text: string;
  authorName: string;
  authorInitials: string;
  authorLocation: string;
  rating: number;
  isPublished: boolean;
  clientId?: string | null;
  projectId?: string | null;
}

export interface UpdateTestimonialInput {
  text: string;
  authorName: string;
  authorInitials: string;
  authorLocation: string;
  rating: number;
  isPublished: boolean;
  clientId?: string | null;
  projectId?: string | null;
}

export abstract class TestimonialRepository {
  abstract getAll(): Promise<Testimonial[]>;
  abstract getById(id: string): Promise<Testimonial | null>;
  abstract create(input: CreateTestimonialInput): Promise<Testimonial>;
  abstract update(id: string, input: UpdateTestimonialInput): Promise<Testimonial>;
}
