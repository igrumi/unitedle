import { type StatComparison } from "../../utils/gameLogic";

export function getBoxStyle(status: StatComparison["status"]): string {
  const baseStyle =
    "flex items-center justify-center gap-1 rounded-xl font-bold text-sm h-full shadow-lg border border-white/5 transition-colors";

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
