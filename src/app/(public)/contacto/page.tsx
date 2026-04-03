import type { Metadata } from "next";

import { sendContactFormAction } from "@/app/(public)/contacto/actions";
import { container } from "@/config/container";
import ContactCard from "@/contexts/contacto/presentation/ContactCard";
import CopyEmailButton from "@/contexts/contacto/presentation/CopyEmailButton";
import { GetAllServicesUseCase } from "@/contexts/services/use-cases/get-all-services.use-case";
import { CONTACT_INFO } from "@/contexts/shared/app/contact-info";
import TurnstileInvisible from "@/contexts/shared/presentation/TurnstileInvisible";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contáctanos para cotizar tu proyecto eléctrico. Respondemos en menos de 24 horas. Atención de emergencias 24/7.",
};

export default async function ContactoPage({
  searchParams,
}: {
  searchParams: Promise<{ servicio?: string; sent?: string; error?: string }>;
}) {
  const { servicio, sent, error } = await searchParams;
  const services = await container.get(GetAllServicesUseCase).execute();
  const selectedService = services.find((s) => s.id === servicio)?.id ?? "";
  return (
    <div className="pt-24">
      <main className="grow bg-background-light">
        {/* ── Page header ── */}
        <section className="relative overflow-hidden pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center justify-center rounded-full border border-secondary/20 bg-secondary/5 px-3 py-1 mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                Atención al cliente
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-navy sm:text-5xl lg:text-6xl">
              Contáctanos
            </h1>
            <div className="mt-4 mx-auto h-1 w-24 bg-cyan-gradient rounded-full" />
            <p className="mt-6 text-lg leading-8 text-muted max-w-2xl mx-auto">
              Estamos listos para ayudarte. Escríbenos para cotizar tu proyecto
              o llámanos directamente para emergencias.
            </p>
          </div>
        </section>

        {/* ── Formulario + info ── */}
        <section className="relative py-12 px-4 sm:px-6 lg:px-8 bg-background-light">
          <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-7 xl:col-span-8">
              <div className="rounded-2xl border border-border bg-surface p-6 sm:p-10 shadow-xl shadow-border/50">
                {sent === "1" && (
                  <div className="mb-6 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-on-surface">
                    Tu mensaje fue enviado correctamente. Te responderemos pronto.
                  </div>
                )}
                {error && (
                  <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {decodeURIComponent(error)}
                  </div>
                )}
                <form action={sendContactFormAction} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        className="block text-sm font-medium text-on-surface"
                        htmlFor="name"
                      >
                        Nombre completo
                      </label>
                      <div className="mt-2 relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="material-symbols-outlined text-on-surface-muted text-[20px]">
                            person
                          </span>
                        </div>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          autoComplete="name"
                          placeholder="Juan Pérez"
                          className="block w-full rounded-lg border-0 bg-surface py-3 pl-10 text-on-surface shadow-sm ring-1 ring-inset ring-border placeholder:text-on-surface-muted focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm transition-all"
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
                          required
                          autoComplete="tel"
                          placeholder="+56 9 1234 5678"
                          className="block w-full rounded-lg border-0 bg-white py-3 pl-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm transition-all"
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
                          required
                          autoComplete="email"
                          placeholder="juan@empresa.com"
                          className="block w-full rounded-lg border-0 bg-white py-3 pl-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm transition-all"
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
                          defaultValue={selectedService}
                          className="block w-full rounded-lg border-0 bg-surface py-3 pl-10 pr-10 text-on-surface shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm transition-all"
                        >
                          <option value="">Selecciona un servicio</option>
                          {services.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.title}
                            </option>
                          ))}
                          <option value="otro">Otro</option>
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
                        required
                        placeholder="Describa brevemente su requerimiento..."
                        className="block w-full rounded-lg border-0 bg-surface py-3 px-4 text-on-surface shadow-sm ring-1 ring-inset ring-border placeholder:text-on-surface-muted focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm transition-all"
                      />
                    </div>
                  </div>

                  <TurnstileInvisible />

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
                    <button
                      type="submit"
                      className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-cyan-gradient px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-primary/30 hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 transition-all"
                    >
                      <span>Enviar mensaje</span>
                      <span className="material-symbols-outlined text-[20px]">send</span>
                    </button>
                    <div className="flex items-center gap-2 text-on-surface-muted text-sm">
                      <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
                      <span>Respondemos en menos de 24 horas</span>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Contact info */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
              {/* Teléfono */}
              <ContactCard
                title="Llámanos"
                subtitle="Atención inmediata para proyectos."
                iconGradient="from-secondary to-primary"
                hoverBorderColor="hover:border-secondary/30"
                icon={<span className="material-symbols-outlined text-2xl">phone_in_talk</span>}
                action={
                  <div className="mt-3 flex flex-col gap-1">
                    {CONTACT_INFO.phoneNumbers.map((phoneNumber) => (
                      <a
                        key={phoneNumber}
                        href={`tel:${phoneNumber}`}
                        className="inline-block text-xl font-bold text-secondary hover:text-primary transition-colors"
                      >
                        {phoneNumber}
                      </a>
                    ))}
                  </div>
                }
              />

              {/* WhatsApp */}
              <ContactCard
                title="WhatsApp"
                subtitle="Chatea con un especialista ahora."
                iconGradient="from-[#25D366] to-[#128C7E]"
                hoverBorderColor="hover:border-[#25D366]/30"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-6 h-6 fill-white"
                    aria-label="WhatsApp"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                  </svg>
                }
                action={
                  <a
                    href={`https://wa.me/${CONTACT_INFO.whatsappNumber.replace(/\D/g, "")}`}
                    target="_blank"
                    className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#25D366] hover:text-[#1eb853]"
                  >
                    <span>Iniciar chat</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </a>
                }
              />

              {/* Email */}
              <ContactCard
                title="Email"
                subtitle="Envíanos tus planos o consultas."
                iconGradient="from-secondary to-primary"
                hoverBorderColor="hover:border-secondary/30"
                icon={<span className="material-symbols-outlined text-2xl">mail</span>}
                action={<CopyEmailButton email={CONTACT_INFO.email} />}
              />
              {/* Horarios */}
              <ContactCard
                title="Horario de Atención"
                subtitle="Siempre disponible"
                iconGradient="from-secondary to-primary"
                hoverBorderColor="hover:border-secondary/30"
                icon={<span className="material-symbols-outlined text-2xl">schedule</span>}
                action={null}
              />
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
