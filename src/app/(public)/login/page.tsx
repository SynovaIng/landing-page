import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { loginAction } from "@/app/actions/auth";
import { createServerAuthUseCases } from "@/contexts/auth/app/server-auth.factory";
import TurnstileInvisible from "@/contexts/shared/presentation/TurnstileInvisible";

export const metadata: Metadata = {
  title: "Admin — SYNOVA",
  description: "Panel de administración SYNOVA",
};

interface AdminLoginPageProps {
  searchParams: Promise<{ error?: string; next?: string }>;
}

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const { getAuthenticatedUserUseCase } = createServerAuthUseCases();
  const user = await getAuthenticatedUserUseCase.execute();

  if (user) {
    redirect("/dashboard");
  }

  const { error, next } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(var(--color-primary) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-cyan-gradient shadow-lg mb-4">
              <span className="material-symbols-outlined text-white text-3xl">
                bolt
              </span>
            </div>
            <h1 className="text-2xl font-bold">
              SYNOVA Admin
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          <form action={loginAction} className="space-y-4">
            <input type="hidden" name="next" value={next ?? ""} />
            <TurnstileInvisible />
            {error ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Correo electrónico
              </label>
              <div className="relative">
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
                  placeholder="admin@synova.cl"
                  className="block w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">
                    lock
                  </span>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-sm transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer">
                <input type="checkbox" className="accent-primary rounded" />
                Recuérdame
              </label>
              <a href="#" className="text-sm text-primary hover:text-primary-dark transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-3 px-6 rounded-lg bg-cyan-gradient text-white font-bold text-base shadow-lg shadow-primary/20 hover:brightness-110 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Iniciar sesión
              <span className="material-symbols-outlined text-[20px]">
                login
              </span>
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-xs text-slate-600">
          SYNOVA — Panel de Administración &copy; 2025
        </p>
      </div>
    </div>
  );
}
