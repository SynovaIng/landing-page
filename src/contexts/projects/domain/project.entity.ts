export const PROJECT_CATEGORIES = ["Comercial", "Residencial", "Industrial"] as const;
export const PROJECT_IMAGE_PLACEHOLDER = "/synova-al-lado-amarillo-blanco.svg";

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export interface ProjectProps {
  id: string;
  title: string;
  location: string;
  category: ProjectCategory;
  imageUrl: string;
  imageUrls?: string[];
  serviceIds: string[];
}

export class Project {
  public readonly id: string;
  public readonly title: string;
  public readonly location: string;
  public readonly category: ProjectCategory;
  public readonly imageUrl: string;
  public readonly imageUrls: string[];
  public readonly serviceIds: string[];

  constructor(props: ProjectProps) {
    const normalizedImageUrls = Array.from(new Set((props.imageUrls ?? [props.imageUrl]).filter(Boolean)));

    this.id = props.id;
    this.title = props.title;
    this.location = props.location;
    this.category = props.category;
    this.imageUrls = normalizedImageUrls.length > 0
      ? normalizedImageUrls
      : [PROJECT_IMAGE_PLACEHOLDER];
    this.imageUrl = this.imageUrls[0] ?? PROJECT_IMAGE_PLACEHOLDER;
    this.serviceIds = props.serviceIds;
  }
}
