import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Leaderboard } from "./Leaderboard";

interface LeaderboardModalProps {
  onClose: () => void;
}

export function LeaderboardModal({ onClose }: LeaderboardModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-xl">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass-panel relative max-h-[calc(100vh-2rem)] w-full max-w-sm overflow-y-auto rounded-3xl border border-amber-500/30 bg-slate-900/95 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:p-8"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>
        <Leaderboard />
      </motion.div>
    </div>
  );
}
