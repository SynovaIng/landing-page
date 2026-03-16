"use client";

import { useEffect, useRef, useState } from "react";

import TestimonialCard from "@/contexts/testimonials/presentation/TestimonialCard";

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
    const cardWidth = firstCard?.offsetWidth ?? viewport.clientWidth;
    const gap = 32;
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
        className="overflow-x-hidden"
      >
        <div className="flex flex-nowrap gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              data-testimonial-card
              className="w-full shrink-0 md:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)]"
            >
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
