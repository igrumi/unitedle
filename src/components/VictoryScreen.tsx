import { useEffect, useState } from 'react';
import { type User } from '@supabase/supabase-js';
import { type Pokemon } from '../utils/gameLogic';
import { type GuessRow } from './game/types';
import { DiscordIcon } from './DiscordIcon';
import { signInWithDiscord } from '../utils/supabaseClient';
import { Leaderboard } from './Leaderboard';
import { AnimatePresence, motion } from 'framer-motion';

interface VictoryScreenProps {
  guesses: GuessRow[];
  winner: Pokemon | null;
  user: User | null;
  attempts?: number | null;
}

export const VictoryScreen = ({ guesses, winner, user, attempts }: VictoryScreenProps) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [view, setView] = useState<'VICTORY' | 'LEADERBOARD'>('VICTORY');

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

  // Se usa 'winner' si existe, si no, usamos el fallback del primer intento
  const displayedName = winner?.name || guesses[0]?.pokemon.name || "Pokemon del dia";
  const displayedImage = winner?.image_url || guesses[0]?.pokemon.image_url;
  const displayedAttempts = attempts ?? guesses.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-950/95 p-4 backdrop-blur-md">
      <div className="relative flex min-h-[min(550px,calc(100vh-2rem))] w-full max-w-sm items-center justify-center">
        <AnimatePresence mode="wait">
          {view === 'VICTORY' ? (
            /* CARA 1: VICTORIA */
            <motion.div 
              key="victory"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              className="max-h-[calc(100vh-2rem)] w-full overflow-y-auto rounded-2xl border-2 border-primary bg-gray-900 p-5 text-center shadow-2xl sm:p-8"
            >
              <h2 className="text-4xl font-black text-white mb-2">¡Victoria!</h2>
              <p className="text-gray-400">Hoy era: <span className="text-white font-bold">{displayedName}</span></p>
              {displayedImage && (
                <img src={displayedImage} className="mx-auto my-4 w-32 h-32 object-contain rounded-2xl bg-gray-800/50 p-2" />
              )}
              <p className="text-gray-400 mb-6">Adivinaste en <span className="text-white font-bold">{displayedAttempts}</span> intentos.</p>

              <button 
                onClick={() => setView('LEADERBOARD')}
                className="w-full mb-4 bg-yellow-500 hover:bg-yellow-600 text-black font-black py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                🏆 VER RANKING DE HOY
              </button>

              {!user && (
                <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <button onClick={signInWithDiscord} className="w-full flex items-center justify-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-2 rounded-xl transition-all">
                    <DiscordIcon className="w-4 h-4" /> Guardar en ranking
                  </button>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">
                  Próximo Pokémon en
                </p>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-2xl font-mono font-black text-white">
                  {timeLeft}
                </div>
              </div>
            </motion.div>
          ) : (
            /* CARA 2: LEADERBOARD */
            <motion.div 
              key="leaderboard"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              className="max-h-[calc(100vh-2rem)] w-full overflow-y-auto rounded-2xl border-2 border-yellow-500/50 bg-gray-900 p-5 text-center shadow-2xl sm:p-8"
            >
              <Leaderboard />
              
              <button 
                onClick={() => setView('VICTORY')}
                className="w-full mt-6 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-all border border-white/10"
              >
                VOLVER A MI RESULTADO
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
