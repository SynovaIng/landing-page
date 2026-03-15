import type { Metadata } from "next";
import Link from "next/link";

import { logoutAction } from "@/app/(protected)/actions";
import { container } from "@/config/container";
import { createServerAuthUseCases } from "@/contexts/auth/app/server-auth.factory";
import { GetAllProjectsUseCase } from "@/contexts/projects/use-cases/get-all-projects.use-case";
import { GetAllServicesUseCase } from "@/contexts/services/use-cases/get-all-services.use-case";
import { GetAllTestimonialsUseCase } from "@/contexts/testimonials/use-cases/get-all-testimonials.use-case";

import type {
  DashboardProjectRow,
  DashboardServiceRow,
  DashboardTestimonialRow,
} from "./dashboard.types";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard — SYNOVA Admin",
};

export default async function AdminDashboardPage() {
  const { getAuthenticatedUserUseCase } = await createServerAuthUseCases();
  const user = await getAuthenticatedUserUseCase.execute();

  const [projects, services, testimonials] = await Promise.all([
    container.get(GetAllProjectsUseCase).execute(),
    container.get(GetAllServicesUseCase).execute(),
    container.get(GetAllTestimonialsUseCase).execute(),
  ]);

  const projectRows: DashboardProjectRow[] = projects.map((project) => ({
    id: project.id,
    name: project.title,
    description: `Proyecto en ${project.location}`,
    type: project.category,
    location: project.location,
    isActive: true,
  }));

  const serviceRows: DashboardServiceRow[] = services.map((service) => ({
    id: service.id,
    name: service.title,
    slug: service.id,
    description: service.description,
    ctaLabel: service.ctaLabel,
    features: service.features.join(" · "),
    isActive: true,
  }));

  const testimonialRows: DashboardTestimonialRow[] = testimonials.map((testimonial) => ({
    id: testimonial.id,
    clientName: testimonial.authorName,
    clientInitials: testimonial.authorInitials,
    clientLocation: testimonial.authorLocation,
    stars: testimonial.rating,
    message: testimonial.text,
    isActive: true,
  }));

  return (
    <div className="min-h-screen flex flex-col p-8">
      <div className="mb-10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-cyan-gradient">
            <span className="material-symbols-outlined text-lg text-white">bolt</span>
          </div>
          <span className="text-lg font-bold tracking-wide text-slate-900">SYNOVA Admin</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600">{user?.email ?? ""}</span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>

      <div className="grow flex flex-col gap-6">
        <DashboardClient
          projects={projectRows}
          services={serviceRows}
          testimonials={testimonialRows}
        />

        <div className="flex justify-end">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-surface text-on-surface text-sm font-medium hover:bg-surface-alt transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Volver al sitio
          </Link>
        </div>
      </div>
    </div>
  );
}
