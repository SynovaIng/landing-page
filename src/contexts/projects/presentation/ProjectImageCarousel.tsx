"use client";

import { useEffect, useRef, useState } from "react";

interface ProjectImageCarouselProps {
  gallery: string[];
}

export default function ProjectImageCarousel({ gallery }: ProjectImageCarouselProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isImageTransitioning, setIsImageTransitioning] = useState(false);
  const thumbnailsContainerRef = useRef<HTMLDivElement | null>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const imageTransitionTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (imageTransitionTimeoutRef.current !== null) {
        window.clearTimeout(imageTransitionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const container = thumbnailsContainerRef.current;
    const activeThumbnail = thumbnailRefs.current[activeImageIndex];

    if (!container || !activeThumbnail) {
      return;
    }

    const containerCenter = container.clientWidth / 2;
    const thumbnailCenter = activeThumbnail.offsetLeft + activeThumbnail.clientWidth / 2;
    const targetScrollLeft = Math.max(0, thumbnailCenter - containerCenter);

    container.scrollTo({
      left: targetScrollLeft,
      behavior: "smooth",
    });
  }, [activeImageIndex, gallery]);

  const changeImage = (nextIndex: number) => {
    if (nextIndex === activeImageIndex) {
      return;
    }

    if (imageTransitionTimeoutRef.current !== null) {
      window.clearTimeout(imageTransitionTimeoutRef.current);
    }

    setIsImageTransitioning(true);
    imageTransitionTimeoutRef.current = window.setTimeout(() => {
      setActiveImageIndex(nextIndex);
      setIsImageTransitioning(false);
    }, 150);
  };

  const goToPreviousImage = () => {
    const nextIndex = activeImageIndex === 0 ? gallery.length - 1 : activeImageIndex - 1;
    changeImage(nextIndex);
  };

  const goToNextImage = () => {
    const nextIndex = activeImageIndex === gallery.length - 1 ? 0 : activeImageIndex + 1;
    changeImage(nextIndex);
  };

  if (gallery.length === 0) {
    return (
      <div className="flex h-[380px] w-full items-center justify-center bg-surface-alt text-on-surface-muted md:h-[520px] lg:h-[640px]">
        Sin imágenes del proyecto
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className={`w-full h-[380px] md:h-[520px] lg:h-[640px] bg-contain bg-center bg-no-repeat bg-black transition-opacity duration-500 ${
          isImageTransitioning ? "opacity-20" : "opacity-100"
        }`}
        style={{
          backgroundImage: `url('${gallery[activeImageIndex]}')`,
        }}
      />

      <div className="absolute top-5 left-5 z-10 rounded-full bg-black/55 text-white text-xs md:text-sm font-medium px-3 py-1.5">
        {activeImageIndex + 1} / {gallery.length}
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/55 to-transparent">
        <div
          ref={thumbnailsContainerRef}
          className="flex flex-nowrap gap-2 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {gallery.map((image, index) => (
            <button
              key={image}
              ref={(element) => {
                thumbnailRefs.current[index] = element;
              }}
              type="button"
              onClick={() => changeImage(index)}
              className={`h-16 w-24 shrink-0 rounded-lg border-2 overflow-hidden transition-all ${
                activeImageIndex === index ? "border-primary scale-105" : "border-white/50 hover:border-white"
              }`}
              aria-label={`Ver imagen ${index + 1}`}
            >
              <span
                className="block h-full w-full bg-contain bg-center bg-no-repeat bg-black"
                style={{ backgroundImage: `url('${image}')` }}
              />
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={goToPreviousImage}
        className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-surface/90 border border-border text-2xl text-navy hover:bg-surface transition-colors"
        aria-label="Imagen anterior"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={goToNextImage}
        className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-surface/90 border border-border text-2xl text-navy hover:bg-surface transition-colors"
        aria-label="Siguiente imagen"
      >
        ›
      </button>
    </div>
  );
}
