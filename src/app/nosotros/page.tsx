import type { Metadata } from "next";
import Image from "next/image";
import SectionHeader from "@/shared/presentation/SectionHeader";
import Button from "@/shared/presentation/Button";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conoce la historia, valores y equipo de SYNOVA — electricistas certificados SEC comprometidos con la calidad y seguridad.",
};

const values = [
  {
    icon: "engineering",
    title: "Profesionalismo",
    desc: "Ejecutamos cada tarea con rigor técnico y ética laboral. Nuestro equipo se mantiene en constante capacitación para ofrecer lo mejor de la industria.",
  },
  {
    icon: "shield",
    title: "Seguridad",
    desc: "La integridad de las personas y las instalaciones es nuestra prioridad #1. Seguimos estrictos protocolos y normativas SEC en todo momento.",
  },
  {
    icon: "handshake",
    title: "Compromiso",
    desc: "Creamos relaciones a largo plazo con nuestros clientes basadas en la confianza, el cumplimiento de plazos y resultados garantizados.",
  },
];

const credentials = [
  {
    icon: "verified_user",
    title: "Certificación SEC Clase A",
    desc: "Licencia vigente para todo tipo de proyecto",
  },
  {
    icon: "history",
    title: "+10 Años en el Mercado",
    desc: "Experiencia comprobada en Santiago",
  },
  {
    icon: "gavel",
    title: "Seguro de Responsabilidad",
    desc: "Cobertura completa para su tranquilidad",
  },
];

const team = [
  {
    name: "Carlos Mendoza",
    role: "Fundador & Ingeniero Jefe",
    bio: "Lidera la visión técnica de SYNOVA con más de 15 años de experiencia en ingeniería eléctrica.",
    imgSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAOQuLnLPQDVBPBNAisZQjVI2GmOVVJ6i2PJ5mKBQ6zVwU6UMh08xWnBY3N1BWV86gBZEGX0FeAtdV7q5Puw7OKYS-_fu3DPAoHGBt5rVd80cTMlz-qe2Xap74IujVLjNn1t5OFlg03zsILfEa7UWiU2OPxZy4aqxtC55LEkB4NA2KETl2cBcauy_kBrN02IXyjkBCqgvGlrQj5azR8IgBiyGLWLLWZbit-ifb1Vlm1mE1hM2RAJ1-BrIe0lBEC66HLf8kKd7wMIYn0",
  },
  {
    name: "Ana Gutiérrez",
    role: "Jefe de Proyectos",
    bio: "Coordina la ejecución precisa de cada obra, asegurando tiempos y presupuestos óptimos.",
    imgSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAPSaHbTN0mUwuQZj_J5vB5zfNHNE5-omjy-qheYRX6zgtVP0ODbJLJrYkDvyRL8ex6u1LkeY6fitG0ro6RURbmxhKR5dLvcdIaW8USG7OaaZRgScLp8MlQaFl8Ofd3hFLqREjspeVRR9aek8VqIRrnxhekabszenfb6gbco-XJucvGCglsVcwJJmrf386xxu2aegQFBgObqVvJhHI_XXyLs-X12tuKqMdEFmYFoTXpGj0ZknIYvu9PAE5rfg1KfC7hbGV5XeVJQOjg",
  },
];

