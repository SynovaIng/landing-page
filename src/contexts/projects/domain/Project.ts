export type ProjectCategory = "Residencial" | "Comercial" | "Industrial";

export interface Project {
  id: string;
  title: string;
  location: string;
  category: ProjectCategory;
  imageUrl: string;
}
