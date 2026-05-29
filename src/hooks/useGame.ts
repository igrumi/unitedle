import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import confetti from "canvas-confetti";
import { type Pokemon, type ComparisonResult } from "../utils/gameLogic";
import { supabase } from "../utils/supabaseClient";
import { getChileTodayISO } from "../utils/date";
import { type GuessRow } from "../components/game/types";
import { useI18n } from "../i18n";

interface SavedWinData {
  isWon?: boolean;
  guesses?: GuessRow[];
  winner?: Pokemon;
  attempts?: number | null;
  dailyWinId?: number | null;
  leaderboardWinId?: number | null;
  leaderboardUserId?: string | null;
}

function loadSavedWinData(today: string): SavedWinData {
  try {
    return JSON.parse(localStorage.getItem(`won_${today}`) || "{}");
  } catch {
    return {};
  }
}

export function useGame(user: { id: string } | null) {
  const today = getChileTodayISO();
  const savedData = loadSavedWinData(today);
  const syncKeyRef = useRef<string | null>(null);
  const { t } = useI18n();

  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [winsCount, setWinsCount] = useState<number | null>(null);
  const [isWon, setIsWon] = useState(!!savedData.isWon);
  const [guesses, setGuesses] = useState<GuessRow[]>(savedData.guesses || []);
  const [winner, setWinner] = useState<Pokemon | null>(savedData.winner || null);
  const [attempts, setAttempts] = useState<number | null>(
    savedData.attempts ?? savedData.guesses?.length ?? null,
  );
  const [showGlobalLeaderboard, setShowGlobalLeaderboard] = useState(false);

  const getDailyWinsCount = useCallback(async () => {
    const { count, error } = await supabase
      .from("daily_wins")
      .select("*", { count: "exact", head: true })
      .eq("win_date", today);

    if (error) {
      console.error("Error obteniendo conteo de victorias:", error);
      return 0;
    }
    return count || 0;
  }, [today]);

  const registerWin = async (pokemonId: number, attempts: number) => {
    const { data, error } = await supabase
      .from("daily_wins")
      .insert([
        {
          pokemon_id: pokemonId,
          user_id: user?.id || null,
          attempts,
          win_date: today,
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error("Error guardando victoria:", error);
      return null;
    } else {
      const freshCount = await getDailyWinsCount();
      setWinsCount(freshCount);
      return data.id as number;
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
  }, [getDailyWinsCount]);

  useEffect(() => {
    if (!user?.id || !savedData.isWon) return;
    if (savedData.leaderboardUserId || savedData.leaderboardWinId) return;

    const pokemonId = savedData.winner?.id ?? savedData.guesses?.[0]?.pokemon?.id;
    const attempts = savedData.guesses?.length;
    if (!pokemonId || !attempts) return;

    const syncKey = `${today}:${user.id}:${pokemonId}:${attempts}`;
    if (syncKeyRef.current === syncKey) return;
    syncKeyRef.current = syncKey;

    const claimSavedWin = async () => {
      const { data, error } = await supabase.rpc("claim_daily_win_after_login", {
        p_anonymous_win_id: savedData.dailyWinId ?? null,
        p_pokemon_id: pokemonId,
        p_attempts: attempts,
        p_win_date: today,
      });

      if (error) {
        console.error("Error guardando victoria en leaderboard:", error);
        syncKeyRef.current = null;
        return;
      }

      const updatedWinData: SavedWinData = {
        ...savedData,
        leaderboardWinId: data as number,
        leaderboardUserId: user.id,
      };
      localStorage.setItem(`won_${today}`, JSON.stringify(updatedWinData));

      const freshCount = await getDailyWinsCount();
      setWinsCount(freshCount);
    };

    claimSavedWin();
  }, [getDailyWinsCount, savedData, today, user?.id]);

  useEffect(() => {
    if (!user?.id || savedData.isWon) return;

    let cancelled = false;

    const loadExistingUserWin = async () => {
      const { data, error } = await supabase
        .from("daily_wins")
        .select("id, pokemon_id, attempts")
        .eq("user_id", user.id)
        .eq("win_date", today)
        .maybeSingle();

      if (error) {
        console.error("Error revisando victoria del usuario:", error);
        return;
      }

      if (!data || cancelled) return;

      let winningPokemon =
        allPokemon.find((pokemon) => pokemon.id === Number(data.pokemon_id)) ??
        null;

      if (!winningPokemon) {
        const { data: pokemonData, error: pokemonError } = await supabase
          .from("pokemon_unite")
          .select("*")
          .eq("id", data.pokemon_id)
          .single();

        if (pokemonError) {
          console.error("Error cargando Pokémon ganador:", pokemonError);
        } else {
          winningPokemon = pokemonData as Pokemon;
        }
      }

      if (cancelled) return;

      const savedServerWin: SavedWinData = {
        isWon: true,
        guesses: [],
        winner: winningPokemon ?? undefined,
        attempts: data.attempts,
        dailyWinId: data.id,
        leaderboardWinId: data.id,
        leaderboardUserId: user.id,
      };

      setIsWon(true);
      setGuesses([]);
      setWinner(winningPokemon);
      setAttempts(data.attempts);
      localStorage.setItem(`won_${today}`, JSON.stringify(savedServerWin));
    };

    loadExistingUserWin();

    return () => {
      cancelled = true;
    };
  }, [allPokemon, savedData.isWon, today, user?.id]);

  const suggestions = useMemo(() => {
    if (inputValue.trim().length === 0) {
      return [];
    }

    return allPokemon.filter((p) => {
      const matchesInput = p.name
        .toLowerCase()
        .includes(inputValue.toLowerCase());
      const isNotGuessed = !guesses.some((g) => g.pokemon.id === p.id);
      return matchesInput && isNotGuessed;
    }).slice(0, 5);
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
    setAttempts(finalGuesses.length);

    const winData = {
      isWon: true,
      guesses: finalGuesses,
      winner: winnerPokemon,
      attempts: finalGuesses.length,
    };

    const alreadyWon = localStorage.getItem(`won_${today}`);
    if (!alreadyWon) {
      const dailyWinId = await registerWin(targetId, finalGuesses.length);
      localStorage.setItem(
        `won_${today}`,
        JSON.stringify({
          ...winData,
          dailyWinId,
          leaderboardWinId: user?.id ? dailyWinId : null,
          leaderboardUserId: user?.id ?? null,
        }),
      );
    }
  };

  const handleGuess = async (selected: Pokemon) => {
    if (guesses.some((g) => g.pokemon.id === selected.id)) {
      alert(t("game.duplicateGuess"));
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
    const { target_id, is_correct, ...statsOnly } = rawData;

    const newGuess: GuessRow = {
      rowId: Date.now(),
      pokemon: selected,
      stats: statsOnly as unknown as ComparisonResult,
    };
    const updatedGuesses = [newGuess, ...guesses];

    setGuesses(updatedGuesses);

    if (is_correct === true) {
      handleWin(target_id as number, selected, updatedGuesses);
    }

    setInputValue("");
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
    attempts,
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
