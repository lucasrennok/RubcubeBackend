export interface KillEvent {
  killer: string;
  victim: string;
  cause: string;
}

export interface Player {
  id: string;
  name: string;
}

export interface GameStats {
  id: string;
  players: Player[];
  kills: KillEvent[];
}

/** Morte com os IDs de cliente do log, usada internamente no cálculo do ranking. */
export interface ParsedKill extends KillEvent {
  killerId: string;
  victimId: string;
}

export interface ParsedGame {
  id: string;
  players: Player[];
  kills: ParsedKill[];
}
