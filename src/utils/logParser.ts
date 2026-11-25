import fs from 'node:fs/promises';
import path from 'node:path';
import { ParsedGame } from '../models/gameStats';

/** ID que o Quake 3 usa para mortes causadas pelo ambiente. */
export const WORLD_ID = '1022';

const INIT_RE = /^\s*\d+:\d+\s+InitGame:/;
const USERINFO_RE = /^\s*\d+:\d+\s+ClientUserinfoChanged: (\d+) n\\([^\\]*)\\/;
const BEGIN_RE = /^\s*\d+:\d+\s+ClientBegin: (\d+)/;
const KILL_RE =
  /^\s*\d+:\d+\s+Kill: (\d+) (\d+) \d+: (.+) killed (.+) by (\S+)\s*$/;

export const defaultLogPath = () =>
  process.env.LOG_PATH
    ? path.resolve(process.env.LOG_PATH)
    : path.resolve(__dirname, '../../logs/games.log');

/** Converte o conteúdo bruto do log em uma lista de partidas. Função pura. */
export const parseLog = (logData: string): ParsedGame[] => {
  const games: ParsedGame[] = [];
  let current: ParsedGame | null = null;
  let names: Record<string, string> = {};

  for (const line of logData.split(/\r?\n/)) {
    if (INIT_RE.test(line)) {
      // Alguns logs têm InitGame sem ShutdownGame; cada InitGame abre uma partida nova.
      if (current) games.push(current);
      current = { id: `game_${games.length + 1}`, players: [], kills: [] };
      names = {};
      continue;
    }
    if (!current) continue;

    const info = USERINFO_RE.exec(line);
    if (info) {
      const [, id, name] = info;
      names[id] = name;
      // Jogador que troca de nome no meio da partida fica com o último nome
      const existing = current.players.find((p) => p.id === id);
      if (existing) existing.name = name;
      continue;
    }

    const begin = BEGIN_RE.exec(line);
    if (begin) {
      const id = begin[1];
      if (names[id] && !current.players.some((p) => p.id === id)) {
        current.players.push({ id, name: names[id] });
      }
      continue;
    }

    const kill = KILL_RE.exec(line);
    if (kill) {
      const [, killerId, victimId, killer, victim, cause] = kill;
      current.kills.push({ killerId, victimId, killer, victim, cause });
    }
  }

  if (current) games.push(current);
  return games;
};

let cache: { file: string; mtimeMs: number; games: ParsedGame[] } | null = null;

/**
 * Lê e interpreta o arquivo de log. O resultado fica em cache e só é
 * recalculado quando o arquivo muda (antes, cada requisição relia o log
 * inteiro de forma síncrona, bloqueando o event loop).
 */
export const parseLogFile = async (
  file: string = defaultLogPath(),
): Promise<ParsedGame[]> => {
  const { mtimeMs } = await fs.stat(file);
  if (cache && cache.file === file && cache.mtimeMs === mtimeMs) {
    return cache.games;
  }
  const games = parseLog(await fs.readFile(file, 'utf-8'));
  cache = { file, mtimeMs, games };
  return games;
};

export const clearLogCache = () => {
  cache = null;
};
