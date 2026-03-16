import type { Project } from "./project.entity";

export interface CreateProjectInput {
  title: string;
  location: string;
  category: string;
  description?: string;
  isPublished: boolean;
  serviceIds: string[];
  imageUrls?: string[];
}

export interface UpdateProjectInput {
  id: string;
  title: string;
  location: string;
  category: string;
  description?: string;
  isPublished: boolean;
  serviceIds: string[];
  imageUrls?: string[];
}

export abstract class ProjectRepository {
  abstract getAll(): Promise<Project[]>;
  abstract getById(id: string): Promise<Project | null>;
  abstract create(input: CreateProjectInput): Promise<Project>;
  abstract update(input: UpdateProjectInput): Promise<Project>;
  abstract reorder(ids: string[]): Promise<void>;
}
