import fs from 'fs';
import path from 'path';
import { GameStats } from '../models/gameStats';

export const parseLogFile = async (): Promise<GameStats[]> => {
  const logPath = path.resolve(__dirname, '../../logs/games.log');
  const logData = fs.readFileSync(logPath, 'utf-8');

  let games: GameStats[] = [];
  let currentGame: GameStats | null = null;
  let playerNames: Record<string, string> = {}; // Para armazenar os últimos nomes dos jogadores

  logData.split('\n').forEach((line) => {
    line = line.trim();

    if (line.includes('InitGame:')) {
      if (currentGame) games.push(currentGame);
      currentGame = { id: `game_${games.length + 1}`, kills: [], players: [] };
      playerNames = {}; // Resetar os nomes dos jogadores para cada jogo
    } else if (currentGame && line.includes('ClientUserinfoChanged:')) {
      const match = line.match(/ClientUserinfoChanged: (\d+) n\\([^\\]+)/);
      if (match) {
        const playerId = match[1];
        const playerName = match[2];
        playerNames[playerId] = playerName; // Atualiza o nome do jogador
      }
    } else if (currentGame && line.includes('ClientBegin:')) {
      const match = line.match(/ClientBegin: (\d+)/);
      if (match) {
        const playerId = match[1];
        if (playerNames[playerId]) {
          // Adicionar o jogador à lista se ainda não estiver nela
          if (!currentGame.players.find((p) => p.id === playerId)) {
            currentGame.players.push({
              id: playerId,
              name: playerNames[playerId],
            });
          }
        }
      }
    } else if (currentGame && line.includes('Kill:')) {
      const match = line.match(
        /Kill: (\d+) (\d+) (\d+): (.+) killed (.+) by (.+)/,
      );
      if (match) {
        currentGame.kills.push({
          killer: match[4],
          victim: match[5],
          cause: match[6],
        });
      }
    }
  });

  if (currentGame) games.push(currentGame);
  return games;
};
