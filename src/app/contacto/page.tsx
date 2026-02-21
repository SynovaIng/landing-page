import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contáctanos para cotizar tu proyecto eléctrico. Respondemos en menos de 24 horas. Atención de emergencias 24/7.",
};

export default function ContactoPage() {
  return (
    <div className="pt-24">
      <main className="flex-grow bg-[#F5F7FA]">
        {/* ── Page header ── */}
        <section className="relative overflow-hidden pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-[#00C8E0]/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center justify-center rounded-full border border-[#1A3A8F]/20 bg-[#1A3A8F]/5 px-3 py-1 mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1A3A8F]">
                Atención al cliente
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#0F1A2E] sm:text-5xl lg:text-6xl">
              Contáctanos
            </h1>
            <div className="mt-4 mx-auto h-1 w-24 bg-gradient-to-r from-[#1A3A8F] to-[#00C8E0] rounded-full" />
            <p className="mt-6 text-lg leading-8 text-[#6B7280] max-w-2xl mx-auto">
              Estamos listos para ayudarte. Escríbenos para cotizar tu proyecto
              o llámanos directamente para emergencias.
            </p>
          </div>
        </section>

        {/* ── Formulario + info ── */}
        <section className="relative py-12 px-4 sm:px-6 lg:px-8 bg-[#F5F7FA]">
          <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-7 xl:col-span-8">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl shadow-slate-200/50">
                <form
                  action="#"
                  method="POST"
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        className="block text-sm font-medium text-slate-700"
                        htmlFor="name"
                      >
                        Nombre completo
                      </label>
                      <div className="mt-2 relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="material-symbols-outlined text-slate-400 text-[20px]">
                            person
                          </span>
                        </div>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          placeholder="Juan Pérez"
                          className="block w-full rounded-lg border-0 bg-white py-3 pl-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#00C8E0] sm:text-sm transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium text-slate-700"
                        htmlFor="phone"
                      >
                        Teléfono
                      </label>
                      <div className="mt-2 relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="material-symbols-outlined text-slate-400 text-[20px]">
                            call
                          </span>
                        </div>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          placeholder="+56 9 1234 5678"
                          className="block w-full rounded-lg border-0 bg-white py-3 pl-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#00C8E0] sm:text-sm transition-all"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        className="block text-sm font-medium text-slate-700"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <div className="mt-2 relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="material-symbols-outlined text-slate-400 text-[20px]">
                            mail
                          </span>
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder="juan@empresa.com"
                          className="block w-full rounded-lg border-0 bg-white py-3 pl-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#00C8E0] sm:text-sm transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium text-slate-700"
                        htmlFor="service"
                      >
                        Tipo de servicio
                      </label>
                      <div className="mt-2 relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="material-symbols-outlined text-slate-400 text-[20px]">
                            handyman
                          </span>
                        </div>
                        <select
                          id="service"
                          name="service"
                          className="block w-full rounded-lg border-0 bg-white py-3 pl-10 pr-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-[#00C8E0] sm:text-sm transition-all"
                        >
                          <option>Instalación Eléctrica</option>
                          <option>Certificación SEC</option>
                          <option>Emergencia 24/7</option>
                          <option>Mantención Industrial</option>
                          <option>Otro</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-slate-700"
                      htmlFor="message"
                    >
                      Mensaje
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        placeholder="Describa brevemente su requerimiento..."
                        className="block w-full rounded-lg border-0 bg-white py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#00C8E0] sm:text-sm transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
                    <button
                      type="submit"
                      className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#1A3A8F] to-[#00C8E0] px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 hover:shadow-xl transition-all"
                    >
                      <span>Enviar mensaje</span>
                      <span className="material-symbols-outlined text-[20px]">send</span>
                    </button>
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <span className="material-symbols-outlined text-[#1A3A8F] text-[18px]">verified</span>
                      <span>Respondemos en menos de 24 horas</span>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Contact info */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
              {/* Teléfono */}
              <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 transition-all hover:border-[#1A3A8F]/30 hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#1A3A8F] to-[#00C8E0] text-white group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <span className="material-symbols-outlined text-2xl">phone_in_talk</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Llámanos</h3>
                    <p className="mt-1 text-sm text-slate-500">Atención inmediata para proyectos.</p>
                    <a
                      href="tel:+56912345678"
                      className="mt-3 inline-block text-xl font-bold text-[#1A3A8F] hover:text-[#00C8E0] transition-colors"
                    >
                      +56 9 1234 5678
                    </a>
                  </div>
                </div>
              </div>
              {/* WhatsApp */}
              <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 transition-all hover:border-[#25D366]/30 hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <span className="material-symbols-outlined text-2xl">chat</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">WhatsApp</h3>
                    <p className="mt-1 text-sm text-slate-500">Chatea con un especialista ahora.</p>
                    <a
                      href="#"
                      className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#25D366] hover:text-[#1eb853]"
                    >
                      <span>Iniciar chat</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </a>
                  </div>
                </div>
              </div>
              {/* Email */}
              <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 transition-all hover:border-[#1A3A8F]/30 hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#1A3A8F] to-[#00C8E0] text-white group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <span className="material-symbols-outlined text-2xl">mail</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Email</h3>
                    <p className="mt-1 text-sm text-slate-500">Envíanos tus planos o consultas.</p>
                    <a
                      href="mailto:contacto@synova.cl"
                      className="mt-3 block text-base font-medium text-slate-700 hover:text-[#00C8E0] transition-colors"
                    >
                      contacto@synova.cl
                    </a>
                  </div>
                </div>
              </div>
              {/* Horarios */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
                  <span className="material-symbols-outlined text-[#1A3A8F]">schedule</span>
                  Horario de Atención
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Lunes - Viernes</span>
                    <span className="font-medium text-slate-700">08:00 - 18:00 hrs</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Sábado</span>
                    <span className="font-medium text-slate-700">09:00 - 14:00 hrs</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-[#1A3A8F]">Emergencias Eléctricas</span>
                    <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-600 ring-1 ring-inset ring-red-600/10">
                      24/7 Disponible
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Mapa ── */}
        <section className="relative w-full h-[400px] lg:h-[500px] border-y border-slate-200 overflow-hidden bg-white">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d53239.52494883163!2d-70.64835697621427!3d-33.43572887373323!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c5410425af2f%3A0x8475d53c400f0931!2sSantiago%2C%20Santiago%20Metropolitan%20Region%2C%20Chile!5e0!3m2!1sen!2sus!4v1716390000000!5m2!1sen!2sus"
            width="100%"
            height="100%"
            className="w-full h-full grayscale opacity-80"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa de ubicación SYNOVA"
          />
          {/* Card overlay */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:left-12 md:translate-x-0 bg-white/95 backdrop-blur-md border border-slate-200 p-5 rounded-xl shadow-xl max-w-xs w-full z-20">
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-[#1A3A8F]/10 to-[#00C8E0]/10 p-2 rounded-lg">
                <span className="material-symbols-outlined text-[#1A3A8F] text-2xl">business</span>
              </div>
              <div>
                <p className="text-slate-900 font-bold text-sm uppercase tracking-wide">Oficina Central</p>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  Av. Providencia 1234, Oficina 605
                  <br />
                  Santiago, Chile
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="flex w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-green-600 font-medium uppercase tracking-wider">
                    Abierto ahora
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
