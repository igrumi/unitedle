import { useI18n } from "../../i18n";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "" }: LogoProps) => {
  const { t } = useI18n();

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <img
        src="/unitedle_logo.png"
        alt={t("metadata.imageAlt")}
        className="w-20 sm:w-24 md:w-28 h-auto object-contain transition-transform duration-300 hover:scale-105"
        loading="eager"
      />
    </div>
  );
};
