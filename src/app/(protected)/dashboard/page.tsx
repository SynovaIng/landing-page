import type { Metadata } from "next";
import Link from "next/link";

import { logoutAction } from "@/app/(protected)/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard — SYNOVA Admin",
};

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-navy flex flex-col text-white p-8">
      <div className="mb-10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-cyan-gradient">
            <span className="material-symbols-outlined text-lg text-white">bolt</span>
          </div>
          <span className="text-lg font-bold tracking-wide">SYNOVA Admin</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-300">{user?.email ?? ""}</span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>

      <div className="grow flex flex-col items-center justify-center gap-6 text-center">
        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-5xl text-primary">
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
