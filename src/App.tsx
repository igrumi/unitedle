import { useState } from 'react';
import Game from './components/Game';
import './index.css';
import { Logo } from './components/Logo';
import { Title } from './components/Title';

function App() {
  const [gameState, setGameState] = useState<'HOME' | 'PLAYING'>('HOME');

  return (
    <div className="min-h-screen bg-[var(--color-dark)] text-white flex flex-col items-center">
      {gameState === 'HOME' ? (
        <div className="flex flex-col items-center justify-center h-screen space-y-8">
          <Logo /> 
          <Title />
          <button 
            onClick={() => setGameState('PLAYING')}
            className="bg-[var(--color-primary)] hover:bg-purple-700 text-white font-bold py-4 px-10 rounded-full transition-all transform hover:scale-110 shadow-xl"
          >
            COMENZAR
          </button>
        </div>
      ) : (
        <Game />
      )}
    </div>
  );
}

export default App;