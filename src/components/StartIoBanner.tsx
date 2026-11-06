import React, { useState, useEffect } from 'react';
import { startIo, AdCreative } from '../services/startioAds';
import { ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';

interface StartIoBannerProps {
  onOpenSdkModal?: () => void;
}

export const StartIoBanner: React.FC<StartIoBannerProps> = ({ onOpenSdkModal }) => {
  const [ad, setAd] = useState<AdCreative>(() => startIo.getAd(0));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    startIo.recordBannerImpression();
    // Rotate banner every 25 seconds
    const interval = setInterval(() => {
      setAd(startIo.getAd());
      startIo.recordBannerImpression();
    }, 25000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    startIo.recordAdClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-2 pb-1.5 pt-1 z-30">
      <div className="relative rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/40 shadow-xl p-2.5 flex items-center justify-between gap-2.5 overflow-hidden">
        {/* Subtle animated backdrop sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-amber-500/10 to-indigo-500/10 pointer-events-none" />

        {/* Start.io Header badge */}
        <div className="absolute top-1 right-2 flex items-center gap-1 text-[9px] font-bold text-purple-300/80">
          <ShieldCheck className="w-2.5 h-2.5 text-pink-400" />
          <button 
            onClick={onOpenSdkModal} 
            className="hover:underline flex items-center gap-0.5 tracking-wider uppercase"
            title="Start.io App ID: 210945361"
          >
            Ads by <span className="text-pink-400 font-extrabold">Start.io</span>
          </button>
        </div>

        {/* Ad icon / thumbnail */}
        <div className={`w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br ${ad.iconBg} shadow-md flex items-center justify-center text-white font-black text-lg border border-white/30 relative`}>
          <span>🍬</span>
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-yellow-400 rounded-full flex items-center justify-center text-[8px] font-black text-black">
            ★
          </div>
        </div>

        {/* Text details */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <h4 className="font-bold text-white text-xs truncate">{ad.title}</h4>
            <span className="text-[9px] bg-pink-500/30 text-pink-300 font-bold px-1.5 py-0.2 rounded-full border border-pink-500/40">
              {ad.badge}
            </span>
          </div>
          <p className="text-[11px] text-purple-200/90 truncate leading-snug">
            {ad.tagline}
          </p>
          <div className="flex items-center gap-2 text-[10px] text-amber-300 font-semibold mt-0.5">
            <span>⭐ {ad.rating}</span>
            <span className="text-purple-300/60">•</span>
            <span className="text-purple-300/80">{ad.category}</span>
            <span className="text-purple-300/60">•</span>
            <span className="text-[9px] text-slate-400">{ad.sponsor}</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="shrink-0 flex flex-col items-center">
          <button
            onClick={handleClick}
            className="candy-btn px-3 py-1.5 rounded-xl font-extrabold text-[11px] text-white tracking-wide shadow flex items-center gap-1 hover:brightness-110 active:scale-95 transition-transform"
          >
            <span>{copied ? 'OPENING...' : ad.ctaText}</span>
            <ExternalLink className="w-3 h-3" />
          </button>
          <span className="text-[8px] text-purple-300/60 mt-0.5 font-medium">Free Install</span>
        </div>
      </div>
    </div>
  );
};
