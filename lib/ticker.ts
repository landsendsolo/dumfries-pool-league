import { readFile } from "fs/promises";
import path from "path";
import * as cheerio from "cheerio";
import {
  getLeagueTable,
  getFixtures,
  getResults,
  getPlayerStats,
} from "@/lib/leagueapp";
import type { SpaEventsData } from "@/lib/spa-event-types";
import type { IMDrawData } from "@/lib/im-draw-types";

const DATA_DIR = path.join(process.cwd(), "data");
const SETTINGS_PATH = path.join(DATA_DIR, "ticker-settings.json");
const EVENTS_PATH = path.join(DATA_DIR, "spa-events", "events.json");

export interface TickerData {
  mode: "live" | "news" | "none";
  items: string[];
}

interface TickerSettings {
  enabled: {
    leagueLeader: boolean;
    topPlayer: boolean;
    nextFixtures: boolean;
    eventDeadlines: boolean;
    recentResults: boolean;
    sosChampions: boolean;
  };
  customMessages: string[];
}

// ─── UK time helpers ────────────────────────────────────────────────

function getUkNow(): Date {
  const now = new Date();
  return new Date(
    now.toLocaleString("en-US", { timeZone: "Europe/London" }),
  );
}

function getUkToday(): string {
  const uk = getUkNow();
  const y = uk.getFullYear();
  const m = String(uk.getMonth() + 1).padStart(2, "0");
  const d = String(uk.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isMatchWindow(): boolean {
  const uk = getUkNow();
  const timeInMinutes = uk.getHours() * 60 + uk.getMinutes();
  return timeInMinutes >= 18 * 60 + 30 || timeInMinutes <= 60;
}

function dateUrgency(eventDateStr: string): string | null {
  const today = new Date(getUkToday());
  const eventDate = new Date(eventDateStr);

  if (isNaN(eventDate.getTime())) return null;

  const diffMs = eventDate.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return null;
  if (diffDays === 0) return "TONIGHT";
  if (diffDays === 1) return "TOMORROW";
  if (diffDays <= 7) return "THIS WEEK";
  return null;
}

function parseDDMMYYYY(str: string): string | null {
  const m = str.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!m) return null;
  return `${m[3]}-${m[2]}-${m[1]}`;
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// ─── Special competition events ─────────────────────────────────────

const SPECIAL_EVENTS = [
  {
    date: "2026-03-27",
    event: "Team Competition Finals — Semi Finals 19:30 — Normandy Bar",
  },
];

// ─── Live scores ────────────────────────────────────────────────────

async function fetchLiveMatches(): Promise<string[]> {
  if (!isMatchWindow()) return [];

  try {
    const res = await fetch(
      "https://live.leagueapplive.com/livedata.php?sitename=dumfries",
      { cache: "no-store" },
    );
    if (!res.ok) return [];
    const html = await res.text();
    if (!html.trim()) return [];

    const $ = cheerio.load(html);
    const items: string[] = [];

    $("a[href*='matchgames']").each((_, el) => {
      const scoreText = $(el).text().trim();
      const scoreMatch = scoreText.match(/\[(\d+)\s*-\s*(\d+)\]/);
      if (!scoreMatch) return;

      const score = `${scoreMatch[1]} - ${scoreMatch[2]}`;

      const parent = $(el).parent();
      const fullText = parent.text();
      const parts = fullText.split(scoreText);
      const home = parts[0]?.trim().replace(/\s+/g, " ");
      const awayAndRest = parts[1]?.trim().replace(/\s+/g, " ");
      const away = awayAndRest?.split(/\s{2,}/)?.[0]?.trim();

      if (home && away) {
        items.push(`${home} ${score} ${away}`);
      }
    });

    return items;
  } catch {
    return [];
  }
}

// ─── News items ─────────────────────────────────────────────────────

async function loadSettings(): Promise<TickerSettings> {
  try {
    const raw = await readFile(SETTINGS_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {
      enabled: {
        leagueLeader: true,
        topPlayer: true,
        nextFixtures: true,
        eventDeadlines: true,
        recentResults: true,
        sosChampions: true,
      },
      customMessages: [],
    };
  }
}

async function generateNewsItems(
  settings: TickerSettings,
): Promise<string[]> {
  const items: string[] = [];

  for (const se of SPECIAL_EVENTS) {
    const urgency = dateUrgency(se.date);
    if (urgency) {
      items.push(`${urgency} — ${se.event}`);
    }
  }

  const [table, players, fixtures, results] = await Promise.all([
    settings.enabled.leagueLeader
      ? getLeagueTable().catch(() => [])
      : Promise.resolve([]),
    settings.enabled.topPlayer
      ? getPlayerStats().catch(() => [])
      : Promise.resolve([]),
    settings.enabled.nextFixtures
      ? getFixtures().catch(() => [])
      : Promise.resolve([]),
    settings.enabled.recentResults
      ? getResults().catch(() => [])
      : Promise.resolve([]),
  ]);

  if (settings.enabled.leagueLeader && table.length > 0) {
    items.push(
      `${table[0].name} lead the table with ${table[0].points} points`,
    );
  }

  if (settings.enabled.topPlayer && players.length > 0) {
    const qualified = players.filter((p) => p.played >= 5);
    if (qualified.length > 0) {
      qualified.sort((a, b) => {
        const pctA = parseFloat(a.percentage) || 0;
        const pctB = parseFloat(b.percentage) || 0;
        return pctB - pctA;
      });
      const top = qualified[0];
      items.push(
        `${top.forename} ${top.surname} top player — ${top.percentage} win rate`,
      );
    }
  }

  if (settings.enabled.nextFixtures && fixtures.length > 0) {
    const isoDate = parseDDMMYYYY(fixtures[0].date);
    if (isoDate) {
      const urgency = dateUrgency(isoDate);
      if (urgency === "TONIGHT") {
        items.push(`TONIGHT — League fixtures ${fixtures[0].time || "19:45"}`);
      } else if (urgency === "TOMORROW") {
        items.push("TOMORROW — League fixtures");
      } else if (urgency === "THIS WEEK") {
        const d = new Date(isoDate);
        items.push(`THIS WEEK — League fixtures ${DAY_NAMES[d.getDay()]}`);
      } else {
        items.push(`Next league fixtures: ${fixtures[0].date}`);
      }
    } else {
      items.push(`Next league fixtures: ${fixtures[0].date}`);
    }
  }

  if (settings.enabled.eventDeadlines) {
    try {
      const eventsRaw = await readFile(EVENTS_PATH, "utf-8");
      const { events } = JSON.parse(eventsRaw) as SpaEventsData;
      const active = events.filter((e) => e.status === "active");

      for (const event of active) {
        try {
          const drawRaw = await readFile(
            path.join(DATA_DIR, "spa-events", event.id, "draw.json"),
            "utf-8",
          );
          const draw = JSON.parse(drawRaw) as IMDrawData;

          const now = new Date();
          for (const round of draw.rounds) {
            const deadlineDate = parseLooseDate(round.deadline);
            if (deadlineDate && deadlineDate >= now) {
              items.push(
                `${event.name} — ${round.name} deadline ${round.deadline}`,
              );
              break;
            }
          }
        } catch {
          /* skip event */
        }
      }
    } catch {
      /* skip */
    }
  }

  if (settings.enabled.recentResults && results.length > 0) {
    const latest = results.slice(0, 3);
    for (const r of latest) {
      items.push(`${r.home} ${r.score} ${r.away}`);
    }
  }

  if (settings.enabled.sosChampions) {
    items.push("Andy Moffat — SoS Singles Champion 2026");
    items.push("Cammy Jackson — SoS Masters Champion 2026");
  }

  for (const msg of settings.customMessages) {
    if (msg.trim()) items.push(msg.trim());
  }

  return items;
}

function parseLooseDate(str: string): Date | null {
  try {
    const cleaned = str.replace(/(\d+)(st|nd|rd|th)/gi, "$1");
    const withoutDay = cleaned.replace(
      /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+/i,
      "",
    );
    const d = new Date(withoutDay);
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}

// ─── Main export ────────────────────────────────────────────────────

export async function getTickerData(): Promise<TickerData> {
  try {
    const liveItems = await fetchLiveMatches();
    if (liveItems.length > 0) {
      return { mode: "live", items: liveItems };
    }

    const settings = await loadSettings();
    const newsItems = await generateNewsItems(settings);

    if (newsItems.length > 0) {
      return { mode: "news", items: newsItems };
    }

    return { mode: "none", items: [] };
  } catch {
    return { mode: "none", items: [] };
  }
}
