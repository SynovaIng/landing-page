export interface ServiceProps {
  id: string;
  /** Material Symbols icon name */
  icon: string;
  title: string;
  description: string;
  features: string[];
  ctaLabel: string;
}

export class Service {
  public readonly id: string;
  public readonly icon: string;
  public readonly title: string;
  public readonly description: string;
  public readonly features: string[];
  public readonly ctaLabel: string;

  constructor(props: ServiceProps) {
    this.id = props.id;
    this.icon = props.icon;
    this.title = props.title;
    this.description = props.description;
    this.features = props.features;
    this.ctaLabel = props.ctaLabel;
  }
}
