import type { Service } from "./service.entity";

export interface CreateServiceInput {
  title: string;
  slug: string;
  description?: string;
  ctaLabel: string;
  features: string[];
  icon: string;
  isPublished: boolean;
}

export abstract class ServiceRepository {
  abstract getAll(): Promise<Service[]>;
  abstract getById(id: string): Promise<Service | null>;
  abstract create(input: CreateServiceInput): Promise<Service>;
}
