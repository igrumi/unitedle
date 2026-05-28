import { supabase } from "./supabaseClient";
import { getChileTodayISO } from "./date";
import { type LeaderboardEntry } from "../types/leaderboard";

export async function fetchTodayLeaderboard(
  limit = 5,
): Promise<LeaderboardEntry[]> {
  const today = getChileTodayISO();

  const { data, error } = await supabase
    .from("leaderboard_view")
    .select("*")
    .eq("win_date", today)
    .order("attempts", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error cargando leaderboard:", error);
    return [];
  }

  return (data ?? []) as LeaderboardEntry[];
}
