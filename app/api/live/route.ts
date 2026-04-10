import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { getFixtures, getResults } from "@/lib/leagueapp";

export const dynamic = "force-dynamic";

// ─── Blacklisted match IDs (invalid/test matches) ───────────────────
const BLACKLISTED_MATCH_IDS = ["301883", "315619"];

// ─── Special competition events ─────────────────────────────────────

const SPECIAL_EVENTS = [
  {
    date: "2026-03-27",
    label: "Team Competition Finals",
    details: "Semi Finals — 19:30 — Normandy Bar",
    link: "/cup",
  },
];

function getUkToday(): string {
  const now = new Date();
  const uk = new Date(
    now.toLocaleString("en-US", { timeZone: "Europe/London" }),
  );
  const y = uk.getFullYear();
  const m = String(uk.getMonth() + 1).padStart(2, "0");
  const d = String(uk.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
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

interface SpecialEvent {
  urgency: string;
  label: string;
  details: string;
  link: string;
}

function getActiveSpecialEvents(): SpecialEvent[] {
  const events: SpecialEvent[] = [];
  for (const se of SPECIAL_EVENTS) {
    const urgency = dateUrgency(se.date);
    if (urgency) {
      events.push({ urgency, label: se.label, details: se.details, link: se.link });
    }
  }
  return events;
}

// ─── Live match types ───────────────────────────────────────────────

interface LiveMatch {
  home: string;
  away: string;
  score: string;
  matchId: string;
}

async function fetchLiveMatches(): Promise<LiveMatch[]> {
  try {
    const [defaultRes, compRes] = await Promise.all([
      fetch("https://live.leagueapplive.com/livedata.php?sitename=dumfries", { cache: "no-store" }),
      fetch("https://live.leagueapplive.com/livedata.php?sitename=dumfries&competitionid=1397", { cache: "no-store" }),
    ]);

    const [defaultHtml, compHtml] = await Promise.all([
      defaultRes.ok ? defaultRes.text() : "",
      compRes.ok ? compRes.text() : "",
    ]);

    const combinedHtml = defaultHtml + compHtml;
    if (!combinedHtml.trim()) return [];

    const $ = cheerio.load(combinedHtml);
    const matches: LiveMatch[] = [];

    $("a[href*='matchgames']").each((_, el) => {
      const scoreText = $(el).text().trim();
      const scoreMatch = scoreText.match(/(\d+)\s*-\s*(\d+)/);
      if (!scoreMatch) return;

      const score = `${scoreMatch[1]} - ${scoreMatch[2]}`;

      const href = $(el).attr("href") || "";
      const matchIdMatch = href.match(/matchid=(\d+)/);
      const matchId = matchIdMatch ? matchIdMatch[1] : "";

      const row = $(el).closest("tr");
      const cells = row.find("td");
      const home = $(cells[1]).text().trim();
      const away = $(cells[5]).text().trim();

      if (home && away) {
        matches.push({ home, away, score, matchId });
      }
    });

    // Blacklist invalid matches then deduplicate by matchId
    const seen = new Set<string>();
    return matches.filter((m) => {
      if (BLACKLISTED_MATCH_IDS.includes(m.matchId)) return false;
      if (seen.has(m.matchId)) return false;
      seen.add(m.matchId);
      return true;
    });
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    const matches = await fetchLiveMatches();
    const updatedAt = new Date().toISOString();

    const specialEvents = getActiveSpecialEvents();

    if (matches.length > 0) {
      return NextResponse.json({
        mode: "live",
        matches,
        specialEvents,
        nextFixtures: [],
        latestResults: [],
        updatedAt,
      });
    }

    const [fixtures, results] = await Promise.all([
      getFixtures().catch(() => []),
      getResults().catch(() => []),
    ]);

    return NextResponse.json({
      mode: "idle",
      matches: [],
      specialEvents,
      nextFixtures: fixtures.slice(0, 8).map((f) => ({
        date: f.date,
        time: f.time,
        home: f.home,
        away: f.away,
        venue: f.venue,
      })),
      latestResults: results.slice(0, 5).map((r) => ({
        home: r.home,
        away: r.away,
        score: r.score,
      })),
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({
      mode: "idle",
      matches: [],
      specialEvents: [],
      nextFixtures: [],
      latestResults: [],
      updatedAt: new Date().toISOString(),
    });
  }
}
