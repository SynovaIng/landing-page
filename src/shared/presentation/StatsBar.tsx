import StatCard from "@/shared/presentation/StatCard";

interface Stat {
  value: string;
  label: string;
}

interface StatsBarProps {
  stats: Stat[];
}

/**
 * Barra horizontal de estadísticas destacadas.
 * Muestra un grid de StatCards separados por divisores.
 */
export default function StatsBar({ stats }: StatsBarProps) {
  return (
    <section className="border-y border-gray-200 bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
          {stats.map((s) => (
            <StatCard key={s.label} value={s.value} label={s.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
