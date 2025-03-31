import React from 'react';
import { GameMode, Player } from '../types/game';
import { BOTS } from '../utils/bots';
import './GameSettings.css';

interface GameSettingsProps {
  gameMode: GameMode;
  selectedBot: typeof BOTS[keyof typeof BOTS];
  computerPlayer: Player;
  onGameModeChange: (mode: GameMode) => void;
  onBotChange: (botId: string) => void;
  onComputerPlayerChange: (player: Player) => void;
}

export const GameSettings: React.FC<GameSettingsProps> = ({
  gameMode,
  selectedBot,
  computerPlayer,
  onGameModeChange,
  onBotChange,
  onComputerPlayerChange,
}) => {
  return (
    <div className="game-settings">
      <div className="setting-group">
        <label>Game Mode:</label>
        <select value={gameMode} onChange={(e) => onGameModeChange(e.target.value as GameMode)}>
          <option value="pvp">Player vs Player</option>
          <option value="pvc">Player vs Computer</option>
        </select>
      </div>

      {gameMode === 'pvc' && (
        <>
          <div className="setting-group">
            <label>Select Bot:</label>
            <select value={selectedBot.id} onChange={(e) => onBotChange(e.target.value)}>
              {Object.values(BOTS).map((bot) => (
                <option key={bot.id} value={bot.id}>
                  {bot.name}
                </option>
              ))}
            </select>
            <div className="bot-description">{selectedBot.description}</div>
          </div>

          <div className="setting-group">
            <label>Computer Plays As:</label>
            <select value={computerPlayer} onChange={(e) => onComputerPlayerChange(e.target.value as Player)}>
              <option value="black">Black</option>
              <option value="white">White</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
}; 