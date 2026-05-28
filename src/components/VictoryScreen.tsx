import { useEffect, useState } from 'react';
import { type Pokemon } from '../utils/gameLogic'; // Asegúrate de que la ruta sea correcta
import { DiscordIcon } from './DiscordIcon';
import { signInWithDiscord } from '../utils/supabaseClient';
import { Leaderboard } from './Leaderboard';
import { AnimatePresence, motion } from 'framer-motion';

// Definimos la estructura de las props
interface VictoryScreenProps {
  guesses: any[];
  winner: Pokemon | null;
  user: any;
}

export const VictoryScreen = ({ guesses, winner, user }: VictoryScreenProps) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [view, setView] = useState<'VICTORY' | 'LEADERBOARD'>('VICTORY'); // Control de la "carta"

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const nextMidnight = new Date();
      nextMidnight.setHours(24, 0, 0, 0); 
      
      const diff = nextMidnight.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Usamos 'winner' si existe, si no, usamos el fallback del primer intento
  const displayedName = winner?.name || guesses[0]?.pokemon.name;
  const displayedImage = winner?.image_url || guesses[0]?.pokemon.image_url;

  return (
    <div className="fixed inset-0 bg-gray-950/95 z-50 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="relative max-w-sm w-full min-h-[550px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {view === 'VICTORY' ? (
            /* CARA 1: VICTORIA */
            <motion.div 
              key="victory"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              className="bg-gray-900 border-2 border-primary p-8 rounded-3xl text-center w-full shadow-2xl"
            >
              <h2 className="text-4xl font-black text-white mb-2">¡Victoria!</h2>
              <p className="text-gray-400">Hoy era: <span className="text-white font-bold">{displayedName}</span></p>
              <img src={displayedImage} className="mx-auto my-4 w-32 h-32 object-contain rounded-2xl bg-gray-800/50 p-2" />
              <p className="text-gray-400 mb-6">Adivinaste en <span className="text-white font-bold">{guesses.length}</span> intentos.</p>

              {/* Botón para ver Leaderboard */}
              <button 
                onClick={() => setView('LEADERBOARD')}
                className="w-full mb-4 bg-yellow-500 hover:bg-yellow-600 text-black font-black py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                🏆 VER RANKING DE HOY
              </button>

              {!user && (
                <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <button onClick={signInWithDiscord} className="w-full flex items-center justify-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-2 rounded-xl transition-all">
                    <DiscordIcon className="w-4 h-4" /> Guardar progreso
                  </button>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="text-2xl font-mono font-black text-white">{timeLeft}</div>
              </div>
            </motion.div>
          ) : (
            /* CARA 2: LEADERBOARD */
            <motion.div 
              key="leaderboard"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              className="bg-gray-900 border-2 border-yellow-500/50 p-8 rounded-3xl text-center w-full shadow-2xl"
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