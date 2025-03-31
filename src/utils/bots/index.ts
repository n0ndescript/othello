import { BotConfig } from './types';
import { RandomBot } from './randomBot';
import { GreedyBot } from './greedyBot';
import { StrategicBot } from './strategicBot';
import { MinimaxBot } from './minimaxBot';

export const BOTS: Record<string, BotConfig> = {
  random: {
    id: 'random',
    name: RandomBot.name,
    description: RandomBot.description,
  },
  greedy: {
    id: 'greedy',
    name: GreedyBot.name,
    description: GreedyBot.description,
  },
  strategic: {
    id: 'strategic',
    name: StrategicBot.name,
    description: StrategicBot.description,
  },
  minimax: {
    id: 'minimax',
    name: MinimaxBot.name,
    description: MinimaxBot.description,
  },
};

export const getBotById = (id: string) => {
  switch (id) {
    case 'random':
      return RandomBot;
    case 'greedy':
      return GreedyBot;
    case 'strategic':
      return StrategicBot;
    case 'minimax':
      return MinimaxBot;
    default:
      return RandomBot;
  }
}; 