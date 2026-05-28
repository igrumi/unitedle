import { ArrowDown, ArrowUp } from "lucide-react";

function LegendItem({
  dotClassName,
  label,
  icon,
}: {
  dotClassName: string;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1">
      <span className={`w-2 h-2 rounded-full ${dotClassName}`} />
      {icon}
      <span className="text-[10px] text-gray-300 uppercase tracking-widest">
        {label}
      </span>
    </span>
  );
}

export function StatLegend() {
  return (
    <div className="mt-3 mb-1 w-full">
      <div className="flex flex-wrap items-center justify-center gap-3 px-2">
        <LegendItem dotClassName="bg-emerald-600/80" label="Correcto" />
        <LegendItem dotClassName="bg-rose-600/80" label="Incorrecto" />
        <LegendItem
          dotClassName="bg-amber-500/80"
          label="Más alto"
          icon={<ArrowUp size={14} className="text-amber-200" />}
        />
        <LegendItem
          dotClassName="bg-amber-500/80"
          label="Más bajo"
          icon={<ArrowDown size={14} className="text-amber-200" />}
        />
      </div>
    </div>
  );
}

