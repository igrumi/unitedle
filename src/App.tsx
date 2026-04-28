import { useState, useEffect } from "react";
import Game from "./components/Game";
import "./index.css";
import { supabase } from "./utils/supabaseClient";
import { Logo } from "./components/Logo";
import { Title } from "./components/Title";
import { initDiscordSdk } from "./utils/discordSdk";
import { Loading } from "./components/Loading";

function App() {
  const [gameState, setGameState] = useState<"HOME" | "PLAYING">("HOME");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      console.log("--- Iniciando Inicialización ---");
      const sdk = await initDiscordSdk();

      if (sdk) {
        console.log("SDK inicializado. Instancia:", sdk);
        try {
          console.log("Intentando autenticación con Discord...");

          // 1. Autenticar con Discord
          const authResult = await sdk.commands.authenticate({});

          // LOG DE ÉXITO: Mira qué trae exactamente este objeto
          console.log("Resultado crudo de authenticate:", authResult);

          if (!authResult || !authResult.access_token) {
            throw new Error(
              "Discord devolvió un objeto vacío o sin access_token",
            );
          }

          // 2. Enviar el token a Supabase
          console.log("Enviando token a Supabase...");
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: "discord",
            token: authResult.access_token,
          });

          if (error) {
            console.error("Error en Supabase:", error);
            throw error;
          }

          console.log("Autenticación completa. Sesión iniciada:", data);
        } catch (e: any) {
          // LOG DE ERROR DETALLADO
          console.error("--- FALLO EN EL FLUJO ---");
          console.error("Mensaje de error:", e.message);
          console.error("Objeto completo del error:", e);
          // Aquí veremos si el error viene de Discord (código 4009) o de Supabase
        }
      } else {
        console.warn("SDK no disponible. ¿Estamos en Discord?");
      }

      setIsReady(true);
    };

    initializeApp();
  }, []);

  if (!isReady) return <Loading />;

  return (
    <div className="min-h-screen bg-[var(--color-dark)] text-white flex flex-col items-center">
      {gameState === "HOME" ? (
        <div className="flex flex-col items-center justify-center h-screen space-y-8">
          <Logo />
          <Title />
          <button
            onClick={() => setGameState("PLAYING")}
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
