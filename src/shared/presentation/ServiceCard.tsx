import type { Service } from "@/shared/domain/data/services";
import Link from "next/link";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="group relative p-8 bg-white rounded-lg border border-gray-200 hover:border-[#00C8E0]/50 transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(0,200,224,0.25)] flex flex-col h-full overflow-hidden">
      {/* Corner glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#1A3A8F]/5 rounded-bl-full -mr-8 -mt-8 group-hover:bg-[#1A3A8F]/10 blur-xl transition-all" />

      {/* Icon */}
      <div className="w-14 h-14 mb-6 rounded-full bg-[#EFF6FF] border border-[#00C8E0]/20 flex items-center justify-center text-[#1A3A8F] group-hover:bg-gradient-to-br group-hover:from-[#1A3A8F] group-hover:to-[#00C8E0] group-hover:text-white group-hover:border-transparent transition-all duration-300 shadow-sm relative z-10">
        <span className="material-symbols-outlined text-3xl">{service.icon}</span>
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-[#0F1A2E] mb-3 group-hover:text-[#1A3A8F] transition-colors relative z-10">
        {service.title}
      </h3>
      <p className="text-[#6B7280] text-sm leading-relaxed mb-4 flex-grow font-light relative z-10">
        {service.description}
      </p>

      {/* Features */}
      {service.features.length > 0 && (
        <ul className="flex flex-col gap-2 mb-6 relative z-10">
          {service.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-[#6B7280] text-sm">
              <span className="material-symbols-outlined text-[#1A3A8F] text-[18px] mt-0.5">
                check_circle
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      )}

      {/* CTA */}
      <div className="mt-auto relative z-10">
        <Link
          href="/contacto"
          className="inline-flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-[#1A3A8F] to-[#00C8E0] font-bold text-sm hover:brightness-125 transition-all group-hover:translate-x-1 duration-300"
        >
          <span>{service.ctaLabel}</span>
          <span className="material-symbols-outlined text-[18px] text-[#1A3A8F]">
            arrow_forward
          </span>
        </Link>
      </div>
    </div>
  );
}
