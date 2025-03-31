import { Bot } from './types';
import { getValidMoves, makeMove, calculateScores } from '../gameLogic';

export const GreedyBot: Bot = {
  name: 'Greedy Bot',
  description: 'Always tries to capture the most pieces in a single move.',
  getMove: (board, player) => {
    const validMoves = getValidMoves(board, player);
    if (validMoves.length === 0) return null;

    let bestMove: Position | null = null;
    let maxCaptures = -1;

    for (const move of validMoves) {
      const newBoard = makeMove(board, move[0], move[1], player);
      const { blackScore, whiteScore } = calculateScores(newBoard);
      const captures = player === 'black' 
        ? blackScore - calculateScores(board).blackScore
        : whiteScore - calculateScores(board).whiteScore;

      if (captures > maxCaptures) {
        maxCaptures = captures;
        bestMove = move;
      }
    }

    return bestMove;
  },
}; 