import { parseLogFile, WORLD_ID } from '../utils/logParser';
import { Ranking } from '../models/ranking';

/**
 * Ranking de um jogo. Regras:
 * - matar outro jogador: +1 para quem matou, -1 para quem morreu
 * - morrer para o <world>: -1
 * - suicídio (matar a si mesmo): não altera a pontuação
 *
 * A contagem é feita pelo ID de cliente do log, então um jogador que troca
 * de nome no meio da partida continua com a mesma pontuação e aparece com o
 * último nome usado. Retorna null se o jogo não existir.
 */
export const getRanking = async (gameId: string): Promise<Ranking[] | null> => {
  const games = await parseLogFile();
  const game = games.find((g) => g.id === gameId);
  if (!game) return null;

  const scores = new Map<string, number>();
  const names = new Map<string, string>();

  for (const player of game.players) {
    scores.set(player.id, 0);
    names.set(player.id, player.name);
  }

  const add = (id: string, delta: number) =>
    scores.set(id, (scores.get(id) ?? 0) + delta);

  for (const kill of game.kills) {
    if (kill.killerId === WORLD_ID) {
      add(kill.victimId, -1);
    } else if (kill.killerId !== kill.victimId) {
      add(kill.killerId, 1);
      add(kill.victimId, -1);
    }
    // Garante um nome mesmo para quem não passou por ClientBegin
    if (kill.killerId !== WORLD_ID && !names.has(kill.killerId)) {
      names.set(kill.killerId, kill.killer);
    }
    if (!names.has(kill.victimId)) names.set(kill.victimId, kill.victim);
  }

  return [...scores.entries()]
    .map(([id, score]) => ({ name: names.get(id) ?? id, score }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
};
