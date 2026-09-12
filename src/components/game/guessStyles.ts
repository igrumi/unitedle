import { type StatComparison } from "../../utils/gameLogic";

export function getBoxStyle(status: StatComparison["status"]): string {
  const baseStyle =
    "flex h-full items-center justify-center gap-1.5 rounded-xl border px-2 text-center text-xs font-bold leading-tight transition-all duration-300 backdrop-blur-md sm:text-sm";

  switch (status) {
    case "correct":
      return `${baseStyle} border-emerald-400/40 bg-emerald-500/20 text-emerald-200 shadow-[0_0_16px_rgba(16,185,129,0.2)]`;
    case "wrong":
      return `${baseStyle} border-rose-500/30 bg-rose-500/15 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.1)]`;
    case "higher":
    case "lower":
      return `${baseStyle} border-amber-400/40 bg-amber-500/20 text-amber-200 shadow-[0_0_16px_rgba(245,158,11,0.2)]`;
  }
}

