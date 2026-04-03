"use client";

import { useEffect } from "react";

interface TestimonialModalProps {
  testimonial: {
    text: string;
    authorName: string;
    authorInitials: string;
    authorLocation: string;
    rating: number;
    projectName: string;
  };
  onClose: () => void;
}

export default function TestimonialModal({ testimonial, onClose }: TestimonialModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Testimonio completo de ${testimonial.authorName}`}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Testimonio completo</p>
            {testimonial.projectName ? (
              <p className="mt-1 text-xs uppercase tracking-wide text-on-surface-muted">{testimonial.projectName}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-on-surface-muted transition-colors hover:bg-surface-alt hover:text-navy"
            aria-label="Cerrar"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="mb-5 flex text-yellow-500">
          {Array.from({ length: testimonial.rating }, (_, i) => i + 1).map((star) => (
            <span
              key={star}
              className="material-symbols-outlined text-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
          ))}
        </div>

        <p className="text-base italic leading-relaxed text-on-surface">&ldquo;{testimonial.text}&rdquo;</p>

        <div className="mt-8 flex items-center gap-4 border-t border-border pt-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-gradient text-sm font-bold text-white">
            {testimonial.authorInitials}
          </div>
          <div>
            <p className="text-sm font-bold text-navy">{testimonial.authorName}</p>
            {testimonial.authorLocation ? (
              <p className="text-[10px] uppercase tracking-widest text-secondary">{testimonial.authorLocation}</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
