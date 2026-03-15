"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { Project, ProjectCategory } from "@/contexts/projects/domain/project.entity";
import ProjectCard from "@/contexts/projects/presentation/ProjectCard";
import Button from "@/contexts/shared/presentation/Button";
import StatCard from "@/contexts/shared/presentation/StatCard";

const categories: (ProjectCategory | "Todos")[] = [
  "Todos",
  "Residencial",
  "Comercial",
  "Industrial",
];

const stats = [
  { value: "+150", label: "Proyectos Realizados" },
  { value: "+10", label: "Años de experiencia" },
  { value: "100%", label: "Certificados SEC" },
  { value: "RM", label: "Cobertura Total" },
];

interface ProyectosClientProps {
  projects: Project[];
}

interface MockProjectDetails {
  description: string;
  gallery: string[];
}

const fallbackDescription =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum dictum, erat nec tempor tristique, lorem sapien accumsan felis, vitae luctus justo sem sed nisi. Donec in posuere arcu, nec pulvinar justo.";

const getMockProjectDetails = (project: Project): MockProjectDetails => ({
  description: `${fallbackDescription} ${project.title} lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  gallery: [
    project.imageUrl,
    `https://picsum.photos/seed/${project.id}-1/1400/900`,
    `https://picsum.photos/seed/${project.id}-2/1400/900`,
    `https://picsum.photos/seed/${project.id}-3/1400/900`,
    `https://picsum.photos/seed/${project.id}-4/1400/900`,
    `https://picsum.photos/seed/${project.id}-5/1400/900`,
    `https://picsum.photos/seed/${project.id}-6/1400/900`,
    `https://picsum.photos/seed/${project.id}-7/1400/900`,
    `https://picsum.photos/seed/${project.id}-8/1400/900`,
    `https://picsum.photos/seed/${project.id}-9/1400/900`,
  ],
});

