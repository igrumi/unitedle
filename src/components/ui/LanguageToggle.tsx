import { Languages } from "lucide-react";
import { useI18n, type Language } from "../../i18n";

const languageOptions: { value: Language; label: string }[] = [
  { value: "es", label: "ES" },
  { value: "en", label: "EN" },
];

export function LanguageToggle() {
  const { language, setLanguage, t } = useI18n();

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-slate-900/70 p-1 text-[11px] font-bold text-slate-400 shadow-xl shadow-black/40 backdrop-blur-md transition-all hover:border-white/20"
      aria-label={t("app.languageLabel")}
      title={t("app.languageLabel")}
    >
      <Languages size={14} className="ml-2 text-slate-400" />
      {languageOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setLanguage(option.value)}
          className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
            language === option.value
              ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-purple-600/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
