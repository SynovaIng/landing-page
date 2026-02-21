interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = true,
}: SectionHeaderProps) {
  return (
    <div className={`mb-16 ${centered ? "text-center" : ""}`}>
      {eyebrow && (
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#1A3A8F] mb-4">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-5xl font-bold text-[#0F1A2E] mb-6 tracking-tight">
        {title}
      </h2>
      <div
        className={`h-1 w-24 bg-gradient-to-r from-[#1A3A8F] to-[#00C8E0] rounded-full ${centered ? "mx-auto" : ""}`}
      />
      {subtitle && (
        <p className="mt-6 text-[#6B7280] max-w-2xl text-lg font-light leading-relaxed mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
