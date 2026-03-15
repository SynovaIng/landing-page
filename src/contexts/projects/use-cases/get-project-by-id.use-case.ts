import { Service } from "diod";

import type { Project } from "@/contexts/projects/domain/project.entity";
import { ProjectRepository } from "@/contexts/projects/domain/project.repository";

@Service()
export class GetProjectByIdUseCase {
  constructor(private readonly repository: ProjectRepository) {}

  async execute(id: string): Promise<Project | null> {
    return this.repository.getById(id);
  }
}
