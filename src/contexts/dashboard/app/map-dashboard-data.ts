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
  return {
    projects: projects.map((project) => ({
      id: project.id,
      name: project.title,
      description: `Proyecto en ${project.location}`,
      type: project.category,
      location: project.location,
      isActive: true,
    })),
    services: services.map((service) => ({
      id: service.id,
      name: service.title,
      slug: service.id,
      description: service.description,
      ctaLabel: service.ctaLabel,
      features: service.features.join(" · "),
      isActive: true,
    })),
    testimonials: testimonials.map((testimonial) => ({
      id: testimonial.id,
      clientName: testimonial.authorName,
      clientInitials: testimonial.authorInitials,
      clientLocation: testimonial.authorLocation,
      stars: testimonial.rating,
      message: testimonial.text,
      isActive: true,
    })),
  };
}
