import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  TileData, LevelConfig, LevelObjective, UserStats, 
  BoosterType, ComboBanner, BeamEffect, ExplosionEffect, 
  RainbowEffect, CandyColor, SpecialType 
} from './types/game';
import { LEVELS } from './services/levels';
import { 
  createInitialBoard, findMatches, getRandomColor, 
  hasPossibleMoves 
} from './services/gameEngine';
import { sound } from './services/sound';
import { startIo } from './services/startioAds';
import { HeaderBar } from './components/HeaderBar';
import { GameBoard } from './components/GameBoard';
import { BoostersBar } from './components/BoostersBar';
import { SagaMap } from './components/SagaMap';
import { StartIoBanner } from './components/StartIoBanner';
import { StartIoInterstitial } from './components/StartIoInterstitial';
import { StartIoRewardedModal } from './components/StartIoRewardedModal';
import { StartIoSdkModal } from './components/StartIoSdkModal';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { GameOverModal } from './components/GameOverModal';
import confetti from 'canvas-confetti';

const STATS_STORAGE_KEY = 'candy_blast_user_stats';

const INITIAL_STATS: UserStats = {
  unlockedLevel: 1,
  levelScores: {},
  levelStars: {},
  coins: 250,
  lives: 5,
  maxLives: 5,
  boosters: {
    hammer: 3,
    free_switch: 2,
    color_bomb: 2,
    extra_moves: 2,
  }
};

