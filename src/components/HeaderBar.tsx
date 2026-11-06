import React from 'react';
import { LevelConfig, LevelObjective } from '../types/game';
import { Volume2, VolumeX, Music, Map, Star, ShieldCheck, Sparkles } from 'lucide-react';
import { sound } from '../services/sound';

interface HeaderBarProps {
  currentLevel: LevelConfig;
  score: number;
  movesLeft: number;
  objective: LevelObjective;
  onOpenMap: () => void;
  onOpenSdkModal: () => void;
  isMuted: boolean;
  isMusicMuted: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  currentLevel,
  score,
  movesLeft,
  objective,
  onOpenMap,
  onOpenSdkModal,
  isMuted,
  isMusicMuted,
  onToggleSound,
  onToggleMusic
}) => {
  const { star1, star2, star3 } = currentLevel;
  const currentStars = score >= star3 ? 3 : score >= star2 ? 2 : score >= star1 ? 1 : 0;
  const scorePercent = Math.min(100, Math.round((score / star3) * 100));

  return (
    <div className="w-full max-w-lg mx-auto px-3 pt-2 select-none">
      {/* Top action row */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <button
          onClick={onOpenMap}
          className="px-3 py-1.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-xs flex items-center gap-1.5 shadow transition-all active:scale-95"
        >
          <Map className="w-4 h-4 text-pink-400" />
          <span>Saga Map</span>
        </button>

        {/* Start.io integration chip */}
        <button
          onClick={onOpenSdkModal}
          className="px-2.5 py-1 rounded-full bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/40 text-pink-300 font-extrabold text-[10px] flex items-center gap-1 tracking-wider uppercase transition-all shadow-sm active:scale-95"
          title="Start.io App ID: 210945361"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
          <span>Start.io: <strong className="text-white">210945361</strong></span>
        </button>

        {/* Audio toggles */}
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleSound}
            className={`w-8 h-8 rounded-full border border-white/20 flex items-center justify-center transition-all ${
              isMuted ? 'bg-red-500/20 text-red-300' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title="Toggle SFX"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onToggleMusic}
            className={`w-8 h-8 rounded-full border border-white/20 flex items-center justify-center transition-all ${
              isMusicMuted ? 'bg-red-500/20 text-red-300' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title="Toggle BGM"
          >
            <Music className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Stats Card: Target Objective, Moves remaining & Score bar */}
      <div className="relative rounded-2xl bg-gradient-to-r from-purple-950/90 via-slate-900/95 to-purple-950/90 border-2 border-purple-500/40 p-3 shadow-xl backdrop-blur-md">
        
        <div className="flex items-center justify-between gap-3">
          
          {/* Target Objective */}
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-black tracking-wider text-pink-300 block">
              Level {currentLevel.levelNumber} Objective
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-white font-black text-sm truncate">
                {objective.label}
              </span>
              <span className="text-xs bg-amber-400/20 border border-amber-400/40 text-amber-300 px-2 py-0.2 rounded-full font-black">
                {objective.currentCount}/{objective.targetCount}
              </span>
            </div>
          </div>

          {/* Moves Left Badge */}
          <div className="shrink-0 flex flex-col items-center">
            <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border-2 shadow-lg transition-transform ${
              movesLeft <= 5 
                ? 'bg-gradient-to-b from-red-500 to-rose-700 border-yellow-300 animate-pulse scale-105' 
                : 'bg-gradient-to-b from-pink-500 to-purple-700 border-white/40'
            }`}>
              <span className="text-[9px] uppercase font-black text-white/80 leading-none">Moves</span>
              <span className="text-xl font-black text-white drop-shadow font-mono leading-tight">{movesLeft}</span>
            </div>
          </div>

        </div>

        {/* Score Progress Bar with 3 Star Milestones */}
        <div className="mt-2.5 pt-2 border-t border-purple-500/20">
          <div className="flex items-center justify-between text-xs font-black mb-1">
            <div className="flex items-center gap-1 text-yellow-300">
              <span>Score:</span>
              <span className="font-mono text-sm text-white">{score.toLocaleString()}</span>
            </div>
            
            {/* Star Icons */}
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 transition-all duration-300 ${
                    s <= currentStars
                      ? 'fill-yellow-400 text-yellow-300 filter drop-shadow scale-110'
                      : 'text-purple-400/40'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="relative w-full h-3 bg-black/50 rounded-full overflow-hidden border border-white/20">
            <div
              className="h-full bg-gradient-to-r from-pink-500 via-amber-400 to-yellow-300 transition-all duration-300 shadow-[0_0_10px_#fbbf24]"
              style={{ width: `${scorePercent}%` }}
            />
            {/* Star markers on score bar */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-white/60"
              style={{ left: `${Math.round((star1 / star3) * 100)}%` }}
            />
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-white/60"
              style={{ left: `${Math.round((star2 / star3) * 100)}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
