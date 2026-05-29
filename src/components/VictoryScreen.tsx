import { useEffect, useState } from "react";
import { type User } from "@supabase/supabase-js";
import { type Pokemon } from "../utils/gameLogic";
import { type GuessRow } from "./game/types";
import { DiscordIcon } from "./DiscordIcon";
import { signInWithDiscord } from "../utils/supabaseClient";
import { Leaderboard } from "./Leaderboard";
import { AnimatePresence, motion } from "framer-motion";
import { useI18n } from "../i18n";

interface VictoryScreenProps {
  guesses: GuessRow[];
  winner: Pokemon | null;
  user: User | null;
  attempts?: number | null;
}

export const VictoryScreen = ({
  guesses,
  winner,
  user,
  attempts,
}: VictoryScreenProps) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [view, setView] = useState<"VICTORY" | "LEADERBOARD">("VICTORY");
  const { t } = useI18n();

  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();
      const nextMidnight = new Date();
      nextMidnight.setHours(24, 0, 0, 0);

      const diff = nextMidnight.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };

    updateTimeLeft();
    const timer = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const displayedName =
    winner?.name || guesses[0]?.pokemon.name || t("victory.fallbackPokemon");
  const displayedImage = winner?.image_url || guesses[0]?.pokemon.image_url;
  const displayedAttempts = attempts ?? guesses.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-950/95 p-4 backdrop-blur-md">
      <div className="relative flex min-h-[min(550px,calc(100vh-2rem))] w-full max-w-sm items-center justify-center">
        <AnimatePresence mode="wait">
          {view === "VICTORY" ? (
            <motion.div
              key="victory"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              className="max-h-[calc(100vh-2rem)] w-full overflow-y-auto rounded-2xl border-2 border-primary bg-gray-900 p-5 text-center shadow-2xl sm:p-8"
            >
              <h2 className="text-4xl font-black text-white mb-2">
                {t("victory.title")}
              </h2>
              <p className="text-gray-400">
                {t("victory.todayWas")}{" "}
                <span className="text-white font-bold">{displayedName}</span>
              </p>
              {displayedImage && (
                <img
                  src={displayedImage}
                  className="mx-auto my-4 w-32 h-32 object-contain rounded-2xl bg-gray-800/50 p-2"
                  alt={displayedName}
                />
              )}
              <p className="text-gray-400 mb-6">
                {t("victory.guessedIn")}{" "}
                <span className="text-white font-bold">{displayedAttempts}</span>{" "}
                {t("victory.attempts")}
              </p>

              <button
                onClick={() => setView("LEADERBOARD")}
                className="w-full mb-4 bg-yellow-500 hover:bg-yellow-600 text-black font-black py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                🏆 {t("victory.viewRanking")}
              </button>

              {!user && (
                <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <button
                    onClick={signInWithDiscord}
                    className="w-full flex items-center justify-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-2 rounded-xl transition-all"
                  >
                    <DiscordIcon className="w-4 h-4" /> {t("victory.saveRanking")}
                  </button>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">
                  {t("victory.nextPokemonIn")}
                </p>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-2xl font-mono font-black text-white">
                  {timeLeft}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="leaderboard"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              className="max-h-[calc(100vh-2rem)] w-full overflow-y-auto rounded-2xl border-2 border-yellow-500/50 bg-gray-900 p-5 text-center shadow-2xl sm:p-8"
            >
              <Leaderboard />

              <button
                onClick={() => setView("VICTORY")}
                className="w-full mt-6 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-all border border-white/10"
              >
                {t("victory.backToResult")}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
