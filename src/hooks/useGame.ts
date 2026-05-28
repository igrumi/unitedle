import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { type Pokemon, type ComparisonResult } from "../utils/gameLogic";
import { supabase } from "../utils/supabaseClient";
import { getChileTodayISO } from "../utils/date";
import { type GuessRow } from "../components/game/types";

export function useGame(user: { id: string } | null) {
  const today = getChileTodayISO();
  const savedData = JSON.parse(localStorage.getItem(`won_${today}`) || "{}");

  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<Pokemon[]>([]);
  const [winsCount, setWinsCount] = useState<number | null>(null);
  const [isWon, setIsWon] = useState(!!savedData.isWon);
  const [guesses, setGuesses] = useState<GuessRow[]>(savedData.guesses || []);
  const [winner, setWinner] = useState<Pokemon | null>(savedData.winner || null);
  const [showGlobalLeaderboard, setShowGlobalLeaderboard] = useState(false);

  const getDailyWinsCount = async () => {
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

  const registerWin = async (pokemonId: number, attempts: number) => {
    const { error } = await supabase.from("daily_wins").insert([
      {
        pokemon_id: pokemonId,
        user_id: user?.id || null,
        attempts,
        win_date: today,
      },
    ]);

    if (error) {
      console.error("Error guardando victoria:", error);
    } else {
      const freshCount = await getDailyWinsCount();
      setWinsCount(freshCount);
    }
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
      return;
    }

    const filtered = allPokemon.filter((p) => {
      const matchesInput = p.name
        .toLowerCase()
        .includes(inputValue.toLowerCase());
      const isNotGuessed = !guesses.some((g) => g.pokemon.id === p.id);
      return matchesInput && isNotGuessed;
    });

    setSuggestions(filtered.slice(0, 5));
  }, [inputValue, allPokemon, guesses]);

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

    const winData = {
      isWon: true,
      guesses: finalGuesses,
      winner: winnerPokemon,
    };

    const alreadyWon = localStorage.getItem(`won_${today}`);
    if (!alreadyWon) {
      await registerWin(targetId, finalGuesses.length);
      localStorage.setItem(`won_${today}`, JSON.stringify(winData));
    }
  };

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

    const rawData = data as Record<string, unknown>;
    const { target_id, ...statsOnly } = rawData;

    const newGuess: GuessRow = {
      rowId: Date.now(),
      pokemon: selected,
      stats: statsOnly as unknown as ComparisonResult,
    };
    const updatedGuesses = [newGuess, ...guesses];

    setGuesses(updatedGuesses);

    if (
      Object.values(statsOnly).every(
        (s) => (s as { status: string }).status === "correct",
      )
    ) {
      handleWin(target_id as number, selected, updatedGuesses);
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

  return {
    isWon,
    guesses,
    winner,
    winsCount,
    inputValue,
    setInputValue,
    suggestions,
    showGlobalLeaderboard,
    setShowGlobalLeaderboard,
    handleGuess,
    handleSubmit,
  };
}
