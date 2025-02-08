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
