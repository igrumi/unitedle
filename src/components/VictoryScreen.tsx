import { useEffect, useState } from 'react';

export const VictoryScreen = ({ guesses }: { guesses: any[] }) => {
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

  return (
    <div className="fixed inset-0 bg-gray-950/90 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border-2 border-primary p-8 rounded-3xl text-center max-w-sm w-full">
        <h2 className="text-4xl font-black text-white mb-2">¡Victoria!</h2>
        <p className="text-gray-400">El Pókemon de hoy era: <span className="text-white font-bold">{guesses[0]?.pokemon.name}</span></p>
        <img src={guesses[0]?.pokemon.image_url} alt={guesses[0]?.pokemon.name} className="mx-auto my-4 rounded-2xl border border-gray-100 shadow-sm" />
        <p className="text-gray-400">Adivinaste en <span className="text-white font-bold">{guesses.length}</span> intentos.</p>
        
        <div className="my-8">
           <p className="text-sm text-gray-500 uppercase">Próximo Pokémon en:</p>
           <div className="text-3xl font-mono text-primary">{timeLeft}</div>
        </div>

        <p className="text-xs text-gray-600">Reinicio programado a las 00:00 UTC-4 (Santiago, Chile)</p>
      </div>
    </div>
  );
};