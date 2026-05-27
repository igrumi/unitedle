import { useState, useEffect } from "react";
import Game from './components/Game';
import './index.css';
import { Logo } from './components/Logo';
import { Title } from './components/Title';
import { supabase, signInWithDiscord, signOut } from "./utils/supabaseClient";
import { DiscordIcon } from "./components/DiscordIcon";

function App() {
  const [gameState, setGameState] = useState<'HOME' | 'PLAYING'>('HOME');
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-dark)] text-white flex flex-col items-center">
      {/* Botón de Logout / Usuario (Solo visible si está logueado) */}
      {session && (
        <div className="absolute top-4 right-4 flex items-center gap-4 bg-gray-900/50 p-2 rounded-full border border-white/10">
          <img 
            src={session.user.user_metadata.avatar_url} 
            alt="Avatar" 
            className="w-8 h-8 rounded-full border border-primary"
          />
          <button 
            onClick={signOut}
            className="text-xs font-bold text-gray-400 hover:text-rose-400 transition-colors pr-2"
          >
            CERRAR SESIÓN
          </button>
        </div>
      )}

      {gameState === 'HOME' ? (
        <div className="flex flex-col items-center justify-center h-screen space-y-8">
          <div className="flex flex-col items-center">
            <Logo /> 
            <Title />
          </div>

          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={() => setGameState('PLAYING')}
              className="bg-[var(--color-primary)] hover:bg-purple-700 text-white font-black py-4 px-12 rounded-full transition-all transform hover:scale-110 shadow-xl tracking-widest"
            >
              COMENZAR
            </button>

            {/* Botón de Discord si NO hay sesión */}
            {!session && (
              <button 
                onClick={signInWithDiscord}
                className="flex items-center gap-2 text-sm font-bold text-[#5865F2] hover:text-white transition-all bg-[#5865F2]/10 hover:bg-[#5865F2] py-2 px-6 rounded-xl border border-[#5865F2]/20"
              >
                <DiscordIcon /> Iniciar sesión con Discord
              </button>
            )}
            
            {session && (
              <p className="text-emerald-400 text-xs font-bold animate-pulse">
                SESIÓN INICIADA COMO {session.user.user_metadata.full_name.toUpperCase()}
              </p>
            )}
          </div>
        </div>
      ) : (
        /* Pasamos el usuario al componente Game */
        <Game user={session?.user ?? null} />
      )}
    </div>
  );
}

export default App;