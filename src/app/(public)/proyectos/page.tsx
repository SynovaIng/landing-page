import { container } from "@/config/container";
import { GetAllProjectsUseCase } from "@/contexts/projects/use-cases/get-all-projects.use-case";

import ProyectosClient from "./ProyectosClient";

export default async function ProyectosPage() {
  const projects = await container.get(GetAllProjectsUseCase).execute();
  return <ProyectosClient projects={projects} />;
}