export default function App() {
  // Load persisted stats
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_STATS;
  });

  const saveStats = (newStats: UserStats) => {
    setStats(newStats);
    try {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(newStats));
    } catch {}
  };

  // Level & Board State
  const [levelIndex, setLevelIndex] = useState<number>(0);
  const currentLevel = LEVELS[levelIndex] || LEVELS[0];

  const [tiles, setTiles] = useState<(TileData | null)[][]>([]);
  const [jellyGrid, setJellyGrid] = useState<Record<string, 'single' | 'double'>>({});
  const [score, setScore] = useState<number>(0);
  const [movesLeft, setMovesLeft] = useState<number>(currentLevel.moves);
  const [objective, setObjective] = useState<LevelObjective>({
    type: 'target_score',
    targetCount: 1500,
    currentCount: 0,
    label: 'Target Score'
  });

  const [activeBooster, setActiveBooster] = useState<BoosterType | null>(null);
  const [freeSwitchFirstPos, setFreeSwitchFirstPos] = useState<{ r: number; c: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // FX & Overlays
  const [comboBanner, setComboBanner] = useState<ComboBanner | null>(null);
  const [beamEffects, setBeamEffects] = useState<BeamEffect[]>([]);
  const [explosionEffects, setExplosionEffects] = useState<ExplosionEffect[]>([]);
  const [rainbowEffects, setRainbowEffects] = useState<RainbowEffect[]>([]);
  const [bonusFromMoves, setBonusFromMoves] = useState<number>(0);

  // Audio state
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMusicMuted, setIsMusicMuted] = useState<boolean>(false);

  // Modals
  const [showSagaMap, setShowSagaMap] = useState<boolean>(false);
  const [showSdkModal, setShowSdkModal] = useState<boolean>(false);
  const [showLevelComplete, setShowLevelComplete] = useState<boolean>(false);
  const [showGameOver, setShowGameOver] = useState<boolean>(false);
  const [showInterstitial, setShowInterstitial] = useState<boolean>(false);
  const [interstitialReason, setInterstitialReason] = useState<string>('Level Complete');
  const [showRewarded, setShowRewarded] = useState<boolean>(false);
  const [rewardedType, setRewardedType] = useState<'moves' | 'hammer' | 'color_bomb' | 'life'>('moves');

  // Initialize or Reset Level
  const initLevel = useCallback((cfg: LevelConfig) => {
    const { tiles: initTiles, jellyGrid: initJellies } = createInitialBoard(cfg);
    setTiles(initTiles);
    setJellyGrid(initJellies);
    setScore(0);
    setMovesLeft(cfg.moves);
    setActiveBooster(null);
    setFreeSwitchFirstPos(null);
    setIsProcessing(false);
    setShowLevelComplete(false);
    setShowGameOver(false);
    setBonusFromMoves(0);

    // Setup objective
    let obj: LevelObjective;
    switch (cfg.objective) {
      case 'clear_jelly': {
        const count = Object.keys(initJellies).length;
        obj = {
          type: 'clear_jelly',
          targetCount: count,
          currentCount: count,
          label: 'Clear Jelly'
        };
        break;
      }
      case 'bring_ingredients':
        obj = {
          type: 'bring_ingredients',
          targetCount: cfg.ingredientCount || 2,
          currentCount: 0,
          label: 'Collect Ingredients'
        };
        break;
      case 'clear_chocolate':
        obj = {
          type: 'clear_chocolate',
          targetCount: cfg.chocolateCount || 8,
          currentCount: cfg.chocolateCount || 8,
          label: 'Break Chocolate'
        };
        break;
      case 'target_score':
      default:
        obj = {
          type: 'target_score',
          targetCount: cfg.targetScore,
          currentCount: 0,
          label: 'Target Score'
        };
        break;
    }
    setObjective(obj);
  }, []);

  useEffect(() => {
    initLevel(currentLevel);
  }, [currentLevel, initLevel]);

  // Audio toggles
  const handleToggleSound = () => {
    const muted = sound.toggleSound();
    setIsMuted(muted);
  };

  const handleToggleMusic = () => {
    const muted = sound.toggleMusic();
    setIsMusicMuted(muted);
  };

  // Helper sleep
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Trigger combo banners
  const showComboPopup = (comboCount: number) => {
    let text = 'Sweet!';
    let subtext = 'Combo x2';
    if (comboCount === 3) {
      text = 'Tasty!';
      subtext = 'Combo x3';
    } else if (comboCount === 4) {
      text = 'Delicious!';
      subtext = 'Combo x4';
    } else if (comboCount >= 5) {
      text = 'Sugar Crush!';
      subtext = `Combo x${comboCount} Mega Blast!`;
    }

    sound.playSweet();
    setComboBanner({ id: String(Date.now()), text, subtext, color: '#ec4899' });
    setTimeout(() => {
      setComboBanner(null);
    }, 1400);
  };

  // Cascade and match execution loop
  const runCascadeLoop = async (
    currentBoard: (TileData | null)[][],
    currentJellies: Record<string, 'single' | 'double'>,
    currentScore: number,
    currentObj: LevelObjective,
    remainingMoves: number
  ) => {
    let board = currentBoard.map(row => [...row]);
    let jellies = { ...currentJellies };
    let scoreAccumulator = currentScore;
    let objAccumulator = { ...currentObj };
    let comboCount = 0;

    const { rows, cols, colors } = currentLevel;

    while (true) {
      // Find matches
      const { matches, specialCreations } = findMatches(board, rows, cols);
      if (matches.length === 0) break;

      comboCount++;
      sound.playMatch(comboCount);

      if (comboCount >= 2) {
        showComboPopup(comboCount);
      }

      // 1. Calculate points
      const points = matches.length * 60 * comboCount;
      scoreAccumulator += points;

      if (objAccumulator.type === 'target_score') {
        objAccumulator.currentCount = scoreAccumulator;
      }

      // 2. Mark tiles for clearing and detect special triggers
      const toRemove = new Set<string>();
      matches.forEach(m => toRemove.add(`${m.row},${m.col}`));

      // Check if any matched tile is a special candy
      matches.forEach(m => {
        const t = board[m.row]?.[m.col];
        if (t?.special === 'striped_h') {
          sound.playLaser();
          setBeamEffects(prev => [...prev, { id: `beam_h_${Date.now()}_${m.row}`, orientation: 'h', index: m.row, color: t.color }]);
          for (let c = 0; c < cols; c++) toRemove.add(`${m.row},${c}`);
        } else if (t?.special === 'striped_v') {
          sound.playLaser();
          setBeamEffects(prev => [...prev, { id: `beam_v_${Date.now()}_${m.col}`, orientation: 'v', index: m.col, color: t.color }]);
          for (let r = 0; r < rows; r++) toRemove.add(`${r},${m.col}`);
        } else if (t?.special === 'wrapped') {
          sound.playExplosion();
          setExplosionEffects(prev => [...prev, { id: `exp_${Date.now()}_${m.row}_${m.col}`, row: m.row, col: m.col, color: t.color }]);
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = m.row + dr;
              const nc = m.col + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                toRemove.add(`${nr},${nc}`);
              }
            }
          }
        }
      });

      // Clear beam/explosion overlays after 350ms
      setTimeout(() => {
        setBeamEffects([]);
        setExplosionEffects([]);
      }, 400);

      // 3. Clear jelly underneath matched tiles
      toRemove.forEach(key => {
        if (jellies[key]) {
          if (jellies[key] === 'double') {
            jellies[key] = 'single';
          } else {
            delete jellies[key];
            if (objAccumulator.type === 'clear_jelly') {
              objAccumulator.currentCount = Math.max(0, objAccumulator.currentCount - 1);
            }
          }
        }
      });

      // 4. Break adjacent chocolate obstacles
      toRemove.forEach(key => {
        const [r, c] = key.split(',').map(Number);
        const adj = [
          [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]
        ];
        adj.forEach(([ar, ac]) => {
          if (ar >= 0 && ar < rows && ac >= 0 && ac < cols) {
            const neighbor = board[ar]?.[ac];
            if (neighbor?.obstacle === 'chocolate') {
              board[ar][ac] = null;
              if (objAccumulator.type === 'clear_chocolate') {
                objAccumulator.currentCount = Math.max(0, objAccumulator.currentCount - 1);
              }
            }
          }
        });
      });

      // 5. Update board: remove matched candies (except where new special is formed)
      const specialMap = new Map<string, { special: SpecialType; color: CandyColor }>();
      specialCreations.forEach(sc => {
        specialMap.set(`${sc.row},${sc.col}`, { special: sc.special, color: sc.color });
      });

      for (const key of toRemove) {
        const [r, c] = key.split(',').map(Number);
        if (specialMap.has(key)) {
          const spec = specialMap.get(key)!;
          board[r][c] = {
            id: `special_${Date.now()}_${r}_${c}`,
            color: spec.color,
            special: spec.special,
            row: r,
            col: c
          };
        } else {
          board[r][c] = null;
        }
      }

      setTiles([...board.map(r => [...r])]);
      setJellyGrid({ ...jellies });
      setScore(scoreAccumulator);
      setObjective({ ...objAccumulator });

      await sleep(200);

      // 6. Drop candies down column by column
      for (let c = 0; c < cols; c++) {
        let emptyRow = rows - 1;
        for (let r = rows - 1; r >= 0; r--) {
          if (board[r][c] !== null) {
            if (r !== emptyRow) {
              board[emptyRow][c] = {
                ...board[r][c]!,
                row: emptyRow,
                col: c
              };
              board[r][c] = null;
            }
            emptyRow--;
          }
        }

        // Spawn new candies at top
        for (let r = emptyRow; r >= 0; r--) {
          board[r][c] = {
            id: `spawn_${Date.now()}_${r}_${c}_${Math.random()}`,
            color: getRandomColor(colors),
            special: 'none',
            row: r,
            col: c,
            isNew: true
          };
        }
      }

      // Check ingredient collection at bottom row
      for (let c = 0; c < cols; c++) {
        const btm = board[rows - 1][c];
        if (btm?.ingredient && btm.ingredient !== 'none') {
          sound.playSweet();
          board[rows - 1][c] = null;
          if (objAccumulator.type === 'bring_ingredients') {
            objAccumulator.currentCount = Math.min(
              objAccumulator.targetCount,
              objAccumulator.currentCount + 1
            );
          }
          // Drop column down once more
          for (let r = rows - 2; r >= 0; r--) {
            if (board[r][c] !== null) {
              board[r + 1][c] = { ...board[r][c]!, row: r + 1 };
              board[r][c] = null;
            }
          }
          board[0][c] = {
            id: `ing_fill_${Date.now()}_${c}`,
            color: getRandomColor(colors),
            special: 'none',
            row: 0,
            col: c
          };
        }
      }

      setTiles([...board.map(r => [...r])]);
      setObjective({ ...objAccumulator });
      await sleep(240);
    }

    // Check Win Condition
    let isWon = false;
    if (objAccumulator.type === 'target_score') {
      isWon = scoreAccumulator >= objAccumulator.targetCount;
    } else if (objAccumulator.type === 'clear_jelly') {
      isWon = objAccumulator.currentCount === 0;
    } else if (objAccumulator.type === 'bring_ingredients') {
      isWon = objAccumulator.currentCount >= objAccumulator.targetCount;
    } else if (objAccumulator.type === 'clear_chocolate') {
      isWon = objAccumulator.currentCount === 0;
    }

    if (isWon) {
      // Sugar Crush Victory!
      const bonus = remainingMoves * 1000;
      const finalScore = scoreAccumulator + bonus;
      setBonusFromMoves(bonus);
      setScore(finalScore);

      const stars = finalScore >= currentLevel.star3 ? 3 : finalScore >= currentLevel.star2 ? 2 : 1;
      
      // Update User Stats
      const nextUnlocked = Math.max(stats.unlockedLevel, currentLevel.levelNumber + 1);
      const prevHigh = stats.levelScores[currentLevel.levelNumber] || 0;
      const prevStars = stats.levelStars[currentLevel.levelNumber] || 0;

      const newStats: UserStats = {
        ...stats,
        unlockedLevel: nextUnlocked,
        coins: stats.coins + 50 * stars,
        levelScores: {
          ...stats.levelScores,
          [currentLevel.levelNumber]: Math.max(prevHigh, finalScore)
        },
        levelStars: {
          ...stats.levelStars,
          [currentLevel.levelNumber]: Math.max(prevStars, stars)
        }
      };
      saveStats(newStats);

      sound.playVictory();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5 }
        });
      } catch {}

      await sleep(600);
      setShowLevelComplete(true);

      // Trigger Start.io Interstitial Ad on level victory
      setTimeout(() => {
        setInterstitialReason(`Level ${currentLevel.levelNumber} Victory`);
        setShowInterstitial(true);
      }, 1500);

    } else if (remainingMoves <= 0) {
      // Out of moves - Game Over
      sound.playGameOver();
      // Deduct 1 life
      const newStats: UserStats = {
        ...stats,
        lives: Math.max(0, stats.lives - 1)
      };
      saveStats(newStats);

      await sleep(400);
      setShowGameOver(true);
    }

    setIsProcessing(false);
  };

  // Handle Tile Swap
  const handleTileSwap = async (r1: number, c1: number, r2: number, c2: number) => {
    if (isProcessing) return;
    setIsProcessing(true);

    const t1 = tiles[r1]?.[c1];
    const t2 = tiles[r2]?.[c2];

    if (!t1 || !t2 || t1.obstacle || t2.obstacle) {
      setIsProcessing(false);
      return;
    }

    const { rows, cols } = currentLevel;

    // Check Special Combos
    // A: Color Bomb + Color Bomb (Wipes entire board)
    if (t1.special === 'color_bomb' && t2.special === 'color_bomb') {
      sound.playColorBomb();
      const newBoard = tiles.map(r => r.map(() => null));
      setTiles(newBoard);
      const points = rows * cols * 200;
      setScore(prev => prev + points);
      setMovesLeft(prev => Math.max(0, prev - 1));
      await sleep(300);
      await runCascadeLoop(newBoard, jellyGrid, score + points, objective, movesLeft - 1);
      return;
    }

    // B: Color Bomb + Striped/Normal
    if (t1.special === 'color_bomb' || t2.special === 'color_bomb') {
      const bombTile = t1.special === 'color_bomb' ? t1 : t2;
      const otherTile = t1.special === 'color_bomb' ? t2 : t1;
      sound.playColorBomb();

      // Rainbow Lightning Effect
      const targetCandies: { row: number; col: number }[] = [];
      tiles.forEach(row => {
        row.forEach(cell => {
          if (cell && cell.color === otherTile.color && !cell.obstacle) {
            targetCandies.push({ row: cell.row, col: cell.col });
          }
        });
      });

      setRainbowEffects([{
        id: `rb_${Date.now()}`,
        fromRow: bombTile.row,
        fromCol: bombTile.col,
        targets: targetCandies,
        color: otherTile.color
      }]);

      await sleep(350);
      setRainbowEffects([]);

      // Clear all tiles of that color
      const newBoard = tiles.map(r => [...r]);
      newBoard[bombTile.row][bombTile.col] = null;

      targetCandies.forEach(t => {
        newBoard[t.row][t.col] = null;
      });

      const points = targetCandies.length * 150;
      setScore(prev => prev + points);
      setMovesLeft(prev => Math.max(0, prev - 1));
      await runCascadeLoop(newBoard, jellyGrid, score + points, objective, movesLeft - 1);
      return;
    }

    // C: Striped + Striped (Row + Col Cross)
    if (
      (t1.special === 'striped_h' || t1.special === 'striped_v') &&
      (t2.special === 'striped_h' || t2.special === 'striped_v')
    ) {
      sound.playLaser();
      setBeamEffects([
        { id: `b1_${Date.now()}`, orientation: 'h', index: r2, color: t2.color },
        { id: `b2_${Date.now()}`, orientation: 'v', index: c2, color: t2.color }
      ]);
      const newBoard = tiles.map(r => [...r]);
      for (let c = 0; c < cols; c++) newBoard[r2][c] = null;
      for (let r = 0; r < rows; r++) newBoard[r][c2] = null;

      setMovesLeft(prev => Math.max(0, prev - 1));
      await sleep(350);
      setBeamEffects([]);
      await runCascadeLoop(newBoard, jellyGrid, score + 1200, objective, movesLeft - 1);
      return;
    }

    // Normal Swap: Swap and test if match exists
    const testBoard = tiles.map(r => [...r]);
    testBoard[r1][c1] = { ...t2, row: r1, col: c1 };
    testBoard[r2][c2] = { ...t1, row: r2, col: c2 };

    const { matches } = findMatches(testBoard, rows, cols, {
      r: r2, c: c2, dr: r2 - r1, dc: c2 - c1
    });

    if (matches.length > 0) {
      // Valid Move!
      sound.playSwap();
      setTiles(testBoard);
      const remaining = movesLeft - 1;
      setMovesLeft(remaining);
      await sleep(150);
      await runCascadeLoop(testBoard, jellyGrid, score, objective, remaining);
    } else {
      // Invalid Move: snap back with bounce
      sound.playInvalidSwap();
      setIsProcessing(false);
    }
  };

  // Booster click on tile
  const handleUseBoosterOnTile = async (r: number, c: number) => {
    if (!activeBooster) return;

    if (activeBooster === 'hammer') {
      // Hammer smashes target tile
      sound.playHammer();
      const newBoard = tiles.map(row => [...row]);
      newBoard[r][c] = null;
      setTiles(newBoard);

      // Decrement hammer
      const newStats: UserStats = {
        ...stats,
        boosters: { ...stats.boosters, hammer: Math.max(0, stats.boosters.hammer - 1) }
      };
      saveStats(newStats);
      setActiveBooster(null);

      // Check jelly under hammer
      const key = `${r},${c}`;
      const newJellies = { ...jellyGrid };
      if (newJellies[key]) {
        delete newJellies[key];
        setJellyGrid(newJellies);
      }

      await runCascadeLoop(newBoard, newJellies, score + 200, objective, movesLeft);
    } else if (activeBooster === 'color_bomb') {
      // Turn tile into color bomb
      const newBoard = tiles.map(row => [...row]);
      newBoard[r][c] = {
        id: `booster_cb_${Date.now()}`,
        color: getRandomColor(currentLevel.colors),
        special: 'color_bomb',
        row: r,
        col: c
      };
      setTiles(newBoard);
      sound.playColorBomb();

      const newStats: UserStats = {
        ...stats,
        boosters: { ...stats.boosters, color_bomb: Math.max(0, stats.boosters.color_bomb - 1) }
      };
      saveStats(newStats);
      setActiveBooster(null);
    } else if (activeBooster === 'free_switch') {
      if (!freeSwitchFirstPos) {
        setFreeSwitchFirstPos({ r, c });
      } else {
        const { r: r1, c: c1 } = freeSwitchFirstPos;
        const newBoard = tiles.map(row => [...row]);
        const t1 = newBoard[r1][c1];
        const t2 = newBoard[r][c];
        if (t1 && t2) {
          newBoard[r1][c1] = { ...t2, row: r1, col: c1 };
          newBoard[r][c] = { ...t1, row: r, col: c };
          setTiles(newBoard);
          sound.playSwap();

          const newStats: UserStats = {
            ...stats,
            boosters: { ...stats.boosters, free_switch: Math.max(0, stats.boosters.free_switch - 1) }
          };
          saveStats(newStats);
          setActiveBooster(null);
          setFreeSwitchFirstPos(null);
          await runCascadeLoop(newBoard, jellyGrid, score, objective, movesLeft);
        }
      }
    }
  };

  // Booster selection from footer
  const handleSelectBooster = (type: BoosterType) => {
    if (type === 'extra_moves') {
      if (stats.boosters.extra_moves > 0) {
        setMovesLeft(prev => prev + 5);
        sound.playSweet();
        const newStats: UserStats = {
          ...stats,
          boosters: { ...stats.boosters, extra_moves: stats.boosters.extra_moves - 1 }
        };
        saveStats(newStats);
      } else {
        // Trigger rewarded ad for moves
        setRewardedType('moves');
        setShowRewarded(true);
      }
      return;
    }

    if (stats.boosters[type] > 0) {
      setActiveBooster(activeBooster === type ? null : type);
      setFreeSwitchFirstPos(null);
    } else {
      // Trigger rewarded ad for that booster
      setRewardedType(type === 'hammer' ? 'hammer' : 'color_bomb');
      setShowRewarded(true);
    }
  };

  // Rewarded Video Ad Claimed
  const handleRewardClaimed = (type: 'moves' | 'hammer' | 'color_bomb' | 'life') => {
    if (type === 'moves') {
      setMovesLeft(prev => prev + 5);
      setShowGameOver(false);
    } else if (type === 'life') {
      const newStats: UserStats = { ...stats, lives: stats.maxLives };
      saveStats(newStats);
    } else if (type === 'hammer') {
      const newStats: UserStats = {
        ...stats,
        boosters: { ...stats.boosters, hammer: stats.boosters.hammer + 1 }
      };
      saveStats(newStats);
    } else if (type === 'color_bomb') {
      const newStats: UserStats = {
        ...stats,
        boosters: { ...stats.boosters, color_bomb: stats.boosters.color_bomb + 1 }
      };
      saveStats(newStats);
    }
  };

  // Level progression
  const handleNextLevel = () => {
    const nextIdx = Math.min(LEVELS.length - 1, levelIndex + 1);
    setLevelIndex(nextIdx);
    setShowLevelComplete(false);
  };

  const handleSelectLevelFromMap = (lvl: LevelConfig) => {
    const idx = LEVELS.findIndex(l => l.levelNumber === lvl.levelNumber);
    if (idx !== -1) {
      setLevelIndex(idx);
      setShowSagaMap(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2b083c] via-[#1a0426] to-[#0d0114] text-white flex flex-col justify-between overflow-x-hidden relative font-sans">
      
      {/* Background Sweet Starry Aura */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-900/20 via-purple-950/20 to-black pointer-events-none" />

      {/* TOP HUD BAR */}
      <HeaderBar
        currentLevel={currentLevel}
        score={score}
        movesLeft={movesLeft}
        objective={objective}
        onOpenMap={() => setShowSagaMap(true)}
        onOpenSdkModal={() => setShowSdkModal(true)}
        isMuted={isMuted}
        isMusicMuted={isMusicMuted}
        onToggleSound={handleToggleSound}
        onToggleMusic={handleToggleMusic}
      />

      {/* CENTER INTERACTIVE GAME BOARD */}
      <main className="flex-1 flex flex-col items-center justify-center p-1 relative z-10">
        <GameBoard
          tiles={tiles}
          rows={currentLevel.rows}
          cols={currentLevel.cols}
          jellyGrid={jellyGrid}
          activeBooster={activeBooster}
          onTileSwap={handleTileSwap}
          onUseBoosterOnTile={handleUseBoosterOnTile}
          comboBanner={comboBanner}
          beamEffects={beamEffects}
          explosionEffects={explosionEffects}
          rainbowEffects={rainbowEffects}
          isProcessing={isProcessing}
        />

        {/* Active Booster Prompt Banner */}
        {activeBooster && (
          <div className="mt-1 px-4 py-1.5 rounded-full bg-pink-600/90 border border-yellow-300 text-xs font-black text-white flex items-center gap-2 animate-pulse shadow-lg">
            <span>
              {activeBooster === 'hammer' && '🔨 Click any candy or obstacle to smash!'}
              {activeBooster === 'color_bomb' && '🌈 Click any tile to place Color Bomb!'}
              {activeBooster === 'free_switch' && (freeSwitchFirstPos ? '🔀 Click 2nd candy to swap!' : '🔀 Click 1st candy to swap!')}
            </span>
            <button
              onClick={() => {
                setActiveBooster(null);
                setFreeSwitchFirstPos(null);
              }}
              className="text-[10px] bg-black/40 hover:bg-black/60 px-2 py-0.5 rounded text-white font-mono"
            >
              Cancel
            </button>
          </div>
        )}
      </main>

      {/* BOTTOM BOOSTERS ROW */}
      <BoostersBar
        stats={stats}
        activeBooster={activeBooster}
        onSelectBooster={handleSelectBooster}
        onWatchAdForBooster={() => {
          setRewardedType('moves');
          setShowRewarded(true);
        }}
      />

      {/* BOTTOM START.IO ADS BANNER */}
      <footer className="w-full">
        <StartIoBanner onOpenSdkModal={() => setShowSdkModal(true)} />
      </footer>

      {/* MODALS */}
      {showSagaMap && (
        <SagaMap
          stats={stats}
          onSelectLevel={handleSelectLevelFromMap}
          onClose={() => setShowSagaMap(false)}
          onOpenSdkModal={() => setShowSdkModal(true)}
          onWatchAdForReward={(type) => {
            setRewardedType(type);
            setShowRewarded(true);
          }}
        />
      )}

      {showSdkModal && (
        <StartIoSdkModal
          isOpen={showSdkModal}
          onClose={() => setShowSdkModal(false)}
          onTriggerInterstitial={() => {
            setInterstitialReason('Manual Test');
            setShowInterstitial(true);
          }}
          onTriggerRewarded={() => {
            setRewardedType('moves');
            setShowRewarded(true);
          }}
        />
      )}

      {showInterstitial && (
        <StartIoInterstitial
          isOpen={showInterstitial}
          onClose={() => setShowInterstitial(false)}
          triggerReason={interstitialReason}
        />
      )}

      {showRewarded && (
        <StartIoRewardedModal
          isOpen={showRewarded}
          rewardType={rewardedType}
          onClose={() => setShowRewarded(false)}
          onRewardClaimed={handleRewardClaimed}
        />
      )}

      {showLevelComplete && (
        <LevelCompleteModal
          isOpen={showLevelComplete}
          level={currentLevel}
          score={score}
          stars={score >= currentLevel.star3 ? 3 : score >= currentLevel.star2 ? 2 : 1}
          bonusFromMoves={bonusFromMoves}
          onNextLevel={handleNextLevel}
          onReplay={() => initLevel(currentLevel)}
          onOpenMap={() => setShowSagaMap(true)}
        />
      )}

      {showGameOver && (
        <GameOverModal
          isOpen={showGameOver}
          level={currentLevel}
          objective={objective}
          score={score}
          onWatchAdForMoves={() => {
            setRewardedType('moves');
            setShowRewarded(true);
          }}
          onRetry={() => initLevel(currentLevel)}
          onOpenMap={() => setShowSagaMap(true)}
        />
      )}

    </div>
  );
}
