export type ProjectCategory = "Residencial" | "Comercial" | "Industrial";

export interface ProjectProps {
  id: string;
  title: string;
  location: string;
  category: ProjectCategory;
  imageUrl: string;
  serviceIds: string[];
}

export class Project {
  public readonly id: string;
  public readonly title: string;
  public readonly location: string;
  public readonly category: ProjectCategory;
  public readonly imageUrl: string;
  public readonly serviceIds: string[];

  constructor(props: ProjectProps) {
    this.id = props.id;
    this.title = props.title;
    this.location = props.location;
    this.category = props.category;
    this.imageUrl = props.imageUrl;
    this.serviceIds = props.serviceIds;
  }
}
