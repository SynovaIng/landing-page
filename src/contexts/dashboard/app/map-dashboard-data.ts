import type { DashboardSectionData } from "@/contexts/dashboard/domain/dashboard.entity";
import type { Project } from "@/contexts/projects/domain/project.entity";
import type { Service } from "@/contexts/services/domain/service.entity";
import type { Testimonial } from "@/contexts/testimonials/domain/testimonial.entity";

interface MapDashboardDataInput {
  projects: Project[];
  services: Service[];
  testimonials: Testimonial[];
}

export function mapDashboardData({
  projects,
  services,
  testimonials,
}: MapDashboardDataInput): DashboardSectionData {
  const serviceNamesById = new Map<string, string>(
    services.map((service) => [service.id, service.title]),
  );
  const serviceIconsById = new Map<string, string>(
    services.map((service) => [service.id, service.icon]),
  );

  return {
    projects: projects.map((project) => ({
      projectServices: project.serviceIds.map((serviceId) => ({
        id: serviceId,
        name: serviceNamesById.get(serviceId) ?? serviceId,
        icon: serviceIconsById.get(serviceId) ?? "engineering",
      })),
      projectServiceIds: project.serviceIds,
      projectServiceNames: project.serviceIds.map((serviceId) => serviceNamesById.get(serviceId) ?? serviceId),
      projectServicesSummary:
        project.serviceIds.length === 0
          ? "Sin servicios"
          : `${project.serviceIds.length} servicio${project.serviceIds.length === 1 ? "" : "s"}`,
      id: project.id,
      name: project.title,
      description: `Proyecto en ${project.location}`,
      type: project.category,
      location: project.location,
      imageUrl: project.imageUrl,
      imageUrls: project.imageUrls,
      isActive: true,
    })),
    services: services.map((service) => ({
      id: service.id,
      icon: service.icon,
      name: service.title,
      slug: service.id,
      description: service.description,
      ctaLabel: service.ctaLabel,
      features: service.features.join(" · "),
      isActive: true,
    })),
    testimonials: testimonials.map((testimonial) => ({
      id: testimonial.id,
      clientId: testimonial.companyId ?? "",
      companyName: testimonial.companyName,
      clientName: testimonial.authorName,
      clientInitials: testimonial.authorInitials,
      clientLocation: testimonial.authorLocation,
      stars: testimonial.rating,
      message: testimonial.text,
      isActive: true,
    })),
  };
}
