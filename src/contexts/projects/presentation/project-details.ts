import type { Project } from "@/contexts/projects/domain/project.entity";

export interface ProjectGalleryDetails {
  description: string;
  gallery: string[];
}

export const getProjectGalleryDetails = (project: Project): ProjectGalleryDetails => ({
  description: project.description.trim(),
  gallery: project.imageUrls,
});
