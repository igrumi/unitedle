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
    <div className="min-h-screen bg-[var(--color-dark)] text-white flex flex-col items-center overflow-x-hidden">
      <div className="fixed bottom-4 right-4 z-40">
        <LanguageToggle />
      </div>

      {session && gameState === "HOME" && (
        <div className="w-full max-w-5xl px-4 pt-4 flex justify-end">
          <div className="flex max-w-full items-center gap-3 rounded-full border border-white/10 bg-gray-900/80 p-1.5 pr-3 shadow-lg">
            <img
              src={session.user.user_metadata?.avatar_url ?? ""}
              alt="Avatar"
              className="h-8 w-8 shrink-0 rounded-full border border-primary bg-gray-800 object-cover"
            />
            <span className="text-xs font-semibold text-gray-300 hidden sm:inline truncate max-w-[150px]">
              {session.user.user_metadata?.full_name ?? session.user.email}
            </span>
            <button
              onClick={signOut}
              className="whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-bold text-gray-400 transition-colors hover:text-rose-400"
            >
              {t("app.signOut")}
            </button>
          </div>
        </div>
      )}

      <div
        className={`flex-1 w-full flex flex-col items-center ${
          gameState === "HOME" ? "justify-center" : "justify-start"
        }`}
      >
        {gameState === "HOME" ? (
          <div className="flex flex-col items-center space-y-8 px-4 text-center my-auto">
            <div className="flex flex-col items-center">
              <Logo />
              <Title />
            </div>

            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => setGameState("PLAYING")}
                className="bg-[var(--color-primary)] hover:bg-purple-700 text-white font-black py-4 px-12 rounded-full transition-all transform hover:scale-105 shadow-xl tracking-widest text-base sm:text-lg"
              >
                {t("app.start")}
              </button>

              {!session && (
                <button
                  onClick={signInWithDiscord}
                  className="flex items-center gap-2 text-sm font-bold text-[#5865F2] hover:text-white transition-all bg-[#5865F2]/10 hover:bg-[#5865F2] py-2 px-6 rounded-xl border border-[#5865F2]/20"
                >
                  <DiscordIcon /> {t("app.signInDiscord")}
                </button>
              )}

              {session && (
                <p className="text-emerald-400 text-xs font-bold animate-pulse">
                  {t("app.signedInAs")}{" "}
                  {session.user.user_metadata?.full_name?.toUpperCase() ??
                    session.user?.email ??
                    t("app.userFallback")}
                </p>
              )}
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
