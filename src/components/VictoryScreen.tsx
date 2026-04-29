import { useEffect, useState } from 'react';
import { type Pokemon } from '../utils/gameLogic'; // Asegúrate de que la ruta sea correcta

// Definimos la estructura de las props
interface VictoryScreenProps {
  guesses: any[]; 
  winner: Pokemon | null;
}

export const VictoryScreen = ({ guesses, winner }: VictoryScreenProps) => {
  const [timeLeft, setTimeLeft] = useState('');

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
    <div className="fixed inset-0 bg-gray-950/90 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border-2 border-primary p-8 rounded-3xl text-center max-w-sm w-full">
        <h2 className="text-4xl font-black text-white mb-2">¡Victoria!</h2>
        
        <p className="text-gray-400">
          El Pokémon de hoy era: <span className="text-white font-bold">{displayedName}</span>
        </p>

        <div className="relative group">
          <img 
            src={displayedImage} 
            alt={displayedName} 
            className="mx-auto my-4 w-32 h-32 object-contain rounded-2xl border border-gray-800 bg-gray-800/50 p-2 shadow-2xl" 
          />
        </div>

        <p className="text-gray-400">
          Adivinaste en <span className="text-white font-bold">{guesses.length}</span> {guesses.length === 1 ? 'intento' : 'intentos'}.
        </p>
        
        <div className="my-8">
            <p className="text-sm text-gray-500 uppercase tracking-widest">Próximo Pokémon en:</p>
            <div className="text-3xl font-mono text-primary font-bold">{timeLeft}</div>
        </div>

        <p className="text-[10px] text-gray-600">Reinicio programado a las 00:00 UTC-4 (Santiago, Chile)</p>
      </div>
    </div>
  );
};