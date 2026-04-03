import type { Metadata } from "next";

import { container } from "@/config/container";
import { formatProjectCountApprox } from "@/contexts/projects/app/format-project-count";
import { GetProjectStatusCountsUseCase } from "@/contexts/projects/use-cases/get-project-status-counts.use-case";
import ServiceCard from "@/contexts/services/presentation/ServiceCard";
import { GetAllServicesUseCase } from "@/contexts/services/use-cases/get-all-services.use-case";
import Button from "@/contexts/shared/presentation/Button";
import SectionHeader from "@/contexts/shared/presentation/SectionHeader";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Instalaciones eléctricas, certificaciones SEC, emergencias 24/7 y mantención preventiva en Santiago de Chile.",
};

const sectors = [
  {
    icon: "home",
    title: "Residencial",
    desc: "Seguridad para tu hogar. Desde cambio de enchufes hasta cableado completo de casas y departamentos.",
  },
  {
    icon: "storefront",
    title: "Comercial",
    desc: "Soluciones para oficinas y retail. Iluminación eficiente y puntos de red para la productividad.",
  },
  {
    icon: "factory",
    title: "Industrial",
    desc: "Alta potencia y trifásica. Mantenimiento de maquinaria y tableros de fuerza industrial.",
  },
];

const SERVICES_GRID_COLUMNS_CLASS = "md:grid-cols-3";

export default async function ServiciosPage() {
  const [services, projectCounts] = await Promise.all([
    container.get(GetAllServicesUseCase).execute(),
    container.get(GetProjectStatusCountsUseCase).execute(),
  ]);
  const projectsCountLabel = formatProjectCountApprox(projectCounts.totalCount);

  return (
    <div className="pt-24">
      {/* ── Hero ── */}
      <section className="relative py-20 px-6 bg-background-light border-b border-border">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
          <div className="relative inline-block">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-navy leading-tight">
              Nuestros Servicios
            </h1>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24 h-1 bg-cyan-gradient rounded-full" />
          </div>
          <p className="text-muted text-lg md:text-xl font-medium max-w-2xl mt-4 leading-relaxed">
            Soluciones eléctricas completas para hogares, empresas e industrias
            en Santiago de Chile. Calidad certificada y atención experta.
          </p>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="px-6 md:px-10 lg:px-16 py-20 bg-background-light">
        <div className={`max-w-7xl mx-auto grid grid-cols-1 ${SERVICES_GRID_COLUMNS_CLASS} gap-8`}>
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      </section>

      {/* ── Sectores ── */}
      <section id="tipos-de-proyectos" className="bg-surface border-y border-border py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="Sectores que atendemos"
            title="Experiencia en todos los niveles"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border">
            {sectors.map((s) => (
              <div key={s.title} className="px-4 py-6 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-surface-alt border border-border flex items-center justify-center text-secondary mb-6 shadow-md shadow-border-light">
                  <span className="material-symbols-outlined text-3xl">{s.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-navy mb-3">{s.title}</h3>
                <p className="text-muted text-sm leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Banner ── */}
      <section className="py-16 px-6 bg-surface-alt relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(var(--color-secondary) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-3 items-stretch">
          <div className="flex items-center justify-center md:justify-start gap-6 py-6 md:py-0 md:pr-8">
            <div className="bg-surface p-4 rounded-xl shadow-lg border border-border-light">
              <div className="text-navy text-center">
                <span className="material-symbols-outlined text-5xl text-secondary">verified</span>
                <div className="text-xs font-bold mt-1 tracking-wider text-secondary">SEC</div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-navy">Certificación Autorizada</h3>
              <p className="text-muted">Instaladores autorizados por la SEC Clase A.</p>
            </div>
          </div>
          <div className="text-center py-6 md:py-0 md:px-8 border-y md:border-y-0 md:border-x border-border flex flex-col items-center justify-center">
            <p className="text-4xl lg:text-5xl font-black text-secondary mb-1">24/7</p>
            <p className="text-navy font-medium uppercase tracking-wide text-sm">
              Emergencias Eléctricas
            </p>
          </div>
          <div className="text-center py-6 md:py-0 md:pl-8 flex flex-col items-center justify-center">
            <p className="text-4xl lg:text-5xl font-black text-secondary mb-1">{projectsCountLabel}</p>
            <p className="text-navy font-medium uppercase tracking-wide text-sm">
              Proyectos Completados
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 bg-background-light border-t border-border">
        <div className="max-w-5xl mx-auto bg-surface rounded-2xl p-8 md:p-16 text-center border border-border shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-linear-to-b from-surface-alt to-transparent pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              ¿No encuentras lo que buscas?
            </h2>
            <p className="text-muted text-lg mb-10 max-w-xl mx-auto">
              Cada proyecto es único. Contáctanos para evaluar tu caso
              específico y ofrecerte una solución a medida.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button href="/contacto" variant="primary" size="md">
                Hablar con un experto
              </Button>
              <Button href="/proyectos" variant="outline" size="md">
                Ver Proyectos
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
