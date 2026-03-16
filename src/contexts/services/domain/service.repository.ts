import type { Service } from "./service.entity";

export interface GetAllServicesOptions {
  includeUnpublished?: boolean;
}

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
  abstract getAll(options?: GetAllServicesOptions): Promise<Service[]>;
  abstract getById(id: string): Promise<Service | null>;
  abstract create(input: CreateServiceInput): Promise<Service>;
  abstract deleteMany(ids: string[]): Promise<void>;
  abstract setVisibility(id: string, isPublished: boolean): Promise<Service>;
  abstract reorder(ids: string[]): Promise<void>;
}
