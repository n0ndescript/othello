import React, { useState, useEffect } from 'react';
import { GameMode, GameState, BotInfo } from '../types/game';
import './GameSettings.css';

interface GameSettingsProps {
  gameState: GameState;
  onStartGame: (gameMode: GameMode, selectedBot: BotInfo | null, secondBot: BotInfo | null) => void;
  onResetGame: () => void;
  availableBots: BotInfo[];
}

export const GameSettings: React.FC<GameSettingsProps> = ({
  gameState,
  onStartGame,
  onResetGame,
  availableBots
}) => {
  const [gameMode, setGameMode] = useState<GameMode>('human-vs-computer');
  const [selectedFirstBot, setSelectedFirstBot] = useState<BotInfo | null>(gameState.selectedBot);
  const [selectedSecondBot, setSelectedSecondBot] = useState<BotInfo | null>(gameState.secondBot);

  // Sync local state with game state
  useEffect(() => {
    setSelectedFirstBot(gameState.selectedBot);
    setSelectedSecondBot(gameState.secondBot);
  }, [gameState.selectedBot, gameState.secondBot]);

  const handleStartGame = () => {
    if (gameMode === 'computer-vs-computer') {
      if (!selectedFirstBot || !selectedSecondBot) return;
      onStartGame(gameMode, selectedFirstBot, selectedSecondBot);
    } else {
      if (!selectedFirstBot) return;
      onStartGame(gameMode, selectedFirstBot, null);
    }
  };

  // Reset bot selections when game mode changes
  const handleGameModeChange = (newMode: GameMode) => {
    setGameMode(newMode);
    if (newMode === 'human-vs-computer') {
      // Keep first bot if switching to human vs computer
      setSelectedSecondBot(null);
    } else {
      // Clear both bots if switching to computer vs computer
      setSelectedFirstBot(null);
      setSelectedSecondBot(null);
    }
  };

  return (
    <div className="game-settings">
      <h2>Game Settings</h2>
      <div className="settings-group">
        <label>
          Game Mode:
          <select
            value={gameMode}
            onChange={(e) => handleGameModeChange(e.target.value as GameMode)}
          >
            <option value="human-vs-computer">Human vs Computer</option>
            <option value="computer-vs-computer">Computer vs Computer</option>
          </select>
        </label>
      </div>

      <div className="settings-group">
        <label>
          {gameMode === 'computer-vs-computer' ? 'First Bot (Black):' : 'Select Bot:'}
          <select
            value={selectedFirstBot?.id || ''}
            onChange={(e) => {
              const bot = availableBots.find(b => b.id === e.target.value);
              setSelectedFirstBot(bot || null);
            }}
          >
            <option value="">Select a bot</option>
            {availableBots.map(bot => (
              <option key={bot.id} value={bot.id}>
                {bot.name}
              </option>
            ))}
          </select>
        </label>
        {selectedFirstBot && (
          <div className="bot-description">{selectedFirstBot.description}</div>
        )}
      </div>

      {gameMode === 'computer-vs-computer' && (
        <div className="settings-group">
          <label>
            Second Bot (White):
            <select
              value={selectedSecondBot?.id || ''}
              onChange={(e) => {
                const bot = availableBots.find(b => b.id === e.target.value);
                setSelectedSecondBot(bot || null);
              }}
            >
              <option value="">Select a bot</option>
              {availableBots.map(bot => (
                <option key={bot.id} value={bot.id}>
                  {bot.name}
                </option>
              ))}
            </select>
          </label>
          {selectedSecondBot && (
            <div className="bot-description">{selectedSecondBot.description}</div>
          )}
        </div>
      )}

      <div className="game-controls">
        <button 
          onClick={handleStartGame} 
          disabled={
            !selectedFirstBot || 
            (gameMode === 'computer-vs-computer' && !selectedSecondBot)
          }
        >
          Start Game
        </button>
        <button 
          onClick={() => {
            onResetGame();
            setSelectedFirstBot(null);
            setSelectedSecondBot(null);
          }}
        >
          Reset Game
        </button>
      </div>
    </div>
  );
}; 