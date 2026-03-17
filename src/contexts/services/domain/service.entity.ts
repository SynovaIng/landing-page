export interface ServiceProps {
  id: string;
  /** Material Symbols icon name */
  icon: string;
  title: string;
  description: string;
  features: string[];
  ctaLabel: string;
  slug: string;
  isPublished?: boolean;
  orderIndex?: number;
}

export class Service {
  public readonly id: string;
  public readonly icon: string;
  public readonly title: string;
  public readonly description: string;
  public readonly features: string[];
  public readonly ctaLabel: string;
  public readonly slug: string;
  public readonly isPublished: boolean;
  public readonly orderIndex: number;

  constructor(props: ServiceProps) {
    this.id = props.id;
    this.icon = props.icon;
    this.title = props.title;
    this.description = props.description;
    this.features = props.features;
    this.ctaLabel = props.ctaLabel;
    this.slug = props.slug;
    this.isPublished = props.isPublished ?? true;
    this.orderIndex = props.orderIndex ?? 0;
  }
}
