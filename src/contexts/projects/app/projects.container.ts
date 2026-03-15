import type { ContainerBuilder } from "diod";

import { ProjectRepository } from "@/contexts/projects/domain/project.repository";
import { MockProjectRepository } from "@/contexts/projects/infrastructure/mock-project.repository";
import { CreateProjectUseCase } from "@/contexts/projects/use-cases/create-project.use-case";
import { GetAllProjectsUseCase } from "@/contexts/projects/use-cases/get-all-projects.use-case";
import { GetProjectByIdUseCase } from "@/contexts/projects/use-cases/get-project-by-id.use-case";

export const registerProjectsContainer = (builder: ContainerBuilder): void => {
  // Domain & Infrastructure
  builder.register(ProjectRepository).useClass(MockProjectRepository).asSingleton();

  // Use Cases
  builder.registerAndUse(CreateProjectUseCase);
  builder.registerAndUse(GetAllProjectsUseCase);
  builder.registerAndUse(GetProjectByIdUseCase);
};
