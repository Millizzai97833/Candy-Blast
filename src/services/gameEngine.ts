import { 
  TileData, CandyColor, SpecialType, ObstacleType, 
  IngredientType, LevelConfig 
} from '../types/game';

export interface MatchResult {
  matches: { row: number; col: number }[];
  specialCreations: {
    row: number;
    col: number;
    special: SpecialType;
    color: CandyColor;
  }[];
}

// Generate random candy color from available colors for level
export function getRandomColor(colors: CandyColor[]): CandyColor {
  return colors[Math.floor(Math.random() * colors.length)];
}

// Initialize a fresh board with no initial matches
export function createInitialBoard(config: LevelConfig): {
  tiles: (TileData | null)[][];
  jellyGrid: Record<string, 'single' | 'double'>;
} {
  const { rows, cols, colors, initialBoardSetup } = config;
  const tiles: (TileData | null)[][] = [];
  const jellyGrid: Record<string, 'single' | 'double'> = {
    ...(initialBoardSetup?.jellyMap || {})
  };

  // Pre-place chocolate if any
  const chocolateSet = new Set<string>();
  initialBoardSetup?.chocolateCoords?.forEach(([r, c]) => {
    chocolateSet.add(`${r},${c}`);
  });

  // Pre-place ingredients if any
  const ingredientCols = initialBoardSetup?.ingredients || [];

  for (let r = 0; r < rows; r++) {
    tiles[r] = [];
    for (let c = 0; c < cols; c++) {
      const isChoc = chocolateSet.has(`${r},${c}`);
      const ing = r === 0 ? ingredientCols.find(i => i.col === c) : undefined;

      if (isChoc) {
        tiles[r][c] = {
          id: `tile_${r}_${c}_${Date.now()}_${Math.random()}`,
          color: getRandomColor(colors),
          special: 'none',
          row: r,
          col: c,
          obstacle: 'chocolate'
        };
      } else if (ing) {
        tiles[r][c] = {
          id: `ing_${r}_${c}_${Date.now()}_${Math.random()}`,
          color: getRandomColor(colors),
          special: 'none',
          row: r,
          col: c,
          ingredient: ing.type
        };
      } else {
        // Find a color that doesn't form an immediate match-3 with left and top
        let colCandidate: CandyColor = getRandomColor(colors);
        let attempts = 0;
        while (attempts < 20) {
          const matchLeft = c >= 2 && 
            tiles[r][c - 1]?.color === colCandidate && 
            tiles[r][c - 2]?.color === colCandidate;
          const matchTop = r >= 2 && 
            tiles[r - 1]?.[c]?.color === colCandidate && 
            tiles[r - 2]?.[c]?.color === colCandidate;

          if (!matchLeft && !matchTop) {
            break;
          }
          colCandidate = getRandomColor(colors);
          attempts++;
        }

        tiles[r][c] = {
          id: `tile_${r}_${c}_${Date.now()}_${Math.random()}`,
          color: colCandidate,
          special: 'none',
          row: r,
          col: c
        };
      }
    }
  }

  return { tiles, jellyGrid };
}

