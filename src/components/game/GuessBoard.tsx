import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ArrowDown, Sparkles } from "lucide-react";
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

  const getPokemonCellState = (guess: GuessRow) => {
    if (guess.isCorrect === true) return "exact";

    const allStatsCorrect = STAT_COLUMN_KEYS.every(
      (key) => guess.stats[key]?.status === "correct",
    );

    return allStatsCorrect ? "almost" : "wrong";
  };

  const getPokemonCellStyle = (state: "exact" | "almost" | "wrong") => {
    if (state === "exact") {
      return "border-2 border-emerald-400 bg-emerald-600/20";
    }

    if (state === "almost") {
      return "border-2 border-amber-300 bg-amber-400/20 ring-2 ring-amber-300/40";
    }

    return "border border-white/10 bg-gray-800";
  };

  const getPokemonCellLabel = (state: "exact" | "almost" | "wrong") => {
    if (state === "exact") return t("board.exact");
    if (state === "almost") return t("board.almost");
    return t("board.notExact");
  };

  const hasAlmostGuess = guesses.some((guess) => getPokemonCellState(guess) === "almost");

  return (
    <div className="w-full overflow-x-auto pb-5 no-scrollbar">
      <div className="min-w-[620px] sm:min-w-[700px]">
        <AnimatePresence>
          {hasAlmostGuess && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-4 flex items-center gap-3 rounded-2xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-left text-xs font-bold leading-relaxed text-amber-100 sm:text-sm"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-300 text-slate-950">
                <Sparkles size={16} />
              </span>
              <span>
                <strong className="text-amber-200">{t("board.almost")}</strong>{" "}
                {t("board.almostMessage")}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {guesses.length > 0 && (
          <div className="mb-2 grid grid-cols-[repeat(7,minmax(0,1fr))] gap-2 px-2 text-center text-[10px] font-bold uppercase tracking-wide text-gray-400 sm:gap-3 sm:text-xs sm:tracking-widest">
            {columnHeaders.map((h) => (
              <div key={h} className="flex min-h-8 items-end justify-center leading-tight">
                {h}
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3 sm:space-y-4">
          <AnimatePresence initial={false}>
            {guesses.map((g) => {
              const pokemonCellState = getPokemonCellState(g);

              return (
                <motion.div
                  key={g.rowId}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid h-16 grid-cols-[repeat(7,minmax(0,1fr))] items-center gap-2 [perspective:1000px] sm:h-20 sm:gap-3"
                >
                  <motion.div
                    className={`relative flex h-full items-center justify-center overflow-hidden rounded-xl border bg-gray-800 transition-colors ${getPokemonCellStyle(pokemonCellState)}`}
                    aria-label={getPokemonCellLabel(pokemonCellState)}
                    title={getPokemonCellLabel(pokemonCellState)}
                  >
                    {pokemonCellState === "almost" && (
                      <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.24),transparent_62%)]" />
                    )}
                    <motion.img
                      src={g.pokemon.image_url}
                      className="relative z-10 h-12 w-12 object-contain sm:h-16 sm:w-16"
                      animate={
                        pokemonCellState === "almost"
                          ? { scale: [1, 1.05, 1], y: [0, -1, 0] }
                          : undefined
                      }
                      transition={
                        pokemonCellState === "almost"
                          ? { duration: 1.3, repeat: Infinity, ease: "easeInOut" }
                          : undefined
                      }
                      alt={g.pokemon.name}
                    />
                    <span
                      className={`absolute bottom-1 left-1/2 z-10 -translate-x-1/2 rounded-full px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wide sm:text-[9px] ${
                        pokemonCellState === "exact"
                          ? "bg-emerald-400/20 text-emerald-100"
                          : pokemonCellState === "almost"
                            ? "bg-amber-300 text-slate-950"
                            : "bg-rose-400/20 text-rose-100"
                      }`}
                    >
                      {getPokemonCellLabel(pokemonCellState)}
                    </span>
                  </motion.div>

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
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
