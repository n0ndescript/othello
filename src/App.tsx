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
  getNextPlayer,
} from './utils/gameLogic'
import { BotInfo, getAvailableBots, getBotMove } from './utils/api'
import './App.css'

// Delay for bot moves in milliseconds
const BOT_MOVE_DELAY = 1000;

function App() {
  const [gameState, setGameState] = useState<GameState>({
    board: createInitialBoard(),
    currentPlayer: 'black' as Player,
    blackScore: 2,
    whiteScore: 2,
    selectedBot: null,
    secondBot: null,
    isGameOver: false,
    winner: null
  })

  const [lastMove, setLastMove] = useState<Position | null>(null)
  const [availableBots, setAvailableBots] = useState<BotInfo[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const bots = await getAvailableBots()
        setAvailableBots(bots)
      } catch (err) {
        setError('Failed to fetch available bots')
        console.error('Error fetching bots:', err)
      }
    }

    fetchBots()
  }, [])

  const handleStartGame = (gameMode: GameMode, selectedBot: BotInfo | null, secondBot: BotInfo | null) => {
    setGameState({
      board: createInitialBoard(),
      currentPlayer: 'black' as Player,
      blackScore: 2,
      whiteScore: 2,
      selectedBot,
      secondBot,
      isGameOver: false,
      winner: null
    })
    setLastMove(null)
  }

  const handleResetGame = () => {
    setGameState({
      board: createInitialBoard(),
      currentPlayer: 'black' as Player,
      blackScore: 2,
      whiteScore: 2,
      selectedBot: null,
      secondBot: null,
      isGameOver: false,
      winner: null
    })
    setLastMove(null)
  }

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleCellClick = async (position: Position) => {
    if (gameState.isGameOver) return

    // Only allow moves on your turn
    if (gameState.currentPlayer !== 'black') return

    const validMoves = getValidMoves(gameState.board, gameState.currentPlayer)
    const isValidMove = validMoves.some(move => move.row === position.row && move.col === position.col)

    if (!isValidMove) return

    const newBoard = makeMove(gameState.board, position.row, position.col, gameState.currentPlayer)
    if (!newBoard) return

    const { blackScore, whiteScore } = calculateScores(newBoard)
    const gameOver = isGameOver(newBoard)
    const winner = gameOver ? getWinner(newBoard) : null
    const nextPlayer = gameOver ? gameState.currentPlayer : getNextPlayer(newBoard, 'white')

    // Update game state and last move after human move
    setLastMove(position)
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: nextPlayer,
      blackScore,
      whiteScore,
      isGameOver: gameOver,
      winner
    }))

    // Handle computer move if applicable
    if (!gameOver && gameState.selectedBot && nextPlayer === 'white') {
      try {
        // Add delay before bot move
        await sleep(BOT_MOVE_DELAY)

        const botMove = await getBotMove(
          gameState.selectedBot.id,
          newBoard,
          'white'
        )

        if (botMove) {
          const botBoard = makeMove(newBoard, botMove.row, botMove.col, 'white')
          if (botBoard) {
            const { blackScore: newBlackScore, whiteScore: newWhiteScore } = calculateScores(botBoard)
            const botGameOver = isGameOver(botBoard)
            const botWinner = botGameOver ? getWinner(botBoard) : null
            const nextPlayerAfterBot = botGameOver ? 'white' : getNextPlayer(botBoard, 'black')

            // Update game state and last move after bot move
            setLastMove(botMove)
            setGameState(prev => ({
              ...prev,
              board: botBoard,
              currentPlayer: nextPlayerAfterBot,
              blackScore: newBlackScore,
              whiteScore: newWhiteScore,
              isGameOver: botGameOver,
              winner: botWinner
            }))

            // If black (human) has no valid moves, let the bot play again
            if (!botGameOver && nextPlayerAfterBot === 'white') {
              // Recursive call to handle bot's next move
              await handleBotMove(botBoard)
            }
          }
        }
      } catch (err) {
        setError('Failed to get bot move')
        console.error('Error getting bot move:', err)
      }
    }
  }

  const handleBotMove = async (board: Board) => {
    if (!gameState.selectedBot) return

    try {
      // Add delay before bot move
      await sleep(BOT_MOVE_DELAY)

      const botMove = await getBotMove(
        gameState.selectedBot.id,
        board,
        'white'
      )

      if (botMove) {
        const botBoard = makeMove(board, botMove.row, botMove.col, 'white')
        if (botBoard) {
          const { blackScore: newBlackScore, whiteScore: newWhiteScore } = calculateScores(botBoard)
          const botGameOver = isGameOver(botBoard)
          const botWinner = botGameOver ? getWinner(botBoard) : null
          const nextPlayerAfterBot = botGameOver ? 'white' : getNextPlayer(botBoard, 'black')

          // Update game state and last move after bot move
          setLastMove(botMove)
          setGameState(prev => ({
            ...prev,
            board: botBoard,
            currentPlayer: nextPlayerAfterBot,
            blackScore: newBlackScore,
            whiteScore: newWhiteScore,
            isGameOver: botGameOver,
            winner: botWinner
          }))

          // If black (human) still has no valid moves, continue bot moves
          if (!botGameOver && nextPlayerAfterBot === 'white') {
            await handleBotMove(botBoard)
          }
        }
      }
    } catch (err) {
      setError('Failed to get bot move')
      console.error('Error getting bot move:', err)
    }
  }

  return (
    <div className="app">
      <h1>Othello Game</h1>
      {error && <div className="error-message">{error}</div>}
      <GameSettings
        gameState={gameState}
        onStartGame={handleStartGame}
        onResetGame={handleResetGame}
        availableBots={availableBots}
      />
      <GameBoard
        board={gameState.board}
        currentPlayer={gameState.currentPlayer}
        onCellClick={handleCellClick}
        blackScore={gameState.blackScore}
        whiteScore={gameState.whiteScore}
        isGameOver={gameState.isGameOver}
        winner={gameState.winner}
        lastMove={lastMove}
      />
    </div>
  )
}

export default App
