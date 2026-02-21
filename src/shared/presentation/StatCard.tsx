interface StatCardProps {
  value: string;
  label: string;
}

export default function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="px-4 flex flex-col items-center group">
      <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-[#1A3A8F] to-[#00C8E0] mb-3 group-hover:scale-110 transition-transform origin-center">
        {value}
      </span>
      <span className="text-[#6B7280] text-xs font-medium uppercase tracking-widest text-center border-t border-gray-200 pt-3 w-full">
        {label}
      </span>
    </div>
  );
}
