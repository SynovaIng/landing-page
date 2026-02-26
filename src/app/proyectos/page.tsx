"use client";

import { useState } from "react";
import ProjectCard from "@/shared/presentation/ProjectCard";
import Button from "@/shared/presentation/Button";
import StatCard from "@/shared/presentation/StatCard";
import { projects, type ProjectCategory } from "@/shared/domain/data/projects";

const categories: Array<ProjectCategory | "Todos"> = [
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

export default function ProyectosPage() {
  const [active, setActive] = useState<ProjectCategory | "Todos">("Todos");

  const filtered =
    active === "Todos"
      ? projects
      : projects.filter((p) => p.category === active);

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
                      ? "bg-linear-to-r from-secondary to-primary text-white font-bold shadow-md"
                      : "bg-white border border-gray-200 text-navy hover:border-secondary hover:text-secondary"
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
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="bg-white border-y border-gray-200 py-16">
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
    </div>
  );
}
