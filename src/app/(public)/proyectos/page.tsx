import { container } from "@/config/container";
import { formatProjectCountApprox } from "@/contexts/projects/app/format-project-count";
import ProyectosClient from "@/contexts/projects/presentation/ProyectosClient";
import { GetAllProjectsUseCase } from "@/contexts/projects/use-cases/get-all-projects.use-case";
import { GetProjectStatusCountsUseCase } from "@/contexts/projects/use-cases/get-project-status-counts.use-case";
import { GetAllServicesUseCase } from "@/contexts/services/use-cases/get-all-services.use-case";

export default async function ProyectosPage() {
  const [projects, services, projectCounts] = await Promise.all([
    container.get(GetAllProjectsUseCase).execute(),
    container.get(GetAllServicesUseCase).execute(),
    container.get(GetProjectStatusCountsUseCase).execute(),
  ]);
  const projectsStatValue = formatProjectCountApprox(projectCounts.totalCount);
  const plainProjects = projects.map((project) => ({
    id: project.id,
    title: project.title,
    location: project.location,
    description: project.description,
    category: project.category,
    imageUrl: project.imageUrl,
    imageUrls: project.imageUrls,
    serviceIds: project.serviceIds,
    isPublished: project.isPublished,
    orderIndex: project.orderIndex,
    clientId: project.clientId,
    companyName: project.companyName,
  }));
  const plainServices = services.map((service) => ({
    id: service.id,
    title: service.title,
    icon: service.icon,
  }));

  return (
    <ProyectosClient
      projects={plainProjects}
      services={plainServices}
      projectsStatValue={projectsStatValue}
    />
  );
}
