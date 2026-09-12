import { VictoryScreen } from "./VictoryScreen";
import { type User } from "@supabase/supabase-js";
import { useGame } from "../../hooks/useGame";
import { GameHeader } from "./GameHeader";
import { PokemonGuessForm } from "./PokemonGuessForm";
import { GuessBoard } from "./GuessBoard";
import { LeaderboardModal } from "./LeaderboardModal";
import { StatLegend } from "./StatLegend";

const Game = ({ user }: { user: User | null }) => {
  const {
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
  } = useGame(user);

  return (
    <div className="w-full max-w-5xl mt-6 px-4 pb-10 sm:mt-10 sm:px-6 lg:px-0">
      {isWon && (
        <VictoryScreen guesses={guesses} winner={winner} user={user} attempts={attempts} />
      )}

      <GameHeader
        user={user}
        isWon={isWon}
        winsCount={winsCount}
        onOpenLeaderboard={() => setShowGlobalLeaderboard(true)}
      />

      {!isWon && (
        <PokemonGuessForm
          inputValue={inputValue}
          onInputChange={setInputValue}
          suggestions={suggestions}
          onSelectPokemon={handleGuess}
          onSubmit={handleSubmit}
        />
      )}

      <GuessBoard guesses={guesses} />

      <StatLegend />

      {showGlobalLeaderboard && (
        <LeaderboardModal onClose={() => setShowGlobalLeaderboard(false)} />
      )}
    </div>
  );
};

export default Game;
