import React, { useState, useEffect } from 'react';
import { startIo, AdCreative } from '../services/startioAds';
import { X, ExternalLink, ShieldCheck, Sparkles, Star } from 'lucide-react';

interface StartIoInterstitialProps {
  isOpen: boolean;
  onClose: () => void;
  triggerReason?: string;
}

export const StartIoInterstitial: React.FC<StartIoInterstitialProps> = ({
  isOpen,
  onClose,
  triggerReason = 'Level Complete'
}) => {
  const [ad, setAd] = useState<AdCreative>(() => startIo.getAd());
  const [countdown, setCountdown] = useState<number>(5);
  const [canClose, setCanClose] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setAd(startIo.getAd());
      startIo.recordInterstitialImpression();
      setCountdown(5);
      setCanClose(false);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanClose(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCta = () => {
    startIo.recordAdClick();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-slate-900 via-purple-950 to-slate-950 border-2 border-pink-500/50 shadow-2xl overflow-hidden flex flex-col">
        {/* Top bar with countdown & Close */}
        <div className="px-4 py-3 bg-slate-900/90 border-b border-purple-500/30 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-pink-400 tracking-wider flex items-center gap-1 uppercase">
                <ShieldCheck className="w-3 h-3 text-pink-400" /> Start.io Interstitial
              </span>
              <span className="text-[9px] text-purple-300/70">
                App ID: {startIo.config.appId} • {triggerReason}
              </span>
            </div>
          </div>

          <div>
            {canClose ? (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors active:scale-95"
                title="Close Ad"
              >
                <X className="w-5 h-5" />
              </button>
            ) : (
              <div className="px-2.5 py-1 rounded-full bg-black/50 border border-white/20 text-white text-xs font-bold font-mono">
                Skip in {countdown}s
              </div>
            )}
          </div>
        </div>

        {/* Ad Body Content */}
        <div className="p-5 flex flex-col items-center text-center">
          {/* Animated Hero Graphic */}
          <div className="relative my-2 w-full h-44 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4 flex flex-col items-center justify-center shadow-inner overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-xl animate-pulse"></div>
            <div className="text-5xl filter drop-shadow-lg mb-2 animate-bounce">
              🍭👑✨
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black tracking-wider text-white uppercase border border-white/40 mb-1">
              {ad.badge}
            </div>
            <span className="text-white text-lg font-black drop-shadow tracking-wide">
              {ad.title}
            </span>
            <p className="text-purple-100 text-xs px-2 mt-1 line-clamp-2">
              {ad.tagline}
            </p>
          </div>

          {/* Details & Ratings */}
          <div className="w-full flex items-center justify-center gap-4 py-2 text-xs">
            <div className="flex items-center gap-1 text-amber-300 font-bold bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-500/30">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{ad.rating} / 5.0</span>
            </div>
            <span className="text-purple-200/80 font-semibold">{ad.category}</span>
            <span className="text-purple-300/60">•</span>
            <span className="text-purple-300/80">{ad.sponsor}</span>
          </div>

          <p className="text-xs text-purple-200/80 px-2 mb-4">
            Join millions of players worldwide! Tap install to play now for free.
          </p>

          {/* Action Button */}
          <div className="w-full space-y-2">
            <button
              onClick={handleCta}
              className="w-full py-3.5 rounded-2xl candy-btn font-black text-white text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 shadow-lg"
            >
              <span>{ad.ctaText}</span>
              <ExternalLink className="w-4 h-4" />
            </button>

            {canClose && (
              <button
                onClick={onClose}
                className="w-full py-2 text-xs text-purple-300/80 hover:text-white font-semibold transition-colors"
              >
                Return to Candy Blast
              </button>
            )}
          </div>
        </div>

        {/* Start.io Footer info */}
        <div className="px-4 py-2 bg-black/40 border-t border-purple-500/20 text-center text-[10px] text-purple-300/50">
          Start.io In-App SDK 5.4.0 • Authorized Placement
        </div>
      </div>
    </div>
  );
};
