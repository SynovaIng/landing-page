import type { Project } from "@/contexts/projects/domain/project.entity";

export interface ProjectGalleryDetails {
  description: string;
  gallery: string[];
}

export const getProjectGalleryDetails = (project: Project): ProjectGalleryDetails => ({
  description: `Proyecto ejecutado en ${project.location}.`,
  gallery: project.imageUrls,
});
