"use client";

import { useEffect, useRef, useState } from "react";

import TestimonialCard from "@/contexts/testimonials/presentation/TestimonialCard";
import TestimonialModal from "@/contexts/testimonials/presentation/TestimonialModal";

interface TestimonialCarouselItem {
  id: string;
  text: string;
  authorName: string;
  authorInitials: string;
  authorLocation: string;
  rating: number;
  projectId: string | null;
  projectName: string;
}

interface TestimonialCarouselProps {
  testimonials: TestimonialCarouselItem[];
}

export default function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState<TestimonialCarouselItem | null>(null);

  const updateScrollState = () => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const maxScrollLeft = viewport.scrollWidth - viewport.clientWidth;

    setCanScrollLeft(viewport.scrollLeft > 8);
    setCanScrollRight(viewport.scrollLeft < maxScrollLeft - 8);
  };

  useEffect(() => {
    const viewport = viewportRef.current;
    const handleScroll = () => updateScrollState();

    updateScrollState();

    if (viewport) {
      viewport.addEventListener("scroll", handleScroll, { passive: true });
    }
    window.addEventListener("resize", handleScroll);

    return () => {
      if (viewport) {
        viewport.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("resize", handleScroll);
    };
  }, [testimonials.length]);

  const scrollByOneCard = (direction: "left" | "right") => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const firstCard = viewport.querySelector("[data-testimonial-card]") as HTMLDivElement | null;
    const track = firstCard?.parentElement;
    const cardWidth = firstCard?.offsetWidth ?? viewport.clientWidth;
    const gap = track
      ? Number.parseFloat(window.getComputedStyle(track).columnGap || window.getComputedStyle(track).gap || "0")
      : 0;
    const delta = cardWidth + gap;

    viewport.scrollBy({
      left: direction === "right" ? delta : -delta,
      behavior: "smooth",
    });
  };

  if (testimonials.length === 0) {
    return (
      <p className="text-center text-muted">Aún no hay testimonios publicados.</p>
    );
  }

  return (
    <div className="relative">
      <div className="mb-6 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollByOneCard("left")}
          disabled={!canScrollLeft}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-navy disabled:cursor-not-allowed disabled:opacity-40 hover:bg-surface-alt transition-colors"
          aria-label="Ver testimonios anteriores"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>

        <button
          type="button"
          onClick={() => scrollByOneCard("right")}
          disabled={!canScrollRight}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-navy disabled:cursor-not-allowed disabled:opacity-40 hover:bg-surface-alt transition-colors"
          aria-label="Ver testimonios siguientes"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </div>

      <div
        ref={viewportRef}
        className="overflow-x-auto pr-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex flex-nowrap gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              data-testimonial-card
              className="w-[88%] shrink-0 md:w-[47%] lg:w-[31%]"
            >
              <TestimonialCard
                testimonial={testimonial}
                onOpenFullText={() => setActiveTestimonial(testimonial)}
              />
            </div>
          ))}
        </div>
      </div>

      {activeTestimonial ? (
        <TestimonialModal
          testimonial={activeTestimonial}
          onClose={() => setActiveTestimonial(null)}
        />
      ) : null}
    </div>
  );
}
