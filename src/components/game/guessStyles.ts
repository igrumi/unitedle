import { type StatComparison } from "../../utils/gameLogic";

export function getBoxStyle(status: StatComparison["status"]): string {
  const baseStyle =
    "flex h-full items-center justify-center gap-1 rounded-xl border border-white/5 px-1 text-center text-xs font-bold leading-tight shadow-lg transition-colors sm:text-sm";

  switch (status) {
    case "correct":
      return `${baseStyle} bg-emerald-600/80 text-white`;
    case "wrong":
      return `${baseStyle} bg-rose-600/80 text-white`;
    case "higher":
      return `${baseStyle} bg-amber-500/80 text-white`;
    case "lower":
      return `${baseStyle} bg-amber-500/80 text-white`;
  }
}
