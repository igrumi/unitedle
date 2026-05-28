import { motion } from "framer-motion";
import { Leaderboard } from "../Leaderboard";

interface LeaderboardModalProps {
  onClose: () => void;
}

export function LeaderboardModal({ onClose }: LeaderboardModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 border-2 border-yellow-500/50 p-8 rounded-3xl max-w-sm w-full relative shadow-[0_0_50px_-12px_rgba(234,179,8,0.3)]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white font-bold"
        >
          ✕
        </button>
        <Leaderboard />
      </motion.div>
    </div>
  );
}
