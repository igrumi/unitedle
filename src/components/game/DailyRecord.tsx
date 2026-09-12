import { useEffect, useState } from "react";
import { fetchTodayLeaderboard } from "../../utils/leaderboard";
import { type LeaderboardEntry } from "../../types/leaderboard";
import { useI18n } from "../../i18n";

interface DailyRecordProps {
  refreshKey?: number | null;
}

const recordTextClass =
  "mt-3 px-3 text-center text-[10px] uppercase leading-relaxed tracking-[0.2em] text-slate-400 sm:text-[11px] sm:tracking-[0.25em]";

export function DailyRecord({ refreshKey }: DailyRecordProps) {
  const [record, setRecord] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      const entries = await fetchTodayLeaderboard(1);
      if (!cancelled) {
        setRecord(entries[0] ?? null);
        setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  if (loading) {
    return (
      <p className={recordTextClass}>
        {t("record.loading")}{" "}
        <span className="inline-block h-3 w-24 rounded bg-white/10 align-middle animate-pulse" />
      </p>
    );
  }

  if (!record) {
    return <p className={recordTextClass}>{t("record.empty")}</p>;
  }

  const attemptsLabel =
    record.attempts === 1
      ? t("record.attemptSingular")
      : t("record.attemptPlural", { count: record.attempts });
  const playerName = record.user_name?.trim() || t("record.anonymous");

  return (
    <p className={recordTextClass}>
      {t("record.label")}{" "}
      <span className="font-bold text-yellow-500">{attemptsLabel}</span>{" "}
      {t("record.by")} <span className="text-white">{playerName}</span>
    </p>
  );
}
