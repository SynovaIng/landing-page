import type { Project } from "@/shared/domain/data/projects";

interface ProjectCardProps {
  project: Project;
}

const categoryColors: Record<string, string> = {
  Residencial: "bg-secondary",
  Comercial: "bg-category-comercial",
  Industrial: "bg-category-industrial",
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 border border-gray-100">
      {/* Image */}
      <div className="aspect-4/3 w-full overflow-hidden relative">
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url('${project.imageUrl}')` }}
        />
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-multiply" />
      </div>

      {/* Card body */}
      <div className="p-8 relative">
        {/* Category badge */}
        <div className="absolute -top-5 right-8">
          <span
            className={`inline-block px-4 py-1.5 text-xs font-bold tracking-wider uppercase text-white rounded-full shadow-md ${
              categoryColors[project.category] ?? "bg-secondary"
            }`}
          >
            {project.category}
          </span>
        </div>

        <h3 className="text-xl font-bold text-navy mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-muted text-sm flex items-center gap-1">
          <span className="material-symbols-outlined text-sm text-primary">
            location_on
          </span>
          {project.location}
        </p>
      </div>
    </div>
  );
}
