import { getResults } from "@/lib/leagueapp";

export const metadata = {
  title: "Results | Dumfries Pool League",
};

export default async function ResultsPage() {
  const results = await getResults();

  // Group results by date
  const grouped: Record<string, typeof results> = {};
  for (const r of results) {
    if (!grouped[r.date]) grouped[r.date] = [];
    grouped[r.date].push(r);
  }
  const dates = Object.keys(grouped);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Results</h1>
        <p className="text-gray-400 text-sm mt-1">
          Recent match results and scores
        </p>
      </div>

      {dates.length === 0 && (
        <p className="text-center text-gray-500 py-12">
          No results available.
        </p>
      )}

      <div className="space-y-8">
        {dates.map((date) => (
          <div key={date}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-gold/20" />
              <h2 className="text-gold font-semibold text-sm uppercase tracking-wider whitespace-nowrap">
                {date}
              </h2>
              <div className="h-px flex-1 bg-gold/20" />
            </div>

            <div className="space-y-3">
              {grouped[date].map((r, i) => (
                <div
                  key={i}
                  className="bg-navy-light/50 border border-gold/10 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium text-sm flex-1">
                      {r.home}
                    </span>
                    <span className="text-gold font-bold px-4 text-sm bg-navy/60 rounded py-1 mx-2 whitespace-nowrap">
                      {r.score}
                    </span>
                    <span className="text-white font-medium text-sm flex-1 text-right">
                      {r.away}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
