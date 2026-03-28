export type {
  IMDrawData,
  IMDrawMatch,
  IMDrawRound,
  IMDrawSeed,
  IMDrawEntry,
} from "./im-draw-types";

export interface SpaEvent {
  id: string;
  name: string;
  fullName: string;
  type: "im" | "trophy";
  status: "active" | "upcoming" | "completed";
  format: string;
  qualifiers: number;
  finals: string;
  finalsVenue: string;
  hasSpreadsheet: boolean;
  drawAvailable: boolean;
  entryFee?: string;
  entryDeadline?: string;
  notes?: string;
  dumfriesEntries?: string[];
}

export interface SpaEventsData {
  events: SpaEvent[];
}

export interface CellMapEntry {
  p1Row: number;
  p2Row: number;
  scoreCol: string;
}

export interface CellMap {
  [matchId: string]: CellMapEntry;
}
