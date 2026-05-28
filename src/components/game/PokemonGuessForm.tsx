import { type Pokemon } from "../../utils/gameLogic";

interface PokemonGuessFormProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  suggestions: Pokemon[];
  onSelectPokemon: (pokemon: Pokemon) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function PokemonGuessForm({
  inputValue,
  onInputChange,
  suggestions,
  onSelectPokemon,
  onSubmit,
}: PokemonGuessFormProps) {
  return (
    <form onSubmit={onSubmit} className="relative mb-8 sm:mb-12">
      <input
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="Adivina el Pokémon del día..."
        className="w-full rounded-2xl border-2 border-primary bg-gray-900 p-4 text-base text-white outline-none transition-all focus:ring-4 focus:ring-primary/20 sm:p-5"
      />

      {suggestions.length > 0 && (
        <div className="absolute z-40 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-primary bg-gray-800 shadow-2xl">
          {suggestions.map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectPokemon(p)}
              className="flex cursor-pointer items-center gap-3 p-3 hover:bg-primary"
            >
              <img src={p.image_url} className="w-10 h-10 object-contain" alt="" />
              <span>{p.name}</span>
            </div>
          ))}
        </div>
      )}
    </form>
  );
}
