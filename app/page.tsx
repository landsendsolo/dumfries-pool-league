import Link from "next/link";
import {
  getLeagueTable,
  getFixtures,
  getResults,
} from "@/lib/leagueapp";

export default async function Home() {
  const [table, fixtures, results] = await Promise.all([
    getLeagueTable(),
    getFixtures(),
    getResults(),
  ]);

  const top5 = table.slice(0, 5);
  const upcomingFixtures = fixtures.slice(0, 6);
  const latestResults = results.slice(0, 6);
  const totalTeams = table.length;
  const totalMatchesPlayed = table.reduce((sum, t) => sum + t.played, 0) / 2;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy-dark via-navy to-navy-light overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gold rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-24">
          {/* Sponsor Banner */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="bg-navy-light/60 border border-gold/30 rounded-lg px-4 sm:px-6 py-2 sm:py-3 flex items-center gap-2 sm:gap-3">
              <span className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">
                Main Sponsor
              </span>
              <span className="text-gold font-bold text-base sm:text-xl">
                MKM Dumfries Timber
              </span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-6xl font-bold text-center text-white mb-3 sm:mb-4">
            Dumfries <span className="text-gold">Pool League</span>
          </h1>
          <p className="text-center text-gray-400 text-sm sm:text-lg max-w-2xl mx-auto mb-8 sm:mb-10 px-2">
            The home of competitive pool in Dumfries. Live standings, fixtures,
            results, and player stats all in one place.
          </p>

          {/* Stats Bar */}
          <div className="flex justify-center gap-6 sm:gap-16">
            <div className="text-center">
              <p className="text-2xl sm:text-4xl font-bold text-gold">
                {totalTeams}
              </p>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">Teams</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-4xl font-bold text-gold">
                {totalMatchesPlayed}
              </p>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">Matches Played</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-4xl font-bold text-gold">
                {upcomingFixtures.length}
              </p>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">Upcoming</p>
            </div>
          </div>
        </div>
      </section>

      {/* League Table Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">League Standings</h2>
          <Link
            href="/table"
            className="text-gold hover:text-gold-light text-sm font-medium transition-colors"
          >
            View Full Table →
          </Link>
        </div>
        <div className="bg-navy-light/50 border border-gold/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold/10 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-3 sm:px-4 py-3 text-left">#</th>
                <th className="px-3 sm:px-4 py-3 text-left">Team</th>
                <th className="px-2 sm:px-4 py-3 text-center">P</th>
                <th className="px-2 sm:px-4 py-3 text-center">W</th>
                <th className="px-2 sm:px-4 py-3 text-center hidden sm:table-cell">D</th>
                <th className="px-2 sm:px-4 py-3 text-center">L</th>
                <th className="px-2 sm:px-4 py-3 text-center">Pts</th>
              </tr>
            </thead>
            <tbody>
              {top5.map((team, i) => (
                <tr
                  key={team.name}
                  className="border-b border-navy/50 hover:bg-navy-light/70 transition-colors"
                >
                  <td className="px-3 sm:px-4 py-3 text-gold font-bold">{i + 1}</td>
                  <td className="px-3 sm:px-4 py-3 font-medium text-white">
                    {team.name}
                  </td>
                  <td className="px-2 sm:px-4 py-3 text-center text-gray-300">
                    {team.played}
                  </td>
                  <td className="px-2 sm:px-4 py-3 text-center text-gray-300">
                    {team.won}
                  </td>
                  <td className="px-2 sm:px-4 py-3 text-center text-gray-300 hidden sm:table-cell">
                    {team.drawn}
                  </td>
                  <td className="px-2 sm:px-4 py-3 text-center text-gray-300">
                    {team.lost}
                  </td>
                  <td className="px-2 sm:px-4 py-3 text-center font-bold text-gold">
                    {team.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Fixtures & Results Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Upcoming Fixtures */}
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Upcoming Fixtures
              </h2>
              <Link
                href="/fixtures"
                className="text-gold hover:text-gold-light text-sm font-medium transition-colors"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingFixtures.length === 0 && (
                <p className="text-gray-500 text-sm">
                  No upcoming fixtures scheduled.
                </p>
              )}
              {upcomingFixtures.map((f, i) => (
                <div
                  key={i}
                  className="bg-navy-light/50 border border-gold/10 rounded-lg p-3 sm:p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">{f.date}</span>
                    <span className="text-xs text-gray-500">{f.time}</span>
                  </div>
                  <div className="flex items-center justify-between min-w-0">
                    <span className="text-white font-medium text-sm flex-1 truncate">
                      {f.home}
                    </span>
                    <span className="text-gold text-xs font-bold px-2 shrink-0">vs</span>
                    <span className="text-white font-medium text-sm flex-1 text-right truncate">
                      {f.away}
                    </span>
                  </div>
                  {f.venue && (
                    <p className="text-xs text-gray-500 mt-2 truncate">{f.venue}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Latest Results */}
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Latest Results</h2>
              <Link
                href="/results"
                className="text-gold hover:text-gold-light text-sm font-medium transition-colors"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {latestResults.length === 0 && (
                <p className="text-gray-500 text-sm">No results available.</p>
              )}
              {latestResults.map((r, i) => (
                <div
                  key={i}
                  className="bg-navy-light/50 border border-gold/10 rounded-lg p-3 sm:p-4"
                >
                  <span className="text-xs text-gray-400 block mb-2">
                    {r.date}
                  </span>
                  <div className="flex items-center justify-between min-w-0">
                    <span className="text-white font-medium text-xs sm:text-sm flex-1 truncate">
                      {r.home}
                    </span>
                    <span className="text-gold font-bold px-2 sm:px-3 text-sm bg-navy/60 rounded py-1 shrink-0">
                      {r.score}
                    </span>
                    <span className="text-white font-medium text-xs sm:text-sm flex-1 text-right truncate">
                      {r.away}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
