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
    <form onSubmit={onSubmit} className="relative mb-12">
      <input
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="Adivina el Pokémon del día..."
        className="w-full p-5 rounded-2xl bg-gray-900 border-2 border-primary text-white outline-none focus:ring-4 focus:ring-primary/20 transition-all"
      />

      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full bg-gray-800 mt-2 rounded-xl border border-primary shadow-2xl max-h-60 overflow-y-auto">
          {suggestions.map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectPokemon(p)}
              className="p-3 hover:bg-primary cursor-pointer flex items-center gap-3"
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
