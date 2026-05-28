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
    <span className="inline-flex min-h-9 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
      <span className={`h-2 w-2 shrink-0 rounded-full ${dotClassName}`} />
      {icon}
      <span className="text-[9px] uppercase tracking-wide text-gray-300 sm:text-[10px] sm:tracking-widest">
        {label}
      </span>
    </span>
  );
}

export function StatLegend() {
  return (
    <div className="mb-1 mt-3 w-full">
      <div className="mx-auto grid max-w-sm grid-cols-2 gap-2 px-1 sm:flex sm:max-w-none sm:flex-wrap sm:items-center sm:justify-center sm:gap-3 sm:px-2">
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

