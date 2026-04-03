import type { Project } from "./project.entity";

export interface GetAllProjectsOptions {
  includeUnpublished?: boolean;
}

export interface ProjectStatusCounts {
  activeCount: number;
  inactiveCount: number;
  totalCount: number;
}

export interface CreateProjectInput {
  title: string;
  location: string;
  category: string;
  description?: string;
  isPublished: boolean;
  serviceIds: string[];
  imageUrls?: string[];
  clientId?: string | null;
  companyName?: string;
  createCompany?: boolean;
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
  clientId?: string | null;
  companyName?: string;
  createCompany?: boolean;
}

export abstract class ProjectRepository {
  abstract getAll(options?: GetAllProjectsOptions): Promise<Project[]>;
  abstract getStatusCounts(): Promise<ProjectStatusCounts>;
  abstract getById(id: string): Promise<Project | null>;
  abstract create(input: CreateProjectInput): Promise<Project>;
  abstract update(input: UpdateProjectInput): Promise<Project>;
  abstract deleteMany(ids: string[]): Promise<void>;
  abstract setVisibility(id: string, isPublished: boolean): Promise<Project>;
  abstract reorder(ids: string[]): Promise<void>;
}
