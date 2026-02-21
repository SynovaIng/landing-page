interface StatCardProps {
  value: string;
  label: string;
}

export default function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="px-4 flex flex-col items-center md:items-start group">
      <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-[#1A3A8F] to-[#00C8E0] mb-2 group-hover:scale-110 transition-transform origin-left">
        {value}
      </span>
      <span className="text-[#6B7280] text-xs font-medium uppercase tracking-widest border-t border-gray-200 pt-3 w-full">
        {label}
      </span>
    </div>
  );
}
