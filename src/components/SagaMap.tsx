import React from 'react';
import { LevelConfig, UserStats } from '../types/game';
import { LEVELS } from '../services/levels';
import { Star, Lock, Play, Heart, Coins, ShieldCheck, Sparkles, X } from 'lucide-react';

interface SagaMapProps {
  stats: UserStats;
  onSelectLevel: (lvl: LevelConfig) => void;
  onClose: () => void;
  onOpenSdkModal: () => void;
  onWatchAdForReward: (type: 'life' | 'moves' | 'hammer') => void;
}

export const SagaMap: React.FC<SagaMapProps> = ({
  stats,
  onSelectLevel,
  onClose,
  onOpenSdkModal,
  onWatchAdForReward
}) => {
  return (
    <div className="fixed inset-0 z-40 bg-gradient-to-b from-[#1f0322] via-[#2a0845] to-[#12001a] overflow-y-auto select-none">
      
      {/* Sticky Top Header on Saga Map */}
      <div className="sticky top-0 z-30 bg-purple-950/90 backdrop-blur-md border-b border-pink-500/30 px-4 py-2.5 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-2">
          {/* Close / Play current button */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-black text-white tracking-wide flex items-center gap-1.5">
              <span>Candy Blast Saga</span>
              <span className="text-xs bg-pink-500 text-white px-2 py-0.2 rounded-full font-bold">Map</span>
            </h2>
          </div>
        </div>

        {/* Currency & Start.io badge */}
        <div className="flex items-center gap-2">
          {/* Lives */}
          <div className="flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-full border border-red-500/30">
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
            <span className="font-mono text-xs font-black text-white">{stats.lives}/{stats.maxLives}</span>
            {stats.lives < stats.maxLives && (
              <button
                onClick={() => onWatchAdForReward('life')}
                className="text-[9px] bg-red-500/30 hover:bg-red-500 text-red-200 px-1 rounded ml-1"
                title="Watch Ad for Full Life"
              >
                +Ad
              </button>
            )}
          </div>

          {/* Coins */}
          <div className="flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-full border border-yellow-500/30">
            <Coins className="w-3.5 h-3.5 text-yellow-400" />
            <span className="font-mono text-xs font-black text-yellow-300">{stats.coins}</span>
          </div>

          {/* Start.io Console */}
          <button
            onClick={onOpenSdkModal}
            className="px-2 py-1 rounded-full bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/40 text-pink-300 font-extrabold text-[10px] flex items-center gap-1"
          >
            <ShieldCheck className="w-3 h-3 text-pink-400" />
            <span>Start.io</span>
          </button>
        </div>
      </div>

      {/* Hero Welcome Banner */}
      <div className="max-w-md mx-auto px-4 pt-4 text-center">
        <div className="p-4 rounded-3xl bg-gradient-to-r from-pink-600/40 via-purple-600/40 to-indigo-600/40 border-2 border-pink-400/30 shadow-2xl relative overflow-hidden">
          <div className="text-3xl mb-1">🍭🏰✨</div>
          <h1 className="text-xl font-black text-white uppercase tracking-wider drop-shadow">
            Kingdom of Candy Blast
          </h1>
          <p className="text-xs text-pink-200/90 mt-1 max-w-xs mx-auto">
            Travel the sweetest trails, crush candies, and unlock magical star crowns!
          </p>
        </div>
      </div>

      {/* Winding Candy Path Nodes */}
      <div className="max-w-md mx-auto px-4 py-8 relative">
        {/* Curving decorative road lines */}
        <div className="absolute top-12 bottom-12 left-1/2 -translate-x-1/2 w-4 bg-gradient-to-b from-pink-500 via-amber-400 to-purple-600 rounded-full opacity-35 filter blur-[1px] pointer-events-none" />

        <div className="space-y-6 relative z-10">
          {LEVELS.map((level, idx) => {
            const isUnlocked = level.levelNumber <= stats.unlockedLevel;
            const isCurrent = level.levelNumber === stats.unlockedLevel;
            const stars = stats.levelStars[level.levelNumber] || 0;
            const highScore = stats.levelScores[level.levelNumber] || 0;

            // Zig-zag offset for authentic winding saga path
            const offsets = ['translate-x-0', 'translate-x-12', 'translate-x-0', '-translate-x-12'];
            const offsetClass = offsets[idx % offsets.length];

            return (
              <div 
                key={level.levelNumber} 
                className={`flex flex-col items-center transition-transform ${offsetClass}`}
              >
                {/* Level Node Circle */}
                <button
                  disabled={!isUnlocked}
                  onClick={() => onSelectLevel(level)}
                  className={`relative group w-18 h-18 rounded-full flex flex-col items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-600 border-4 border-white shadow-[0_0_25px_#fbbf24] scale-110 animate-sweet-float ring-4 ring-pink-500/60'
                      : isUnlocked
                      ? 'bg-gradient-to-b from-pink-400 via-purple-600 to-indigo-800 border-4 border-yellow-300 shadow-xl hover:scale-105 active:scale-95'
                      : 'bg-gradient-to-b from-slate-700 to-slate-900 border-4 border-slate-600 opacity-60 cursor-not-allowed'
                  }`}
                >
                  {/* Current Level Marker Pin */}
                  {isCurrent && (
                    <div className="absolute -top-6 text-sm font-black bg-pink-500 text-white px-2 py-0.5 rounded-full border border-white shadow-md animate-bounce whitespace-nowrap">
                      YOU ARE HERE!
                    </div>
                  )}

                  {/* Level Number or Lock */}
                  {isUnlocked ? (
                    <>
                      <span className="text-xl font-black text-white drop-shadow-md font-mono leading-none">
                        {level.levelNumber}
                      </span>
                      {/* Stars count */}
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            className={`w-2.5 h-2.5 ${
                              s <= stars
                                ? 'fill-yellow-300 text-yellow-300'
                                : 'text-white/40'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <Lock className="w-6 h-6 text-slate-400" />
                  )}
                </button>

                {/* Level Title label */}
                <div className="mt-1.5 text-center">
                  <span className={`text-xs font-bold block ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                    {level.title}
                  </span>
                  {highScore > 0 && (
                    <span className="text-[10px] text-yellow-300/80 font-mono">
                      Best: {highScore.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Ad callout banner */}
      <div className="max-w-md mx-auto px-4 pb-8 text-center">
        <div className="p-3 rounded-2xl bg-black/40 border border-purple-500/20 text-xs text-purple-200">
          <span>Start.io App ID: <strong>210945361</strong> • Ready for Production & Ad Revenue</span>
        </div>
      </div>

    </div>
  );
};
