import { container } from "@/config/container";
import { GetAllProjectsUseCase } from "@/contexts/projects/use-cases/get-all-projects.use-case";

import ProyectosClient from "./ProyectosClient";

export default async function ProyectosPage() {
  const projects = await container.get(GetAllProjectsUseCase).execute();
  const plainProjects = projects.map((project) => ({
    id: project.id,
    title: project.title,
    location: project.location,
    category: project.category,
    imageUrl: project.imageUrl,
    serviceIds: project.serviceIds,
  }));

  return <ProyectosClient projects={plainProjects} />;
}
