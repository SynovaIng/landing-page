import type { Project } from "@/contexts/projects/domain/project.entity";

export interface ProjectGalleryDetails {
  description: string;
  gallery: string[];
}

const fallbackDescription =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum dictum, erat nec tempor tristique, lorem sapien accumsan felis, vitae luctus justo sem sed nisi. Donec in posuere arcu, nec pulvinar justo.";

export const getProjectGalleryDetails = (project: Project): ProjectGalleryDetails => ({
  description: `${fallbackDescription} ${project.title} lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  gallery: [
    project.imageUrl,
    `https://picsum.photos/seed/${project.id}-1/1400/900`,
    `https://picsum.photos/seed/${project.id}-2/1400/900`,
    `https://picsum.photos/seed/${project.id}-3/1400/900`,
    `https://picsum.photos/seed/${project.id}-4/1400/900`,
    `https://picsum.photos/seed/${project.id}-5/1400/900`,
    `https://picsum.photos/seed/${project.id}-6/1400/900`,
    `https://picsum.photos/seed/${project.id}-7/1400/900`,
    `https://picsum.photos/seed/${project.id}-8/1400/900`,
    `https://picsum.photos/seed/${project.id}-9/1400/900`,
  ],
});
