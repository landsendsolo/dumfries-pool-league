"use client";

import { useState } from "react";
import type { PlayerStat } from "@/lib/leagueapp";

export function PlayerSearch({ players }: { players: PlayerStat[] }) {
  const [query, setQuery] = useState("");

  const filtered = players.filter((p) => {
    const name = `${p.forename} ${p.surname}`.toLowerCase();
    return name.includes(query.toLowerCase());
  });

  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search players..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:w-80 bg-navy-light/50 border border-gold/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gold/50 transition-colors"
        />
        <span className="text-gray-500 text-xs ml-3">
          {filtered.length} player{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="bg-navy-light/50 border border-gold/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold/20 text-gray-400 text-xs uppercase tracking-wider bg-navy-dark/50">
                <th className="px-4 py-3 text-left">Player</th>
                <th className="px-4 py-3 text-center">P</th>
                <th className="px-4 py-3 text-center">W</th>
                <th className="px-4 py-3 text-center">Won Lag</th>
                <th className="px-4 py-3 text-center">BD For</th>
                <th className="px-4 py-3 text-center">BD Agst</th>
                <th className="px-4 py-3 text-center">Forf.</th>
                <th className="px-4 py-3 text-center">Win %</th>
                <th className="px-4 py-3 text-center">Pts</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr
                  key={i}
                  className="border-b border-navy/30 hover:bg-navy-light/70 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                    {p.forename} {p.surname}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-300">
                    {p.played}
                  </td>
                  <td className="px-4 py-3 text-center text-green-400">
                    {p.won}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-300">
                    {p.wonLag}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-300">
                    {p.breakDishesFor}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-300">
                    {p.breakDishesAgainst}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-300">
                    {p.forfeited}
                  </td>
                  <td className="px-4 py-3 text-center font-medium text-gold">
                    {p.percentage}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-gold">
                    {p.points}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
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
    </div>
  );
}
