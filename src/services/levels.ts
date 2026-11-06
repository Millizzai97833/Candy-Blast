import { LevelConfig, CandyColor } from '../types/game';

const ALL_COLORS: CandyColor[] = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
const EASY_COLORS: CandyColor[] = ['red', 'orange', 'yellow', 'green'];
const MID_COLORS: CandyColor[] = ['red', 'orange', 'yellow', 'green', 'blue'];

export const LEVELS: LevelConfig[] = [
  {
    levelNumber: 1,
    title: 'Sugar Starter',
    subtitle: 'Match 3 or more sweet candies to score points!',
    rows: 8,
    cols: 8,
    moves: 22,
    star1: 1500,
    star2: 3000,
    star3: 5000,
    colors: EASY_COLORS,
    objective: 'target_score',
    targetScore: 2000,
  },
  {
    levelNumber: 2,
    title: 'Striped Delight',
    subtitle: 'Clear all the frosted jelly underneath the candies!',
    rows: 8,
    cols: 8,
    moves: 20,
    star1: 2500,
    star2: 4500,
    star3: 7500,
    colors: MID_COLORS,
    objective: 'clear_jelly',
    targetScore: 3000,
    jellyCount: 16,
    initialBoardSetup: {
      jellyMap: {
        '2,2': 'single', '2,3': 'single', '2,4': 'single', '2,5': 'single',
        '3,2': 'single', '3,3': 'single', '3,4': 'single', '3,5': 'single',
        '4,2': 'single', '4,3': 'single', '4,4': 'single', '4,5': 'single',
        '5,2': 'single', '5,3': 'single', '5,4': 'single', '5,5': 'single',
      }
    }
  },
  {
    levelNumber: 3,
    title: 'Wrapped Explosion',
    subtitle: 'Create L or T shapes for explosive wrapped candies!',
    rows: 8,
    cols: 8,
    moves: 18,
    star1: 4000,
    star2: 7000,
    star3: 11000,
    colors: ALL_COLORS,
    objective: 'target_score',
    targetScore: 4500,
  },
  {
    levelNumber: 4,
    title: 'Cherry Drop',
    subtitle: 'Bring delicious sweet cherries down to the bottom row!',
    rows: 8,
    cols: 8,
    moves: 22,
    star1: 3000,
    star2: 6000,
    star3: 10000,
    colors: MID_COLORS,
    objective: 'bring_ingredients',
    targetScore: 3500,
    ingredientCount: 2,
    initialBoardSetup: {
      ingredients: [
        { col: 2, type: 'cherry' },
        { col: 5, type: 'cherry' }
      ]
    }
  },
  {
    levelNumber: 5,
    title: 'Chocolate Crunch',
    subtitle: 'Break all chocolate wafers by matching adjacent candies!',
    rows: 8,
    cols: 8,
    moves: 20,
    star1: 4500,
    star2: 8000,
    star3: 13000,
    colors: ALL_COLORS,
    objective: 'clear_chocolate',
    targetScore: 5000,
    chocolateCount: 8,
    initialBoardSetup: {
      chocolateCoords: [
        [3, 3], [3, 4], [4, 3], [4, 4],
        [2, 3], [2, 4], [5, 3], [5, 4]
      ]
    }
  },
  {
    levelNumber: 6,
    title: 'Double Jelly Maze',
    subtitle: 'Double-layer jelly takes 2 matches to pop!',
    rows: 8,
    cols: 8,
    moves: 24,
    star1: 5000,
    star2: 9500,
    star3: 15000,
    colors: MID_COLORS,
    objective: 'clear_jelly',
    targetScore: 6000,
    jellyCount: 20,
    initialBoardSetup: {
      jellyMap: {
        '1,1': 'double', '1,6': 'double', '6,1': 'double', '6,6': 'double',
        '2,2': 'double', '2,5': 'double', '5,2': 'double', '5,5': 'double',
        '3,3': 'double', '3,4': 'double', '4,3': 'double', '4,4': 'double',
        '2,3': 'single', '2,4': 'single', '5,3': 'single', '5,4': 'single',
        '3,2': 'single', '4,2': 'single', '3,5': 'single', '4,5': 'single',
      }
    }
  },
  {
    levelNumber: 7,
    title: 'Hazelnut Harvest',
    subtitle: 'Collect 3 sweet ingredients at the bottom!',
    rows: 8,
    cols: 8,
    moves: 25,
    star1: 6000,
    star2: 11000,
    star3: 17000,
    colors: ALL_COLORS,
    objective: 'bring_ingredients',
    targetScore: 6500,
    ingredientCount: 3,
    initialBoardSetup: {
      ingredients: [
        { col: 1, type: 'cherry' },
        { col: 4, type: 'hazelnut' },
        { col: 6, type: 'cherry' }
      ]
    }
  },
  {
    levelNumber: 8,
    title: 'Frosting Castle',
    subtitle: 'Smash through the tough sugar frosting blocks!',
    rows: 8,
    cols: 8,
    moves: 22,
    star1: 7000,
    star2: 12000,
    star3: 19000,
    colors: ALL_COLORS,
    objective: 'clear_chocolate',
    targetScore: 7000,
    chocolateCount: 10,
    initialBoardSetup: {
      chocolateCoords: [
        [2, 2], [2, 5],
        [3, 2], [3, 5],
        [4, 2], [4, 5],
        [5, 2], [5, 3], [5, 4], [5, 5]
      ]
    }
  },
  {
    levelNumber: 9,
    title: 'Rainbow Cascade',
    subtitle: '5 in a row creates a glorious Rainbow Color Bomb!',
    rows: 8,
    cols: 8,
    moves: 24,
    star1: 8500,
    star2: 15000,
    star3: 24000,
    colors: MID_COLORS,
    objective: 'target_score',
    targetScore: 10000,
  },
  {
    levelNumber: 10,
    title: 'Sugar King Climax',
    subtitle: 'The supreme candy test! Clear 24 jellies in 25 moves!',
    rows: 8,
    cols: 8,
    moves: 25,
    star1: 10000,
    star2: 18000,
    star3: 28000,
    colors: ALL_COLORS,
    objective: 'clear_jelly',
    targetScore: 12000,
    jellyCount: 24,
    initialBoardSetup: {
      jellyMap: {
        '1,2': 'double', '1,3': 'double', '1,4': 'double', '1,5': 'double',
        '2,1': 'double', '2,6': 'double',
        '3,1': 'double', '3,6': 'double',
        '4,1': 'double', '4,6': 'double',
        '5,1': 'double', '5,6': 'double',
        '6,2': 'double', '6,3': 'double', '6,4': 'double', '6,5': 'double',
        '3,3': 'single', '3,4': 'single', '4,3': 'single', '4,4': 'single',
        '2,3': 'single', '2,4': 'single', '5,3': 'single', '5,4': 'single'
      }
    }
  },
  {
    levelNumber: 11,
    title: 'Soda Geyser',
    subtitle: 'Bring down 4 ingredients through narrow candy columns!',
    rows: 8,
    cols: 8,
    moves: 26,
    star1: 12000,
    star2: 20000,
    star3: 30000,
    colors: ALL_COLORS,
    objective: 'bring_ingredients',
    targetScore: 12000,
    ingredientCount: 4,
    initialBoardSetup: {
      ingredients: [
        { col: 1, type: 'cherry' },
        { col: 3, type: 'hazelnut' },
        { col: 4, type: 'cherry' },
        { col: 6, type: 'hazelnut' }
      ]
    }
  },
  {
    levelNumber: 12,
    title: 'Lollipop Lagoon',
    subtitle: 'Clear all 28 frosted jellies in this grand candy lagoon!',
    rows: 8,
    cols: 8,
    moves: 28,
    star1: 14000,
    star2: 24000,
    star3: 36000,
    colors: ALL_COLORS,
    objective: 'clear_jelly',
    targetScore: 15000,
    jellyCount: 28,
    initialBoardSetup: {
      jellyMap: {
        '0,0': 'single', '0,7': 'single', '7,0': 'single', '7,7': 'single',
        '1,1': 'single', '1,6': 'single', '6,1': 'single', '6,6': 'single',
        '2,2': 'double', '2,3': 'double', '2,4': 'double', '2,5': 'double',
        '3,2': 'double', '3,3': 'double', '3,4': 'double', '3,5': 'double',
        '4,2': 'double', '4,3': 'double', '4,4': 'double', '4,5': 'double',
        '5,2': 'double', '5,3': 'double', '5,4': 'double', '5,5': 'double',
        '3,0': 'single', '3,7': 'single', '4,0': 'single', '4,7': 'single'
      }
    }
  }
];
