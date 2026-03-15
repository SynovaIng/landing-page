export type DashboardSectionKey = "projects" | "services" | "testimonials";

export interface DashboardRowBase {
  id: string;
  isActive: boolean;
}

export interface DashboardProjectRow extends DashboardRowBase {
  title: string;
  location: string;
  category: string;
}

export interface DashboardServiceRow extends DashboardRowBase {
  title: string;
  description: string;
  features: string;
}

export interface DashboardTestimonialRow extends DashboardRowBase {
  authorName: string;
  authorLocation: string;
  rating: number;
  text: string;
}

export interface DashboardSectionData {
  projects: DashboardProjectRow[];
  services: DashboardServiceRow[];
  testimonials: DashboardTestimonialRow[];
}
