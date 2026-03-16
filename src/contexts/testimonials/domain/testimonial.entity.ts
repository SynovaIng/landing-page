export interface TestimonialProps {
  id: string;
  text: string;
  authorName: string;
  authorInitials: string;
  authorLocation: string;
  rating: number;
  companyId?: string | null;
  projectId?: string | null;
  companyName?: string;
  projectName?: string;
}

export class Testimonial {
  public readonly id: string;
  public readonly text: string;
  public readonly authorName: string;
  public readonly authorInitials: string;
  public readonly authorLocation: string;
  public readonly rating: number;
  public readonly companyId: string | null;
  public readonly projectId: string | null;
  public readonly companyName: string;
  public readonly projectName: string;

  constructor(props: TestimonialProps) {
    this.id = props.id;
    this.text = props.text;
    this.authorName = props.authorName;
    this.authorInitials = props.authorInitials;
    this.authorLocation = props.authorLocation;
    this.rating = props.rating;
    this.companyId = props.companyId ?? null;
    this.projectId = props.projectId ?? null;
    this.companyName = props.companyName ?? "";
    this.projectName = props.projectName ?? "";
  }
}
