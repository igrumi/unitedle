import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";
import { STAT_COLUMN_KEYS, type GuessRow } from "./types";
import { getBoxStyle } from "./guessStyles";
import { useI18n } from "../../i18n";

interface GuessBoardProps {
  guesses: GuessRow[];
}

export function GuessBoard({ guesses }: GuessBoardProps) {
  const { t, translateGameValue } = useI18n();
  const columnHeaders = [
    t("board.pokemon"),
    t("board.role"),
    t("board.evolves"),
    t("board.mega"),
    t("board.range"),
    t("board.releaseYear"),
    t("board.evolutionStage"),
  ];

  const getPokemonCellStyle = (isCorrect: boolean) =>
    isCorrect
      ? "border-emerald-400/70 bg-emerald-600/15 shadow-[0_0_24px_rgba(16,185,129,0.22)]"
      : "border-rose-400/70 bg-rose-600/10 shadow-[0_0_18px_rgba(244,63,94,0.16)]";

  return (
    <div className="w-full overflow-x-auto pb-5 no-scrollbar">
      <div className="min-w-[620px] sm:min-w-[700px]">
        {guesses.length > 0 && (
          <div className="mb-2 grid grid-cols-[repeat(7,minmax(0,1fr))] gap-2 px-2 text-center text-[10px] font-bold uppercase tracking-wide text-gray-500 sm:gap-3 sm:text-xs sm:tracking-widest">
            {columnHeaders.map((h) => (
              <div key={h} className="flex min-h-8 items-end justify-center leading-tight">
                {h}
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3 sm:space-y-4">
          <AnimatePresence initial={false}>
            {guesses.map((g) => (
              <motion.div
                key={g.rowId}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid h-16 grid-cols-[repeat(7,minmax(0,1fr))] items-center gap-2 [perspective:1000px] sm:h-20 sm:gap-3"
              >
                <div
                  className={`relative flex h-full items-center justify-center rounded-xl border bg-gray-800 transition-colors ${getPokemonCellStyle(g.isCorrect === true)}`}
                  aria-label={g.isCorrect === true ? t("board.exact") : t("board.notExact")}
                  title={g.isCorrect === true ? t("board.exact") : t("board.notExact")}
                >
                  <img
                    src={g.pokemon.image_url}
                    className="h-12 w-12 object-contain sm:h-16 sm:w-16"
                    alt={g.pokemon.name}
                  />
                  <span
                    className={`absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wide sm:text-[9px] ${
                      g.isCorrect === true
                        ? "bg-emerald-400/20 text-emerald-100"
                        : "bg-rose-400/20 text-rose-100"
                    }`}
                  >
                    {g.isCorrect === true ? t("board.exact") : t("board.notExact")}
                  </span>
                </div>

                {STAT_COLUMN_KEYS.map((key, i) => {
                  const stat = g.stats[key];

                  return (
                    <motion.div
                      key={key}
                      initial={{ rotateY: 90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      transition={{
                        delay: i * 0.2,
                        duration: 0.6,
                        ease: "easeInOut",
                      }}
                      className={getBoxStyle(stat.status)}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <span className="backface-hidden flex items-center justify-center gap-1">
                        {stat.status === "higher" && <ArrowUp size={18} />}
                        {stat.status === "lower" && <ArrowDown size={18} />}
                        {translateGameValue(stat.value)}
                      </span>
                    </motion.div>
                  );
                })}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
