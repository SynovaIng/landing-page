import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página no encontrada | SYNOVA",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col items-center justify-center px-4 text-center">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1A3A8F]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00C8E0]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-xl mx-auto">
        {/* Número 404 */}
        <div className="relative mb-6">
          <span className="text-[10rem] lg:text-[14rem] font-black leading-none text-transparent bg-clip-text bg-linear-to-br from-[#1A3A8F] to-[#00C8E0] select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-[#0F1A2E]/5">
              bolt
            </span>
          </div>
        </div>

        {/* Mensaje */}
        <h1 className="text-2xl md:text-3xl font-bold text-[#0F1A2E] mb-4">
          Página no encontrada
        </h1>
        <p className="text-[#6B7280] text-lg mb-10 leading-relaxed">
          Lo sentimos, la página que buscas no existe o fue movida.
          <br />
          Verifica la dirección o vuelve al inicio.
        </p>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-sm bg-linear-to-r from-[#1A3A8F] to-[#00C8E0] text-white font-bold text-base shadow-lg hover:brightness-110 hover:-translate-y-0.5 transition-all duration-300"
          >
            <span className="material-symbols-outlined text-[20px]">home</span>
            Volver al inicio
          </Link>
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-sm border-2 border-[#1A3A8F] text-[#1A3A8F] font-bold text-base hover:bg-[#1A3A8F]/5 transition-all duration-300"
          >
            Contactar soporte
          </Link>
        </div>
      </div>
    </div>
  );
}
