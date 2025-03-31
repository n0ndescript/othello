import { useState, useEffect } from 'react'
import { GameBoard } from './components/GameBoard'
import { GameSettings } from './components/GameSettings'
import { GameState, Player, Position, GameMode } from './types/game'
import {
  createInitialBoard,
  makeMove,
  calculateScores,
  isGameOver,
  getWinner,
  getValidMoves,
} from './utils/gameLogic'
import { BOTS, getBotById } from './utils/bots'
import './App.css'

function App() {
  const [gameState, setGameState] = useState<GameState>(() => ({
    board: createInitialBoard(),
    currentPlayer: 'black',
    blackScore: 2,
    whiteScore: 2,
    gameOver: false,
    winner: null,
    gameMode: 'pvp',
    selectedBot: BOTS.random,
    computerPlayer: 'white',
    isComputerThinking: false,
  }))

  const handleCellClick = (position: Position) => {
    if (gameState.gameOver || gameState.isComputerThinking) return
    if (gameState.gameMode === 'pvc' && gameState.currentPlayer === gameState.computerPlayer) return

    const [row, col] = position
    const validMoves = getValidMoves(gameState.board, gameState.currentPlayer)
    const isValidMove = validMoves.some(([r, c]) => r === row && c === col)

    if (!isValidMove) return

    const newBoard = makeMove(gameState.board, row, col, gameState.currentPlayer)
    const { blackScore, whiteScore } = calculateScores(newBoard)
    const gameOver = isGameOver(newBoard)
    const winner = gameOver ? getWinner(newBoard) : null
    const nextPlayer = gameState.currentPlayer === 'black' ? 'white' : 'black'

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: nextPlayer,
      blackScore,
      whiteScore,
      gameOver,
      winner,
    }))
  }

  useEffect(() => {
    // Computer's turn
    if (
      !gameState.gameOver &&
      gameState.gameMode === 'pvc' &&
      gameState.currentPlayer === gameState.computerPlayer
    ) {
      setGameState(prev => ({ ...prev, isComputerThinking: true }))

      // Add a small delay to make the computer's move feel more natural
      const timeoutId = setTimeout(() => {
        const bot = getBotById(gameState.selectedBot.id)
        const computerMove = bot.getMove(gameState.board, gameState.computerPlayer)

        if (computerMove) {
          const [row, col] = computerMove
          const newBoard = makeMove(gameState.board, row, col, gameState.computerPlayer)
          const { blackScore, whiteScore } = calculateScores(newBoard)
          const gameOver = isGameOver(newBoard)
          const winner = gameOver ? getWinner(newBoard) : null

          setGameState(prev => ({
            ...prev,
            board: newBoard,
            currentPlayer: gameState.computerPlayer === 'black' ? 'white' : 'black',
            blackScore,
            whiteScore,
            gameOver,
            winner,
            isComputerThinking: false,
          }))
        } else {
          setGameState(prev => ({ ...prev, isComputerThinking: false }))
        }
      }, 500)

      return () => clearTimeout(timeoutId)
    }
  }, [gameState.board, gameState.currentPlayer, gameState.computerPlayer, gameState.gameMode, gameState.selectedBot])

  const resetGame = () => {
    const board = createInitialBoard()
    const { blackScore, whiteScore } = calculateScores(board)
    setGameState(prev => ({
      ...prev,
      board,
      currentPlayer: 'black',
      blackScore,
      whiteScore,
      gameOver: false,
      winner: null,
      isComputerThinking: false,
    }))
  }

  const handleGameModeChange = (mode: GameMode) => {
    setGameState(prev => ({ ...prev, gameMode: mode }))
    resetGame()
  }

  const handleBotChange = (botId: string) => {
    setGameState(prev => ({ ...prev, selectedBot: BOTS[botId as keyof typeof BOTS] }))
  }

  const handleComputerPlayerChange = (player: Player) => {
    setGameState(prev => ({ ...prev, computerPlayer: player }))
    resetGame()
  }

  return (
    <div className="app">
      <h1>Othello</h1>
      <GameSettings
        gameMode={gameState.gameMode}
        selectedBot={gameState.selectedBot}
        computerPlayer={gameState.computerPlayer}
        onGameModeChange={handleGameModeChange}
        onBotChange={handleBotChange}
        onComputerPlayerChange={handleComputerPlayerChange}
      />
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
          {gameState.gameMode === 'pvc' && gameState.currentPlayer === gameState.computerPlayer && (
            <span className="thinking-indicator"> (thinking...)</span>
          )}
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
