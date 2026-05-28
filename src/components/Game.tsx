import { VictoryScreen } from "./VictoryScreen";
import { useGame } from "../hooks/useGame";
import { GameHeader } from "./game/GameHeader";
import { PokemonGuessForm } from "./game/PokemonGuessForm";
import { GuessBoard } from "./game/GuessBoard";
import { LeaderboardModal } from "./game/LeaderboardModal";
import { StatLegend } from "./game/StatLegend";

const Game = ({ user }: { user: any }) => {
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
    <div className="w-full max-w-5xl mt-10">
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
