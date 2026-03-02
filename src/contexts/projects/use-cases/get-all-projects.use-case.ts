import { Service } from "diod";

import type { Project } from "@/contexts/projects/domain/project.entity";
import { ProjectRepository } from "@/contexts/projects/domain/project.repository";

@Service()
export class GetAllProjectsUseCase {
  constructor(private readonly repository: ProjectRepository) {}

  async execute(): Promise<Project[]> {
    return this.repository.getAll();
  }
}
