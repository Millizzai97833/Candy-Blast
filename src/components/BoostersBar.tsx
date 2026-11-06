import React from 'react';
import { BoosterType, UserStats } from '../types/game';
import { Video, Sparkles, Plus } from 'lucide-react';

interface BoostersBarProps {
  stats: UserStats;
  activeBooster: BoosterType | null;
  onSelectBooster: (b: BoosterType) => void;
  onWatchAdForBooster: () => void;
}

export const BoostersBar: React.FC<BoostersBarProps> = ({
  stats,
  activeBooster,
  onSelectBooster,
  onWatchAdForBooster
}) => {
  const boostersList: { type: BoosterType; name: string; icon: string; count: number; desc: string }[] = [
    { type: 'hammer', name: 'Hammer', icon: '🔨', count: stats.boosters.hammer, desc: 'Smash any tile' },
    { type: 'free_switch', name: 'Free Switch', icon: '🔀', count: stats.boosters.free_switch, desc: 'Swap any two' },
    { type: 'color_bomb', name: 'Color Bomb', icon: '🌈', count: stats.boosters.color_bomb, desc: 'Spawn rainbow' },
    { type: 'extra_moves', name: '+5 Moves', icon: '➕', count: stats.boosters.extra_moves, desc: '+5 instant moves' },
  ];

  return (
    <div className="w-full max-w-lg mx-auto px-2 py-1 select-none">
      <div className="flex items-center justify-between gap-1.5 p-1.5 rounded-2xl bg-black/40 border border-purple-500/20 backdrop-blur-md">
        
        {/* Boosters items */}
        <div className="flex items-center gap-1.5 flex-1">
          {boostersList.map((b) => {
            const isActive = activeBooster === b.type;
            const hasStock = b.count > 0;

            return (
              <button
                key={b.type}
                onClick={() => onSelectBooster(b.type)}
                className={`relative flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center transition-all ${
                  isActive
                    ? 'bg-pink-600 border-2 border-yellow-300 scale-105 shadow-[0_0_15px_#ec4899]'
                    : hasStock
                    ? 'bg-purple-900/60 border border-white/20 hover:bg-purple-800/80 active:scale-95'
                    : 'bg-white/5 border border-white/5 opacity-60'
                }`}
                title={b.desc}
              >
                <span className="text-xl leading-none filter drop-shadow">{b.icon}</span>
                <span className="text-[9px] font-black text-white/90 mt-0.5 tracking-tight truncate">
                  {b.name}
                </span>

                {/* Badge count */}
                <span className={`absolute -top-1.5 -right-1 text-[9px] font-black px-1.5 py-0.2 rounded-full border ${
                  hasStock 
                    ? 'bg-amber-400 text-black border-yellow-200 shadow' 
                    : 'bg-slate-700 text-white/60 border-slate-600'
                }`}>
                  {b.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Start.io Rewarded Video CTA Button */}
        <button
          onClick={onWatchAdForBooster}
          className="shrink-0 candy-btn-amber px-2.5 py-2 rounded-xl flex items-center gap-1.5 text-black font-black text-[11px] uppercase tracking-wider shadow hover:brightness-110 active:scale-95 transition-all"
          title="Watch Start.io Ad for free booster"
        >
          <Video className="w-3.5 h-3.5 text-black" />
          <div className="flex flex-col text-left leading-tight">
            <span className="text-[8px] opacity-80">FREE BOOST</span>
            <span>Watch Ad</span>
          </div>
        </button>

      </div>
    </div>
  );
};
