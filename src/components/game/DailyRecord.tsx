import { useEffect, useState } from "react";
import { fetchTodayLeaderboard } from "../../utils/leaderboard";
import { type LeaderboardEntry } from "../../types/leaderboard";

interface DailyRecordProps {
  refreshKey?: number | null;
}

const recordTextClass =
  "mt-4 px-3 text-center text-[9px] uppercase leading-relaxed tracking-[0.18em] text-gray-500 sm:text-[10px] sm:tracking-[0.3em]";

export function DailyRecord({ refreshKey }: DailyRecordProps) {
  const [record, setRecord] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);

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
        Récord de hoy:{" "}
        <span className="inline-block h-3 w-24 rounded bg-white/10 align-middle animate-pulse" />
      </p>
    );
  }

  if (!record) {
    return (
      <p className={recordTextClass}>
        Aún no hay récord hoy - ¡sé el primero!
      </p>
    );
  }

  const attemptsLabel =
    record.attempts === 1 ? "1 intento" : `${record.attempts} intentos`;
  const playerName = record.user_name?.trim() || "Anónimo";

  return (
    <p className={recordTextClass}>
      Récord de hoy:{" "}
      <span className="font-bold text-yellow-500">{attemptsLabel}</span> por{" "}
      <span className="text-white">{playerName}</span>
    </p>
  );
}
