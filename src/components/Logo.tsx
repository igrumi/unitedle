import { useI18n } from "../i18n";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
  const { t } = useI18n();

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <img
        src="/unitedle_logo.png"
        alt={t("metadata.imageAlt")}
        className="w-16 md:w-20 lg:w-24 h-auto object-contain transition-all duration-300"
        loading="eager"
      />
    </div>
  );
};
