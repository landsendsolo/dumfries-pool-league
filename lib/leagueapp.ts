import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";

const BASE_URL = "https://live.leagueapplive.com";
const SITE = "dumfries";

const fetchOptions: RequestInit = {
  next: { revalidate: 300 },
} as RequestInit;

async function fetchPage(path: string, extraParams = ""): Promise<string> {
  const url = `${BASE_URL}/${path}?sitename=${SITE}${extraParams}`;
  const res = await fetch(url, fetchOptions);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

// ─── Types ───────────────────────────────────────────────────────────

export interface TeamStanding {
  name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  for: number;
  against: number;
  diff: number;
  bonus: number;
  points: number;
}

export interface Fixture {
  date: string;
  time: string;
  home: string;
  away: string;
  venue: string;
  tables: string;
}

export interface Result {
  date: string;
  time: string;
  home: string;
  score: string;
  away: string;
}

export interface PlayerStat {
  forename: string;
  surname: string;
  played: number;
  won: number;
  wonLag: number;
  breakDishesFor: number;
  breakDishesAgainst: number;
  forfeited: number;
  percentage: string;
  points: number;
}

export interface Venue {
  name: string;
  address: string;
}

export interface KnockoutMatch {
  round: string;
  home: string;
  away: string;
  score: string;
}

export interface Player {
  forename: string;
  surname: string;
  rankingPoints: string;
  team: string;
  venue: string;
}

// ─── Helper to get cell text from DataGrid rows ─────────────────────

function cellText($: cheerio.CheerioAPI, cell: AnyNode): string {
  const $cell = $(cell);
  const label = $cell.find("label.x-blue_dg_label");
  if (label.length) return label.text().trim();
  const link = $cell.find("a.x-blue_dg_a2");
  if (link.length) return link.text().trim();
  return $cell.text().trim();
}

// ─── Competition IDs ─────────────────────────────────────────────────

export const COMPETITIONS = {
  LEAGUE: 1065,
  DUMFRIES_SINGLES: 1141,
  FRIENDLY: 1338,
  TEAM_COMP: 1359,
  TEAM_COMP_WK2: 1397,
  SOS_MAIN: 1402,
  SOS_MASTERS: 1403,
  SOS_GROUP_A: 1414,
  SOS_GROUP_B: 1415,
  SOS_GROUP_C: 1419,
  SOS_GROUP_D: 1420,
} as const;

// ─── Generic fetchers by competition ID ──────────────────────────────

export async function getTableByCompetition(
  competitionId: number,
): Promise<TeamStanding[]> {
  const html = await fetchPage(
    "table1.php",
    `&sel_competition=${competitionId}`,
  );
  const $ = cheerio.load(html);
  const teams: TeamStanding[] = [];

  $("#top__contentTable tbody tr.dg_tr").each((_, row) => {
    const cells = $(row).find("td.x-blue_dg_td").toArray();
    if (cells.length < 10) return;
    teams.push({
      name: cellText($, cells[0]),
      played: parseInt(cellText($, cells[1])) || 0,
      won: parseInt(cellText($, cells[2])) || 0,
      drawn: parseInt(cellText($, cells[3])) || 0,
      lost: parseInt(cellText($, cells[4])) || 0,
      for: parseInt(cellText($, cells[5])) || 0,
      against: parseInt(cellText($, cells[6])) || 0,
      diff: parseInt(cellText($, cells[7])) || 0,
      bonus: parseInt(cellText($, cells[8])) || 0,
      points: parseInt(cellText($, cells[9])) || 0,
    });
  });

  return teams;
}

export async function getResultsByCompetition(
  competitionId: number,
): Promise<Result[]> {
  const html = await fetchPage(
    "results.php",
    `&sel_competition=${competitionId}`,
  );
  const $ = cheerio.load(html);
  const results: Result[] = [];

  $("#printableArea table tr").each((i, row) => {
    if (i === 0) return;
    const cells = $(row).find("td");
    if (cells.length < 5) return;
    const date = $(cells[0]).text().trim();
    if (!date) return;
    results.push({
      date,
      time: $(cells[1]).text().trim(),
      home: $(cells[2]).text().trim(),
      score: $(cells[3]).text().trim(),
      away: $(cells[4]).text().trim(),
    });
  });

  return results.reverse();
}

// ─── Parsers ────────────────────────────────────────────────────────

export async function getLeagueTable(): Promise<TeamStanding[]> {
  const html = await fetchPage("table1.php", "&sel_competition=1065");
  const $ = cheerio.load(html);
  const teams: TeamStanding[] = [];

  $("#top__contentTable tbody tr.dg_tr").each((_, row) => {
    const cells = $(row).find("td.x-blue_dg_td").toArray();
    if (cells.length < 10) return;
    teams.push({
      name: cellText($, cells[0]),
      played: parseInt(cellText($, cells[1])) || 0,
      won: parseInt(cellText($, cells[2])) || 0,
      drawn: parseInt(cellText($, cells[3])) || 0,
      lost: parseInt(cellText($, cells[4])) || 0,
      for: parseInt(cellText($, cells[5])) || 0,
      against: parseInt(cellText($, cells[6])) || 0,
      diff: parseInt(cellText($, cells[7])) || 0,
      bonus: parseInt(cellText($, cells[8])) || 0,
      points: parseInt(cellText($, cells[9])) || 0,
    });
  });

  return teams;
}

export async function getFixtures(): Promise<Fixture[]> {
  const html = await fetchPage("fixture3.php", "&sel_competition=1065");
  const $ = cheerio.load(html);
  const fixtures: Fixture[] = [];

  $("#printableArea table tr").each((i, row) => {
    if (i === 0) return; // skip header
    const cells = $(row).find("td");
    if (cells.length < 5) return;
    const date = $(cells[0]).text().trim();
    if (!date) return;
    fixtures.push({
      date,
      time: $(cells[1]).text().trim(),
      home: $(cells[2]).text().trim(),
      away: $(cells[3]).text().trim(),
      venue: $(cells[4]).text().trim(),
      tables: cells.length > 5 ? $(cells[5]).text().trim() : "",
    });
  });

  return fixtures;
}

export async function getResults(): Promise<Result[]> {
  const html = await fetchPage("results.php", "&sel_competition=1065");
  const $ = cheerio.load(html);
  const results: Result[] = [];

  $("#printableArea table tr").each((i, row) => {
    if (i === 0) return;
    const cells = $(row).find("td");
    if (cells.length < 5) return;
    const date = $(cells[0]).text().trim();
    if (!date) return;
    results.push({
      date,
      time: $(cells[1]).text().trim(),
      home: $(cells[2]).text().trim(),
      score: $(cells[3]).text().trim(),
      away: $(cells[4]).text().trim(),
    });
  });

  return results.reverse();
}

export async function getPlayerStats(): Promise<PlayerStat[]> {
  const html = await fetchPage("stats11.php");
  const $ = cheerio.load(html);
  const players: PlayerStat[] = [];

  $("#top__contentTable tbody tr.dg_tr").each((_, row) => {
    const cells = $(row).find("td.x-blue_dg_td").toArray();
    if (cells.length < 10) return;
    players.push({
      forename: cellText($, cells[0]),
      surname: cellText($, cells[1]),
      played: parseInt(cellText($, cells[2])) || 0,
      won: parseInt(cellText($, cells[3])) || 0,
      wonLag: parseInt(cellText($, cells[4])) || 0,
      breakDishesFor: parseInt(cellText($, cells[5])) || 0,
      breakDishesAgainst: parseInt(cellText($, cells[6])) || 0,
      forfeited: parseInt(cellText($, cells[7])) || 0,
      percentage: cellText($, cells[8]),
      points: parseInt(cellText($, cells[9])) || 0,
    });
  });

  return players;
}

export async function getVenues(): Promise<Venue[]> {
  const html = await fetchPage("venuelist.php");
  const $ = cheerio.load(html);
  const venues: Venue[] = [];

  $("#top__contentTable tbody tr.dg_tr").each((_, row) => {
    const cells = $(row).find("td.x-blue_dg_td").toArray();
    if (cells.length < 2) return;
    venues.push({
      name: cellText($, cells[0]),
      address: cellText($, cells[1]),
    });
  });

  return venues;
}

export async function getKnockoutDraw(): Promise<KnockoutMatch[]> {
  try {
    const html = await fetchPage("knockout.php");
    const $ = cheerio.load(html);
    const matches: KnockoutMatch[] = [];

    // Try Pattern B (simple table in printableArea)
    $("#printableArea table tr").each((i, row) => {
      if (i === 0) return;
      const cells = $(row).find("td");
      if (cells.length < 3) return;
      const home = $(cells[0]).text().trim();
      if (!home) return;
      matches.push({
        round: "",
        home,
        away: $(cells[1]).text().trim(),
        score: cells.length > 2 ? $(cells[2]).text().trim() : "",
      });
    });

    // Try Pattern A (DataGrid)
    if (matches.length === 0) {
      $("#top__contentTable tbody tr.dg_tr").each((_, row) => {
        const cells = $(row).find("td.x-blue_dg_td").toArray();
        if (cells.length < 3) return;
        matches.push({
          round: cellText($, cells[0]),
          home: cellText($, cells[1]),
          away: cellText($, cells[2]),
          score: cells.length > 3 ? cellText($, cells[3]) : "",
        });
      });
    }

    return matches;
  } catch {
    return [];
  }
}

export async function getPlayers(): Promise<Player[]> {
  const html = await fetchPage("playerlist.php");
  const $ = cheerio.load(html);
  const players: Player[] = [];

  $("#top__contentTable tbody tr.dg_tr").each((_, row) => {
    const cells = $(row).find("td.x-blue_dg_td").toArray();
    if (cells.length < 9) return;
    players.push({
      forename: cellText($, cells[1]),
      surname: cellText($, cells[2]),
      rankingPoints: cellText($, cells[4]),
      team: cellText($, cells[7]),
      venue: cellText($, cells[8]),
    });
  });

  return players;
}
