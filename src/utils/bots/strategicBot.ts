import { Bot } from './types';
import { getValidMoves, makeMove } from '../gameLogic';

// Piece weights for board evaluation
const BOARD_WEIGHTS = [
  [100, -20, 10, 5, 5, 10, -20, 100],
  [-20, -50, -2, -2, -2, -2, -50, -20],
  [10, -2, -1, -1, -1, -1, -2, 10],
  [5, -2, -1, -1, -1, -1, -2, 5],
  [5, -2, -1, -1, -1, -1, -2, 5],
  [10, -2, -1, -1, -1, -1, -2, 10],
  [-20, -50, -2, -2, -2, -2, -50, -20],
  [100, -20, 10, 5, 5, 10, -20, 100],
];

export const StrategicBot: Bot = {
  name: 'Strategic Bot',
  description: 'Uses position weights and mobility to make strategic moves.',
  getMove: (board, player) => {
    const validMoves = getValidMoves(board, player);
    if (validMoves.length === 0) return null;

    let bestMove: Position | null = null;
    let bestScore = -Infinity;

    for (const move of validMoves) {
      const newBoard = makeMove(board, move[0], move[1], player);
      let score = 0;

      // Position-based evaluation
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if (newBoard[i][j] === player) {
            score += BOARD_WEIGHTS[i][j];
          }
        }
      }

      // Mobility evaluation
      const playerMoves = getValidMoves(newBoard, player).length;
      const opponentMoves = getValidMoves(newBoard, player === 'black' ? 'white' : 'black').length;
      score += (playerMoves - opponentMoves) * 5;

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  },
}; 