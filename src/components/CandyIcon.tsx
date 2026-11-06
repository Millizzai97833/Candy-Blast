import React from 'react';
import { CandyColor, SpecialType, ObstacleType, IngredientType } from '../types/game';

interface CandyIconProps {
  color: CandyColor;
  special?: SpecialType;
  obstacle?: ObstacleType;
  ingredient?: IngredientType;
  size?: number | string;
  className?: string;
  isSelected?: boolean;
  isHint?: boolean;
}

export const CandyIcon: React.FC<CandyIconProps> = ({
  color,
  special = 'none',
  obstacle = 'none',
  ingredient = 'none',
  size = '100%',
  className = '',
  isSelected = false,
  isHint = false,
}) => {
  // 1. Ingredients render instead of normal candy
  if (ingredient === 'cherry') {
    return (
      <div 
        style={{ width: size, height: size }}
        className={`relative flex items-center justify-center filter drop-shadow-md transition-transform duration-200 ${className} ${isSelected ? 'scale-115 animate-pulse' : ''}`}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <radialGradient id="cherryGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ff4d6d" />
              <stop offset="60%" stopColor="#c9184a" />
              <stop offset="100%" stopColor="#590d22" />
            </radialGradient>
          </defs>
          {/* Stems */}
          <path d="M50 20 Q56 38 42 58" fill="none" stroke="#2b9348" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M50 20 Q62 42 66 60" fill="none" stroke="#2b9348" strokeWidth="4.5" strokeLinecap="round" />
          {/* Leaf */}
          <path d="M50 20 Q62 14 65 24 Q55 24 50 20" fill="#55a630" />
          {/* Left Cherry */}
          <circle cx="38" cy="65" r="19" fill="url(#cherryGrad)" filter="drop-shadow(0 3px 2px rgba(0,0,0,0.4))" />
          <ellipse cx="32" cy="58" rx="5" ry="3" fill="white" opacity="0.8" transform="rotate(-30 32 58)" />
          {/* Right Cherry */}
          <circle cx="68" cy="67" r="18" fill="url(#cherryGrad)" filter="drop-shadow(0 3px 2px rgba(0,0,0,0.4))" />
          <ellipse cx="62" cy="60" rx="4.5" ry="2.5" fill="white" opacity="0.8" transform="rotate(-30 62 60)" />
        </svg>
      </div>
    );
  }

  if (ingredient === 'hazelnut') {
    return (
      <div 
        style={{ width: size, height: size }}
        className={`relative flex items-center justify-center filter drop-shadow-md transition-transform duration-200 ${className} ${isSelected ? 'scale-115 animate-pulse' : ''}`}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <radialGradient id="nutBody" cx="35%" cy="40%" r="65%">
              <stop offset="0%" stopColor="#d4a373" />
              <stop offset="70%" stopColor="#a98467" />
              <stop offset="100%" stopColor="#6f4e37" />
            </radialGradient>
            <linearGradient id="nutCap" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7f4f24" />
              <stop offset="100%" stopColor="#4a2810" />
            </linearGradient>
          </defs>
          {/* Nut Cap */}
          <path d="M30 45 C30 25 70 25 70 45 C65 42 35 42 30 45 Z" fill="url(#nutCap)" />
          <path d="M48 24 L52 16" stroke="#4a2810" strokeWidth="4" strokeLinecap="round" />
          {/* Nut Shell */}
          <path d="M30 44 C26 65 40 85 50 88 C60 85 74 65 70 44 Z" fill="url(#nutBody)" />
          {/* Highlight */}
          <ellipse cx="44" cy="54" rx="4" ry="12" fill="white" opacity="0.45" transform="rotate(-20 44 54)" />
        </svg>
      </div>
    );
  }

  // 2. Obstacles (Chocolate block or Frosting)
  if (obstacle === 'chocolate') {
    return (
      <div 
        style={{ width: size, height: size }}
        className={`relative flex items-center justify-center p-1 ${className}`}
      >
        <div className="w-full h-full rounded-xl bg-gradient-to-br from-amber-900 via-amber-950 to-stone-900 border-2 border-amber-700 shadow-inner flex items-center justify-center relative overflow-hidden">
          <div className="grid grid-cols-2 grid-rows-2 gap-1 w-4/5 h-4/5">
            <div className="bg-amber-800 rounded-sm shadow-inner border-t border-amber-600/40"></div>
            <div className="bg-amber-800 rounded-sm shadow-inner border-t border-amber-600/40"></div>
            <div className="bg-amber-800 rounded-sm shadow-inner border-t border-amber-600/40"></div>
            <div className="bg-amber-800 rounded-sm shadow-inner border-t border-amber-600/40"></div>
          </div>
          {/* Gloss */}
          <div className="absolute top-1 left-2 w-6 h-2 bg-white/20 rounded-full blur-[1px]"></div>
        </div>
      </div>
    );
  }

  if (obstacle === 'frosting_1' || obstacle === 'frosting_2') {
    return (
      <div 
        style={{ width: size, height: size }}
        className={`relative flex items-center justify-center p-1 ${className}`}
      >
        <div className={`w-full h-full rounded-2xl bg-gradient-to-br from-sky-100 via-blue-200 to-indigo-300 border-2 ${obstacle === 'frosting_2' ? 'border-sky-400 ring-2 ring-sky-300' : 'border-sky-200'} shadow-md flex items-center justify-center relative overflow-hidden`}>
          <span className="text-xl select-none">❄️</span>
          {obstacle === 'frosting_2' && (
            <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px] flex items-center justify-center">
              <span className="text-xs font-black text-sky-800 bg-white/70 px-1.5 py-0.5 rounded-full">2x</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. Special: Color Bomb (Disco Rainbow Chocolate Donut)
  if (special === 'color_bomb') {
    return (
      <div 
        style={{ width: size, height: size }}
        className={`relative flex items-center justify-center p-1 transition-transform duration-200 ${className} ${isSelected ? 'scale-115' : ''} ${isHint ? 'animate-bounce' : ''}`}
      >
        <div className="w-[90%] h-[90%] rounded-full bg-gradient-to-br from-stone-800 via-stone-900 to-black border-2 border-amber-500 shadow-xl relative flex items-center justify-center overflow-hidden animate-pulse">
          {/* Rainbow Sprinkles */}
          <div className="absolute w-2 h-1 bg-red-400 rounded-full top-2 left-3 rotate-45"></div>
          <div className="absolute w-2 h-1 bg-yellow-400 rounded-full top-2 right-4 -rotate-12"></div>
          <div className="absolute w-2 h-1 bg-blue-400 rounded-full bottom-3 left-4 -rotate-45"></div>
          <div className="absolute w-2 h-1 bg-green-400 rounded-full bottom-2 right-3 rotate-30"></div>
          <div className="absolute w-2 h-1 bg-purple-400 rounded-full top-5 left-6 rotate-90"></div>
          <div className="absolute w-2 h-1 bg-pink-400 rounded-full bottom-5 right-5 rotate-15"></div>
          <div className="absolute w-2 h-1 bg-amber-400 rounded-full top-6 right-2 -rotate-30"></div>
          <div className="absolute w-2 h-1 bg-cyan-400 rounded-full bottom-6 left-2 rotate-60"></div>

          {/* Central Shimmering Star */}
          <div className="text-yellow-300 text-lg filter drop-shadow animate-spin" style={{ animationDuration: '6s' }}>
            ✨
          </div>

          {/* Specular highlight */}
          <div className="absolute top-1 left-2 w-5 h-3 bg-white/50 rounded-full transform -rotate-30 blur-[1px]"></div>
        </div>
      </div>
    );
  }

  // 4. Regular or Striped or Wrapped Candy
  const renderCandyShape = () => {
    switch (color) {
      case 'red': // Jelly Bean / Heart
        return (
          <svg viewBox="0 0 100 100" className="w-[88%] h-[88%] filter drop-shadow(0 4px 4px rgba(0,0,0,0.35))">
            <defs>
              <radialGradient id="redGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#ff4d6d" />
                <stop offset="45%" stopColor="#e60039" />
                <stop offset="90%" stopColor="#a30026" />
                <stop offset="100%" stopColor="#660018" />
              </radialGradient>
            </defs>
            <path
              d="M50 82 C20 62 14 42 22 28 C30 14 46 18 50 32 C54 18 70 14 78 28 C86 42 80 62 50 82 Z"
              fill="url(#redGrad)"
              stroke="#ffe3e9"
              strokeWidth="2.5"
            />
            {/* Specular gleam */}
            <path
              d="M32 26 C28 32 30 44 36 50"
              fill="none"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.85"
            />
          </svg>
        );

      case 'orange': // Citrus Lozenge Oval
        return (
          <svg viewBox="0 0 100 100" className="w-[88%] h-[88%] filter drop-shadow(0 4px 4px rgba(0,0,0,0.35))">
            <defs>
              <radialGradient id="orangeGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#ffb703" />
                <stop offset="45%" stopColor="#fb8500" />
                <stop offset="90%" stopColor="#d95d00" />
                <stop offset="100%" stopColor="#993d00" />
              </radialGradient>
            </defs>
            <ellipse
              cx="50"
              cy="50"
              rx="38"
              ry="28"
              fill="url(#orangeGrad)"
              stroke="#fff1db"
              strokeWidth="2.5"
              transform="rotate(-20 50 50)"
            />
            {/* Center swirl */}
            <circle cx="50" cy="50" r="14" fill="none" stroke="#ffe299" strokeWidth="2.5" opacity="0.6" strokeDasharray="4 3" />
            {/* Highlight */}
            <ellipse cx="38" cy="38" rx="14" ry="5" fill="white" opacity="0.8" transform="rotate(-30 38 38)" />
          </svg>
        );

      case 'yellow': // Lemon Teardrop
        return (
          <svg viewBox="0 0 100 100" className="w-[88%] h-[88%] filter drop-shadow(0 4px 4px rgba(0,0,0,0.35))">
            <defs>
              <radialGradient id="yellowGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#fff066" />
                <stop offset="50%" stopColor="#ffca18" />
                <stop offset="90%" stopColor="#e5a000" />
                <stop offset="100%" stopColor="#9e6c00" />
              </radialGradient>
            </defs>
            <path
              d="M50 18 C30 45 22 64 26 76 C32 88 68 88 74 76 C78 64 70 45 50 18 Z"
              fill="url(#yellowGrad)"
              stroke="#ffffea"
              strokeWidth="2.5"
            />
            <path
              d="M40 38 C34 50 34 65 40 74"
              fill="none"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.85"
            />
          </svg>
        );

      case 'green': // Mint Square Pillow
        return (
          <svg viewBox="0 0 100 100" className="w-[88%] h-[88%] filter drop-shadow(0 4px 4px rgba(0,0,0,0.35))">
            <defs>
              <radialGradient id="greenGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#70e000" />
                <stop offset="50%" stopColor="#38b000" />
                <stop offset="90%" stopColor="#007200" />
                <stop offset="100%" stopColor="#004b00" />
              </radialGradient>
            </defs>
            <rect
              x="20"
              y="20"
              width="60"
              height="60"
              rx="18"
              fill="url(#greenGrad)"
              stroke="#e6ffcc"
              strokeWidth="2.5"
            />
            <rect
              x="28"
              y="28"
              width="44"
              height="44"
              rx="10"
              fill="none"
              stroke="#9ef01a"
              strokeWidth="2"
              opacity="0.6"
            />
            {/* Highlight */}
            <path
              d="M26 36 Q36 26 48 26"
              fill="none"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.9"
            />
          </svg>
        );

      case 'blue': // Blueberry Sphere
        return (
          <svg viewBox="0 0 100 100" className="w-[88%] h-[88%] filter drop-shadow(0 4px 4px rgba(0,0,0,0.35))">
            <defs>
              <radialGradient id="blueGrad" cx="32%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="45%" stopColor="#2563eb" />
                <stop offset="85%" stopColor="#1d4ed8" />
                <stop offset="100%" stopColor="#0f2b6e" />
              </radialGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="34"
              fill="url(#blueGrad)"
              stroke="#dbeafe"
              strokeWidth="2.5"
            />
            <circle cx="50" cy="50" r="22" fill="none" stroke="#93c5fd" strokeWidth="1.5" opacity="0.4" />
            {/* Specular gleam */}
            <ellipse cx="38" cy="36" rx="9" ry="5" fill="white" opacity="0.9" transform="rotate(-30 38 36)" />
            <circle cx="56" cy="30" r="2.5" fill="white" opacity="0.75" />
          </svg>
        );

      case 'purple': // Blackberry Gem Hexagon
      default:
        return (
          <svg viewBox="0 0 100 100" className="w-[88%] h-[88%] filter drop-shadow(0 4px 4px rgba(0,0,0,0.35))">
            <defs>
              <radialGradient id="purpleGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="50%" stopColor="#9333ea" />
                <stop offset="90%" stopColor="#6b21a8" />
                <stop offset="100%" stopColor="#3b0764" />
              </radialGradient>
            </defs>
            <polygon
              points="50,16 80,32 80,68 50,84 20,68 20,32"
              fill="url(#purpleGrad)"
              stroke="#f3e8ff"
              strokeWidth="2.5"
            />
            <polygon
              points="50,26 70,38 70,62 50,74 30,62 30,38"
              fill="none"
              stroke="#d8b4fe"
              strokeWidth="1.8"
              opacity="0.6"
            />
            <line x1="28" y1="36" x2="48" y2="24" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
          </svg>
        );
    }
  };

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center transition-transform duration-150 ${className} ${isSelected ? 'scale-115 ring-4 ring-yellow-400 rounded-2xl bg-yellow-400/20 shadow-xl' : ''} ${isHint ? 'animate-candy-wobble' : ''}`}
    >
      {/* Wrapped Candy Wrappers (Left & Right crinkled edges) */}
      {special === 'wrapped' && (
        <>
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-3 h-5 bg-gradient-to-r from-amber-300 via-pink-400 to-transparent clip-path-polygon opacity-90 animate-pulse pointer-events-none" 
               style={{ clipPath: 'polygon(100% 0, 0 50%, 100% 100%)' }} />
          <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-5 bg-gradient-to-l from-amber-300 via-pink-400 to-transparent clip-path-polygon opacity-90 animate-pulse pointer-events-none" 
               style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }} />
          {/* Sparkle bag border */}
          <div className="absolute inset-1 rounded-2xl border-2 border-white/80 animate-ping opacity-30 pointer-events-none" />
        </>
      )}

      {/* Main Base Candy */}
      {renderCandyShape()}

      {/* Striped Candy White Laser Stripes */}
      {special === 'striped_h' && (
        <div className="absolute inset-2 flex flex-col justify-around pointer-events-none overflow-hidden rounded-xl">
          <div className="w-full h-1 bg-white shadow-[0_0_6px_#ffffff] opacity-95"></div>
          <div className="w-full h-1.5 bg-white shadow-[0_0_8px_#ffffff] opacity-95"></div>
          <div className="w-full h-1 bg-white shadow-[0_0_6px_#ffffff] opacity-95"></div>
        </div>
      )}

      {special === 'striped_v' && (
        <div className="absolute inset-2 flex flex-row justify-around pointer-events-none overflow-hidden rounded-xl">
          <div className="h-full w-1 bg-white shadow-[0_0_6px_#ffffff] opacity-95"></div>
          <div className="h-full w-1.5 bg-white shadow-[0_0_8px_#ffffff] opacity-95"></div>
          <div className="h-full w-1 bg-white shadow-[0_0_6px_#ffffff] opacity-95"></div>
        </div>
      )}

      {/* Wrapped Special Badge Sparkle */}
      {special === 'wrapped' && (
        <div className="absolute top-1 right-1 text-xs text-yellow-300 font-extrabold filter drop-shadow">
          💥
        </div>
      )}
    </div>
  );
};
