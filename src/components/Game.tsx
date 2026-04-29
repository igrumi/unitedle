import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";
import confetti from "canvas-confetti";
import { type Pokemon, type ComparisonResult } from "../utils/gameLogic";
import { VictoryScreen } from "./VictoryScreen";
import { supabase } from "../utils/supabaseClient";
import { Logo } from "./Logo";
import { Title } from "./Title";

interface GuessRow {
  rowId: number;
  pokemon: Pokemon;
  stats: ComparisonResult;
}

const headers = [
  "Pokémon",
  "Rol",
  "Evo",
  "Mega",
  "Alcance",
  "Año lanzamiento",
  "Etapa evolutiva",
];

const Game = () => {
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Pokemon[]>([]);
  const [winsCount, setWinsCount] = useState<number | null>(null);
  const today = new Date().toISOString().split("T")[0];
  const savedData = JSON.parse(localStorage.getItem(`won_${today}`) || "{}");
  const [isWon, setIsWon] = useState(!!savedData.isWon);
  const [guesses, setGuesses] = useState<GuessRow[]>(savedData.guesses || []);
  const [winner, setWinner] = useState<Pokemon | null>(
    savedData.winner || null,
  );

  const registerWin = async (pokemonId: number) => {
    const { error } = await supabase
      .from("daily_wins")
      .insert([{ pokemon_id: pokemonId }]);

    if (error) {
      console.error("Error guardando victoria:", error);
    } else {
      const freshCount = await getDailyWinsCount();
      setWinsCount(freshCount);
    }
  };

  const getDailyWinsCount = async () => {
    const today = new Date().toISOString().split("T")[0];
    const { count, error } = await supabase
      .from("daily_wins")
      .select("*", { count: "exact", head: true })
      .eq("win_date", today);

    if (error) {
      console.error("Error obteniendo conteo de victorias:", error);
      return 0;
    }
    return count || 0;
  };

  useEffect(() => {
    const loadAllData = async () => {
      const { data } = await supabase.from("pokemon_unite").select("*");
      if (data) setAllPokemon(data);
    };

    const loadWins = async () => {
      const count = await getDailyWinsCount();
      setWinsCount(count);
    };

    loadAllData();
    loadWins();
  }, []);

  useEffect(() => {
    if (inputValue.trim().length === 0) {
      setSuggestions([]);
    } else {
      const filtered = allPokemon.filter((p) => {
        const matchesInput = p.name
          .toLowerCase()
          .includes(inputValue.toLowerCase());

        const isNotGuessed = !guesses.some((g) => g.pokemon.id === p.id);

        return matchesInput && isNotGuessed;
      });

      setSuggestions(filtered.slice(0, 5));
    }
  }, [inputValue, allPokemon, guesses]);

  const handleGuess = async (selected: Pokemon) => {
    if (guesses.some((g) => g.pokemon.id === selected.id)) {
      alert("¡Ya intentaste con este Pokémon!");
      return;
    }

    const { data, error } = await supabase.rpc("check_guess", {
      guess_id: selected.id,
    });

    if (error) {
      console.error("Error al comparar:", error);
      return;
    }

    const rawData = data as any;
    const { target_id, ...statsOnly } = rawData;

    const newGuess: GuessRow = {
      rowId: Date.now(),
      pokemon: selected,
      stats: statsOnly,
    };
    const updatedGuesses = [newGuess, ...guesses];

    setGuesses(updatedGuesses);

    if (Object.values(statsOnly).every((s: any) => s.status === "correct")) {
      handleWin(target_id, selected, updatedGuesses);
    }

    setInputValue("");
    setSuggestions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleGuess(suggestions[0]);
    }
  };

  const getBoxStyle = (status: string) => {
    const baseStyle =
      "flex items-center justify-center gap-1 rounded-xl font-bold text-sm h-full shadow-lg border border-white/5 transition-colors";

    switch (status) {
      case "correct":
        return `${baseStyle} bg-emerald-600/80 text-white`;
      case "wrong":
        return `${baseStyle} bg-rose-600/80 text-white`;
      default:
        return `${baseStyle} bg-rose-600/80 text-white`;
    }
  };

  const handleWin = async (
    targetId: number,
    winnerPokemon: Pokemon,
    finalGuesses: GuessRow[],
  ) => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });

    setIsWon(true);
    setWinner(winnerPokemon);

    const today = new Date().toISOString().split("T")[0];

    const winData = {
      isWon: true,
      guesses: finalGuesses,
      winner: winnerPokemon,
    };

    const alreadyWon = localStorage.getItem(`won_${today}`);
    if (!alreadyWon) {
      await registerWin(targetId);
      localStorage.setItem(`won_${today}`, JSON.stringify(winData));
    }
  };

  return (
    <div className="w-full max-w-5xl mt-10">
      {isWon && <VictoryScreen guesses={guesses} />}
      <div className="text-center mb-10">
        <Logo className="mb-4" />
        <Title />
        <p className="text-gray-400 mt-2 text-lg italic">
          Adivina el Pokémon del día
        </p>
        <div className="flex justify-center mt-2 h-8 items-center">
          {" "}
          <AnimatePresence mode="wait">
            {winsCount === null ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-5 w-48 bg-emerald-400/20 animate-pulse rounded-full"
              />
            ) : (
              <motion.p
                key="count"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-emerald-400 font-bold"
              >
                {winsCount === 0
                  ? "¡Sé el primero en adivinar el Pokémon de hoy!"
                  : `¡${winsCount} ${winsCount === 1 ? "persona ha" : "personas han"} adivinado el Pokémon de hoy!`}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
      {!isWon && (
        <form onSubmit={handleSubmit} className="relative mb-12">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Nombre del Pokémon..."
            className="w-full p-5 rounded-2xl bg-gray-900 border-2 border-primary text-white outline-none focus:ring-4 focus:ring-primary/20 transition-all"
          />

          {suggestions.length > 0 && (
            <div className="absolute z-10 w-full bg-gray-800 mt-2 rounded-xl border border-primary shadow-2xl max-h-60 overflow-y-auto">
              {suggestions.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleGuess(p)}
                  className="p-3 hover:bg-primary cursor-pointer flex items-center gap-3"
                >
                  <img src={p.image_url} className="w-10 h-10 object-contain" />
                  <span>{p.name}</span>
                </div>
              ))}
            </div>
          )}
        </form>
      )}

      <div className="w-full overflow-x-auto pb-6 no-scrollbar">
        <div className="min-w-[700px]">
          {guesses.length > 0 && (
            <div className="grid grid-cols-7 gap-3 mb-2 px-2 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">
              {headers.map((h) => (
                <div key={h}>{h}</div>
              ))}
            </div>
          )}

          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {guesses.map((g) => (
                <motion.div
                  key={g.rowId}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-7 gap-3 h-20 items-center [perspective:1000px]"
                >
                  <div className="bg-gray-800 flex items-center justify-center rounded-xl border border-gray-700 h-full">
                    <img
                      src={g.pokemon.image_url}
                      className="w-16 h-16 object-contain"
                    />
                  </div>

                  {Object.values(g.stats).map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ rotateY: 90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      transition={{
                        delay: i * 0.2,
                        duration: 0.6,
                        ease: "easeInOut",
                      }}
                      className={getBoxStyle(stat.status)}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <span className="backface-hidden flex items-center gap-1">
                        {stat.status === "higher" && <ArrowUp size={18} />}
                        {stat.status === "lower" && <ArrowDown size={18} />}
                        {stat.value}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
