import { motion, AnimatePresence } from "framer-motion";
import { type User } from "@supabase/supabase-js";
import { Trophy } from "lucide-react";
import { signInWithDiscord, signOut } from "../../utils/supabaseClient";
import { Logo } from "../Logo";
import { Title } from "../Title";
import { DiscordIcon } from "../DiscordIcon";
import { DailyRecord } from "./DailyRecord";
import { useI18n } from "../../i18n";

interface GameHeaderProps {
  user: User | null;
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
  const { t } = useI18n();

  const winsText =
    winsCount === 0
      ? t("game.firstWin")
      : t(winsCount === 1 ? "game.winsSingular" : "game.winsPlural", {
          count: winsCount ?? 0,
        });
  const avatarUrl = user?.user_metadata?.avatar_url;
  const fallbackInitial =
    user?.user_metadata?.full_name?.charAt(0) ?? user?.email?.charAt(0) ?? "?";

  return (
    <div className="relative mb-7 pt-1 text-center sm:mb-10">
      <button
        onClick={onOpenLeaderboard}
        aria-label={t("game.ranking")}
        title={t("game.ranking")}
        className="absolute left-0 top-0 inline-flex h-10 w-10 items-center justify-center rounded-full border border-yellow-500/25 bg-yellow-500/10 text-yellow-400 shadow-lg transition-all hover:bg-yellow-500 hover:text-black active:scale-95 sm:h-11 sm:w-11"
      >
        <Trophy size={15} />
      </button>

      {user ? (
        <button
          onClick={signOut}
          aria-label={t("app.signOut")}
          title={t("app.signOut")}
          className="absolute right-0 top-0 inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-slate-900/80 text-white shadow-lg backdrop-blur transition-all hover:border-rose-300/60 hover:shadow-rose-500/20 active:scale-95 sm:h-11 sm:w-11"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className="h-8 w-8 rounded-full border border-white/10 bg-gray-800 object-cover sm:h-9 sm:w-9"
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-gray-800 text-xs font-black uppercase text-gray-300 sm:h-9 sm:w-9">
              {fallbackInitial}
            </span>
          )}
        </button>
      ) : !isWon ? (
        <button
          onClick={signInWithDiscord}
          aria-label={t("game.saveStreak")}
          title={t("game.saveStreak")}
          className="group absolute right-0 top-0 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#5865F2] text-white shadow-lg transition-all hover:bg-[#4752C4] hover:shadow-[#5865F2]/30 active:scale-95 sm:h-11 sm:w-11"
        >
          <DiscordIcon className="h-4 w-4 transition-transform group-hover:rotate-12" />
        </button>
      ) : null}

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
              {winsText}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
