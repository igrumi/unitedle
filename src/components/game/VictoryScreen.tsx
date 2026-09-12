import { useEffect, useState } from "react";
import { type User } from "@supabase/supabase-js";
import { type Pokemon } from "../../types/pokemon";
import { type GuessRow } from "../../types/game";
import { DiscordIcon } from "../ui/DiscordIcon";
import { signInWithDiscord } from "../../utils/supabaseClient";
import { Leaderboard } from "./Leaderboard";
import { AnimatePresence, motion } from "framer-motion";
import { useI18n } from "../../i18n";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-xl">
      <div className="relative flex min-h-[min(550px,calc(100vh-2rem))] w-full max-w-sm items-center justify-center">
        <AnimatePresence mode="wait">
          {view === "VICTORY" ? (
            <motion.div
              key="victory"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              className="glass-panel max-h-[calc(100vh-2rem)] w-full overflow-y-auto rounded-3xl border border-purple-500/30 bg-slate-900/90 p-6 text-center shadow-[0_25px_70px_rgba(124,58,237,0.25)] backdrop-blur-2xl relative overflow-hidden sm:p-8"
            >
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

              <h2 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
                {t("victory.title")}
              </h2>
              <p className="text-slate-400 text-sm">
                {t("victory.todayWas")}{" "}
                <span className="text-white font-bold">{displayedName}</span>
              </p>

              {displayedImage && (
                <div className="relative mx-auto my-5 flex h-36 w-36 items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.02] p-2 shadow-inner">
                  <img
                    src={displayedImage}
                    className="h-28 w-28 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                    alt={displayedName}
                  />
                </div>
              )}

              <p className="text-slate-400 mb-6 text-sm">
                {t("victory.guessedIn")}{" "}
                <span className="text-emerald-400 font-bold">{displayedAttempts}</span>{" "}
                {t("victory.attempts")}
              </p>

              <button
                onClick={() => setView("LEADERBOARD")}
                className="w-full mb-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black py-3.5 rounded-2xl transition-all shadow-[0_10px_25px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 tracking-wide active:scale-[0.98]"
              >
                🏆 {t("victory.viewRanking")}
              </button>

              {!user && (
                <div className="mt-4 p-4 bg-white/[0.03] rounded-2xl border border-white/10">
                  <button
                    onClick={signInWithDiscord}
                    className="w-full flex items-center justify-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-2.5 rounded-xl transition-all shadow-md"
                  >
                    <DiscordIcon className="w-4 h-4" /> {t("victory.saveRanking")}
                  </button>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                  {t("victory.nextPokemonIn")}
                </p>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-2xl sm:text-3xl font-mono font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-amber-200 shadow-inner">
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
              className="glass-panel max-h-[calc(100vh-2rem)] w-full overflow-y-auto rounded-3xl border border-amber-500/30 bg-slate-900/90 p-6 text-center shadow-[0_25px_70px_rgba(245,158,11,0.2)] backdrop-blur-2xl sm:p-8"
            >
              <Leaderboard />

              <button
                onClick={() => setView("VICTORY")}
                className="w-full mt-6 bg-white/10 hover:bg-white/15 text-white font-bold py-3 rounded-2xl transition-all border border-white/10 active:scale-[0.98]"
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
