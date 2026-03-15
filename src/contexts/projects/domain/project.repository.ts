import type { Project } from "./project.entity";

export interface CreateProjectInput {
  title: string;
  location: string;
  category: string;
  description?: string;
  isPublished: boolean;
}

export abstract class ProjectRepository {
  abstract getAll(): Promise<Project[]>;
  abstract getById(id: string): Promise<Project | null>;
  abstract create(input: CreateProjectInput): Promise<Project>;
}
