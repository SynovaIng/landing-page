import type { ReactNode } from "react";

interface ContactCardProps {
  /** Título de la tarjeta, ej. "Llámanos" */
  title: string;
  /** Subtítulo descriptivo */
  subtitle: string;
  /**
   * Clases del gradiente del fondo del ícono.
   * Ej: "from-[#1A3A8F] to-[#00C8E0]"
   */
  iconGradient: string;
  /**
   * Color del borde en hover.
   * Ej: "hover:border-[#1A3A8F]/30"
   */
  hoverBorderColor: string;
  /**
   * El ícono a mostrar dentro del círculo de gradiente.
   * Puede ser un <span> de Material Symbols o un SVG inline.
   */
  icon: ReactNode;
  /**
   * El contenido de acción bajo el subtítulo:
   * un enlace, botón, etc.
   */
  action: ReactNode;
}

/**
 * Tarjeta de contacto reutilizable usada en la página /contacto.
 * Comparte estructura, animaciones y estilos entre Llámanos,
 * WhatsApp y Email.
 */
export default function ContactCard({
  title,
  subtitle,
  iconGradient,
  hoverBorderColor,
  icon,
  action,
}: ContactCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 transition-all ${hoverBorderColor} hover:shadow-md`}
    >
      <div className="flex items-start gap-4">
        {/* Icon badge */}
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-linear-to-br ${iconGradient} text-white group-hover:scale-110 transition-transform duration-300 shadow-sm`}
        >
          {icon}
        </div>

        {/* Content */}
        <div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          {action}
        </div>
      </div>
    </div>
  );
}
