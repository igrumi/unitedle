import { ArrowDown, ArrowUp } from "lucide-react";
import { useI18n } from "../../i18n";

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
    <span className="inline-flex min-h-8 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 shadow-sm">
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotClassName}`} />
      {icon}
      <span className="text-[9px] uppercase tracking-wider text-gray-300 sm:text-[10px] sm:tracking-widest font-bold">
        {label}
      </span>
    </span>
  );
}

export function StatLegend() {
  const { t } = useI18n();

  return (
    <div className="mb-1 mt-4 w-full">
      <div className="mx-auto grid max-w-sm grid-cols-2 gap-2 px-1 sm:flex sm:max-w-none sm:flex-wrap sm:items-center sm:justify-center sm:gap-3 sm:px-2">
        <LegendItem dotClassName="bg-emerald-600" label={t("legend.correct")} />
        <LegendItem dotClassName="bg-rose-600" label={t("legend.wrong")} />
        <LegendItem
          dotClassName="bg-amber-500"
          label={t("legend.higher")}
          icon={<ArrowUp size={14} className="text-amber-400" />}
        />
        <LegendItem
          dotClassName="bg-amber-500"
          label={t("legend.lower")}
          icon={<ArrowDown size={14} className="text-amber-400" />}
        />
      </div>
    </div>
  );
}
