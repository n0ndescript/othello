import { BotConfig } from '../utils/bots/types';

export type Player = 'black' | 'white';
export type Cell = Player | null;
export type Board = Cell[][];
export type Position = [number, number];
export type GameMode = 'pvp' | 'pvc';

export interface GameState {
  board: Board;
  currentPlayer: Player;
  blackScore: number;
  whiteScore: number;
  gameOver: boolean;
  winner: Player | null;
  gameMode: GameMode;
  selectedBot: BotConfig;
  computerPlayer: Player;
  isComputerThinking: boolean;
} 