import {
  COMPETITIONS,
  getTableByCompetition,
  getResultsByCompetition,
} from "@/lib/leagueapp";
import type { TeamStanding, Result } from "@/lib/leagueapp";

export const revalidate = 300;

export const metadata = {
  title: "League Competitions | Dumfries Pool League",
};

const SEMI_FINALS = [
  {
    label: "Semi Final 1",
    home: "Abbey A",
    away: "Abbey B",
    venue: "Abbey",
    time: "19:30",
  },
  {
    label: "Semi Final 2",
    home: "Lochside Tavern",
    away: "Normandy A",
    venue: "Normandy Bar",
    time: "19:30",
  },
];

function findResult(
  results: Result[],
  home: string,
  away: string,
): Result | undefined {
  return results.find(
    (r) =>
      (r.home === home && r.away === away) ||
      (r.home === away && r.away === home),
  );
}

function parseScore(score: string): { homeGoals: number; awayGoals: number } | null {
  const m = score.match(/(\d+)\s*-\s*(\d+)/);
  if (!m) return null;
  return { homeGoals: parseInt(m[1]), awayGoals: parseInt(m[2]) };
}

function getWinner(
  result: Result | undefined,
  sfHome: string,
  sfAway: string,
): string | null {
  if (!result) return null;
  const parsed = parseScore(result.score);
  if (!parsed) return null;

  // If the result row matches our expected home/away order
  if (result.home === sfHome) {
    return parsed.homeGoals > parsed.awayGoals ? sfHome : sfAway;
  }
  // Reversed order in results
  return parsed.homeGoals > parsed.awayGoals ? sfAway : sfHome;
}

