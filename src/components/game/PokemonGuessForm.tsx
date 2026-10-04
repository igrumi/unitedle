import { Search } from "lucide-react";
import { type Pokemon } from "../../utils/gameLogic";
import { useI18n } from "../../i18n";

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
  const { t, translateGameValue } = useI18n();

  return (
    <form onSubmit={onSubmit} className="relative mb-8 sm:mb-12">
      <div className="relative flex items-center">
        <div className="pointer-events-none absolute left-4 text-purple-400 sm:left-5">
          <Search size={20} />
        </div>
        <input
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={t("game.inputPlaceholder")}
          className="w-full rounded-2xl border-2 border-primary bg-gray-900 py-4 pl-12 pr-4 text-base text-white outline-none transition-all placeholder:text-gray-500 focus:ring-4 focus:ring-primary/25 sm:py-5 sm:pl-14 sm:pr-5 sm:text-lg"
        />
      </div>

      {suggestions.length > 0 && (
        <div className="absolute z-40 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-primary/50 bg-gray-800 p-1.5 shadow-2xl space-y-1">
          {suggestions.map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectPokemon(p)}
              className="group flex cursor-pointer items-center justify-between rounded-xl p-2.5 transition-colors hover:bg-primary/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-900/60 p-1">
                  <img src={p.image_url} className="h-8 w-8 object-contain" alt="" />
                </div>
                <span className="text-sm font-bold text-white sm:text-base">
                  {p.name}
                </span>
              </div>
              <span className="rounded-full bg-primary/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-300 border border-primary/30 sm:text-xs">
                {translateGameValue(p.role)}
              </span>
            </div>
          ))}
        </div>
      )}
    </form>
  );
}

