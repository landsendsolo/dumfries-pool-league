import { getKnockoutDraw } from "@/lib/leagueapp";

export const metadata = {
  title: "Cup Draw | Dumfries Pool League",
};

export default async function CupPage() {
  const matches = await getKnockoutDraw();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Cup Draw</h1>
        <p className="text-gray-400 text-sm mt-1">
          Knockout competition draw
        </p>
      </div>

      {matches.length === 0 ? (
        <div className="bg-navy-light/50 border border-gold/10 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gold"
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
          <h2 className="text-white font-semibold text-lg mb-2">
            No Draw Available
          </h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            The knockout draw hasn&apos;t been published yet. Check back later
            for the cup competition draw.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match, i) => (
            <div
              key={i}
              className="bg-navy-light/50 border border-gold/10 rounded-lg p-4"
            >
              {match.round && (
                <span className="text-xs text-gold font-semibold uppercase tracking-wider block mb-2">
                  {match.round}
                </span>
              )}
              <div className="flex items-center justify-between min-w-0">
                <span className="text-white font-medium text-xs sm:text-sm flex-1 truncate">
                  {match.home}
                </span>
                {match.score ? (
                  <span className="text-gold font-bold px-2 sm:px-4 text-sm bg-navy/60 rounded py-1 mx-1 sm:mx-2 whitespace-nowrap shrink-0">
                    {match.score}
                  </span>
                ) : (
                  <span className="text-gold text-xs font-bold px-2 sm:px-3 shrink-0">vs</span>
                )}
                <span className="text-white font-medium text-xs sm:text-sm flex-1 text-right truncate">
                  {match.away}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
