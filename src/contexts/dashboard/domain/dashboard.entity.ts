export type DashboardSectionKey = "projects" | "services" | "testimonials";

export interface DashboardRowBase {
  id: string;
  isActive: boolean;
}

export interface DashboardProjectRow extends DashboardRowBase {
  name: string;
  description: string;
  type: string;
  location: string;
}

export interface DashboardServiceRow extends DashboardRowBase {
  name: string;
  slug: string;
  description: string;
  ctaLabel: string;
  features: string;
}

export interface DashboardTestimonialRow extends DashboardRowBase {
  clientName: string;
  clientInitials: string;
  clientLocation: string;
  stars: number;
  message: string;
}

export interface DashboardSectionData {
  projects: DashboardProjectRow[];
  services: DashboardServiceRow[];
  testimonials: DashboardTestimonialRow[];
}
