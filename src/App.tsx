import { useState } from 'react'
import { GameBoard } from './components/GameBoard'
import { GameState, Player, Position } from './types/game'
import {
  createInitialBoard,
  makeMove,
  calculateScores,
  isGameOver,
  getWinner,
} from './utils/gameLogic'
import './App.css'

function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const board = createInitialBoard()
    const { blackScore, whiteScore } = calculateScores(board)
    return {
      board,
      currentPlayer: 'black',
      blackScore,
      whiteScore,
      gameOver: false,
      winner: null,
    }
  })

  const handleCellClick = (position: Position) => {
    if (gameState.gameOver) return

    const [row, col] = position
    const newBoard = makeMove(gameState.board, row, col, gameState.currentPlayer)
    const { blackScore, whiteScore } = calculateScores(newBoard)
    const gameOver = isGameOver(newBoard)
    const winner = gameOver ? getWinner(newBoard) : null

    setGameState({
      board: newBoard,
      currentPlayer: gameState.currentPlayer === 'black' ? 'white' : 'black',
      blackScore,
      whiteScore,
      gameOver,
      winner,
    })
  }

  const resetGame = () => {
    const board = createInitialBoard()
    const { blackScore, whiteScore } = calculateScores(board)
    setGameState({
      board,
      currentPlayer: 'black',
      blackScore,
      whiteScore,
      gameOver: false,
      winner: null,
    })
  }

  return (
    <div className="app">
      <h1>Othello</h1>
      <div className="game-info">
        <div className="score">
          <div className="player-score black">
            Black: {gameState.blackScore}
          </div>
          <div className="player-score white">
            White: {gameState.whiteScore}
          </div>
        </div>
        <div className="current-player">
          Current Player: {gameState.currentPlayer}
        </div>
        {gameState.gameOver && (
          <div className="game-over">
            Game Over! {gameState.winner ? `${gameState.winner} wins!` : "It's a tie!"}
          </div>
        )}
      </div>
      <GameBoard
        board={gameState.board}
        currentPlayer={gameState.currentPlayer}
        onCellClick={handleCellClick}
      />
      <button className="reset-button" onClick={resetGame}>
        Reset Game
      </button>
    </div>
  )
}

export default App
