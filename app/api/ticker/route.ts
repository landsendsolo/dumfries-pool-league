import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import {
  getLeagueTable,
  getFixtures,
  getResults,
  getPlayerStats,
} from "@/lib/leagueapp";
import type { SpaEventsData } from "@/lib/spa-event-types";
import type { IMDrawData } from "@/lib/im-draw-types";

export const dynamic = "force-dynamic";

const DATA_DIR = path.join(process.cwd(), "data");
const SETTINGS_PATH = path.join(DATA_DIR, "ticker-settings.json");
const EVENTS_PATH = path.join(DATA_DIR, "spa-events", "events.json");

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

// ─── Live scores ────────────────────────────────────────────────────

async function fetchLiveMatches(): Promise<string[]> {
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

    // livedata.php returns match blocks with score links like [X-Y]
    // and team/player names as surrounding text
    $("a[href*='matchgames']").each((_, el) => {
      const scoreText = $(el).text().trim();
      const scoreMatch = scoreText.match(/\[(\d+)\s*-\s*(\d+)\]/);
      if (!scoreMatch) return;

      const score = `${scoreMatch[1]} - ${scoreMatch[2]}`;

      // Walk backwards and forwards from the link to find team names
      const parent = $(el).parent();
      const fullText = parent.text();
      const parts = fullText.split(scoreText);
      const home = parts[0]?.trim().replace(/\s+/g, " ");
      const awayAndRest = parts[1]?.trim().replace(/\s+/g, " ");
      // Away team is text before any venue info
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

  if (settings.enabled.leagueLeader) {
    try {
      const table = await getLeagueTable();
      if (table.length > 0) {
        items.push(
          `${table[0].name} lead the table with ${table[0].points} points`,
        );
      }
    } catch {
      /* skip */
    }
  }

  if (settings.enabled.topPlayer) {
    try {
      const players = await getPlayerStats();
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
    } catch {
      /* skip */
    }
  }

  if (settings.enabled.nextFixtures) {
    try {
      const fixtures = await getFixtures();
      if (fixtures.length > 0) {
        items.push(`Next fixtures: ${fixtures[0].date}`);
      }
    } catch {
      /* skip */
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

          // Find the next incomplete round
          const now = new Date();
          for (const round of draw.rounds) {
            // Parse deadline like "Wed 1st April 2026"
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

  if (settings.enabled.recentResults) {
    try {
      const results = await getResults();
      const latest = results.slice(0, 3);
      for (const r of latest) {
        items.push(`${r.home} ${r.score} ${r.away}`);
      }
    } catch {
      /* skip */
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

// Parse dates like "Wed 1st April 2026" or "Thu 9th April 2026"
function parseLooseDate(str: string): Date | null {
  try {
    // Remove ordinal suffixes (1st, 2nd, 3rd, 4th, etc.)
    const cleaned = str.replace(/(\d+)(st|nd|rd|th)/gi, "$1");
    // Remove day name prefix
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

// ─── Route handler ──────────────────────────────────────────────────

export async function GET() {
  try {
    // Step 1: Check for live matches
    const liveItems = await fetchLiveMatches();
    if (liveItems.length > 0) {
      return NextResponse.json({ mode: "live", items: liveItems });
    }

    // Step 2: Generate news items
    const settings = await loadSettings();
    const newsItems = await generateNewsItems(settings);

    if (newsItems.length > 0) {
      return NextResponse.json({ mode: "news", items: newsItems });
    }

    return NextResponse.json({ mode: "none", items: [] });
  } catch {
    return NextResponse.json({ mode: "none", items: [] });
  }
}
