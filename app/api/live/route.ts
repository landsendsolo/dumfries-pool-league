import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { getFixtures, getResults } from "@/lib/leagueapp";

export const dynamic = "force-dynamic";

interface LiveMatch {
  home: string;
  away: string;
  score: string;
  matchId: string;
}

async function fetchLiveMatches(): Promise<LiveMatch[]> {
  try {
    const res = await fetch(
      "https://live.leagueapplive.com/livedata.php?sitename=dumfries",
      { cache: "no-store" },
    );
    if (!res.ok) return [];
    const html = await res.text();
    if (!html.trim()) return [];

    const $ = cheerio.load(html);
    const matches: LiveMatch[] = [];

    $("a[href*='matchgames']").each((_, el) => {
      const scoreText = $(el).text().trim();
      const scoreMatch = scoreText.match(/\[(\d+)\s*-\s*(\d+)\]/);
      if (!scoreMatch) return;

      const score = `${scoreMatch[1]} - ${scoreMatch[2]}`;

      // Extract matchId from href
      const href = $(el).attr("href") || "";
      const matchIdMatch = href.match(/matchid=(\d+)/);
      const matchId = matchIdMatch ? matchIdMatch[1] : "";

      // Walk backwards and forwards from the link to find team names
      const parent = $(el).parent();
      const fullText = parent.text();
      const parts = fullText.split(scoreText);
      const home = parts[0]?.trim().replace(/\s+/g, " ");
      const awayAndRest = parts[1]?.trim().replace(/\s+/g, " ");
      const away = awayAndRest?.split(/\s{2,}/)?.[0]?.trim();

      if (home && away) {
        matches.push({ home, away, score, matchId });
      }
    });

    return matches;
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    const matches = await fetchLiveMatches();
    const updatedAt = new Date().toISOString();

    if (matches.length > 0) {
      return NextResponse.json({
        mode: "live",
        matches,
        nextFixtures: [],
        latestResults: [],
        updatedAt,
      });
    }

    // Idle mode — fetch fixtures and results for fallback display
    const [fixtures, results] = await Promise.all([
      getFixtures().catch(() => []),
      getResults().catch(() => []),
    ]);

    return NextResponse.json({
      mode: "idle",
      matches: [],
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
      updatedAt,
    });
  } catch {
    return NextResponse.json({
      mode: "idle",
      matches: [],
      nextFixtures: [],
      latestResults: [],
      updatedAt: new Date().toISOString(),
    });
  }
}
