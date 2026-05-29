import { useEffect, useState } from "react";
import { fetchTodayLeaderboard } from "../utils/leaderboard";
import { type LeaderboardEntry } from "../types/leaderboard";
import { useI18n } from "../i18n";

const topRankBadges = [
  { src: "/rank_legend.webp", altKey: "leaderboard.rankLegend" },
  { src: "/rank_master.webp", altKey: "leaderboard.rankMaster" },
  { src: "/rank_ultra.webp", altKey: "leaderboard.rankUltra" },
] as const;

export const Leaderboard = () => {
  const [topEntries, setTopEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();

  useEffect(() => {
    const load = async () => {
      const data = await fetchTodayLeaderboard(5);
      setTopEntries(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 animate-pulse">
        {t("leaderboard.loading")}
      </div>
    );
  }

  return (
    <div className="w-full text-left">
      <h3 className="mb-5 flex items-center gap-2 text-lg font-black uppercase tracking-tight text-yellow-500 sm:mb-6 sm:text-xl">
        <span>🏆</span> {t("leaderboard.title")}
      </h3>
      <div className="space-y-3">
        {topEntries.map((entry, i) => (
          <div
            key={entry.id}
            className="flex min-h-14 items-center justify-between gap-3 rounded-2xl border border-white/5 bg-white/5 p-3 transition-colors hover:border-yellow-500/30"
          >
            <div className="flex min-w-0 items-center gap-3">
              {topRankBadges[i] ? (
                <img
                  src={topRankBadges[i].src}
                  alt={t(topRankBadges[i].altKey)}
                  className="h-8 w-8 shrink-0 object-contain"
                />
              ) : (
                <span className="w-8 shrink-0 text-center font-black text-gray-600">
                  {i + 1}
                </span>
              )}
              {entry.user_avatar && (
                <img
                  src={entry.user_avatar}
                  className="h-8 w-8 shrink-0 rounded-full border border-yellow-500/20 bg-gray-800"
                  alt=""
                />
              )}
              <span className="min-w-0 max-w-[9rem] truncate text-sm font-bold uppercase text-gray-200 sm:max-w-[140px]">
                {entry.user_name?.trim() || t("record.anonymous")}
              </span>
            </div>
            <div className="shrink-0 text-right">
              <span className="block text-[10px] font-black leading-none text-yellow-500">
                {entry.attempts}
              </span>
              <span className="text-[8px] uppercase text-gray-500">
                {t("leaderboard.attempts")}
              </span>
            </div>
          </div>
        ))}
        {topEntries.length === 0 && (
          <p className="py-4 text-center italic text-gray-600">
            {t("leaderboard.empty")}
          </p>
        )}
      </div>
    </div>
  );
};
