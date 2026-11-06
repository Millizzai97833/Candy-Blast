import React from 'react';
import { LevelConfig } from '../types/game';
import { Star, Play, RotateCcw, Map, Trophy, Sparkles } from 'lucide-react';

interface LevelCompleteModalProps {
  isOpen: boolean;
  level: LevelConfig;
  score: number;
  stars: number;
  bonusFromMoves: number;
  onNextLevel: () => void;
  onReplay: () => void;
  onOpenMap: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  isOpen,
  level,
  score,
  stars,
  bonusFromMoves,
  onNextLevel,
  onReplay,
  onOpenMap
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-purple-900 via-slate-900 to-purple-950 border-4 border-yellow-400 shadow-2xl p-6 text-center flex flex-col items-center">
        
        {/* Golden Crown Banner */}
        <div className="absolute -top-7 w-14 h-14 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-600 border-4 border-white shadow-xl flex items-center justify-center text-3xl animate-bounce">
          👑
        </div>

        <h2 className="text-2xl font-black text-yellow-300 uppercase tracking-widest mt-4 drop-shadow">
          Sugar Crush!
        </h2>
        <p className="text-xs font-bold text-pink-300 tracking-wide">
          Level {level.levelNumber}: {level.title} Completed!
        </p>

        {/* 3 Stars Container */}
        <div className="flex items-center justify-center gap-3 my-5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`transition-all duration-500 transform ${
                s <= stars ? 'scale-125' : 'scale-90 opacity-40'
              }`}
            >
              <Star
                className={`w-10 h-10 ${
                  s <= stars
                    ? 'fill-yellow-400 text-yellow-300 filter drop-shadow-[0_0_12px_#fbbf24]'
                    : 'text-slate-500 fill-slate-700'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Score & Moves Bonus breakdown */}
        <div className="w-full rounded-2xl bg-black/40 border border-purple-500/30 p-3.5 mb-5 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-purple-200">
            <span>Sugar Bonus (Leftover moves):</span>
            <span className="font-mono text-yellow-300 font-bold">+{bonusFromMoves.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-base font-black text-white pt-1 border-t border-purple-500/20">
            <span>Final Score:</span>
            <span className="font-mono text-xl text-yellow-300">{score.toLocaleString()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2.5">
          <button
            onClick={onNextLevel}
            className="w-full py-3.5 rounded-2xl candy-btn-green font-black text-white text-base tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl hover:brightness-110 active:scale-98 transition-all"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Next Level</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onReplay}
              className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/20 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay</span>
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
