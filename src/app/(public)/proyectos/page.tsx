import { container } from "@/config/container";
import ProyectosClient from "@/contexts/projects/presentation/ProyectosClient";
import { GetAllProjectsUseCase } from "@/contexts/projects/use-cases/get-all-projects.use-case";
import { GetAllServicesUseCase } from "@/contexts/services/use-cases/get-all-services.use-case";

export default async function ProyectosPage() {
  const projects = await container.get(GetAllProjectsUseCase).execute();
  const services = await container.get(GetAllServicesUseCase).execute();
  const plainProjects = projects.map((project) => ({
    id: project.id,
    title: project.title,
    location: project.location,
    category: project.category,
    imageUrl: project.imageUrl,
    imageUrls: project.imageUrls,
    serviceIds: project.serviceIds,
    orderIndex: project.orderIndex,
  }));
  const plainServices = services.map((service) => ({
    id: service.id,
    title: service.title,
    icon: service.icon,
  }));

  return <ProyectosClient projects={plainProjects} services={plainServices} />;
}
