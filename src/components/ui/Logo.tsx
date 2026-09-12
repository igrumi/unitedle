import { useI18n } from "../../i18n";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "" }: LogoProps) => {
  const { t } = useI18n();

  return (
    <div className={`relative flex justify-center items-center ${className}`}>
      {/* Ambient glow behind logo */}
      <div className="absolute -inset-3 bg-gradient-to-tr from-purple-600/40 via-violet-500/30 to-orange-500/30 rounded-full blur-xl opacity-60 animate-pulse pointer-events-none" />
      <img
        src="/unitedle_logo.png"
        alt={t("metadata.imageAlt")}
        className="relative z-10 w-20 sm:w-24 md:w-28 h-auto object-contain transition-all duration-300 drop-shadow-2xl hover:scale-105"
        loading="eager"
      />
    </div>
  );
};
