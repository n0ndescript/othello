import { Bot } from './types';
import { getValidMoves } from '../gameLogic';

export const RandomBot: Bot = {
  name: 'Random Bot',
  description: 'Makes random valid moves. Good for beginners!',
  getMove: (board, player) => {
    const validMoves = getValidMoves(board, player);
    if (validMoves.length === 0) return null;
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  },
}; 