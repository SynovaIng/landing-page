export interface TestimonialProps {
  id: string;
  text: string;
  authorName: string;
  authorInitials: string;
  authorLocation: string;
  rating: number;
  isPublished?: boolean;
  projectId?: string | null;
  projectName?: string;
  orderIndex?: number;
  token?: string | null;
  tokenActive?: boolean;
}

export class Testimonial {
  public readonly id: string;
  public readonly text: string;
  public readonly authorName: string;
  public readonly authorInitials: string;
  public readonly authorLocation: string;
  public readonly rating: number;
  public readonly isPublished: boolean;
  public readonly projectId: string | null;
  public readonly projectName: string;
  public readonly orderIndex: number;
  public readonly token: string | null;
  public readonly tokenActive: boolean;

  constructor(props: TestimonialProps) {
    this.id = props.id;
    this.text = props.text;
    this.authorName = props.authorName;
    this.authorInitials = props.authorInitials;
    this.authorLocation = props.authorLocation;
    this.rating = props.rating;
    this.isPublished = props.isPublished ?? true;
    this.projectId = props.projectId ?? null;
    this.projectName = props.projectName ?? "";
    this.orderIndex = props.orderIndex ?? 0;
    this.token = props.token ?? null;
    this.tokenActive = props.tokenActive ?? false;
  }
}
