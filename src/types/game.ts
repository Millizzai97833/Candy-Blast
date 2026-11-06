export type CandyColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple';

export type SpecialType = 'none' | 'striped_h' | 'striped_v' | 'wrapped' | 'color_bomb';

export type ObstacleType = 'none' | 'jelly_single' | 'jelly_double' | 'chocolate' | 'frosting_1' | 'frosting_2';

export type IngredientType = 'none' | 'cherry' | 'hazelnut';

export interface TileData {
  id: string;
  color: CandyColor;
  special: SpecialType;
  row: number;
  col: number;
  isMatched?: boolean;
  isNew?: boolean;
  obstacle?: ObstacleType;
  ingredient?: IngredientType;
}

export type LevelObjectiveType = 
  | 'target_score'
  | 'clear_jelly'
  | 'bring_ingredients'
  | 'clear_chocolate';

export interface LevelObjective {
  type: LevelObjectiveType;
  targetCount: number;
  currentCount: number;
  label: string;
}

export interface LevelConfig {
  levelNumber: number;
  title: string;
  subtitle: string;
  rows: number;
  cols: number;
  moves: number;
  star1: number;
  star2: number;
  star3: number;
  colors: CandyColor[];
  objective: LevelObjectiveType;
  targetScore: number;
  jellyCount?: number;
  ingredientCount?: number;
  chocolateCount?: number;
  initialBoardSetup?: {
    jellyMap?: Record<string, 'single' | 'double'>;
    chocolateCoords?: [number, number][];
    frostingCoords?: [number, number][];
    ingredients?: { col: number; type: IngredientType }[];
  };
}

export type BoosterType = 'hammer' | 'free_switch' | 'color_bomb' | 'extra_moves';

export interface UserStats {
  unlockedLevel: number;
  levelScores: Record<number, number>; // levelNumber -> score
  levelStars: Record<number, number>; // levelNumber -> stars (1-3)
  coins: number;
  lives: number;
  maxLives: number;
  boosters: {
    hammer: number;
    free_switch: number;
    color_bomb: number;
    extra_moves: number;
  };
}

export interface ComboBanner {
  id: string;
  text: string;
  subtext?: string;
  color: string;
}

export interface BeamEffect {
  id: string;
  orientation: 'h' | 'v';
  index: number; // row or col
  color: CandyColor;
}

export interface ExplosionEffect {
  id: string;
  row: number;
  col: number;
  color: CandyColor;
}

export interface RainbowEffect {
  id: string;
  fromRow: number;
  fromCol: number;
  targets: { row: number; col: number }[];
  color: CandyColor;
}
