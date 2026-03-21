import { getLeagueTable } from "@/lib/leagueapp";

export const metadata = {
  title: "League Table | Dumfries Pool League",
};

export default async function TablePage() {
  const table = await getLeagueTable();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">League Table</h1>
          <p className="text-gray-400 text-sm mt-1">
            Full standings for the current season
          </p>
        </div>
        <div className="bg-navy-light/60 border border-gold/30 rounded-lg px-4 py-2 self-start">
          <span className="text-xs text-gray-400 block">Sponsored by</span>
          <span className="text-gold font-semibold text-sm">
            JJ Plumbing &amp; Bathrooms
          </span>
        </div>
      </div>

      <div className="bg-navy-light/50 border border-gold/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold/20 text-gray-400 text-xs uppercase tracking-wider bg-navy-dark/50">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Team</th>
                <th className="px-4 py-3 text-center">P</th>
                <th className="px-4 py-3 text-center">W</th>
                <th className="px-4 py-3 text-center">D</th>
                <th className="px-4 py-3 text-center">L</th>
                <th className="px-4 py-3 text-center">F</th>
                <th className="px-4 py-3 text-center">A</th>
                <th className="px-4 py-3 text-center">Diff</th>
                <th className="px-4 py-3 text-center">Pts</th>
              </tr>
            </thead>
            <tbody>
              {table.map((team, i) => (
                <tr
                  key={team.name}
                  className={`border-b border-navy/30 hover:bg-navy-light/70 transition-colors ${
                    i < 3 ? "bg-gold/5" : ""
                  }`}
                >
                  <td className="px-4 py-3 text-gold font-bold">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                    {team.name}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-300">
                    {team.played}
                  </td>
                  <td className="px-4 py-3 text-center text-green-400">
                    {team.won}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-400">
                    {team.drawn}
                  </td>
                  <td className="px-4 py-3 text-center text-red-400">
                    {team.lost}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-300">
                    {team.for}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-300">
                    {team.against}
                  </td>
                  <td
                    className={`px-4 py-3 text-center font-medium ${
                      team.diff > 0
                        ? "text-green-400"
                        : team.diff < 0
                        ? "text-red-400"
                        : "text-gray-400"
                    }`}
                  >
                    {team.diff > 0 ? `+${team.diff}` : team.diff}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-gold text-base">
                    {team.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {table.length === 0 && (
        <p className="text-center text-gray-500 py-12">
          No league table data available.
        </p>
      )}
    </div>
  );
}
