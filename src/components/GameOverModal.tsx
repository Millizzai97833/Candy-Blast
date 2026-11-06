import React from 'react';
import { LevelConfig, LevelObjective } from '../types/game';
import { Video, RotateCcw, Map, AlertCircle, Sparkles } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  level: LevelConfig;
  objective: LevelObjective;
  score: number;
  onWatchAdForMoves: () => void;
  onRetry: () => void;
  onOpenMap: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  level,
  objective,
  score,
  onWatchAdForMoves,
  onRetry,
  onOpenMap
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-purple-950 via-slate-900 to-rose-950 border-4 border-rose-500 shadow-2xl p-6 text-center flex flex-col items-center">
        
        {/* Sad Candy Emoji */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-rose-700 border-4 border-white shadow-xl flex items-center justify-center text-3xl mb-2">
          💔
        </div>

        <h2 className="text-2xl font-black text-rose-300 uppercase tracking-widest drop-shadow">
          Out of Moves!
        </h2>
        <p className="text-xs text-purple-200 mt-1 mb-4">
          You were so close to clearing Level {level.levelNumber}!
        </p>

        {/* Objective Progress */}
        <div className="w-full rounded-2xl bg-black/40 border border-rose-500/30 p-3.5 mb-5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-rose-300 block">Remaining Goal</span>
          <div className="flex items-center justify-between text-xs text-white font-black">
            <span>{objective.label}:</span>
            <span className="font-mono text-amber-300">
              {objective.currentCount} / {objective.targetCount}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-purple-300 pt-1 border-t border-white/10">
            <span>Score Reached:</span>
            <span className="font-mono text-white font-bold">{score.toLocaleString()}</span>
          </div>
        </div>

        {/* Start.io Rewarded Video Savior Button */}
        <div className="w-full space-y-2.5">
          <button
            onClick={onWatchAdForMoves}
            className="w-full py-3.5 rounded-2xl candy-btn-amber font-black text-black text-sm tracking-wide uppercase flex items-center justify-center gap-2 shadow-xl hover:brightness-110 active:scale-98 transition-all animate-pulse"
          >
            <Video className="w-5 h-5 text-black" />
            <span>Watch Ad for +5 Extra Moves</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onRetry}
              className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/20 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Level</span>
            </button>
            <button
              onClick={onOpenMap}
              className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/20 transition-all"
            >
              <Map className="w-3.5 h-3.5" />
              <span>Saga Map</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
