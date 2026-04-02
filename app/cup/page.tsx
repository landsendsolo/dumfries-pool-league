import {
  COMPETITIONS,
  getTableByCompetition,
  getResultsByCompetition,
} from "@/lib/leagueapp";
import type { TeamStanding, Result } from "@/lib/leagueapp";

export const dynamic = "force-dynamic";
export const revalidate = 30;

export const metadata = {
  title: "League Competitions | Dumfries Pool League",
};

// ── Team Competition — completed ──────────────────────────────
const SF1_WINNER = "Abbey A";
const SF2_WINNER = "Lochside Tavern";
const FINAL_SCORE = "4 - 2";
const CHAMPION = "Abbey A";

const SEMI_FINALS = [
  { label: "Semi Final 1", home: "Abbey A", away: "Abbey B", venue: "Abbey", time: "19:30", homeScore: 4, awayScore: 1 },
  { label: "Semi Final 2", home: "Lochside Tavern", away: "Normandy A", venue: "Normandy Bar", time: "19:30", homeScore: 4, awayScore: 3 },
];

function parseScore(score: string): { homeGoals: number; awayGoals: number } | null {
  const m = score.match(/(\d+)\s*-\s*(\d+)/);
  if (!m) return null;
  return { homeGoals: parseInt(m[1]), awayGoals: parseInt(m[2]) };
}

function findResult(results: Result[], home: string, away: string): Result | undefined {
  return results.find(
    (r) => (r.home === home && r.away === away) || (r.home === away && r.away === home),
  );
}

