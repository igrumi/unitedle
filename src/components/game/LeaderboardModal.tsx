import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Leaderboard } from "./Leaderboard";

interface LeaderboardModalProps {
  onClose: () => void;
}

export function LeaderboardModal({ onClose }: LeaderboardModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative max-h-[calc(100vh-2rem)] w-full max-w-sm overflow-y-auto rounded-2xl border-2 border-yellow-500/50 bg-gray-900 p-5 shadow-2xl sm:p-8"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-1"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <Leaderboard />
      </motion.div>
    </div>
  );
}
