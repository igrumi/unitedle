import { useEffect, useState } from "react";
import { fetchTodayLeaderboard } from "../../utils/leaderboard";
import { type LeaderboardEntry } from "../../types/leaderboard";
import { useI18n } from "../../i18n";

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

  const getRankCardStyle = (index: number) => {
    switch (index) {
      case 0:
        return "border-amber-400/40 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-slate-900/40 shadow-[0_0_20px_rgba(245,158,11,0.12)]";
      case 1:
        return "border-slate-300/30 bg-gradient-to-r from-slate-300/10 via-slate-300/5 to-slate-900/40";
      case 2:
        return "border-amber-700/30 bg-gradient-to-r from-amber-700/10 via-amber-700/5 to-slate-900/40";
      default:
        return "border-white/5 bg-slate-900/40 hover:border-white/15";
    }
  };

  return (
    <div className="w-full text-left">
      <h3 className="mb-5 flex items-center gap-2 text-lg font-black uppercase tracking-tight text-amber-400 sm:mb-6 sm:text-xl">
        <span>🏆</span> {t("leaderboard.title")}
      </h3>
      <div className="space-y-2.5">
        {topEntries.map((entry, i) => (
          <div
            key={entry.id}
            className={`flex min-h-14 items-center justify-between gap-3 rounded-2xl border p-3 transition-all backdrop-blur-md ${getRankCardStyle(i)}`}
          >
            <div className="flex min-w-0 items-center gap-3">
              {topRankBadges[i] ? (
                <img
                  src={topRankBadges[i].src}
                  alt={t(topRankBadges[i].altKey)}
                  className="h-8 w-8 shrink-0 object-contain drop-shadow-md"
                />
              ) : (
                <span className="w-8 shrink-0 text-center font-black text-slate-500 text-sm">
                  #{i + 1}
                </span>
              )}
              {entry.user_avatar && (
                <img
                  src={entry.user_avatar}
                  className="h-8 w-8 shrink-0 rounded-full border border-amber-500/30 bg-gray-800 object-cover"
                  alt=""
                />
              )}
              <span className="min-w-0 max-w-[9rem] truncate text-sm font-bold uppercase text-slate-100 sm:max-w-[140px]">
                {entry.user_name?.trim() || t("record.anonymous")}
              </span>
            </div>
            <div className="shrink-0 text-right">
              <span className="block text-sm font-black leading-none text-amber-400">
                {entry.attempts}
              </span>
              <span className="text-[8px] uppercase tracking-wider text-slate-400">
                {t("leaderboard.attempts")}
              </span>
            </div>
          </div>
        ))}
        {topEntries.length === 0 && (
          <p className="py-4 text-center italic text-slate-500 text-sm">
            {t("leaderboard.empty")}
          </p>
        )}
      </div>
    </div>
  );
};
