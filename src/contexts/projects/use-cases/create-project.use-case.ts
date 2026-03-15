import { Service } from "diod";

import type { Project } from "@/contexts/projects/domain/project.entity";
import type { CreateProjectInput } from "@/contexts/projects/domain/project.repository";
import { ProjectRepository } from "@/contexts/projects/domain/project.repository";

@Service()
export class CreateProjectUseCase {
  constructor(private readonly repository: ProjectRepository) {}

  async execute(input: CreateProjectInput): Promise<Project> {
    return this.repository.create(input);
  }
}
