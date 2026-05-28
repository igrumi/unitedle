import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";
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
    <div className="relative mb-7 pt-1 text-center sm:mb-10">
      <button
        onClick={onOpenLeaderboard}
        aria-label="Ver ranking"
        title="Ver ranking"
        className="absolute left-0 top-0 inline-flex h-10 w-10 items-center justify-center rounded-full border border-yellow-500/25 bg-yellow-500/10 text-yellow-400 shadow-lg transition-all hover:bg-yellow-500 hover:text-black active:scale-95 sm:h-11 sm:w-11"
      >
        <Trophy size={15} />
      </button>

      {!user && !isWon && (
        <button
          onClick={signInWithDiscord}
          aria-label="Iniciar sesión con Discord"
          title="Iniciar sesión con Discord"
          className="group absolute right-0 top-0 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#5865F2] text-white shadow-lg transition-all hover:bg-[#4752C4] hover:shadow-[#5865F2]/30 active:scale-95 sm:h-11 sm:w-11"
        >
          <DiscordIcon className="h-4 w-4 transition-transform group-hover:rotate-12" />
        </button>
      )}

      <Logo className="mb-4" />

      <Title />

      <DailyRecord refreshKey={winsCount} />

      <div className="mt-4 flex min-h-8 items-center justify-center px-3">
        <AnimatePresence mode="wait">
          {winsCount === null ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-5 w-48 rounded-full bg-emerald-400/20 animate-pulse"
            />
          ) : (
            <motion.p
              key="count"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-sm font-bold leading-snug text-emerald-400 sm:text-base"
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
