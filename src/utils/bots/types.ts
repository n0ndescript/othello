import { Board, Player, Position } from '../../types/game';

export interface Bot {
  name: string;
  description: string;
  getMove: (board: Board, player: Player) => Position | null;
}

export interface BotConfig {
  id: string;
  name: string;
  description: string;
} 