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
  const [guesses, setGuesses] = useState<GuessRow[]>([]);
  const [isWon, setIsWon] = useState(false);

  useEffect(() => {
    const loadAllData = async () => {
      const { data } = await supabase.from("pokemon_unite").select("*");
      if (data) setAllPokemon(data);
    };
    loadAllData();
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

    const newGuess: GuessRow = {
      rowId: Date.now(),
      pokemon: selected,
      stats: data as ComparisonResult,
    };

    setGuesses([newGuess, ...guesses]);

    setInputValue("");
    setSuggestions([]);

    if (Object.values(data).every((s: any) => s.status === "correct")) {
      handleWin();
    }
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

  const handleWin = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });
    setIsWon(true);
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
