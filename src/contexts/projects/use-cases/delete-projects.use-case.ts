import { Service } from "diod";

import { ProjectRepository } from "@/contexts/projects/domain/project.repository";

@Service()
export class DeleteProjectsUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(ids: string[]): Promise<void> {
    await this.projectRepository.deleteMany(ids);
  }
}
