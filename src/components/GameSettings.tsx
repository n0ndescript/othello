import React from 'react';
import { GameMode, Difficulty, Player } from '../types/game';
import './GameSettings.css';

interface GameSettingsProps {
  gameMode: GameMode;
  difficulty: Difficulty;
  computerPlayer: Player;
  onGameModeChange: (mode: GameMode) => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onComputerPlayerChange: (player: Player) => void;
}

export const GameSettings: React.FC<GameSettingsProps> = ({
  gameMode,
  difficulty,
  computerPlayer,
  onGameModeChange,
  onDifficultyChange,
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
            <label>Difficulty:</label>
            <select value={difficulty} onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
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