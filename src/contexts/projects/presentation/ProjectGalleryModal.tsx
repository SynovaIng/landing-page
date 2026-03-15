"use client";

import type { Project } from "@/contexts/projects/domain/project.entity";

import type { ProjectGalleryDetails } from "./project-details";
import ProjectImageCarousel from "./ProjectImageCarousel";

interface ProjectGalleryModalProps {
  project: Project | null;
  details: ProjectGalleryDetails | null;
  onClose: () => void;
}

export default function ProjectGalleryModal({ project, details, onClose }: ProjectGalleryModalProps) {
  if (!project || !details) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/25 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl max-h-[90vh] overflow-auto rounded-3xl bg-surface border border-border shadow-2xl"
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
