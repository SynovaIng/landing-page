import { Service } from "diod";

import type { ProjectStatusCounts } from "@/contexts/projects/domain/project.repository";
import { ProjectRepository } from "@/contexts/projects/domain/project.repository";

@Service()
export class GetProjectStatusCountsUseCase {
  constructor(private readonly repository: ProjectRepository) {}

  async execute(): Promise<ProjectStatusCounts> {
    return this.repository.getStatusCounts();
  }
}
