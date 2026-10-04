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
      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-gray-900/90 p-1 text-[11px] font-bold text-gray-400 shadow-lg"
      aria-label={t("app.languageLabel")}
      title={t("app.languageLabel")}
    >
      <Languages size={14} className="ml-2 text-gray-400" />
      {languageOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setLanguage(option.value)}
          className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
            language === option.value
              ? "bg-primary text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
