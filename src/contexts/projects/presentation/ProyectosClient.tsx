"use client";

import { useEffect, useMemo, useState } from "react";

import type { Project, ProjectCategory } from "@/contexts/projects/domain/project.entity";
import Button from "@/contexts/shared/presentation/Button";
import StatCard from "@/contexts/shared/presentation/StatCard";

import { getProjectGalleryDetails } from "./project-details";
import ProjectCard from "./ProjectCard";
import ProjectGalleryModal from "./ProjectGalleryModal";

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

export default function ProyectosClient({ projects }: ProyectosClientProps) {
  const [active, setActive] = useState<ProjectCategory | "Todos">("Todos");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered = active === "Todos" ? projects : projects.filter((project) => project.category === active);

  const selectedProjectDetails = useMemo(() => {
    if (!selectedProject) {
      return null;
    }

    return getProjectGalleryDetails(selectedProject);
  }, [selectedProject]);

  useEffect(() => {
    document.body.style.overflow = selectedProject ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  return (
    <div className="pt-24">
      <main className="grow pt-8 pb-20 bg-background-light">
        <div className="max-w-7xl mx-auto px-6">
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
                Excelencia eléctrica y precisión técnica en cada instalación a lo largo de Santiago.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActive(category)}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm ${
                    active === category
                      ? "bg-cyan-gradient text-white font-bold shadow-md"
                      : "bg-surface border border-border text-navy hover:border-secondary hover:text-secondary"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
            ))}
          </div>
        </div>

        <div className="bg-surface border-y border-border py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {stats.map((stat) => (
                <StatCard key={stat.label} value={stat.value} label={stat.label} />
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="max-w-3xl mx-auto relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6 relative z-10">
              ¿Quieres un trabajo como estos?
            </h2>
            <p className="text-muted text-lg mb-10 relative z-10">
              Contamos con el equipo y la experiencia para llevar tu proyecto eléctrico al siguiente nivel.
            </p>
            <div className="relative z-10">
              <Button href="/contacto" variant="primary" size="lg">
                Solicita tu cotización
              </Button>
            </div>
          </div>
        </div>
      </main>

      <ProjectGalleryModal
        project={selectedProject}
        details={selectedProjectDetails}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
