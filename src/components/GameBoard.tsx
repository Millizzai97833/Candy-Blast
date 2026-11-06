import React, { useState, useRef, useEffect } from 'react';
import { 
  TileData, SpecialType, CandyColor, ComboBanner, 
  BeamEffect, ExplosionEffect, RainbowEffect, BoosterType 
} from '../types/game';
import { CandyIcon } from './CandyIcon';
import { sound } from '../services/sound';

interface GameBoardProps {
  tiles: (TileData | null)[][];
  rows: number;
  cols: number;
  jellyGrid: Record<string, 'single' | 'double'>;
  activeBooster: BoosterType | null;
  onTileSwap: (r1: number, c1: number, r2: number, c2: number) => void;
  onUseBoosterOnTile: (r: number, c: number) => void;
  comboBanner: ComboBanner | null;
  beamEffects: BeamEffect[];
  explosionEffects: ExplosionEffect[];
  rainbowEffects: RainbowEffect[];
  isProcessing: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  tiles,
  rows,
  cols,
  jellyGrid,
  activeBooster,
  onTileSwap,
  onUseBoosterOnTile,
  comboBanner,
  beamEffects,
  explosionEffects,
  rainbowEffects,
  isProcessing
}) => {
  const [selectedPos, setSelectedPos] = useState<{ r: number; c: number } | null>(null);
  const touchStartRef = useRef<{ r: number; c: number; x: number; y: number } | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  // Handle tile click
  const handleTileClick = (r: number, c: number) => {
    if (isProcessing) return;

    // If booster is active (Hammer, etc.)
    if (activeBooster) {
      onUseBoosterOnTile(r, c);
      return;
    }

    if (!selectedPos) {
      const tile = tiles[r]?.[c];
      if (tile && !tile.obstacle) {
        setSelectedPos({ r, c });
        sound.playSwap();
      }
    } else {
      const { r: sr, c: sc } = selectedPos;
      const isAdjacent = (Math.abs(sr - r) === 1 && sc === c) || (Math.abs(sc - c) === 1 && sr === r);

      if (isAdjacent) {
        setSelectedPos(null);
        onTileSwap(sr, sc, r, c);
      } else {
        // Select new tile if valid
        const tile = tiles[r]?.[c];
        if (tile && !tile.obstacle) {
          setSelectedPos({ r, c });
          sound.playSwap();
        } else {
          setSelectedPos(null);
        }
      }
    }
  };

  // Touch swipe support for smooth mobile play
  const handleTouchStart = (e: React.TouchEvent, r: number, c: number) => {
    if (isProcessing || activeBooster) return;
    const touch = e.touches[0];
    touchStartRef.current = { r, c, x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || isProcessing || activeBooster) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const { r, c } = touchStartRef.current;
    touchStartRef.current = null;

    const minSwipe = 24;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > minSwipe) {
      // Horizontal swipe
      const targetC = dx > 0 ? c + 1 : c - 1;
      if (targetC >= 0 && targetC < cols) {
        setSelectedPos(null);
        onTileSwap(r, c, r, targetC);
      }
    } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > minSwipe) {
      // Vertical swipe
      const targetR = dy > 0 ? r + 1 : r - 1;
      if (targetR >= 0 && targetR < rows) {
        setSelectedPos(null);
        onTileSwap(r, c, targetR, c);
      }
    }
  };

  return (
    <div className="relative w-full max-w-[420px] aspect-square mx-auto select-none p-2 flex items-center justify-center">
      {/* Outer Candy Wooden/Caramel Border Frame */}
      <div 
        ref={boardRef}
        className={`relative w-full h-full rounded-3xl p-2.5 shadow-2xl overflow-hidden border-4 border-amber-600/70 transition-all ${
          activeBooster === 'hammer' ? 'cursor-crosshair ring-4 ring-pink-500' : ''
        }`}
        style={{
          background: 'linear-gradient(145deg, #421035 0%, #2b083c 50%, #1e052c 100%)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.7), inset 0 3px 6px rgba(255,255,255,0.2)'
        }}
      >
        {/* Board Tile Grid */}
        <div 
          className="w-full h-full grid gap-1.5"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
          }}
        >
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((_, c) => {
              const tile = tiles[r]?.[c];
              const isSelected = selectedPos?.r === r && selectedPos?.c === c;
              const jellyState = jellyGrid[`${r},${c}`];

              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => handleTileClick(r, c)}
                  onTouchStart={(e) => handleTouchStart(e, r, c)}
                  onTouchEnd={handleTouchEnd}
                  className={`relative rounded-xl flex items-center justify-center transition-all ${
                    (r + c) % 2 === 0 ? 'bg-black/25' : 'bg-black/40'
                  } border border-white/5 hover:border-pink-300/40`}
                >
                  {/* Frosted Jelly Layer Underneath */}
                  {jellyState && (
                    <div 
                      className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none flex items-center justify-center ${
                        jellyState === 'double' 
                          ? 'bg-pink-500/45 border-2 border-pink-300 shadow-inner' 
                          : 'bg-pink-400/25 border border-pink-300/60'
                      }`}
                    >
                      {/* Jelly sheen highlight */}
                      <div className="absolute top-1 left-1 w-2.5 h-1 bg-white/50 rounded-full blur-[0.5px]"></div>
                      {jellyState === 'double' && (
                        <span className="text-[10px] text-pink-100 font-extrabold opacity-75">2x</span>
                      )}
                    </div>
                  )}

                  {/* Active Candy */}
                  {tile && (
                    <div className="w-full h-full flex items-center justify-center animate-candy-drop">
                      <CandyIcon
                        color={tile.color}
                        special={tile.special}
                        obstacle={tile.obstacle}
                        ingredient={tile.ingredient}
                        isSelected={isSelected}
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Laser Beams Animation Overlay */}
        {beamEffects.map((beam) => (
          <div
            key={beam.id}
            className="absolute inset-2 pointer-events-none z-20 flex items-center justify-center"
          >
            {beam.orientation === 'h' ? (
              <div 
                className="absolute left-0 right-0 h-8 rounded-full shadow-[0_0_25px_#ffffff] bg-gradient-to-r from-transparent via-white to-transparent animate-beam-h"
                style={{ top: `${(beam.index / rows) * 100 + (1 / rows) * 50}%`, transform: 'translateY(-50%)' }}
              />
            ) : (
              <div 
                className="absolute top-0 bottom-0 w-8 rounded-full shadow-[0_0_25px_#ffffff] bg-gradient-to-b from-transparent via-white to-transparent animate-beam-v"
                style={{ left: `${(beam.index / cols) * 100 + (1 / cols) * 50}%`, transform: 'translateX(-50%)' }}
              />
            )}
          </div>
        ))}

        {/* Wrapped Candy Explosion Overlay */}
        {explosionEffects.map((exp) => (
          <div
            key={exp.id}
            className="absolute pointer-events-none z-20 w-32 h-32 rounded-full border-4 border-yellow-300 bg-yellow-400/30 shadow-[0_0_35px_#fbbf24] animate-ping"
            style={{
              top: `${(exp.row / rows) * 100 + (1 / rows) * 50}%`,
              left: `${(exp.col / cols) * 100 + (1 / cols) * 50}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}

        {/* Rainbow Color Bomb Lightning Arcs */}
        {rainbowEffects.map((rb) => (
          <svg key={rb.id} className="absolute inset-0 w-full h-full pointer-events-none z-25">
            {rb.targets.map((tgt, i) => {
              const x1 = (rb.fromCol / cols) * 100 + (100 / cols) / 2;
              const y1 = (rb.fromRow / rows) * 100 + (100 / rows) / 2;
              const x2 = (tgt.col / cols) * 100 + (100 / cols) / 2;
              const y2 = (tgt.row / rows) * 100 + (100 / rows) / 2;
              return (
                <g key={i}>
                  <line
                    x1={`${x1}%`}
                    y1={`${y1}%`}
                    x2={`${x2}%`}
                    y2={`${y2}%`}
                    stroke="#ffffff"
                    strokeWidth="4"
                    strokeDasharray="6 4"
                    className="animate-pulse"
                    filter="drop-shadow(0 0 8px #f43f5e)"
                  />
                  <circle cx={`${x2}%`} cy={`${y2}%`} r="6" fill="#fbbf24" className="animate-ping" />
                </g>
              );
            })}
          </svg>
        ))}

        {/* Juicy Combo Voice / Banner Exclamation ("Sweet!", "Tasty!", "Delicious!", "Sugar Crush!") */}
        {comboBanner && (
          <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center animate-bounce">
            <div className="px-6 py-3 rounded-3xl bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 border-4 border-white shadow-2xl transform -rotate-3 filter drop-shadow-2xl">
              <span className="block font-black text-2xl sm:text-3xl text-white tracking-widest uppercase drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] text-center">
                {comboBanner.text}
              </span>
              {comboBanner.subtext && (
                <span className="block font-extrabold text-xs text-yellow-200 tracking-wider text-center mt-0.5">
                  {comboBanner.subtext}
                </span>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
