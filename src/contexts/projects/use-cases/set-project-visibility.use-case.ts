import { Service } from "diod";

import type { Project } from "@/contexts/projects/domain/project.entity";
import { ProjectRepository } from "@/contexts/projects/domain/project.repository";

@Service()
export class SetProjectVisibilityUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(id: string, isPublished: boolean): Promise<Project> {
    return this.projectRepository.setVisibility(id, isPublished);
  }
}
