import type { Testimonial } from "./testimonial.entity";

export interface GetAllTestimonialsOptions {
  includeUnpublished?: boolean;
}

export interface CreateTestimonialInput {
  text: string;
  authorName: string;
  authorInitials: string;
  authorLocation: string;
  rating: number;
  isPublished: boolean;
  projectId?: string | null;
}

export interface UpdateTestimonialInput {
  text: string;
  authorName: string;
  authorInitials: string;
  authorLocation: string;
  rating: number;
  isPublished: boolean;
  projectId?: string | null;
}

export abstract class TestimonialRepository {
  abstract getAll(options?: GetAllTestimonialsOptions): Promise<Testimonial[]>;
  abstract getById(id: string): Promise<Testimonial | null>;
  abstract create(input: CreateTestimonialInput): Promise<Testimonial>;
  abstract update(id: string, input: UpdateTestimonialInput): Promise<Testimonial>;
  abstract deleteMany(ids: string[]): Promise<void>;
  abstract setVisibility(id: string, isPublished: boolean): Promise<Testimonial>;
  abstract reorder(ids: string[]): Promise<void>;
}
