import { VictoryScreen } from "./VictoryScreen";
import { type User } from "@supabase/supabase-js";
import { useGame } from "../hooks/useGame";
import { GameHeader } from "./game/GameHeader";
import { PokemonGuessForm } from "./game/PokemonGuessForm";
import { GuessBoard } from "./game/GuessBoard";
import { LeaderboardModal } from "./game/LeaderboardModal";
import { StatLegend } from "./game/StatLegend";

const Game = ({ user }: { user: User | null }) => {
  const {
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
  } = useGame(user);

  return (
    <div className="w-full max-w-5xl mt-6 px-4 pb-10 sm:mt-10 sm:px-6 lg:px-0">
      {isWon && (
        <VictoryScreen guesses={guesses} winner={winner} user={user} />
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
