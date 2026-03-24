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

export interface CreateReviewLinkInput {
  projectId: string;
  token: string;
}

export interface SubmitReviewByTokenInput {
  authorName: string;
  text: string;
  rating: number;
}

export abstract class TestimonialRepository {
  abstract getAll(options?: GetAllTestimonialsOptions): Promise<Testimonial[]>;
  abstract getById(id: string): Promise<Testimonial | null>;
  abstract getByToken(token: string): Promise<Testimonial | null>;
  abstract create(input: CreateTestimonialInput): Promise<Testimonial>;
  abstract createReviewLink(input: CreateReviewLinkInput): Promise<Testimonial>;
  abstract update(id: string, input: UpdateTestimonialInput): Promise<Testimonial>;
  abstract submitByToken(token: string, input: SubmitReviewByTokenInput): Promise<Testimonial>;
  abstract deleteMany(ids: string[]): Promise<void>;
  abstract setVisibility(id: string, isPublished: boolean): Promise<Testimonial>;
  abstract reorder(ids: string[]): Promise<void>;
}
