import React from 'react';
import { Board, Player, Position } from '../types/game';
import { getValidMoves } from '../utils/gameLogic';
import './GameBoard.css';

export interface GameBoardProps {
  board: Board;
  currentPlayer: Player;
  onCellClick: (position: Position) => void;
  isGameOver: boolean;
  winner: Player | null;
  blackScore: number;
  whiteScore: number;
  lastMove?: Position | null;
}

export function GameBoard({
  board,
  currentPlayer,
  onCellClick,
  isGameOver,
  winner,
  blackScore,
  whiteScore,
  lastMove
}: GameBoardProps) {
  const validMoves = getValidMoves(board, currentPlayer);

  return (
    <div className="game-board">
      <div className="score-board">
        <div className="score black-score">
          <span className="piece black"></span>
          <span>{blackScore}</span>
        </div>
        <div className="score white-score">
          <span className="piece white"></span>
          <span>{whiteScore}</span>
        </div>
      </div>
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => {
              const isValidMove = validMoves.some(
                move => move.row === rowIndex && move.col === colIndex
              );
              const isLastMove = lastMove && lastMove.row === rowIndex && lastMove.col === colIndex;
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`cell ${isValidMove ? 'valid-move' : ''} ${isLastMove ? 'last-move' : ''}`}
                  onClick={() => onCellClick({ row: rowIndex, col: colIndex })}
                >
                  {cell && <div className={`piece ${cell}`} />}
                  {isValidMove && <div className="valid-move-indicator" />}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {isGameOver && (
        <div className="game-over">
          {blackScore === whiteScore ? (
            <div className="draw">Tied!</div>
          ) : winner ? (
            <div className="winner">
              {winner === 'black' ? 'Black' : 'White'} wins!
            </div>
          ) : (
            <div className="draw">It's a draw!</div>
          )}
        </div>
      )}
    </div>
  );
} 