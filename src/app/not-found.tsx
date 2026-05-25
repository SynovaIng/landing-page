import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sitio en mantencion | SYNOVA",
};

export default function NotFound() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy px-6 py-16 text-center">
      <div className="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-primary/10" />
      <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/8 p-8 shadow-2xl backdrop-blur md:p-14">
        <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          SYNOVA
        </span>
        <h1 className="mt-8 text-4xl font-bold tracking-tight text-white md:text-6xl">
          Sitio en mantencion
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/80 md:text-xl">
          Estamos realizando mejoras para ofrecer una mejor experiencia. Volveremos pronto.
        </p>
        <p className="mt-8 text-sm uppercase tracking-[0.2em] text-white/50">
          Gracias por tu paciencia
        </p>
      </div>
    </section>
  );
}
