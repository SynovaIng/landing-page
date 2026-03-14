import type { Metadata } from "next";
import Link from "next/link";

import { logoutAction } from "@/app/(protected)/actions";
import { createServerAuthUseCases } from "@/contexts/auth/app/server-auth.factory";

export const metadata: Metadata = {
  title: "Dashboard — SYNOVA Admin",
};

export default async function AdminDashboardPage() {
  const { getAuthenticatedUserUseCase } = await createServerAuthUseCases();
  const user = await getAuthenticatedUserUseCase.execute();

  return (
    <div className="min-h-screen flex flex-col p-8">
      <div className="mb-10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-cyan-gradient">
            <span className="material-symbols-outlined text-lg text-white">bolt</span>
          </div>
          <span className="text-lg font-bold tracking-wide text-slate-900">SYNOVA Admin</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600">{user?.email ?? ""}</span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>

      <div className="grow flex flex-col items-center justify-center gap-6 text-center">
        <div className="w-20 h-20 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-subtle">
          <span className="material-symbols-outlined text-5xl text-primary">
            construction
          </span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard en construcción</h1>
        <p className="text-slate-600 max-w-md text-lg">
          El panel de administración de proyectos se implementará en la
          siguiente iteración. Aquí podrás gestionar proyectos, servicios y
          solicitudes de contacto.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors text-sm font-medium"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Volver al sitio
        </Link>
      </div>
    </div>
  );
}
