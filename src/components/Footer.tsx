import { useI18n } from "../i18n";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="w-full max-w-5xl py-6 text-center text-[10px] text-gray-500">
      {t("footer.disclaimer")}
    </footer>
  );
}