export default async function LeagueCompetitionsPage() {
  const [groupTable, groupResults, knockoutResults] = await Promise.all([
    getTableByCompetition(COMPETITIONS.TEAM_COMP_WK2),
    getResultsByCompetition(COMPETITIONS.TEAM_COMP_WK2),
    getResultsByCompetition(COMPETITIONS.TEAM_COMP),
  ]);

  // Match knockout results to semi-finals
  const sf1Result = findResult(knockoutResults, SEMI_FINALS[0].home, SEMI_FINALS[0].away);
  const sf2Result = findResult(knockoutResults, SEMI_FINALS[1].home, SEMI_FINALS[1].away);

  const sf1Winner = getWinner(sf1Result, SEMI_FINALS[0].home, SEMI_FINALS[0].away);
  const sf2Winner = getWinner(sf2Result, SEMI_FINALS[1].home, SEMI_FINALS[1].away);

  // Check for final result
  const finalResult =
    sf1Winner && sf2Winner
      ? findResult(knockoutResults, sf1Winner, sf2Winner)
      : undefined;
  const champion =
    finalResult && sf1Winner && sf2Winner
      ? getWinner(finalResult, sf1Winner, sf2Winner)
      : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Team Competition Finals
        </h1>
        <p className="text-gray-400 text-sm mb-4">
          Dumfries Pool League 2025/26
        </p>
        <div className="inline-block bg-navy-light/50 border border-gold/30 rounded-lg px-4 py-2 mb-4">
          <span className="text-gold text-sm font-medium">
            Finals Night hosted by The Normandy Bar
          </span>
        </div>
        <div className="block">
          <span className="inline-flex items-center gap-2 bg-[#e24b4a] text-white text-sm font-bold px-4 py-2 rounded-lg">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            TONIGHT — 27th March 2026
          </span>
        </div>
      </div>

      {/* Semi Finals */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-gold uppercase tracking-wider mb-4 text-center">
          Semi Finals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SEMI_FINALS.map((sf, i) => {
            const result = i === 0 ? sf1Result : sf2Result;
            const winner = i === 0 ? sf1Winner : sf2Winner;
            const parsed = result ? parseScore(result.score) : null;

            // Determine score display accounting for possible reversed result row
            let homeScore: number | null = null;
            let awayScore: number | null = null;
            if (parsed && result) {
              if (result.home === sf.home) {
                homeScore = parsed.homeGoals;
                awayScore = parsed.awayGoals;
              } else {
                homeScore = parsed.awayGoals;
                awayScore = parsed.homeGoals;
              }
            }

            return (
              <div
                key={sf.label}
                className="bg-navy-light/50 border border-gold/20 rounded-xl p-5 sm:p-6"
              >
                <span className="text-xs font-bold text-gold uppercase tracking-wider block mb-4">
                  {sf.label}
                </span>

                <div className="space-y-3">
                  {/* Home team */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-lg font-bold ${
                        winner === sf.home
                          ? "text-gold"
                          : winner && winner !== sf.home
                            ? "text-gray-500"
                            : "text-white"
                      }`}
                    >
                      {sf.home}
                    </span>
                    {homeScore !== null ? (
                      <span
                        className={`text-xl font-bold tabular-nums ${
                          winner === sf.home ? "text-gold" : "text-gray-500"
                        }`}
                      >
                        {homeScore}
                      </span>
                    ) : null}
                  </div>

                  {/* Divider / Score */}
                  {result ? (
                    <div className="border-t border-gold/10" />
                  ) : (
                    <div className="text-center">
                      <span className="text-gold/40 text-xs font-bold">vs</span>
                    </div>
                  )}

                  {/* Away team */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-lg font-bold ${
                        winner === sf.away
                          ? "text-gold"
                          : winner && winner !== sf.away
                            ? "text-gray-500"
                            : "text-white"
                      }`}
                    >
                      {sf.away}
                    </span>
                    {awayScore !== null ? (
                      <span
                        className={`text-xl font-bold tabular-nums ${
                          winner === sf.away ? "text-gold" : "text-gray-500"
                        }`}
                      >
                        {awayScore}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gold/10 flex items-center justify-between text-xs text-gray-500">
                  <span>{sf.venue}</span>
                  <span>{sf.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* The Final */}
      <div className="mb-8">
        <div className="bg-navy-light/50 border-2 border-gold/40 rounded-xl p-6 sm:p-8 text-center">
          <span className="text-xs font-bold text-gold uppercase tracking-widest block mb-5">
            The Final
          </span>

          {champion && finalResult ? (
            <>
              <div className="flex items-center justify-center gap-4 sm:gap-6">
                <span
                  className={`text-lg sm:text-xl font-bold ${
                    champion === sf1Winner ? "text-gold" : "text-gray-500"
                  }`}
                >
                  {sf1Winner}
                </span>
                <span className="text-gold font-bold text-lg sm:text-xl bg-navy/60 rounded px-3 py-1">
                  {finalResult.score}
                </span>
                <span
                  className={`text-lg sm:text-xl font-bold ${
                    champion === sf2Winner ? "text-gold" : "text-gray-500"
                  }`}
                >
                  {sf2Winner}
                </span>
              </div>
              <p className="text-gold font-bold mt-4">
                {champion} — Team Competition Champions 2026
              </p>
            </>
          ) : (
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              <span className={`text-lg sm:text-xl font-bold ${sf1Winner ? "text-gold" : "text-gray-500"}`}>
                {sf1Winner || "Winner SF1"}
              </span>
              <span className="text-gold/40 text-sm font-bold">vs</span>
              <span className={`text-lg sm:text-xl font-bold ${sf2Winner ? "text-gold" : "text-gray-500"}`}>
                {sf2Winner || "Winner SF2"}
              </span>
            </div>
          )}

          <p className="text-gray-500 text-xs mt-4">
            Venue: Normandy Bar
          </p>
        </div>
      </div>

      {/* Group Stage — Collapsible */}
      <details className="mb-8 group">
        <summary className="bg-navy-light/50 border border-gold/20 rounded-xl px-5 py-4 cursor-pointer list-none flex items-center justify-between hover:border-gold/40 transition-colors">
          <span className="text-sm font-bold text-gold uppercase tracking-wider">
            Group Stage — 12th December 2025
          </span>
          <svg
            className="w-4 h-4 text-gold transition-transform group-open:rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>

        <div className="mt-2 bg-navy-light/50 border border-gold/20 rounded-xl p-4 sm:p-6 space-y-6">
          {/* Group Table */}
          {groupTable.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gold/80 text-xs uppercase tracking-wider">
                    <th className="text-left py-2 pr-2">Team</th>
                    <th className="text-center px-1">P</th>
                    <th className="text-center px-1">W</th>
                    <th className="text-center px-1">D</th>
                    <th className="text-center px-1">L</th>
                    <th className="text-center px-1">F</th>
                    <th className="text-center px-1">A</th>
                    <th className="text-center px-1">+/-</th>
                    <th className="text-center pl-1">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {groupTable.map((team: TeamStanding, i: number) => (
                    <tr
                      key={team.name}
                      className={`border-t border-gold/5 ${i < 4 ? "bg-gold/5" : ""}`}
                    >
                      <td className="py-2 pr-2 text-white font-medium whitespace-nowrap">
                        {team.name}
                      </td>
                      <td className="text-center text-gray-400 px-1">{team.played}</td>
                      <td className="text-center text-gray-400 px-1">{team.won}</td>
                      <td className="text-center text-gray-400 px-1">{team.drawn}</td>
                      <td className="text-center text-gray-400 px-1">{team.lost}</td>
                      <td className="text-center text-gray-400 px-1">{team.for}</td>
                      <td className="text-center text-gray-400 px-1">{team.against}</td>
                      <td className="text-center text-gray-400 px-1">{team.diff}</td>
                      <td className="text-center text-gold font-bold pl-1">{team.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Group Results */}
          {groupResults.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-gold/60 uppercase tracking-wider mb-3">
                Results
              </h3>
              <div className="space-y-2">
                {groupResults.map((r: Result, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-navy-dark/30 rounded-lg px-3 py-2 text-sm"
                  >
                    <span className="text-white flex-1 text-right truncate mr-2">
                      {r.home}
                    </span>
                    <span className="text-gold font-bold shrink-0 bg-navy/60 rounded px-2 py-0.5 text-xs">
                      {r.score}
                    </span>
                    <span className="text-white flex-1 truncate ml-2">
                      {r.away}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </details>

      {/* Footer note */}
      <p className="text-center text-gray-600 text-xs">
        Results update automatically from LeagueAppLive
      </p>
    </div>
  );
}
