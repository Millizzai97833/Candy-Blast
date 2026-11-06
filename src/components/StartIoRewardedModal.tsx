import React, { useState, useEffect } from 'react';
import { startIo } from '../services/startioAds';
import { sound } from '../services/sound';
import confetti from 'canvas-confetti';
import { Play, CheckCircle2, Gift, X, Sparkles, Volume2, ShieldCheck } from 'lucide-react';

interface StartIoRewardedModalProps {
  isOpen: boolean;
  rewardType: 'moves' | 'hammer' | 'color_bomb' | 'life';
  onClose: () => void;
  onRewardClaimed: (rewardType: 'moves' | 'hammer' | 'color_bomb' | 'life') => void;
}

export const StartIoRewardedModal: React.FC<StartIoRewardedModalProps> = ({
  isOpen,
  rewardType,
  onClose,
  onRewardClaimed
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const durationSec = 10;

  useEffect(() => {
    if (isOpen) {
      setProgress(0);
      setIsFinished(false);
      setIsPlaying(true);
      startIo.recordRewardedImpression();

      const startTime = Date.now();
      const totalMs = durationSec * 1000;

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const pct = Math.min(100, Math.round((elapsed / totalMs) * 100));
        setProgress(pct);

        if (pct >= 100) {
          clearInterval(interval);
          setIsFinished(true);
          setIsPlaying(false);
          startIo.recordRewardedCompleted();
          sound.playVictory();
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.6 }
            });
          } catch {}
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getRewardDescription = () => {
    switch (rewardType) {
      case 'moves':
        return { label: '+5 Extra Moves', icon: '➕', color: 'from-amber-400 to-yellow-500' };
      case 'hammer':
        return { label: '1x Lollipop Hammer', icon: '🔨', color: 'from-pink-500 to-rose-600' };
      case 'color_bomb':
        return { label: '1x Color Bomb', icon: '🌈', color: 'from-purple-500 to-indigo-600' };
      case 'life':
      default:
        return { label: 'Full Life Refill', icon: '❤️', color: 'from-red-500 to-pink-600' };
    }
  };

  const rewardInfo = getRewardDescription();

  const handleClaim = () => {
    onRewardClaimed(rewardType);
    onClose();
  };

  const handleFastForward = () => {
    setProgress(100);
    setIsFinished(true);
    setIsPlaying(false);
    startIo.recordRewardedCompleted();
    sound.playVictory();
    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-purple-950 via-slate-900 to-purple-950 border-2 border-pink-400 shadow-2xl overflow-hidden flex flex-col">
        {/* Top header */}
        <div className="px-4 py-2.5 bg-black/60 border-b border-purple-500/30 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-pink-400" />
            <div className="text-left">
              <span className="text-[11px] font-black text-white uppercase tracking-wider flex items-center gap-1">
                Start.io Rewarded Video
              </span>
              <span className="text-[9px] text-purple-300">
                App ID: {startIo.config.appId}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isFinished ? (
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <span className="text-xs font-mono font-bold text-amber-300 bg-black/40 px-2 py-0.5 rounded-full border border-amber-400/30">
                {Math.ceil(durationSec * (1 - progress / 100))}s
              </span>
            )}
          </div>
        </div>

        {/* Video Player Display */}
        <div className="relative aspect-video bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-4 overflow-hidden border-b border-purple-500/30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-500/20 via-transparent to-transparent"></div>
          
          {/* Animated promotional gameplay preview */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="text-4xl filter drop-shadow animate-bounce mb-1">
              🎉🍭🍬
            </div>
            <h3 className="text-white font-black text-base drop-shadow tracking-wide">
              Candy Blast Grand Saga
            </h3>
            <p className="text-pink-200 text-xs mt-0.5">
              Sweetest matches, explosive combos, free rewards!
            </p>
          </div>

          {/* Sound & Live badge */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded-full text-[10px] text-white">
            <Volume2 className="w-3 h-3 text-pink-400" />
            <span>Sound ON</span>
          </div>

          {/* Skip for test mode */}
          <button
            onClick={handleFastForward}
            className="absolute top-2 right-2 text-[10px] bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded text-white font-mono"
            title="Fast forward simulated ad"
          >
            Fast Forward ⏩
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2">
          <div 
            className="bg-gradient-to-r from-pink-500 via-amber-400 to-green-400 h-full transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Reward Status & Claim section */}
        <div className="p-5 flex flex-col items-center text-center">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${rewardInfo.color} flex items-center justify-center text-3xl shadow-lg border-2 border-white/40 mb-3 ${isFinished ? 'animate-bounce' : 'animate-pulse'}`}>
            {rewardInfo.icon}
          </div>

          <h4 className="text-white font-black text-lg mb-1">
            {isFinished ? 'Reward Unlocked!' : 'Watching Sponsored Video...'}
          </h4>
          <p className="text-purple-200/90 text-xs mb-4">
            {isFinished
              ? `Congratulations! You earned ${rewardInfo.label}!`
              : `Watch until the timer finishes to claim ${rewardInfo.label}`}
          </p>

          {isFinished ? (
            <button
              onClick={handleClaim}
              className="w-full py-3.5 rounded-2xl candy-btn-green font-black text-white text-base tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl hover:brightness-110 active:scale-98 transition-all"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Claim {rewardInfo.label}</span>
            </button>
          ) : (
            <div className="w-full py-3 rounded-2xl bg-white/10 text-purple-300 font-bold text-xs flex items-center justify-center gap-2 border border-white/10">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Reward ready in {Math.ceil(durationSec * (1 - progress / 100))} seconds</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-black/40 text-center text-[10px] text-purple-300/60 border-t border-purple-500/20">
          Powered by Start.io Rewarded Video SDK
        </div>
      </div>
    </div>
  );
};
