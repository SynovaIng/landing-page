import type { Metadata } from "next";
import SectionHeader from "@/shared/presentation/SectionHeader";
import ServiceCard from "@/shared/presentation/ServiceCard";
import Button from "@/shared/presentation/Button";
import { services } from "@/shared/domain/data/services";

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

export default function ServiciosPage() {
  return (
    <div className="pt-24">
      {/* ── Hero ── */}
      <section className="relative py-20 px-6 bg-[#F5F7FA] border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
          <div className="relative inline-block">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0F1A2E] leading-tight">
              Nuestros Servicios
            </h1>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#1A3A8F] to-[#00C8E0] rounded-full" />
          </div>
          <p className="text-[#6B7280] text-lg md:text-xl font-medium max-w-2xl mt-4 leading-relaxed">
            Soluciones eléctricas completas para hogares, empresas e industrias
            en Santiago de Chile. Calidad certificada y atención experta.
          </p>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="px-6 md:px-10 lg:px-16 py-20 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      </section>

      {/* ── Sectores ── */}
      <section className="bg-white border-y border-gray-200 py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#1A3A8F] font-bold tracking-wider text-sm uppercase">
              Sectores que atendemos
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F1A2E] mt-2">
              Experiencia en todos los niveles
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {sectors.map((s) => (
              <div key={s.title} className="px-4 py-6 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1A3A8F] mb-6 shadow-md shadow-blue-100">
                  <span className="material-symbols-outlined text-3xl">{s.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-[#0F1A2E] mb-3">{s.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Banner ── */}
      <section className="py-16 px-6 bg-slate-50 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(#1A3A8F 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-6">
            <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
              <div className="text-[#0F1A2E] text-center">
                <span className="material-symbols-outlined text-5xl text-[#1A3A8F]">verified</span>
                <div className="text-xs font-bold mt-1 tracking-wider text-[#1A3A8F]">SEC</div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#0F1A2E]">Certificación Autorizada</h3>
              <p className="text-[#6B7280]">Instaladores autorizados por la SEC Clase A.</p>
            </div>
          </div>
          <div className="h-px w-full md:w-px md:h-20 bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
          <div className="text-center md:text-left">
            <p className="text-4xl lg:text-5xl font-black text-[#1A3A8F] mb-1">10+</p>
            <p className="text-[#0F1A2E] font-medium uppercase tracking-wide text-sm">
              Años de Experiencia
            </p>
          </div>
          <div className="h-px w-full md:w-px md:h-20 bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
          <div className="text-center md:text-left">
            <p className="text-4xl lg:text-5xl font-black text-[#1A3A8F] mb-1">500+</p>
            <p className="text-[#0F1A2E] font-medium uppercase tracking-wide text-sm">
              Proyectos Completados
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 bg-[#F5F7FA] border-t border-gray-200">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl p-8 md:p-16 text-center border border-gray-200 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-slate-50 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F1A2E] mb-4">
              ¿No encuentras lo que buscas?
            </h2>
            <p className="text-[#6B7280] text-lg mb-10 max-w-xl mx-auto">
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
