import { Board, Player, Position } from '../types/game';
import { getValidMoves } from './gameLogic';

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

// Evaluate board position based on piece positions and mobility
const evaluateBoard = (board: Board, player: Player): number => {
  let score = 0;
  const opponent = player === 'black' ? 'white' : 'black';
  
  // Position-based evaluation
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] === player) {
        score += BOARD_WEIGHTS[i][j];
      } else if (board[i][j] === opponent) {
        score -= BOARD_WEIGHTS[i][j];
      }
    }
  }
  
  // Mobility evaluation
  const playerMoves = getValidMoves(board, player).length;
  const opponentMoves = getValidMoves(board, opponent).length;
  score += (playerMoves - opponentMoves) * 5;
  
  return score;
};

// Minimax algorithm with alpha-beta pruning
const minimax = (
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean,
  player: Player,
  opponent: Player
): [number, Position | null] => {
  if (depth === 0) {
    return [evaluateBoard(board, player), null];
  }

  const validMoves = getValidMoves(board, maximizingPlayer ? player : opponent);
  if (validMoves.length === 0) {
    return [evaluateBoard(board, player), null];
  }

  let bestMove: Position | null = null;
  
  if (maximizingPlayer) {
    let maxEval = -Infinity;
    for (const move of validMoves) {
      const newBoard = JSON.parse(JSON.stringify(board));
      // Simulate move
      newBoard[move[0]][move[1]] = player;
      const [evaluation] = minimax(newBoard, depth - 1, alpha, beta, false, player, opponent);
      
      if (evaluation > maxEval) {
        maxEval = evaluation;
        bestMove = move;
      }
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return [maxEval, bestMove];
  } else {
    let minEval = Infinity;
    for (const move of validMoves) {
      const newBoard = JSON.parse(JSON.stringify(board));
      // Simulate move
      newBoard[move[0]][move[1]] = opponent;
      const [evaluation] = minimax(newBoard, depth - 1, alpha, beta, true, player, opponent);
      
      if (evaluation < minEval) {
        minEval = evaluation;
        bestMove = move;
      }
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return [minEval, bestMove];
  }
};

export type Difficulty = 'easy' | 'medium' | 'hard';

export const getComputerMove = (
  board: Board,
  player: Player,
  difficulty: Difficulty
): Position | null => {
  const validMoves = getValidMoves(board, player);
  if (validMoves.length === 0) return null;

  switch (difficulty) {
    case 'easy':
      // Random move
      return validMoves[Math.floor(Math.random() * validMoves.length)];
    
    case 'medium':
      // Use minimax with depth 2
      const [_, mediumMove] = minimax(
        board,
        2,
        -Infinity,
        Infinity,
        true,
        player,
        player === 'black' ? 'white' : 'black'
      );
      return mediumMove;
    
    case 'hard':
      // Use minimax with depth 4
      const [__, hardMove] = minimax(
        board,
        4,
        -Infinity,
        Infinity,
        true,
        player,
        player === 'black' ? 'white' : 'black'
      );
      return hardMove;
    
    default:
      return validMoves[0];
  }
}; 