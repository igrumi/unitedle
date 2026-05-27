import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export const Leaderboard = () => {
  const [topEntries, setTopEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTop5 = async () => {
      const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Santiago' });
      
      const { data, error } = await supabase
        .from("leaderboard_view") // Usamos nuestra nueva vista
        .select("*")
        .eq("win_date", today)
        .order("attempts", { ascending: true })
        .limit(5);

      if (!error && data) setTopEntries(data);
      setLoading(false);
    };
    fetchTop5();
  }, []);

  if (loading) return <div className="p-10 animate-pulse text-gray-500">Cargando campeones...</div>;

  return (
    <div className="w-full text-left">
      <h3 className="text-xl font-black text-yellow-500 mb-6 flex items-center gap-2 uppercase tracking-tighter">
        <span>🏆</span> Top 5 de Hoy
      </h3>
      <div className="space-y-3">
        {topEntries.map((entry, i) => (
          <div key={entry.id} className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/5 hover:border-yellow-500/30 transition-colors">
            <div className="flex items-center gap-3">
              <span className={`font-black w-5 ${i === 0 ? 'text-yellow-400' : 'text-gray-600'}`}>{i + 1}</span>
              <img src={entry.user_avatar} className="w-8 h-8 rounded-full border border-yellow-500/20" alt="avatar" />
              <span className="font-bold text-sm text-gray-200 truncate max-w-[140px] uppercase">{entry.user_name}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-yellow-500 block leading-none">{entry.attempts}</span>
              <span className="text-[8px] text-gray-500 uppercase">Intentos</span>
            </div>
          </div>
        ))}
        {topEntries.length === 0 && <p className="text-gray-600 italic text-center py-4">Aún no hay registros hoy.</p>}
      </div>
    </div>
  );
};