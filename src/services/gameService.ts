import { parseLogFile } from '../utils/logParser';
import { GameStats } from '../models/gameStats';

// Processa e retorna estatísticas de todos os jogos
export const getStats = async (): Promise<GameStats[]> => {
  return parseLogFile();
};

// Processa e retorna estatísticas de um jogo específico
export const getStatsById = async (
  gameId: string,
): Promise<GameStats | null> => {
  const stats = await parseLogFile();
  return stats.find((game) => game.id === gameId) || null;
};

export const getGameStatistics = async (gameId: string) => {
  const games = await parseLogFile();
  const game = games.find((g) => g.id === gameId);

  if (!game) return null;

  const totalKills = game.kills.length;
  const killsByCause: Record<string, number> = {};
  let worldKills = 0;

  game.kills.forEach((kill) => {
    killsByCause[kill.cause] = (killsByCause[kill.cause] || 0) + 1;
    if (kill.killer === '<world>') worldKills++;
  });

  return {
    id: game.id,
    totalKills,
    killsByCause,
    worldKills,
  };
};
