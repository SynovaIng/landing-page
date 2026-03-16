import { Service } from "diod";

import type { Project } from "@/contexts/projects/domain/project.entity";
import type { UpdateProjectInput } from "@/contexts/projects/domain/project.repository";
import { ProjectRepository } from "@/contexts/projects/domain/project.repository";

@Service()
export class UpdateProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(input: UpdateProjectInput): Promise<Project> {
    return this.projectRepository.update(input);
  }
}