export default function ProyectosClient({ projects }: ProyectosClientProps) {
  const [active, setActive] = useState<ProjectCategory | "Todos">("Todos");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isImageTransitioning, setIsImageTransitioning] = useState(false);
  const thumbnailsContainerRef = useRef<HTMLDivElement | null>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const imageTransitionTimeoutRef = useRef<number | null>(null);

  const filtered =
    active === "Todos"
      ? projects
      : projects.filter((p) => p.category === active);

  const selectedProjectDetails = useMemo(() => {
    if (!selectedProject) {
      return null;
    }

    return getMockProjectDetails(selectedProject);
  }, [selectedProject]);

  useEffect(() => {
    document.body.style.overflow = selectedProject ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  useEffect(() => {
    return () => {
      if (imageTransitionTimeoutRef.current !== null) {
        window.clearTimeout(imageTransitionTimeoutRef.current);
      }
    };
  }, []);

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
    if (!selectedProjectDetails) {
      return;
    }

    const nextIndex =
      activeImageIndex === 0
        ? selectedProjectDetails.gallery.length - 1
        : activeImageIndex - 1;

    changeImage(nextIndex);
  };

  const goToNextImage = () => {
    if (!selectedProjectDetails) {
      return;
    }

    const nextIndex =
      activeImageIndex === selectedProjectDetails.gallery.length - 1
        ? 0
        : activeImageIndex + 1;

    changeImage(nextIndex);
  };

  useEffect(() => {
    const container = thumbnailsContainerRef.current;
    const activeThumbnail = thumbnailRefs.current[activeImageIndex];

    if (!container || !activeThumbnail) {
      return;
    }

    const containerCenter = container.clientWidth / 2;
    const thumbnailCenter =
      activeThumbnail.offsetLeft + activeThumbnail.clientWidth / 2;
    const targetScrollLeft = Math.max(0, thumbnailCenter - containerCenter);

    container.scrollTo({
      left: targetScrollLeft,
      behavior: "smooth",
    });
  }, [activeImageIndex, selectedProjectDetails]);

  const openProjectModal = (project: Project) => {
    if (imageTransitionTimeoutRef.current !== null) {
      window.clearTimeout(imageTransitionTimeoutRef.current);
      imageTransitionTimeoutRef.current = null;
    }

    setIsImageTransitioning(false);
    setSelectedProject(project);
    setActiveImageIndex(0);
  };

  const closeProjectModal = () => {
    if (imageTransitionTimeoutRef.current !== null) {
      window.clearTimeout(imageTransitionTimeoutRef.current);
      imageTransitionTimeoutRef.current = null;
    }

    setIsImageTransitioning(false);
    setSelectedProject(null);
    setActiveImageIndex(0);
  };

  return (
    <div className="pt-24">
      {/* ── Hero ── */}
      <main className="grow pt-8 pb-20 bg-background-light">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header + filters */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-12 bg-secondary" />
                <span className="text-secondary uppercase tracking-widest text-xs font-bold">
                  Portafolio
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-navy leading-tight mb-4">
                Nuestros Proyectos
              </h1>
              <p className="text-muted text-lg md:text-xl mt-4 leading-relaxed">
                Excelencia eléctrica y precisión técnica en cada instalación a lo
                largo de Santiago.
              </p>
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm ${
                    active === cat
                      ? "bg-cyan-gradient text-white font-bold shadow-md"
                      : "bg-surface border border-border text-navy hover:border-secondary hover:text-secondary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Projects grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {filtered.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onClick={() => openProjectModal(p)}
              />
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="bg-surface border-y border-border py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {stats.map((s) => (
                <StatCard key={s.label} value={s.value} label={s.label} />
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="max-w-3xl mx-auto relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6 relative z-10">
              ¿Quieres un trabajo como estos?
            </h2>
            <p className="text-muted text-lg mb-10 relative z-10">
              Contamos con el equipo y la experiencia para llevar tu proyecto
              eléctrico al siguiente nivel.
            </p>
            <div className="relative z-10">
              <Button href="/contacto" variant="primary" size="lg">
                Solicita tu cotización
              </Button>
            </div>
          </div>
        </div>
      </main>

      {selectedProject && selectedProjectDetails ? (
        <div
          className="fixed inset-0 z-50 bg-black/25 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeProjectModal}
        >
          <div
            className="relative w-full max-w-6xl max-h-[90vh] overflow-auto rounded-3xl bg-surface border border-border shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeProjectModal}
              className="absolute top-4 right-4 z-20 h-11 w-11 rounded-full bg-surface/95 border border-border text-navy text-2xl leading-none hover:bg-background-light transition-colors"
              aria-label="Cerrar modal"
            >
              ×
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr]">
              <div className="relative">
                <div
                  className={`w-full h-[380px] md:h-[520px] lg:h-[640px] bg-cover bg-center transition-opacity duration-500 ${
                    isImageTransitioning ? "opacity-20" : "opacity-100"
                  }`}
                  style={{
                    backgroundImage: `url('${selectedProjectDetails.gallery[activeImageIndex]}')`,
                  }}
                />

                <div className="absolute top-5 left-5 z-10 rounded-full bg-black/55 text-white text-xs md:text-sm font-medium px-3 py-1.5">
                  {activeImageIndex + 1} / {selectedProjectDetails.gallery.length}
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/55 to-transparent">
                  <div
                    ref={thumbnailsContainerRef}
                    className="flex flex-nowrap gap-2 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                  >
                    {selectedProjectDetails.gallery.map((image, index) => (
                      <button
                        key={image}
                        ref={(element) => {
                          thumbnailRefs.current[index] = element;
                        }}
                        type="button"
                        onClick={() => changeImage(index)}
                        className={`h-16 w-24 shrink-0 rounded-lg border-2 overflow-hidden transition-all ${
                          activeImageIndex === index
                            ? "border-primary scale-105"
                            : "border-white/50 hover:border-white"
                        }`}
                        aria-label={`Ver imagen ${index + 1}`}
                      >
                        <span
                          className="block h-full w-full bg-cover bg-center"
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

              <div className="p-8 md:p-10">
                <span className="inline-flex px-4 py-1.5 text-xs font-bold tracking-wider uppercase text-white rounded-full bg-cyan-gradient shadow-md mb-5">
                  {selectedProject.category}
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-navy leading-tight mb-4">
                  {selectedProject.title}
                </h2>
                <p className="text-sm font-semibold text-primary mb-4">
                  {selectedProjectDetails.gallery.length} fotos en total
                </p>
                <p className="text-muted text-base md:text-lg leading-relaxed mb-5">
                  {selectedProjectDetails.description}
                </p>

                <div className="rounded-2xl border border-border bg-background-light px-4 py-3 inline-flex items-center gap-2 text-muted">
                  <span className="material-symbols-outlined text-primary">
                    location_on
                  </span>
                  <span className="font-medium">{selectedProject.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
