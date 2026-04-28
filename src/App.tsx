import { useState, useEffect } from 'react';
import Game from './components/Game';
import './index.css';
import { supabase } from './utils/supabaseClient';
import { Logo } from './components/Logo';
import { Title } from './components/Title';
import { initDiscordSdk } from './utils/discordSdk';
import { Loading } from './components/Loading';

function App() {
  const [gameState, setGameState] = useState<'HOME' | 'PLAYING'>('HOME');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      const sdk = await initDiscordSdk(); 

      if (sdk) {
        try {
          // 1. Autenticar con Discord
          const authResult = await sdk.commands.authenticate({});
          console.log("Autenticado en Discord");

          // 2. Enviar el token a Supabase
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'discord',
            token: authResult.access_token,
          });

          if (error) throw error;
          console.log("Sesión en Supabase iniciada:", data);

        } catch (e) {
          console.error("Error en la autenticación:", e);
          // Opcional: mostrar un mensaje de error al usuario
        }
      } else {
        console.log("Modo web estándar: esperando login manual o acceso público");
      }

      setIsReady(true);
    };

    initializeApp();
  }, []);

  if (!isReady) return <Loading />;

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