export default async function LeagueCompetitionsPage() {
  const [groupTable, groupResults, knockoutResults] = await Promise.all([
    getTableByCompetition(COMPETITIONS.TEAM_COMP_WK2),
    getResultsByCompetition(COMPETITIONS.TEAM_COMP_WK2),
    getResultsByCompetition(COMPETITIONS.TEAM_COMP),
  ]);

  const sf1Result = findResult(knockoutResults, SEMI_FINALS[0].home, SEMI_FINALS[0].away);
  const sf2Result = findResult(knockoutResults, SEMI_FINALS[1].home, SEMI_FINALS[1].away);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

      {/* ── SINGLES COMPETITION — UPCOMING ── */}
      <div className="mb-12">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-block bg-gold/10 border border-gold/30 text-gold text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
            Upcoming Competition
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Singles Competition 2026
          </h1>
          <p className="text-gray-400 text-sm">
            Sponsored by GH Gardening and Labouring Services
          </p>
        </div>

        {/* Key details cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-navy-light/50 border border-gold/20 rounded-xl p-4 text-center">
            <p className="text-gold font-bold text-lg">17th Apr</p>
            <p className="text-gray-400 text-xs mt-1">Night 1 — Friday</p>
          </div>
          <div className="bg-navy-light/50 border border-gold/20 rounded-xl p-4 text-center">
            <p className="text-gold font-bold text-lg">24th Apr</p>
            <p className="text-gray-400 text-xs mt-1">Night 2 — Friday</p>
          </div>
          <div className="bg-navy-light/50 border border-gold/20 rounded-xl p-4 text-center">
            <p className="text-gold font-bold text-lg">6:00pm</p>
            <p className="text-gray-400 text-xs mt-1">Start — Both Nights</p>
          </div>
          <div className="bg-navy-light/50 border border-gold/20 rounded-xl p-4 text-center">
            <p className="text-gold font-bold text-lg">£5</p>
            <p className="text-gray-400 text-xs mt-1">Entry Fee</p>
          </div>
        </div>

        {/* Info block */}
        <div className="bg-navy-light/50 border border-gold/20 rounded-xl p-5 sm:p-6 mb-6">
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div className="flex justify-between border-b border-gold/10 pb-2">
                <span className="text-gray-400">Venue</span>
                <span className="text-white font-medium">Abbey Inn, Lincluden</span>
              </div>
              <div className="flex justify-between border-b border-gold/10 pb-2">
                <span className="text-gray-400">Format</span>
                <span className="text-white font-medium">Best of 5</span>
              </div>
              <div className="flex justify-between border-b border-gold/10 pb-2">
                <span className="text-gray-400">From Quarter Finals</span>
                <span className="text-white font-medium">Best of 7</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-gold/10 pb-2">
                <span className="text-gray-400">Entry Deadline</span>
                <span className="text-white font-medium">10th April 2026</span>
              </div>
              <div className="flex justify-between border-b border-gold/10 pb-2">
                <span className="text-gray-400">Host Sponsor</span>
                <span className="text-white font-medium">Abbey Inn Lincluden</span>
              </div>
              <div className="flex justify-between border-b border-gold/10 pb-2">
                <span className="text-gray-400">Comp Sponsor</span>
                <span className="text-white font-medium">GH Gardening &amp; Labouring</span>
              </div>
            </div>
          </div>
        </div>

        {/* Entry payment */}
        <div className="bg-gold/5 border border-gold/30 rounded-xl p-5 text-center">
          <p className="text-gold font-bold text-sm uppercase tracking-wider mb-2">How to Enter</p>
          <p className="text-gray-300 text-sm mb-3">
            Pay £5 entry by bank transfer — use your name as the reference
          </p>
          <div className="inline-flex flex-col items-center gap-1">
            <span className="text-white font-semibold text-sm">Dumfries Pool League</span>
            <span className="text-gray-400 text-sm font-mono">25616367 &nbsp;|&nbsp; 80-22-60</span>
          </div>
          <p className="text-gray-500 text-xs mt-3">Entry deadline: Friday 10th April 2026</p>
        </div>
      </div>

      {/* ── TEAM COMPETITION — COMPLETED ── */}
      <details className="group mb-8">
        <summary className="bg-navy-light/50 border border-gold/20 rounded-xl px-5 py-4 cursor-pointer list-none flex items-center justify-between hover:border-gold/40 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-gold uppercase tracking-wider">
              Team Competition 2025/26
            </span>
            <span className="text-[10px] font-bold text-green-400 bg-green-400/10 border border-green-400/20 rounded-full px-2 py-0.5 uppercase tracking-wider">
              Completed
            </span>
          </div>
          <svg
            className="w-4 h-4 text-gold transition-transform group-open:rotate-180 shrink-0"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>

        <div className="mt-2 space-y-4">

          {/* Champion banner */}
          <div className="bg-gold/10 border-2 border-gold/40 rounded-xl p-6 text-center">
            <span className="text-xs font-bold text-gold uppercase tracking-widest block mb-2">Champions 2026</span>
            <p className="text-white font-bold text-2xl sm:text-3xl">🏆 {CHAMPION}</p>
            <p className="text-gray-400 text-sm mt-1">beat {SF2_WINNER} {FINAL_SCORE} in the Final</p>
            <p className="text-gray-500 text-xs mt-1">Normandy Bar — 27th March 2026</p>
          </div>

          {/* Final */}
          <div className="bg-navy-light/50 border border-gold/20 rounded-xl p-5 sm:p-6 text-center">
            <span className="text-xs font-bold text-gold uppercase tracking-widest block mb-4">The Final</span>
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              <span className={`text-lg sm:text-xl font-bold ${CHAMPION === SF1_WINNER ? "text-gold" : "text-gray-500"}`}>
                {SF1_WINNER}
              </span>
              <span className="text-gold font-bold text-lg sm:text-xl bg-navy/60 rounded px-3 py-1">
                {FINAL_SCORE}
              </span>
              <span className={`text-lg sm:text-xl font-bold ${CHAMPION === SF2_WINNER ? "text-gold" : "text-gray-500"}`}>
                {SF2_WINNER}
              </span>
            </div>
          </div>

          {/* Semi Finals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SEMI_FINALS.map((sf, i) => {
              const result = i === 0 ? sf1Result : sf2Result;
              const parsed = result ? parseScore(result.score) : null;
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
              const displayHome = homeScore ?? sf.homeScore;
              const displayAway = awayScore ?? sf.awayScore;
              const winner = displayHome > displayAway ? sf.home : sf.away;
              return (
                <div key={sf.label} className="bg-navy-light/50 border border-gold/10 rounded-xl p-4 sm:p-5">
                  <span className="text-xs font-bold text-gold uppercase tracking-wider block mb-3">{sf.label}</span>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-base font-bold ${winner === sf.home ? "text-gold" : "text-gray-500"}`}>{sf.home}</span>
                      <span className={`text-lg font-bold tabular-nums ${winner === sf.home ? "text-gold" : "text-gray-500"}`}>{displayHome}</span>
                    </div>
                    <div className="border-t border-gold/10" />
                    <div className="flex items-center justify-between">
                      <span className={`text-base font-bold ${winner === sf.away ? "text-gold" : "text-gray-500"}`}>{sf.away}</span>
                      <span className={`text-lg font-bold tabular-nums ${winner === sf.away ? "text-gold" : "text-gray-500"}`}>{displayAway}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-gold/10 flex justify-between text-xs text-gray-500">
                    <span>{sf.venue}</span>
                    <span>{sf.time}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Group Stage */}
          <details className="group/inner">
            <summary className="bg-navy-light/30 border border-gold/10 rounded-xl px-5 py-3 cursor-pointer list-none flex items-center justify-between hover:border-gold/20 transition-colors">
              <span className="text-xs font-bold text-gold/70 uppercase tracking-wider">Group Stage — 12th December 2025</span>
              <svg className="w-3.5 h-3.5 text-gold/70 transition-transform group-open/inner:rotate-180 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="mt-2 bg-navy-light/30 border border-gold/10 rounded-xl p-4 sm:p-5 space-y-5">
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
                        <tr key={team.name} className={`border-t border-gold/5 ${i < 4 ? "bg-gold/5" : ""}`}>
                          <td className="py-2 pr-2 text-white font-medium whitespace-nowrap">{team.name}</td>
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
              {groupResults.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-gold/60 uppercase tracking-wider mb-3">Results</h3>
                  <div className="space-y-2">
                    {groupResults.map((r: Result, i: number) => (
                      <div key={i} className="flex items-center justify-between bg-navy-dark/30 rounded-lg px-3 py-2 text-sm">
                        <span className="text-white flex-1 text-right truncate mr-2">{r.home}</span>
                        <span className="text-gold font-bold shrink-0 bg-navy/60 rounded px-2 py-0.5 text-xs">{r.score}</span>
                        <span className="text-white flex-1 truncate ml-2">{r.away}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </details>

        </div>
      </details>

    </div>
  );
}
