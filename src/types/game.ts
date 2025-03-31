export type Player = 'black' | 'white';
export type Cell = Player | null;
export type Board = Cell[][];
export type Position = [number, number];
export type GameMode = 'pvp' | 'pvc';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameState {
  board: Board;
  currentPlayer: Player;
  blackScore: number;
  whiteScore: number;
  gameOver: boolean;
  winner: Player | null;
  gameMode: GameMode;
  difficulty: Difficulty;
  computerPlayer: Player;
  isComputerThinking: boolean;
} 