"use client";

import { useState } from "react";
import type { PlayerStat } from "@/lib/leagueapp";

export function PlayerSearch({ players }: { players: PlayerStat[] }) {
  const [query, setQuery] = useState("");

  const filtered = players.filter((p) => {
    const text = `${p.forename} ${p.surname} ${p.team}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <input
          type="text"
          placeholder="Search players..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:w-80 bg-navy-light/50 border border-gold/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gold/50 transition-colors"
        />
        <span className="text-gray-500 text-xs">
          {filtered.length} player{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="bg-navy-light/50 border border-gold/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold/20 text-gray-400 text-xs uppercase tracking-wider bg-navy-dark/50">
              <th className="px-3 sm:px-4 py-3 text-left">Player</th>
              <th className="px-2 sm:px-4 py-3 text-left hidden sm:table-cell">Team</th>
              <th className="px-2 sm:px-4 py-3 text-center">P</th>
              <th className="px-2 sm:px-4 py-3 text-center">W</th>
              <th className="px-2 sm:px-4 py-3 text-center hidden sm:table-cell">Won Lag</th>
              <th className="px-2 sm:px-4 py-3 text-center hidden sm:table-cell">BD For</th>
              <th className="px-2 sm:px-4 py-3 text-center hidden sm:table-cell">BD Agst</th>
              <th className="px-2 sm:px-4 py-3 text-center hidden sm:table-cell">Forf.</th>
              <th className="px-2 sm:px-4 py-3 text-center">Win %</th>
              <th className="px-2 sm:px-4 py-3 text-center">Pts</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr
                key={i}
                className="border-b border-navy/30 hover:bg-navy-light/70 transition-colors"
              >
                <td className="px-3 sm:px-4 py-3 font-medium text-white whitespace-nowrap text-xs sm:text-sm">
                  {p.forename} {p.surname}
                </td>
                <td className="px-2 sm:px-4 py-3 text-gray-300 text-xs sm:text-sm hidden sm:table-cell">
                  {p.team}
                </td>
                <td className="px-2 sm:px-4 py-3 text-center text-gray-300">
                  {p.played}
                </td>
                <td className="px-2 sm:px-4 py-3 text-center text-green-400">
                  {p.won}
                </td>
                <td className="px-2 sm:px-4 py-3 text-center text-gray-300 hidden sm:table-cell">
                  {p.wonLag}
                </td>
                <td className="px-2 sm:px-4 py-3 text-center text-gray-300 hidden sm:table-cell">
                  {p.breakDishesFor}
                </td>
                <td className="px-2 sm:px-4 py-3 text-center text-gray-300 hidden sm:table-cell">
                  {p.breakDishesAgainst}
                </td>
                <td className="px-2 sm:px-4 py-3 text-center text-gray-300 hidden sm:table-cell">
                  {p.forfeited}
                </td>
                <td className="px-2 sm:px-4 py-3 text-center font-medium text-gold">
                  {p.percentage}
                </td>
                <td className="px-2 sm:px-4 py-3 text-center font-bold text-gold">
                  {p.points}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No players found matching &ldquo;{query}&rdquo;
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
