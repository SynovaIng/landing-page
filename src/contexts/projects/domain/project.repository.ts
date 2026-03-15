import type { Project } from "./project.entity";

export abstract class ProjectRepository {
  abstract getAll(): Promise<Project[]>;
  abstract getById(id: string): Promise<Project | null>;
}
