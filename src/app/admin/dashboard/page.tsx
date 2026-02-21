import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard — SYNOVA Admin",
};

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-[#0F1A2E] flex flex-col text-white p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-8 h-8 rounded bg-linear-to-br from-[#1A3A8F] to-[#00C8E0] flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-lg">bolt</span>
        </div>
        <span className="font-bold text-lg tracking-wide">SYNOVA Admin</span>
      </div>

      {/* Placeholder content */}
      <div className="grow flex flex-col items-center justify-center gap-6 text-center">
        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-5xl text-[#00C8E0]">
            construction
          </span>
        </div>
        <h1 className="text-3xl font-bold text-white">Dashboard en construcción</h1>
        <p className="text-slate-400 max-w-md text-lg">
          El panel de administración de proyectos se implementará en la
          siguiente iteración. Aquí podrás gestionar proyectos, servicios y
          solicitudes de contacto.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors text-sm font-medium"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Volver al sitio
        </Link>
      </div>
    </div>
  );
}
