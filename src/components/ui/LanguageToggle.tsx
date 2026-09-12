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
      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-gray-950/80 p-1 text-[10px] font-black text-gray-400 shadow-lg shadow-black/20 backdrop-blur transition-opacity hover:opacity-100 sm:opacity-80"
      aria-label={t("app.languageLabel")}
      title={t("app.languageLabel")}
    >
      <Languages size={13} className="ml-1.5 text-gray-500" />
      {languageOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setLanguage(option.value)}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            language === option.value
              ? "bg-white text-gray-950"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
