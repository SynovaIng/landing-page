"use client";

import type { Project } from "@/contexts/projects/domain/project.entity";

import type { ProjectGalleryDetails } from "./project-details";
import ProjectImageCarousel from "./ProjectImageCarousel";

interface ProjectServiceSummary {
  id: string;
  title: string;
  icon: string;
}

interface ProjectGalleryModalProps {
  project: Project | null;
  details: ProjectGalleryDetails | null;
  services: ProjectServiceSummary[];
  onClose: () => void;
}

export default function ProjectGalleryModal({ project, details, services, onClose }: ProjectGalleryModalProps) {
  if (!project || !details) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/25 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl lg:max-w-[90rem] xl:max-w-[100rem] max-h-[90vh] lg:max-h-[96vh] overflow-auto rounded-3xl bg-surface border border-border shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 h-11 w-11 rounded-full bg-surface/95 border border-border text-navy text-2xl leading-none hover:bg-background-light transition-colors"
          aria-label="Cerrar modal"
        >
          ×
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr]">
          <ProjectImageCarousel key={project.id} gallery={details.gallery} />

          <div className="p-8 md:p-10">
            <span className="inline-flex px-4 py-1.5 text-xs font-bold tracking-wider uppercase text-white rounded-full bg-cyan-gradient shadow-md mb-5">
              {project.category}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-navy leading-tight mb-4">
              {project.title}
            </h2>
            <p className="text-muted text-base md:text-lg leading-relaxed mb-5">{details.description}</p>

            {services.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-navy mb-3">Servicios ofrecidos</p>
                <div className="flex flex-wrap items-center gap-2">
                  {services.map((service) => (
                    <div key={service.id} className="relative group">
                      <div
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-primary"
                        aria-label={service.title}
                      >
                        <span className="material-symbols-outlined text-[20px] leading-none">{service.icon}</span>
                      </div>
                      <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-navy px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                        {service.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-border bg-background-light px-4 py-3 inline-flex items-center gap-2 text-muted">
              <span className="material-symbols-outlined text-primary">location_on</span>
              <span className="font-medium">{project.location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