// Check board for matches (horizontal and vertical)
export function findMatches(
  tiles: (TileData | null)[][],
  rows: number,
  cols: number,
  lastSwapCoord?: { r: number; c: number; dr: number; dc: number }
): MatchResult {
  const matchedCoords = new Set<string>();
  const specialCreations: {
    row: number;
    col: number;
    special: SpecialType;
    color: CandyColor;
  }[] = [];

  // Group horizontal matches
  const hLines: { r: number; startC: number; count: number; color: CandyColor }[] = [];
  for (let r = 0; r < rows; r++) {
    let matchCount = 1;
    for (let c = 0; c < cols; c++) {
      const current = tiles[r][c];
      const next = c < cols - 1 ? tiles[r][c + 1] : null;

      if (
        current && 
        next && 
        !current.obstacle && 
        !next.obstacle && 
        !current.ingredient && 
        !next.ingredient && 
        current.color === next.color
      ) {
        matchCount++;
      } else {
        if (matchCount >= 3 && current) {
          hLines.push({
            r,
            startC: c - matchCount + 1,
            count: matchCount,
            color: current.color
          });
          for (let i = 0; i < matchCount; i++) {
            matchedCoords.add(`${r},${c - matchCount + 1 + i}`);
          }
        }
        matchCount = 1;
      }
    }
  }

  // Group vertical matches
  const vLines: { c: number; startR: number; count: number; color: CandyColor }[] = [];
  for (let c = 0; c < cols; c++) {
    let matchCount = 1;
    for (let r = 0; r < rows; r++) {
      const current = tiles[r][c];
      const next = r < rows - 1 ? tiles[r + 1][c] : null;

      if (
        current && 
        next && 
        !current.obstacle && 
        !next.obstacle && 
        !current.ingredient && 
        !next.ingredient && 
        current.color === next.color
      ) {
        matchCount++;
      } else {
        if (matchCount >= 3 && current) {
          vLines.push({
            c,
            startR: r - matchCount + 1,
            count: matchCount,
            color: current.color
          });
          for (let i = 0; i < matchCount; i++) {
            matchedCoords.add(`${r - matchCount + 1 + i},${c}`);
          }
        }
        matchCount = 1;
      }
    }
  }

  // Detect 5 in a row -> Color Bomb
  const colorBombPlaced = new Set<string>();

  for (const h of hLines) {
    if (h.count >= 5) {
      const targetC = lastSwapCoord && lastSwapCoord.r === h.r && lastSwapCoord.c >= h.startC && lastSwapCoord.c < h.startC + h.count
        ? lastSwapCoord.c
        : h.startC + Math.floor(h.count / 2);
      specialCreations.push({
        row: h.r,
        col: targetC,
        special: 'color_bomb',
        color: h.color
      });
      colorBombPlaced.add(`${h.r},${targetC}`);
    }
  }

  for (const v of vLines) {
    if (v.count >= 5) {
      const targetR = lastSwapCoord && lastSwapCoord.c === v.c && lastSwapCoord.r >= v.startR && lastSwapCoord.r < v.startR + v.count
        ? lastSwapCoord.r
        : v.startR + Math.floor(v.count / 2);
      if (!colorBombPlaced.has(`${targetR},${v.c}`)) {
        specialCreations.push({
          row: targetR,
          col: v.c,
          special: 'color_bomb',
          color: v.color
        });
        colorBombPlaced.add(`${targetR},${v.c}`);
      }
    }
  }

  // Detect T / L shapes -> Wrapped Candy (intersection of H and V line)
  const wrappedPlaced = new Set<string>();
  for (const h of hLines) {
    if (h.count >= 5) continue; // Already color bomb
    for (const v of vLines) {
      if (v.count >= 5) continue;
      if (h.color === v.color) {
        // Check if they intersect
        if (v.c >= h.startC && v.c < h.startC + h.count && h.r >= v.startR && h.r < v.startR + v.count) {
          const key = `${h.r},${v.c}`;
          if (!colorBombPlaced.has(key) && !wrappedPlaced.has(key)) {
            specialCreations.push({
              row: h.r,
              col: v.c,
              special: 'wrapped',
              color: h.color
            });
            wrappedPlaced.add(key);
          }
        }
      }
    }
  }

  // Detect 4 in a row -> Striped Candy (Horizontal or Vertical)
  for (const h of hLines) {
    if (h.count === 4) {
      // Check if wrapped wasn't made here
      let hasSpecial = false;
      for (let i = 0; i < h.count; i++) {
        if (wrappedPlaced.has(`${h.r},${h.startC + i}`) || colorBombPlaced.has(`${h.r},${h.startC + i}`)) {
          hasSpecial = true;
          break;
        }
      }
      if (!hasSpecial) {
        const targetC = lastSwapCoord && lastSwapCoord.r === h.r && lastSwapCoord.c >= h.startC && lastSwapCoord.c < h.startC + h.count
          ? lastSwapCoord.c
          : h.startC + 1;
        specialCreations.push({
          row: h.r,
          col: targetC,
          special: 'striped_v', // horizontal match creates vertical striped candy (clears col)
          color: h.color
        });
      }
    }
  }

  for (const v of vLines) {
    if (v.count === 4) {
      let hasSpecial = false;
      for (let i = 0; i < v.count; i++) {
        if (wrappedPlaced.has(`${v.startR + i},${v.c}`) || colorBombPlaced.has(`${v.startR + i},${v.c}`)) {
          hasSpecial = true;
          break;
        }
      }
      if (!hasSpecial) {
        const targetR = lastSwapCoord && lastSwapCoord.c === v.c && lastSwapCoord.r >= v.startR && lastSwapCoord.r < v.startR + v.count
          ? lastSwapCoord.r
          : v.startR + 1;
        specialCreations.push({
          row: targetR,
          col: v.c,
          special: 'striped_h', // vertical match creates horizontal striped candy
          color: v.color
        });
      }
    }
  }

  const matches = Array.from(matchedCoords).map((k) => {
    const [r, c] = k.split(',').map(Number);
    return { row: r, col: c };
  });

  return { matches, specialCreations };
}

// Check if any valid move exists on current board
export function hasPossibleMoves(tiles: (TileData | null)[][], rows: number, cols: number): boolean {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const current = tiles[r][c];
      if (!current || current.obstacle || current.ingredient) continue;

      if (current.special === 'color_bomb') return true;

      // Check swap right
      if (c < cols - 1) {
        const right = tiles[r][c + 1];
        if (right && !right.obstacle && !right.ingredient) {
          if (right.special === 'color_bomb') return true;
          // Swap and test
          tiles[r][c] = right;
          tiles[r][c + 1] = current;
          const { matches } = findMatches(tiles, rows, cols);
          tiles[r][c] = current;
          tiles[r][c + 1] = right;
          if (matches.length > 0) return true;
        }
      }

      // Check swap down
      if (r < rows - 1) {
        const down = tiles[r + 1][c];
        if (down && !down.obstacle && !down.ingredient) {
          if (down.special === 'color_bomb') return true;
          tiles[r][c] = down;
          tiles[r + 1][c] = current;
          const { matches } = findMatches(tiles, rows, cols);
          tiles[r][c] = current;
          tiles[r + 1][c] = down;
          if (matches.length > 0) return true;
        }
      }
    }
  }
  return false;
}
