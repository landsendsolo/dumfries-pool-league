export interface IMDrawRound {
  name: string;
  deadline: string;
}

export interface IMDrawSeed {
  seed: number;
  name: string;
}

export interface IMDrawEntry {
  position: number;
  name: string;
}

export interface IMDrawMatch {
  id: string;
  round: number;
  position: number;
  player1: string | null;
  player2: string | null;
  score1: number | null;
  score2: number | null;
  walkover: boolean;
  winner: string | null;
  bye: boolean;
  nextMatchId: string | null;
  nextSlot: 1 | 2 | null;
}

export interface IMDrawData {
  competition: string;
  event: string;
  finals: string;
  venue: string;
  qualifiers: number;
  format: string;
  updatedAt: string;
  rounds: IMDrawRound[];
  players: {
    seeds: IMDrawSeed[];
    entries: IMDrawEntry[];
  };
  matches: IMDrawMatch[];
}
