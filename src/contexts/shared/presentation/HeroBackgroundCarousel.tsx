"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const HERO_IMAGES = [
  {
    src: "https://cdn.pixabay.com/photo/2015/12/07/10/49/electrician-1080554_1280.jpg",
    alt: "Electricista realizando instalación residencial",
  },
  {
    src: "https://andysmithelectrical.ie/wp-content/uploads/2021/04/Commercvial-Electricians-scaled.jpg",
    alt: "Ingeniero eléctrico en labores de mantenimiento",
  },
  {
    src: "https://bestlittlemep.co.uk/wp-content/uploads/2025/04/getty-images-vAkNz2AEnns-unsplash-2048x1365.webp",
    alt: "Infraestructura de subestación eléctrica industrial",
  },
  {
    src: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=2200&q=80",
    alt: "Líneas de alta tensión para distribución energética",
  },
  {
    src: "https://images.unsplash.com/photo-1576446468729-7674e99608f5?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Ingeniero eléctrico trabajando en proyecto industrial",
  },
];

const AUTO_PLAY_INTERVAL_MS = 5000;

export default function HeroBackgroundCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % HERO_IMAGES.length);
    }, AUTO_PLAY_INTERVAL_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activeIndex]);

  return (
    <>
      <div className="absolute inset-0 z-0">
        {HERO_IMAGES.map((image, index) => (
          <div
            key={image.src}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={index !== activeIndex}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={index === 0}
              className="object-cover"
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 z-[1] bg-navy/65" />

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        {HERO_IMAGES.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Mostrar imagen ${index + 1} de ${HERO_IMAGES.length}`}
            aria-current={index === activeIndex}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
              index === activeIndex ? "w-7 bg-secondary" : "bg-white/60 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </>
  );
}
