import { motion, AnimatePresence } from "framer-motion";
import { signInWithDiscord } from "../../utils/supabaseClient";
import { Logo } from "../Logo";
import { Title } from "../Title";
import { DiscordIcon } from "../DiscordIcon";
import { DailyRecord } from "./DailyRecord";

interface GameHeaderProps {
  user: unknown;
  isWon: boolean;
  winsCount: number | null;
  onOpenLeaderboard: () => void;
}

export function GameHeader({
  user,
  isWon,
  winsCount,
  onOpenLeaderboard,
}: GameHeaderProps) {
  return (
    <div className="text-center mb-10 relative">
      <div className="flex flex-col items-center justify-center relative">
        <Logo className="mb-4" />

        {!user && !isWon && (
          <div className="md:absolute md:right-20 md:top-1/2 md:-translate-y-1/2 mt-4 md:mt-0">
            <button
              onClick={signInWithDiscord}
              className="group flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white text-[11px] font-black px-5 py-2.5 rounded-full transition-all shadow-lg hover:shadow-[#5865F2]/30 border border-white/10 uppercase tracking-widest active:scale-95"
            >
              <DiscordIcon className="w-4 h-4 transition-transform group-hover:rotate-12" />
              <span>Guardar racha</span>
            </button>
          </div>
        )}

        <div className="md:absolute md:left-20 md:top-1/2 md:-translate-y-1/2 mt-2 md:mt-0">
          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-2 bg-yellow-500/10 hover:bg-yellow-500 text-yellow-500 hover:text-black text-[11px] font-black px-4 py-2 rounded-full transition-all border border-yellow-500/20 uppercase"
          >
            🏆 <span className="hidden sm:inline">Ver Ranking</span>
          </button>
        </div>
      </div>

      <Title />

      <DailyRecord refreshKey={winsCount} />

      <div className="flex justify-center mt-4 h-8 items-center">
        <AnimatePresence mode="wait">
          {winsCount === null ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-5 w-48 bg-emerald-400/20 animate-pulse rounded-full"
            />
          ) : (
            <motion.p
              key="count"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-emerald-400 font-bold"
            >
              {winsCount === 0
                ? "¡Sé el primero en adivinar el Pokémon de hoy!"
                : `¡${winsCount} ${winsCount === 1 ? "persona ha" : "personas han"} adivinado el Pokémon de hoy!`}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
