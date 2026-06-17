import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type User } from "@supabase/supabase-js";
import { LogOut, ShieldAlert, Trophy, X } from "lucide-react";
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
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSignOutConfirmOpen, setIsSignOutConfirmOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const winsText =
    winsCount === 0
      ? t("game.firstWin")
      : t(winsCount === 1 ? "game.winsSingular" : "game.winsPlural", {
          count: winsCount ?? 0,
        });
  const avatarUrl = user?.user_metadata?.avatar_url;
  const fallbackInitial =
    user?.user_metadata?.full_name?.charAt(0) ?? user?.email?.charAt(0) ?? "?";

  const openSignOutConfirm = () => {
    setIsProfileMenuOpen(false);
    setIsSignOutConfirmOpen(true);
  };

  const confirmSignOut = async () => {
    setIsSignOutConfirmOpen(false);
    await signOut();
  };

  useEffect(() => {
    if (!isProfileMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProfileMenuOpen]);

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
        <div ref={profileMenuRef} className="absolute right-0 top-0 z-30">
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((isOpen) => !isOpen)}
            aria-label={t("app.accountMenu")}
            title={t("app.accountMenu")}
            aria-expanded={isProfileMenuOpen}
            aria-haspopup="menu"
            className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-slate-900/80 text-white shadow-lg transition-all hover:border-emerald-300/40 hover:shadow-emerald-500/10 active:scale-95 sm:h-11 sm:w-11"
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

          <AnimatePresence>
            {isProfileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                role="menu"
                aria-label={t("app.accountMenu")}
                className="absolute right-0 top-12 w-56 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/96 text-left shadow-[0_24px_60px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:top-13"
              >
                <div className="border-b border-white/8 px-4 py-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                    {t("app.accountMenu")}
                  </p>
                  <p className="mt-1 truncate text-sm font-bold text-white">
                    {user?.user_metadata?.full_name ?? user?.email ?? t("app.userFallback")}
                  </p>
                </div>

                <div className="p-2">
                  <button
                    type="button"
                    onClick={openSignOutConfirm}
                    className="flex w-full items-center gap-3 rounded-2xl border border-rose-500/10 bg-rose-500/8 px-3 py-3 text-left transition-colors hover:border-rose-400/20 hover:bg-rose-500/14"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500/15 text-rose-200">
                      <LogOut size={15} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-black uppercase tracking-wide text-rose-100">
                        {t("app.signOut")}
                      </span>
                      <span className="block text-[11px] leading-tight text-slate-400">
                        {t("app.signOut")}
                      </span>
                    </span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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

      <AnimatePresence>
        {isSignOutConfirmOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-dark)]/78 px-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sign-out-title"
          >
            <motion.div
              initial={{ scale: 0.96, y: 14 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 14 }}
              className="w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(24,24,46,0.98),rgba(12,16,32,0.98))] p-0 text-left shadow-[0_30px_80px_rgba(0,0,0,0.48)]"
            >
              <div className="h-1 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-primary)]" />

              <div className="border-b border-white/8 bg-white/[0.02] px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/12 text-[#c4b5fd] shadow-[inset_0_0_24px_rgba(109,40,217,0.16)]">
                      <ShieldAlert size={18} />
                    </span>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--color-secondary)]/80">
                        {t("app.accountMenu")}
                      </p>
                      <h2 id="sign-out-title" className="mt-1 text-lg font-black text-white">
                        {t("app.signOutConfirmTitle")}
                      </h2>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSignOutConfirmOpen(false)}
                    aria-label={t("app.cancel")}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              <div className="px-5 py-5">
                <p className="text-sm leading-relaxed text-slate-300">
                  {t("app.signOutConfirmBody")}
                </p>

                <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setIsSignOutConfirmOpen(false)}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-black uppercase tracking-wide text-slate-200 transition-colors hover:bg-white/8 hover:text-white"
                  >
                    {t("app.cancel")}
                  </button>
                  <button
                    type="button"
                    onClick={confirmSignOut}
                    className="rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-4 py-2.5 text-xs font-black uppercase tracking-wide text-white shadow-[0_10px_24px_rgba(109,40,217,0.26)] transition-colors hover:from-[#7c3aed] hover:to-[#fb923c]"
                  >
                    {t("app.signOut")}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
