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
        <div className="pointer-events-none absolute left-4 sm:left-5 text-purple-400/70">
          <Search size={22} />
        </div>
        <input
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={t("game.inputPlaceholder")}
          className="w-full rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-xl py-4 pl-12 pr-4 sm:py-5 sm:pl-14 sm:pr-6 text-base sm:text-lg text-white placeholder-slate-400 outline-none transition-all shadow-[0_10px_30px_rgba(0,0,0,0.3)] focus:border-purple-500/80 focus:ring-4 focus:ring-purple-500/20 focus:bg-slate-900/90"
        />
      </div>

      {suggestions.length > 0 && (
        <div className="glass-panel absolute z-40 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/90 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl p-1.5 space-y-1">
          {suggestions.map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectPokemon(p)}
              className="group flex cursor-pointer items-center justify-between rounded-xl p-2.5 transition-all hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-indigo-600/20 hover:border-white/10 border border-transparent"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-white/5 p-1 flex items-center justify-center border border-white/5 group-hover:border-purple-500/30 transition-colors">
                  <img src={p.image_url} className="h-8 w-8 object-contain" alt="" />
                </div>
                <span className="font-bold text-white text-sm sm:text-base group-hover:text-purple-200 transition-colors">
                  {p.name}
                </span>
              </div>
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                {translateGameValue(p.role)}
              </span>
            </div>
          ))}
        </div>
      )}
    </form>
  );
}

