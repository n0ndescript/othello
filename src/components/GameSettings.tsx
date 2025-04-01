import React from 'react';
import { GameMode, Player } from '../types/game';
import { BOTS } from '../utils/bots';
import './GameSettings.css';

interface GameSettingsProps {
  gameMode: GameMode;
  selectedBot: typeof BOTS[keyof typeof BOTS];
  secondBot?: typeof BOTS[keyof typeof BOTS];
  computerPlayer: Player;
  onGameModeChange: (mode: GameMode) => void;
  onBotChange: (botId: string) => void;
  onSecondBotChange: (botId: string) => void;
  onComputerPlayerChange: (player: Player) => void;
}

export const GameSettings: React.FC<GameSettingsProps> = ({
  gameMode,
  selectedBot,
  secondBot,
  computerPlayer,
  onGameModeChange,
  onBotChange,
  onSecondBotChange,
  onComputerPlayerChange,
}) => {
  return (
    <div className="game-settings">
      <div className="setting-group">
        <label>Game Mode:</label>
        <select 
          defaultValue={gameMode}
          onChange={(e) => {
            const newMode = e.target.value;
            if (newMode === 'pvp' || newMode === 'pvc' || newMode === 'cvc') {
              onGameModeChange(newMode);
            }
          }}
        >
          <option value="">Select Game Mode</option>
          <option value="pvp">Player vs Player</option>
          <option value="pvc">Player vs Computer</option>
          <option value="cvc">Computer vs Computer</option>
        </select>
      </div>

      {(gameMode === 'pvc' || gameMode === 'cvc') && (
        <>
          <div className="setting-group">
            <label>{gameMode === 'pvc' ? 'Select Bot:' : 'Black Player Bot:'}</label>
            <select value={selectedBot.id} onChange={(e) => onBotChange(e.target.value)}>
              {Object.values(BOTS).map((bot) => (
                <option key={bot.id} value={bot.id}>
                  {bot.name}
                </option>
              ))}
            </select>
            <div className="bot-description">{selectedBot.description}</div>
          </div>

          {gameMode === 'cvc' && (
            <div className="setting-group">
              <label>White Player Bot:</label>
              <select value={secondBot?.id} onChange={(e) => onSecondBotChange(e.target.value)}>
                {Object.values(BOTS).map((bot) => (
                  <option key={bot.id} value={bot.id}>
                    {bot.name}
                  </option>
                ))}
              </select>
              <div className="bot-description">{secondBot?.description}</div>
            </div>
          )}

          {gameMode === 'pvc' && (
            <div className="setting-group">
              <label>Computer Plays As:</label>
              <select value={computerPlayer} onChange={(e) => onComputerPlayerChange(e.target.value as Player)}>
                <option value="black">Black</option>
                <option value="white">White</option>
              </select>
            </div>
          )}
        </>
      )}
    </div>
  );
}; 