import { useState, useEffect } from "react";
import { type Session } from "@supabase/supabase-js";
import Game from "./components/game/Game";
import "./index.css";
import { Logo } from "./components/ui/Logo";
import { Title } from "./components/ui/Title";
import { supabase, signInWithDiscord, signOut } from "./utils/supabaseClient";
import { DiscordIcon } from "./components/ui/DiscordIcon";
import { Footer } from "./components/ui/Footer";
import { LanguageToggle } from "./components/ui/LanguageToggle";
import { useI18n } from "./i18n";

function App() {
  const [gameState, setGameState] = useState<"HOME" | "PLAYING">("HOME");
  const [session, setSession] = useState<Session | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-dark)] text-white flex flex-col items-center overflow-x-hidden relative">
      {/* Ambient Aurora Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-purple-600/15 blur-[128px]" />
        <div className="absolute top-1/4 -right-40 w-96 h-96 rounded-full bg-indigo-600/12 blur-[128px]" />
        <div className="absolute -bottom-40 left-1/3 w-[450px] h-[450px] rounded-full bg-amber-500/8 blur-[140px]" />
      </div>

      <div className="fixed bottom-4 right-4 z-40">
        <LanguageToggle />
      </div>

      {session && gameState === "HOME" && (
        <div className="w-full max-w-5xl px-4 pt-4 flex justify-end relative z-10">
          <div className="flex max-w-full items-center gap-3 rounded-full border border-white/10 bg-slate-900/60 p-1.5 pr-3 shadow-lg backdrop-blur-xl">
            <img
              src={session.user.user_metadata?.avatar_url ?? ""}
              alt="Avatar"
              className="h-8 w-8 shrink-0 rounded-full border border-purple-500/50 bg-slate-800 object-cover"
            />
            <span className="text-xs font-semibold text-slate-300 hidden sm:inline truncate max-w-[150px]">
              {session.user.user_metadata?.full_name ?? session.user.email}
            </span>
            <button
              onClick={signOut}
              className="whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold text-slate-400 transition-colors hover:bg-rose-500/20 hover:text-rose-300"
            >
              {t("app.signOut")}
            </button>
          </div>
        </div>
      )}

      <div
        className={`flex-1 w-full flex flex-col items-center relative z-10 ${
          gameState === "HOME" ? "justify-center" : "justify-start"
        }`}
      >
        {gameState === "HOME" ? (
          <div className="relative z-10 flex flex-col items-center space-y-8 px-4 text-center my-auto w-full max-w-md">
            <div className="glass-card p-8 sm:p-12 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center w-full backdrop-blur-xl relative overflow-hidden">
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col items-center relative z-10 mb-6">
                <Logo />
                <Title />
              </div>

              <div className="flex flex-col items-center gap-4 w-full relative z-10">
                <button
                  onClick={() => setGameState("PLAYING")}
                  className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black py-4 px-10 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_10px_30px_-5px_rgba(124,58,237,0.5)] tracking-widest text-base sm:text-lg border border-white/10"
                >
                  {t("app.start")}
                </button>

                {!session && (
                  <button
                    onClick={signInWithDiscord}
                    className="flex items-center justify-center gap-2 text-sm font-bold text-indigo-200 hover:text-white transition-all bg-[#5865F2]/15 hover:bg-[#5865F2]/30 py-2.5 px-6 rounded-xl border border-[#5865F2]/30 hover:border-[#5865F2]/60 w-full shadow-md"
                  >
                    <DiscordIcon /> {t("app.signInDiscord")}
                  </button>
                )}

                {session && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>
                      {t("app.signedInAs")}{" "}
                      {session.user.user_metadata?.full_name?.toUpperCase() ??
                        session.user?.email ??
                        t("app.userFallback")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <Game user={session?.user ?? null} />
        )}
      </div>

      <Footer />
    </div>
  );
}

export default App;
