import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — SYNOVA",
  description: "Panel de administración SYNOVA",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      {/* Background accent */}
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
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-linear-to-br from-secondary to-primary shadow-lg mb-4">
              <span className="material-symbols-outlined text-white text-3xl">
                bolt
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white">
              SYNOVA Admin
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          <form action="#" method="POST" className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Correo electrónico
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="material-symbols-outlined text-slate-500 text-[20px]">
                    mail
                  </span>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@synova.cl"
                  className="block w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white placeholder:text-slate-500 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-sm backdrop-blur transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="material-symbols-outlined text-slate-500 text-[20px]">
                    lock
                  </span>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white placeholder:text-slate-500 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-sm backdrop-blur transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                <input type="checkbox" className="accent-primary rounded" />
                Recuérdame
              </label>
              <a href="#" className="text-sm text-primary hover:text-white transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-3 px-6 rounded-lg bg-linear-to-r from-secondary to-primary text-white font-bold text-base shadow-lg shadow-primary/20 hover:brightness-110 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
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
