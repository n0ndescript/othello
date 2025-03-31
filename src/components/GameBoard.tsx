import React from 'react';
import { Board, Player, Position } from '../types/game';
import { getValidMoves } from '../utils/gameLogic';
import './GameBoard.css';

interface GameBoardProps {
  board: Board;
  currentPlayer: Player;
  onCellClick: (position: Position) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ board, currentPlayer, onCellClick }) => {
  const validMoves = getValidMoves(board, currentPlayer);

  return (
    <div className="game-board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, colIndex) => {
            const isValidMove = validMoves.some(
              ([r, c]) => r === rowIndex && c === colIndex
            );

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`board-cell ${cell || ''} ${isValidMove ? 'valid-move' : ''}`}
                onClick={() => onCellClick([rowIndex, colIndex])}
              >
                {cell && <div className="piece" />}
                {isValidMove && <div className="valid-move-indicator" />}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}; 