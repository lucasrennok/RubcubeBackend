import { parseLogFile } from '../utils/logParser';
import { Ranking } from '../models/ranking';

// Retorna o ranking de um jogo específico
export const getRanking = async (gameId: string): Promise<Ranking[]> => {
  const games = await parseLogFile();
  const game = games.find((g) => g.id === gameId);

  if (!game) return [];

  let ranking: Record<string, number> = {};
  const lastNames: Record<string, string> = {};

  game.players.forEach((player) => {
    ranking[player.id] = 0;
    lastNames[player.id] = player.name;
  });

  for (const kill of game.kills) {
    if (kill.killer === '<world>') {
      ranking[kill.victim] = (ranking[kill.victim] || 0) - 1; // Morte para <world> perde 1 ponto
    } else if (kill.killer !== kill.victim) {
      // Se o jogador matou outro, ganha 1 ponto e o que morreu perde 1 ponto
      ranking[kill.killer] = (ranking[kill.killer] || 0) + 1;
      ranking[kill.victim] = (ranking[kill.victim] || 0) - 1;
    }
  }

  // Usar o último nome do jogador
  let finalRanking: Record<string, number> = {};

  for (const [playerId, score] of Object.entries(ranking)) {
    const playerName = lastNames[playerId] || playerId;
    finalRanking[playerName] = (finalRanking[playerName] || 0) + score;
  }

  return Object.entries(finalRanking)
    .map(([name, score]) => ({
      name,
      score,
    }))
    .sort((a, b) => b.score - a.score);
};
