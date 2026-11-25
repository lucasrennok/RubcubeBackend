import { parseLogFile } from '../utils/logParser';
import { GameStats, ParsedGame } from '../models/gameStats';

export interface GameKillStatistics {
  id: string;
  totalKills: number;
  killsByCause: Record<string, number>;
  worldKills: number;
}

/** Remove os campos internos (IDs de cliente) antes de expor na API. */
const toPublic = (game: ParsedGame): GameStats => ({
  id: game.id,
  players: game.players.map(({ id, name }) => ({ id, name })),
  kills: game.kills.map(({ killer, victim, cause }) => ({
    killer,
    victim,
    cause,
  })),
});

// Retorna estatísticas de todos os jogos
export const getStats = async (): Promise<GameStats[]> => {
  const games = await parseLogFile();
  return games.map(toPublic);
};

// Retorna estatísticas de um jogo específico
export const getStatsById = async (
  gameId: string,
): Promise<GameStats | null> => {
  const games = await parseLogFile();
  const game = games.find((g) => g.id === gameId);
  return game ? toPublic(game) : null;
};

// Retorna o resumo de mortes de um jogo específico
export const getGameStatistics = async (
  gameId: string,
): Promise<GameKillStatistics | null> => {
  const games = await parseLogFile();
  const game = games.find((g) => g.id === gameId);
  if (!game) return null;

  const killsByCause: Record<string, number> = {};
  let worldKills = 0;

  for (const kill of game.kills) {
    killsByCause[kill.cause] = (killsByCause[kill.cause] ?? 0) + 1;
    if (kill.killer === '<world>') worldKills++;
  }

  return {
    id: game.id,
    totalKills: game.kills.length,
    killsByCause,
    worldKills,
  };
};
