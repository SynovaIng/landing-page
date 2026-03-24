"use client";

import { useState } from "react";

import ProjectImageCarousel from "@/contexts/projects/presentation/ProjectImageCarousel";

type ReviewPageStatus = "missing" | "invalid" | "inactive" | "ready" | "success";

interface ReviewPublicFormClientProps {
  token: string;
  status: ReviewPageStatus;
  projectName: string;
  gallery: string[];
  errorMessage: string;
  submitAction: (formData: FormData) => Promise<void>;
}

interface StarIconProps {
  fillPercent: 0 | 50 | 100;
}

function StarIcon({ fillPercent }: StarIconProps) {
  return (
    <span className="relative inline-flex h-6 w-6 items-center justify-center">
      <span className="material-symbols-outlined text-[24px] leading-none text-border">star</span>
      {fillPercent > 0 ? (
        <span
          className="absolute inset-0 inline-flex items-center justify-start overflow-hidden"
          style={{ width: `${fillPercent}%` }}
        >
          <span
            className="material-symbols-outlined text-[24px] leading-none text-amber-400"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
        </span>
      ) : null}
    </span>
  );
}

const getRatingFromPointer = (clientX: number, rect: DOMRect, starValue: number): number => {
  const pointerX = clientX - rect.left;
  const isLeftHalf = pointerX <= rect.width / 2;

  return isLeftHalf ? starValue - 0.5 : starValue;
};

export default function ReviewPublicFormClient({
  token,
  status,
  projectName,
  gallery,
  errorMessage,
  submitAction,
}: ReviewPublicFormClientProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const displayRating = hoverRating === null ? rating : Math.max(rating, hoverRating);

  if (status === "missing") {
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

  if (status === "invalid") {
    return (
      <div className="pt-24">
        <main className="bg-background-light px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-surface p-8 text-center shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Reseñas</p>
            <h1 className="mt-2 text-3xl font-black text-navy">Link no válido</h1>
            <p className="mt-4 text-on-surface-muted">
              Este link no corresponde a una reseña disponible. Solicita un enlace actualizado.
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (status === "inactive") {
    return (
      <div className="pt-24">
        <main className="bg-background-light px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-surface p-8 text-center shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Reseñas</p>
            <h1 className="mt-2 text-3xl font-black text-navy">Link no disponible</h1>
            <p className="mt-4 text-on-surface-muted">
              Esta reseña ya fue respondida o el link está inactivo.
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
                Proyecto: <span className="font-semibold text-on-surface">{projectName}</span>
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1fr]">
            <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-xl">
              <ProjectImageCarousel gallery={gallery} />
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
                <form action={submitAction} className="space-y-5">
                  <input type="hidden" name="token" value={token} />
                  <input type="hidden" name="rating" value={String(rating)} />

                  {errorMessage ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {errorMessage}
                    </div>
                  ) : null}

                  <div>
                    <p className="mb-2 block text-sm font-medium text-on-surface">Calificación</p>
                    <div
                      className="flex items-center gap-1"
                      onMouseLeave={() => setHoverRating(null)}
                    >
                      {[1, 2, 3, 4, 5].map((value) => {
                        let fillPercent: 0 | 50 | 100 = 0;

                        if (displayRating >= value) {
                          fillPercent = 100;
                        } else if (displayRating >= value - 0.5) {
                          fillPercent = 50;
                        }

                        return (
                          <button
                            key={value}
                            type="button"
                            onMouseMove={(event) => {
                              const rect = event.currentTarget.getBoundingClientRect();
                              setHoverRating(getRatingFromPointer(event.clientX, rect, value));
                            }}
                            onClick={(event) => {
                              const rect = event.currentTarget.getBoundingClientRect();
                              const nextRating = getRatingFromPointer(event.clientX, rect, value);
                              setRating(nextRating);
                              setHoverRating(nextRating);
                            }}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-transparent transition-colors hover:border-border"
                            aria-label={`Calificar con ${value} estrella${value === 1 ? "" : "s"}`}
                          >
                            <StarIcon fillPercent={fillPercent} />
                          </button>
                        );
                      })}
                      <span className="ml-2 text-sm text-on-surface-muted">{displayRating.toFixed(1)}/5</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="review-name" className="mb-2 block text-sm font-medium text-on-surface">
                      Nombre
                    </label>
                    <input
                      id="review-name"
                      name="name"
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
                      name="comment"
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
