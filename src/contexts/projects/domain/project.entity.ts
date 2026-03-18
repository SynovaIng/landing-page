export const PROJECT_CATEGORIES = ["Comercial", "Residencial", "Industrial"] as const;
export const PROJECT_IMAGE_PLACEHOLDER = "/synova-al-lado-amarillo-blanco.svg";

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export interface ProjectProps {
  id: string;
  title: string;
  location: string;
  description?: string;
  category: ProjectCategory;
  imageUrl: string;
  imageUrls?: string[];
  serviceIds: string[];
  isPublished?: boolean;
  orderIndex?: number;
  clientId?: string | null;
  companyName?: string;
}

export class Project {
  public readonly id: string;
  public readonly title: string;
  public readonly location: string;
  public readonly description: string;
  public readonly category: ProjectCategory;
  public readonly imageUrl: string;
  public readonly imageUrls: string[];
  public readonly serviceIds: string[];
  public readonly isPublished: boolean;
  public readonly orderIndex: number;
  public readonly clientId: string | null;
  public readonly companyName: string;

  constructor(props: ProjectProps) {
    const normalizedImageUrls = Array.from(new Set((props.imageUrls ?? [props.imageUrl]).filter(Boolean)));

    this.id = props.id;
    this.title = props.title;
    this.location = props.location;
    this.description = props.description ?? "";
    this.category = props.category;
    this.imageUrls = normalizedImageUrls.length > 0
      ? normalizedImageUrls
      : [PROJECT_IMAGE_PLACEHOLDER];
    this.imageUrl = this.imageUrls[0] ?? PROJECT_IMAGE_PLACEHOLDER;
    this.serviceIds = props.serviceIds;
    this.isPublished = props.isPublished ?? true;
    this.orderIndex = props.orderIndex ?? 0;
    this.clientId = props.clientId ?? null;
    this.companyName = props.companyName ?? "";
  }
}
