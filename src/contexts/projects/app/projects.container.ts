import type { ContainerBuilder } from "diod";

import { ProjectRepository } from "@/contexts/projects/domain/project.repository";
import { SupabaseProjectRepository } from "@/contexts/projects/infrastructure/supabase-project.repository";
import { CreateProjectUseCase } from "@/contexts/projects/use-cases/create-project.use-case";
import { GetAllProjectsUseCase } from "@/contexts/projects/use-cases/get-all-projects.use-case";
import { GetProjectByIdUseCase } from "@/contexts/projects/use-cases/get-project-by-id.use-case";
import { ReorderProjectsUseCase } from "@/contexts/projects/use-cases/reorder-projects.use-case";
import { SetProjectVisibilityUseCase } from "@/contexts/projects/use-cases/set-project-visibility.use-case";
import { UpdateProjectUseCase } from "@/contexts/projects/use-cases/update-project.use-case";

export const registerProjectsContainer = (builder: ContainerBuilder): void => {
  // Domain & Infrastructure
  builder.register(ProjectRepository).useClass(SupabaseProjectRepository).asSingleton();

  // Use Cases
  builder.registerAndUse(CreateProjectUseCase);
  builder.registerAndUse(GetAllProjectsUseCase);
  builder.registerAndUse(GetProjectByIdUseCase);
  builder.registerAndUse(ReorderProjectsUseCase);
  builder.registerAndUse(SetProjectVisibilityUseCase);
  builder.registerAndUse(UpdateProjectUseCase);
};