export default function NosotrosPage() {
  return (
    <div className="pt-24">
      {/* ── Page Hero ── */}
      <div className="pt-16 pb-16 lg:pt-24 lg:pb-20 bg-[#F5F7FA] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-white/60 to-[#F5F7FA]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0F1A2E] mb-6 tracking-tight relative inline-block">
            Nosotros
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-[#1A3A8F] rounded-full opacity-80" />
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-[#6B7280] font-light leading-relaxed">
            Electricistas certificados comprometidos con la calidad y seguridad de cada proyecto.
          </p>
        </div>
      </div>

      {/* ── Historia ── */}
      <section className="py-20 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 text-[#1A3A8F] uppercase tracking-widest text-xs font-bold border-b border-[#1A3A8F]/30 pb-1">
                <span>Nuestra Historia</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0F1A2E] leading-tight">
                Expertos en Energía,{" "}
                <br />
                <span className="text-cyan-gradient">Comprometidos con el Futuro.</span>
              </h2>
              <p className="text-[#6B7280] text-lg leading-relaxed">
                Fundada en Santiago, SYNOVA nació con la visión de elevar el
                estándar de los servicios eléctricos en Chile. Entendemos que
                la electricidad no es solo energía; es el pulso vital de hogares
                y empresas.
              </p>
              <p className="text-[#6B7280] text-lg leading-relaxed">
                Nuestra misión es proporcionar soluciones eléctricas seguras,
                eficientes y tecnológicamente avanzadas, con un equipo de
                profesionales altamente capacitados y certificados por la SEC.
              </p>
              <div className="flex items-center gap-4">
                <div className="h-12 w-1 bg-[#1A3A8F] rounded-full" />
                <p className="text-[#0F1A2E] italic text-lg font-medium">
                  &ldquo;La seguridad y la excelencia técnica son los pilares
                  inquebrantables de nuestra operación diaria.&rdquo;
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-[#00C8E0]/10 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative rounded-lg overflow-hidden border border-gray-200 p-2 bg-white shadow-xl">
                <div className="relative overflow-hidden rounded border border-[#00C8E0]/20">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8mDq9_R9-V4It5HAWL7nlQHwaTeUmiKCw0RBJiE8cUUE2r6xQnC04nizdjpo7ciXb8IGKxFjIph7Fq8C4smqDUfHDrU7CL63VKbThCEm2HOdqFKLNP9QZJrIVFBZMe2GAJmenkEm7jfQKmgZHjUK6yYSV4dTxVdQMPTmepQBS7iNrFNZJRBpFXfksISpbaBHbLKOGcdSijiEg8xLnOleQ9UyDhmq6Sa0R6viQEuibYe_X-Yb4apaOFrLmN7XhBbwZIBi61cAA0ush"
                    alt="Equipo profesional SYNOVA"
                    width={600}
                    height={450}
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Valores ── */}
      <section className="py-24 bg-[#EFF6FF] border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Nuestros Valores" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v) => (
              <div
                key={v.title}
                className="group p-8 bg-white rounded-lg border border-gray-200 hover:border-[#00C8E0]/50 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                  <span className="material-symbols-outlined text-9xl text-[#0F1A2E]">
                    {v.icon}
                  </span>
                </div>
                <div className="w-14 h-14 mb-6 rounded-full bg-[#EFF6FF] border border-[#00C8E0]/20 flex items-center justify-center text-[#1A3A8F] group-hover:bg-cyan-gradient group-hover:text-white transition-colors duration-300 shadow-sm relative z-10">
                  <span className="material-symbols-outlined text-3xl">{v.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-[#0F1A2E] mb-4 relative z-10">{v.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed relative z-10">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Credenciales ── */}
      <section className="bg-white border-y border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {credentials.map((c) => (
              <div key={c.title} className="px-4 py-4 md:py-0 flex flex-col items-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#EFF6FF] border border-[#00C8E0]/20 mb-4 shadow-sm text-[#1A3A8F]">
                  <span className="material-symbols-outlined text-3xl">{c.icon}</span>
                </div>
                <h4 className="text-[#0F1A2E] font-bold text-lg mb-1">{c.title}</h4>
                <p className="text-gray-500 text-sm">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Equipo ── */}
      <section className="py-24 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Nuestro Equipo"
            subtitle="Profesionales apasionados por la excelencia eléctrica."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {team.map((member) => (
              <div key={member.name} className="text-center group">
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full border-2 border-[#00C8E0]/30 scale-105 group-hover:scale-110 transition-transform duration-500" />
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-white relative z-10 ring-2 ring-[#00C8E0] shadow-lg">
                    <Image
                      src={member.imgSrc}
                      alt={member.name}
                      width={192}
                      height={192}
                      className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#0F1A2E] mb-1 group-hover:text-[#1A3A8F] transition-colors">
                  {member.name}
                </h3>
                <p className="text-[#1A3A8F] text-sm uppercase tracking-widest font-bold mb-2">
                  {member.role}
                </p>
                <p className="text-[#6B7280] text-sm font-light px-4">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-white border-t border-gray-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#EFF6FF]/50" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-[#0F1A2E] mb-6">
            ¿Listo para trabajar con nosotros?
          </h2>
          <p className="text-lg text-[#6B7280] mb-10 max-w-2xl mx-auto">
            Permita que nuestro equipo experto se encargue de sus necesidades
            eléctricas con la calidad que usted merece.
          </p>
          <Button href="/contacto" variant="primary" size="lg">
            Contáctanos
          </Button>
        </div>
      </section>
    </div>
  );
}
