import type { Service } from "@/shared/domain/data/services";
import Link from "next/link";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="group relative p-8 bg-white rounded-lg border border-gray-200 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-glow flex flex-col h-full overflow-hidden">
      {/* Corner glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-full -mr-8 -mt-8 group-hover:bg-secondary/10 blur-xl transition-all" />

      {/* Icon */}
      <div className="w-14 h-14 mb-6 rounded-full bg-background-alt border border-primary/20 flex items-center justify-center text-secondary group-hover:bg-linear-to-br group-hover:from-secondary group-hover:to-primary group-hover:text-white group-hover:border-transparent transition-all duration-300 shadow-sm relative z-10">
        <span className="material-symbols-outlined text-3xl">{service.icon}</span>
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-navy mb-3 group-hover:text-secondary transition-colors relative z-10">
        {service.title}
      </h3>
      <p className="text-muted text-sm leading-relaxed mb-4 grow font-light relative z-10">
        {service.description}
      </p>

      {/* Features */}
      {service.features.length > 0 && (
        <ul className="flex flex-col gap-2 mb-6 relative z-10">
          {service.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-muted text-sm">
              <span className="material-symbols-outlined text-secondary text-[18px] mt-0.5">{"check_circle"}</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      )}

      {/* CTA */}
      <div className="mt-auto relative z-10">
        <Link
          href="/contacto"
          className="inline-flex items-center gap-2 text-transparent bg-clip-text bg-linear-to-r from-secondary to-primary font-bold text-sm hover:brightness-125 transition-all group-hover:translate-x-1 duration-300"
        >
          <span>{service.ctaLabel}</span>
          <span className="material-symbols-outlined text-[18px] text-secondary">{"arrow_forward"}</span>
        </Link>
      </div>
    </div>
  );
}
