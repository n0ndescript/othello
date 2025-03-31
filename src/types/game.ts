export type Player = 'black' | 'white';
export type Cell = Player | null;
export type Board = Cell[][];
export type Position = [number, number];

export interface GameState {
  board: Board;
  currentPlayer: Player;
  blackScore: number;
  whiteScore: number;
  gameOver: boolean;
  winner: Player | null;
} 