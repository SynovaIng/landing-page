import type { Testimonial } from "@/shared/domain/data/testimonials";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-white p-10 rounded-lg border border-gray-200 hover:border-[#00C8E0]/40 transition-all duration-300 shadow-sm hover:shadow-glow group">
      {/* Stars */}
      <div className="flex text-yellow-500 mb-6">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <span
            key={i}
            className="material-symbols-outlined text-sm"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
        ))}
      </div>

      {/* Quote */}
      <p className="text-[#6B7280] italic mb-8 font-light leading-relaxed group-hover:text-[#0F1A2E] transition-colors">
        &ldquo;{testimonial.text}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#1A3A8F] to-[#00C8E0] flex items-center justify-center text-white font-bold text-sm shrink-0">
          {testimonial.authorInitials}
        </div>
        <div>
          <p className="font-bold text-[#0F1A2E] text-sm">{testimonial.authorName}</p>
          <p className="text-[10px] text-[#1A3A8F] uppercase tracking-widest">
            {testimonial.authorLocation}
          </p>
        </div>
      </div>
    </div>
  );
}
