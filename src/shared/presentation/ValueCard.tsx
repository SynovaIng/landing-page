interface ValueCardProps {
  icon: string;
  title: string;
  description: string;
}

export default function ValueCard({ icon, title, description }: ValueCardProps) {
  return (
    <div className="group p-8 bg-white rounded-lg border border-gray-200 hover:border-primary/50 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
        <span className="material-symbols-outlined text-9xl text-navy">
          {icon}
        </span>
      </div>
      <div className="w-14 h-14 mb-6 rounded-full bg-background-alt border border-primary/20 flex items-center justify-center text-secondary group-hover:bg-cyan-gradient group-hover:text-white transition-colors duration-300 shadow-sm relative z-10">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <h3 className="text-xl font-bold text-navy mb-4 relative z-10">{title}</h3>
      <p className="text-muted text-sm leading-relaxed relative z-10">{description}</p>
    </div>
  );
}
