import { Board, Cell, GameState, Player, Position } from '../types/game';

const BOARD_SIZE = 8;
const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

export const createInitialBoard = (): Board => {
  const board: Board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
  
  // Place initial pieces
  const center = BOARD_SIZE / 2;
  board[center - 1][center - 1] = 'white';
  board[center - 1][center] = 'black';
  board[center][center - 1] = 'black';
  board[center][center] = 'white';
  
  return board;
};

export const getValidMoves = (board: Board, player: Player): Position[] => {
  const validMoves: Position[] = [];
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === null && isValidMove(board, row, col, player)) {
        validMoves.push([row, col]);
      }
    }
  }
  
  return validMoves;
};

const isValidMove = (board: Board, row: number, col: number, player: Player): boolean => {
  if (board[row][col] !== null) return false;
  
  return DIRECTIONS.some(([dx, dy]) => {
    let x = row + dx;
    let y = col + dy;
    let hasOpponent = false;
    
    while (
      x >= 0 && x < BOARD_SIZE &&
      y >= 0 && y < BOARD_SIZE &&
      board[x][y] !== null
    ) {
      if (board[x][y] === player) {
        return hasOpponent;
      }
      hasOpponent = true;
      x += dx;
      y += dy;
    }
    
    return false;
  });
};

export const makeMove = (board: Board, row: number, col: number, player: Player): Board => {
  const newBoard = board.map(row => [...row]);
  newBoard[row][col] = player;
  
  DIRECTIONS.forEach(([dx, dy]) => {
    let x = row + dx;
    let y = col + dy;
    const piecesToFlip: Position[] = [];
    
    while (
      x >= 0 && x < BOARD_SIZE &&
      y >= 0 && y < BOARD_SIZE &&
      newBoard[x][y] !== null &&
      newBoard[x][y] !== player
    ) {
      piecesToFlip.push([x, y]);
      x += dx;
      y += dy;
    }
    
    if (
      x >= 0 && x < BOARD_SIZE &&
      y >= 0 && y < BOARD_SIZE &&
      newBoard[x][y] === player
    ) {
      piecesToFlip.forEach(([flipX, flipY]) => {
        newBoard[flipX][flipY] = player;
      });
    }
  });
  
  return newBoard;
};

export const calculateScores = (board: Board): { blackScore: number; whiteScore: number } => {
  let blackScore = 0;
  let whiteScore = 0;
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === 'black') blackScore++;
      if (board[row][col] === 'white') whiteScore++;
    }
  }
  
  return { blackScore, whiteScore };
};

export const isGameOver = (board: Board): boolean => {
  return !getValidMoves(board, 'black').length && !getValidMoves(board, 'white').length;
};

export const getWinner = (board: Board): Player | null => {
  const { blackScore, whiteScore } = calculateScores(board);
  
  if (blackScore > whiteScore) return 'black';
  if (whiteScore > blackScore) return 'white';
  return null;
}; 