"use client";

import { useState } from "react";
import type { TeamStanding, Result } from "@/lib/leagueapp";

interface SoSGroup {
  label: string;
  standings: TeamStanding[];
  results: Result[];
}

interface CompetitionSection {
  id: string;
  label: string;
  standings: TeamStanding[];
  results: Result[];
}

const tabs = [
  { id: "sos-teams", label: "SoS Teams" },
  { id: "sos-singles", label: "SoS Singles" },
  { id: "sos-masters", label: "SoS Masters" },
  { id: "team-comp", label: "Team Competition" },
  { id: "team-comp-wk2", label: "Team Comp WK2" },
  { id: "friendly", label: "Friendly" },
];

function hasData(standings: TeamStanding[], results: Result[]): boolean {
  if (results.length > 0) return true;
  return standings.some((t) => t.played > 0 || t.points > 0);
}

export function CompetitionTabs({
  sosGroups,
  sosMainResults,
  sosMastersResults,
  competitions,
}: {
  sosGroups: SoSGroup[];
  sosMainResults: Result[];
  sosMastersResults: Result[];
  competitions: CompetitionSection[];
}) {
  const sosTeamsHasData = sosGroups.some((g) => hasData(g.standings, g.results));

  const visibleTabs = tabs.filter((tab) => {
    if (tab.id === "sos-teams") return sosTeamsHasData;
    if (tab.id === "sos-singles") return sosMainResults.length > 0;
    if (tab.id === "sos-masters") return sosMastersResults.length > 0;
    const comp = competitions.find((c) => c.id === tab.id);
    if (comp) return hasData(comp.standings, comp.results);
    return false;
  });

  const firstTab = visibleTabs[0]?.id ?? "";
  const [activeTab, setActiveTab] = useState(firstTab);

  if (visibleTabs.length === 0) {
    return (
      <div className="bg-navy-light/50 border border-gold/10 rounded-xl p-12 text-center">
        <p className="text-gray-400">No competition data available yet.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 mb-8 overflow-x-auto pb-1">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-gold text-navy"
                : "bg-navy-light/50 text-gray-400 hover:text-white border border-gold/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* South of Scotland Teams */}
      {activeTab === "sos-teams" && <SoSTeamsContent groups={sosGroups} />}

      {/* South of Scotland Singles */}
      {activeTab === "sos-singles" && (
        <KnockoutContent
          title="South of Scotland Main Event (Singles)"
          description="February 2026 &middot; Individual knockout tournament"
          results={sosMainResults}
        />
      )}

      {/* South of Scotland Masters */}
      {activeTab === "sos-masters" && (
        <KnockoutContent
          title="South of Scotland Masters Event"
          description="February 2026 &middot; Individual knockout tournament"
          results={sosMastersResults}
        />
      )}

      {/* Other competitions */}
      {competitions.map(
        (comp) =>
          activeTab === comp.id && (
            <CompetitionContent
              key={comp.id}
              label={comp.label}
              standings={comp.standings}
              results={comp.results}
            />
          ),
      )}
    </div>
  );
}

function SoSTeamsContent({ groups }: { groups: SoSGroup[] }) {
  const allResults = groups.flatMap((g) => g.results);

  // Find top performers across all groups (most points)
  const teamWins: Record<string, { won: number; played: number; points: number }> = {};
  for (const group of groups) {
    for (const team of group.standings) {
      teamWins[team.name] = {
        won: team.won,
        played: team.played,
        points: team.points,
      };
    }
  }
  const topTeams = Object.entries(teamWins)
    .sort((a, b) => b[1].points - a[1].points)
    .slice(0, 5);

  return (
    <div>
      {/* Event header */}
      <div className="bg-navy-light/50 border border-gold/20 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-gold"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              South of Scotland Team Event
            </h2>
            <p className="text-gray-400 text-sm">
              February 2026 &middot; 4 Groups &middot;{" "}
              {groups.reduce((sum, g) => sum + g.standings.length, 0)} Teams
            </p>
          </div>
        </div>
      </div>

      {/* Top performers */}
      {topTeams.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-white mb-4">
            Top Performers
          </h3>
          <div className="grid sm:grid-cols-5 gap-3">
            {topTeams.map(([name, stats], i) => (
              <div
                key={name}
                className={`rounded-lg p-4 text-center border ${
                  i === 0
                    ? "bg-gold/10 border-gold/30"
                    : "bg-navy-light/50 border-gold/10"
                }`}
              >
                <span
                  className={`text-xs font-bold uppercase tracking-wider block mb-1 ${
                    i === 0 ? "text-gold" : "text-gray-500"
                  }`}
                >
                  #{i + 1}
                </span>
                <p className="text-white font-semibold text-sm truncate">
                  {name}
                </p>
                <p className="text-gold font-bold text-lg">{stats.points} pts</p>
                <p className="text-gray-400 text-xs">
                  {stats.won}W / {stats.played}P
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Group tables */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {groups.map((group) => (
          <div key={group.label}>
            <h3 className="text-lg font-bold text-white mb-3">
              {group.label}
            </h3>
            <StandingsTable standings={group.standings} compact />
          </div>
        ))}
      </div>

      {/* All results */}
      {allResults.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-white mb-4">All Results</h3>
          <ResultsList results={allResults} />
        </div>
      )}
    </div>
  );
}

function KnockoutContent({
  title,
  description,
  results,
}: {
  title: string;
  description: string;
  results: Result[];
}) {
  // Determine the winner (last result in the tournament is the final)
  const finalMatch = results.length > 0 ? results[0] : null;
  let winner = "";
  if (finalMatch?.score) {
    const parts = finalMatch.score.split("-").map((s) => parseInt(s.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      winner = parts[0] > parts[1] ? finalMatch.home : finalMatch.away;
    }
  }

  // Group results by round (date + time acts as round indicator)
  const grouped: Record<string, Result[]> = {};
  for (const r of results) {
    const key = `${r.date} ${r.time}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(r);
  }
  const rounds = Object.entries(grouped);

  // Assign round labels based on number of matches
  const labeledRounds = rounds.map(([key, matches]) => {
    let label = key;
    if (matches.length === 1) label = "Final";
    else if (matches.length === 2) label = "Semi-Finals";
    else if (matches.length === 4) label = "Quarter-Finals";
    else if (matches.length === 8) label = "Round of 16";
    else if (matches.length === 16) label = "Round of 32";
    else label = `Round (${key})`;
    return { label, matches, key };
  });

  return (
    <div>
      {/* Event header */}
      <div className="bg-navy-light/50 border border-gold/20 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-gold"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <p
              className="text-gray-400 text-sm"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        </div>
      </div>

      {/* Winner banner */}
      {winner && (
        <div className="bg-gold/10 border border-gold/30 rounded-xl p-6 mb-8 text-center">
          <span className="text-xs text-gold font-bold uppercase tracking-wider block mb-1">
            Champion
          </span>
          <p className="text-white font-bold text-2xl">{winner}</p>
          {finalMatch && (
            <p className="text-gray-400 text-sm mt-1">
              defeated{" "}
              {winner === finalMatch.home ? finalMatch.away : finalMatch.home}{" "}
              {finalMatch.score} in the Final
            </p>
          )}
        </div>
      )}

      {/* Results by round */}
      {results.length === 0 ? (
        <div className="bg-navy-light/50 border border-gold/10 rounded-xl p-8 text-center">
          <p className="text-gray-400 text-sm">No results available yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {labeledRounds.map(({ label, matches, key }) => (
            <div key={key}>
              <h3 className="text-sm font-bold text-gold uppercase tracking-wider mb-3">
                {label}
              </h3>
              <div className="space-y-2">
                {matches.map((r, i) => {
                  const parts = r.score
                    .split("-")
                    .map((s) => parseInt(s.trim()));
                  const homeWon =
                    parts.length === 2 &&
                    !isNaN(parts[0]) &&
                    !isNaN(parts[1]) &&
                    parts[0] > parts[1];
                  const awayWon =
                    parts.length === 2 &&
                    !isNaN(parts[0]) &&
                    !isNaN(parts[1]) &&
                    parts[1] > parts[0];

                  return (
                    <div
                      key={i}
                      className="bg-navy-light/50 border border-gold/10 rounded-lg p-3 flex items-center justify-between"
                    >
                      <span
                        className={`font-medium text-sm flex-1 truncate ${
                          homeWon ? "text-gold" : "text-white"
                        }`}
                      >
                        {r.home}
                      </span>
                      <span className="text-gold font-bold px-3 text-sm bg-navy/60 rounded py-1 mx-2 whitespace-nowrap">
                        {r.score}
                      </span>
                      <span
                        className={`font-medium text-sm flex-1 text-right truncate ${
                          awayWon ? "text-gold" : "text-white"
                        }`}
                      >
                        {r.away}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CompetitionContent({
  label,
  standings,
  results,
}: {
  label: string;
  standings: TeamStanding[];
  results: Result[];
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">{label}</h2>

      {standings.length > 0 ? (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-3">Standings</h3>
          <StandingsTable standings={standings} />
        </div>
      ) : (
        <div className="bg-navy-light/50 border border-gold/10 rounded-xl p-8 text-center mb-8">
          <p className="text-gray-400 text-sm">No standings data available.</p>
        </div>
      )}

      {results.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Results</h3>
          <ResultsList results={results} />
        </div>
      )}
    </div>
  );
}

function StandingsTable({
  standings,
  compact,
}: {
  standings: TeamStanding[];
  compact?: boolean;
}) {
  return (
    <div className="bg-navy-light/50 border border-gold/10 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold/20 text-gray-400 text-xs uppercase tracking-wider bg-navy-dark/50">
              <th className="px-3 py-2.5 text-left">Team</th>
              <th className="px-2 py-2.5 text-center">P</th>
              <th className="px-2 py-2.5 text-center">W</th>
              {!compact && (
                <>
                  <th className="px-2 py-2.5 text-center">D</th>
                  <th className="px-2 py-2.5 text-center">L</th>
                  <th className="px-2 py-2.5 text-center">F</th>
                  <th className="px-2 py-2.5 text-center">A</th>
                </>
              )}
              <th className="px-2 py-2.5 text-center">Diff</th>
              <th className="px-2 py-2.5 text-center">Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team, i) => (
              <tr
                key={team.name}
                className={`border-b border-navy/30 hover:bg-navy-light/70 transition-colors ${
                  i === 0 ? "bg-gold/5" : ""
                }`}
              >
                <td className="px-3 py-2.5 font-medium text-white whitespace-nowrap text-xs">
                  {team.name}
                </td>
                <td className="px-2 py-2.5 text-center text-gray-300">
                  {team.played}
                </td>
                <td className="px-2 py-2.5 text-center text-green-400">
                  {team.won}
                </td>
                {!compact && (
                  <>
                    <td className="px-2 py-2.5 text-center text-gray-300">
                      {team.drawn}
                    </td>
                    <td className="px-2 py-2.5 text-center text-gray-300">
                      {team.lost}
                    </td>
                    <td className="px-2 py-2.5 text-center text-gray-300">
                      {team.for}
                    </td>
                    <td className="px-2 py-2.5 text-center text-gray-300">
                      {team.against}
                    </td>
                  </>
                )}
                <td className="px-2 py-2.5 text-center text-gray-300">
                  {team.diff}
                </td>
                <td className="px-2 py-2.5 text-center font-bold text-gold">
                  {team.points}
                </td>
              </tr>
            ))}
            {standings.length === 0 && (
              <tr>
                <td
                  colSpan={compact ? 5 : 9}
                  className="px-3 py-6 text-center text-gray-500 text-sm"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ResultsList({ results }: { results: Result[] }) {
  // Group results by date
  const grouped: Record<string, Result[]> = {};
  for (const r of results) {
    if (!grouped[r.date]) grouped[r.date] = [];
    grouped[r.date].push(r);
  }

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([date, dateResults]) => (
        <div key={date}>
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider block mb-2">
            {date}
          </span>
          <div className="space-y-2">
            {dateResults.map((r, i) => (
              <div
                key={i}
                className="bg-navy-light/50 border border-gold/10 rounded-lg p-3 flex items-center justify-between"
              >
                <span className="text-white font-medium text-sm flex-1 truncate">
                  {r.home}
                </span>
                <span className="text-gold font-bold px-3 text-sm bg-navy/60 rounded py-1 mx-2 whitespace-nowrap">
                  {r.score}
                </span>
                <span className="text-white font-medium text-sm flex-1 text-right truncate">
                  {r.away}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
