import { useEffect, useState } from "react";
import { fetchTodayLeaderboard } from "../../utils/leaderboard";
import { type LeaderboardEntry } from "../../types/leaderboard";

interface DailyRecordProps {
  /** Refresca el récord cuando cambia (p. ej. tras una nueva victoria). */
  refreshKey?: number | null;
}

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
      <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] mt-4">
        Récord de hoy:{" "}
        <span className="inline-block h-3 w-24 bg-white/10 animate-pulse rounded align-middle" />
      </p>
    );
  }

  if (!record) {
    return (
      <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] mt-4">
        Aún no hay récord hoy — ¡sé el primero!
      </p>
    );
  }

  const attemptsLabel =
    record.attempts === 1 ? "1 intento" : `${record.attempts} intentos`;
  const playerName = record.user_name?.trim() || "Anónimo";

  return (
    <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] mt-4">
      Récord de hoy:{" "}
      <span className="text-yellow-500 font-bold">{attemptsLabel}</span> por{" "}
      <span className="text-white">{playerName}</span>
    </p>
  );
}
