"use client";

import { useState } from "react";

import ProjectImageCarousel from "@/contexts/projects/presentation/ProjectImageCarousel";

interface ReviewPublicFormClientProps {
  token: string;
}

const previewGallery = ["/synova-al-lado.svg", "/synova-al-lado-blanco.svg", "/logo.svg"];

export default function ReviewPublicFormClient({ token }: ReviewPublicFormClientProps) {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const handleSubmit = () => {
    if (!name.trim() || !comment.trim()) {
      return;
    }

    setStatus("success");
  };

  if (!token) {
    return (
      <div className="pt-24">
        <main className="bg-background-light px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-surface p-8 text-center shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Reseñas</p>
            <h1 className="mt-2 text-3xl font-black text-navy">Link incompleto</h1>
            <p className="mt-4 text-on-surface-muted">
              Este enlace no contiene un token de reseña. Solicita uno nuevo al equipo de SYNOVA.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="pt-24">
      <main className="bg-background-light pb-20">
        <section className="relative overflow-hidden px-4 pb-12 pt-16 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-full max-w-4xl -translate-x-1/2 rounded-full bg-primary/10 blur-[110px]" />
          <div className="relative mx-auto max-w-6xl">
            <div className="rounded-3xl border border-border bg-surface p-6 shadow-xl sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Formulario de reseña</p>
              <h1 className="mt-2 text-3xl font-black text-navy sm:text-4xl">Cuéntanos tu experiencia</h1>
              <p className="mt-3 text-on-surface-muted">
                Proyecto: <span className="font-semibold text-on-surface">Instalación eléctrica integral</span>
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1fr]">
            <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-xl">
              <ProjectImageCarousel gallery={previewGallery} />
            </div>

            <div className="rounded-3xl border border-border bg-surface p-6 shadow-xl sm:p-8">
              {status === "success" ? (
                <div className="rounded-2xl border border-primary/30 bg-primary/10 p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Enviado</p>
                  <h2 className="mt-2 text-2xl font-bold text-navy">Gracias por tu respuesta</h2>
                  <p className="mt-3 text-sm text-on-surface-muted">
                    Tu reseña fue enviada correctamente. El equipo la revisará antes de publicarla.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleSubmit();
                  }}
                  className="space-y-5"
                >
                  <div>
                    <label htmlFor="review-name" className="mb-2 block text-sm font-medium text-on-surface">
                      Nombre
                    </label>
                    <input
                      id="review-name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Tu nombre"
                      className="block w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-on-surface placeholder:text-on-surface-muted focus:border-primary focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="review-comment" className="mb-2 block text-sm font-medium text-on-surface">
                      Comentario
                    </label>
                    <textarea
                      id="review-comment"
                      value={comment}
                      onChange={(event) => setComment(event.target.value)}
                      placeholder="Cuéntanos cómo fue el trabajo realizado"
                      rows={5}
                      className="block w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-on-surface placeholder:text-on-surface-muted focus:border-primary focus:outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-gradient px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    Enviar respuesta
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
