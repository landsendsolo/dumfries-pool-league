import { getFixtures } from "@/lib/leagueapp";

export const metadata = {
  title: "Fixtures | Dumfries Pool League",
};

interface GroupedFixtures {
  [date: string]: {
    date: string;
    time: string;
    home: string;
    away: string;
    venue: string;
    tables: string;
  }[];
}

export default async function FixturesPage() {
  const fixtures = await getFixtures();

  // Group fixtures by date
  const grouped: GroupedFixtures = {};
  for (const f of fixtures) {
    if (!grouped[f.date]) grouped[f.date] = [];
    grouped[f.date].push(f);
  }
  const dates = Object.keys(grouped);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Fixtures</h1>
        <p className="text-gray-400 text-sm mt-1">
          All upcoming matches grouped by date
        </p>
      </div>

      {dates.length === 0 && (
        <p className="text-center text-gray-500 py-12">
          No fixtures available.
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
              {grouped[date].map((f, i) => (
                <div
                  key={i}
                  className="bg-navy-light/50 border border-gold/10 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                >
                  <span className="text-xs text-gray-500 sm:w-16 shrink-0">
                    {f.time}
                  </span>
                  <div className="flex items-center flex-1 min-w-0">
                    <span className="text-white font-medium text-sm flex-1 truncate">
                      {f.home}
                    </span>
                    <span className="text-gold text-xs font-bold px-3">vs</span>
                    <span className="text-white font-medium text-sm flex-1 text-right truncate">
                      {f.away}
                    </span>
                  </div>
                  {f.venue && (
                    <span className="text-xs text-gray-500 sm:w-48 sm:text-right truncate shrink-0">
                      📍 {f.venue}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
