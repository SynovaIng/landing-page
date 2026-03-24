import Link from "next/link";

interface TestimonialCardProps {
  testimonial: {
    id: string;
    text: string;
    authorName: string;
    authorInitials: string;
    authorLocation: string;
    rating: number;
    projectId: string | null;
    projectName: string;
  };
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const hasAssignedProject = Boolean(testimonial.projectId);
  const hasProjectChip = Boolean(testimonial.projectName);

  return (
    <div
      className={`relative bg-surface p-10 rounded-lg border border-border hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-glow group ${hasProjectChip ? "pt-16" : ""}`}
    >
      {hasProjectChip ? (
        <span className="absolute top-4 left-4 inline-flex h-9 items-center rounded-full bg-background-light border border-border px-3 text-[10px] text-secondary uppercase tracking-widest max-w-[70%] truncate">
          {testimonial.projectName}
        </span>
      ) : null}

      {hasAssignedProject ? (
        <Link
          href={`/proyectos?projectId=${encodeURIComponent(testimonial.projectId as string)}`}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-background-light border border-border text-secondary hover:text-white hover:bg-secondary flex items-center justify-center transition-colors"
          aria-label="Ver proyecto relacionado"
          title="Ver proyecto"
        >
          <span className="material-symbols-outlined text-[18px]">north_east</span>
        </Link>
      ) : null}

      {/* Stars */}
      <div className="flex text-yellow-500 mb-6">
        {Array.from({ length: testimonial.rating }, (_, i) => i + 1).map((star) => (
          <span key={star}
            className="material-symbols-outlined text-sm"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
        ))}
      </div>

      {/* Quote */}
      <p className="text-muted italic mb-8 font-light leading-relaxed group-hover:text-navy transition-colors">
        &ldquo;{testimonial.text}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-cyan-gradient flex items-center justify-center text-white font-bold text-sm shrink-0">
          {testimonial.authorInitials}
        </div>
        <div>
          <p className="font-bold text-navy text-sm">{testimonial.authorName}</p>
          {testimonial.authorLocation ? (
            <p className="text-[10px] text-secondary uppercase tracking-widest">
              {testimonial.authorLocation}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
