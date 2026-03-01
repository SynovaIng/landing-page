import type { Metadata } from "next";
import Image from "next/image";
import SectionHeader from "@/shared/presentation/SectionHeader";
import StatsBar from "@/shared/presentation/StatsBar";
import ServiceCard from "@/shared/presentation/ServiceCard";
import TestimonialCard from "@/shared/presentation/TestimonialCard";
import Button from "@/shared/presentation/Button";
import { services } from "@/shared/domain/data/services";
import { testimonials } from "@/shared/domain/data/testimonials";

export const metadata: Metadata = {
  title: "SYNOVA — Soluciones Eléctricas Profesionales en Santiago",
  description:
    "Expertos en instalaciones eléctricas de alto estándar, certificaciones SEC y emergencias 24/7 en Santiago de Chile.",
};

const stats = [
  { value: "+10", label: "Años de experiencia" },
  { value: "500+", label: "Proyectos Ejecutados" },
  { value: "100%", label: "Certificación SEC" },
  { value: "24/7", label: "Soporte Técnico" },
];

const whyUs = [
  {
    icon: "badge",
    title: "Instaladores Certificados SEC",
    desc: "Todo nuestro personal cuenta con licencia SEC vigente, asegurando cumplimiento normativo total.",
  },
  {
    icon: "schedule",
    title: "Respuesta Rápida y Puntualidad",
    desc: "Valoramos su tiempo. Llegamos a la hora acordada y entregamos los proyectos en los plazos establecidos.",
  },
  {
    icon: "security",
    title: "Garantía en Todos los Trabajos",
    desc: "Ofrecemos garantía escrita sobre la mano de obra y materiales utilizados en cada instalación.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-screen flex items-center bg-linear-to-br from-background-alt to-background-light">
        <div className="absolute inset-0 z-0 opacity-10">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsxDgGDLNnwtuJwaH1OW0SdsKIiE7Wi22khRCzc5b66OgDu3ZH3ZyY2RL6xaXjFgB1GGluWpsQXhGajsn4t0lgnKYUAZGHW2uEhANotGjnwGpAKjqzC0IDimqJNiUXrNVV33WBljZlXQoNwxoNC6-xRaWy20c1b-uqL4G7K1BJ9lqnz6Tmc-R6GADafE4J9ErcQz1RVSnNpipjj90YCZdkJnaO3g9kOa1EKbjvjcP3O_nPNdamXq7EO3NTL106NAW3rfaJO_5S6mcF"
            alt="Fondo industrial eléctrico"
            fill
            className="object-cover mix-blend-multiply grayscale"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-white/40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block py-1.5 px-4 rounded-full bg-white text-secondary text-xs font-bold tracking-widest mb-8 uppercase border border-secondary/20 shadow-sm">
            Certificados SEC Clase A
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-navy mb-8 leading-tight tracking-tight">
            Soluciones Eléctricas <br />
            <span className="text-cyan-gradient">Profesionales en Santiago</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-muted font-light leading-relaxed">
            Expertos en instalaciones de alto estándar, mantenimiento industrial
            y residencial. Seguridad certificada para su tranquilidad.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6">
            <Button href="/contacto" variant="primary" size="lg">
              Cotiza ahora
            </Button>
            <Button href="/servicios" variant="outline" size="lg">
              Ver servicios
            </Button>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <StatsBar stats={stats} />

      {/* ── Servicios (preview) ── */}
      <section className="py-24 bg-background-alt" id="servicios">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Nuestros Servicios"
            subtitle="Excelencia técnica y compromiso en cada proyecto eléctrico."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button href="/servicios" variant="outline" size="md">
              Ver todos los servicios
            </Button>
          </div>
        </div>
      </section>

      {/* ── Why Us ── */}
      <section className="py-24 bg-background-light relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-1/2 h-full bg-linear-to-l from-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative rounded-lg overflow-hidden group shadow-xl">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpe6RelrGCFnl9zag4R1lAAazDXh42QKxnn3w-3ySrOAKh_LVrL_r36cvnNsyQ1Vfx6XR4LhWq2H1MiATt4ovx9GwbFLhFbEZOdweD5cUPyHNOy3bksYE9tQ9QAxJcuWbj5qC9sgjGbMN83vTkxobWSJJYQ1k2Jav0p3HdZF_QKQ8rYzsfzn7ycxyAhef9JAVs11IUpTc82_NDB60P0xlqvmXOyVjuXTMd79HPuNyVTJ_aipAAEaJA_3RYmMTenaYrbaYIC8iUNzA5"
                alt="Electricista trabajando en tablero"
                width={600}
                height={450}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-2">
                ¿Por qué elegir a SYNOVA?
              </h2>
              <div className="h-1 w-16 bg-secondary mb-10 rounded-full" />
              <div className="space-y-10">
                {whyUs.map((item) => (
                  <div key={item.title} className="flex group">
                    <div className="shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded bg-white text-secondary border border-gray-200 shadow-sm group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                        <span className="material-symbols-outlined">{item.icon}</span>
                      </div>
                    </div>
                    <div className="ml-6">
                      <h4 className="text-xl font-bold text-navy mb-2 group-hover:text-secondary transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-muted font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonios ── */}
      <section className="py-24 bg-background-alt relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Lo que dicen nuestros clientes" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-white border-y border-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-secondary/5 to-primary/5" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">
            ¿Necesitas un electricista de confianza?
          </h2>
          <p className="text-lg text-muted mb-10 font-light max-w-2xl mx-auto">
            Contáctanos hoy para una evaluación gratuita. Garantizamos
            soluciones seguras y eficientes para tu hogar o empresa.
          </p>
          <Button href="/contacto" variant="primary" size="lg">
            Contactar Ahora
          </Button>
        </div>
      </section>
    </>
  );
}
