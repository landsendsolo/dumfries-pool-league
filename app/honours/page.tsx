import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Honours | Dumfries Pool League",
};

const competitions = [
  {
    id: "league",
    title: "League Champions",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    winners: [],
  },
  {
    id: "singles",
    title: "Singles Competition",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    winners: [],
  },
  {
    id: "doubles",
    title: "Doubles Competition",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    winners: [],
  },
  {
    id: "team-competition",
    title: "Team Competition",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    winners: [
      { year: "2025/26", winner: "Abbey A" },
    ],
  },
  {
    id: "super11s",
    title: "SPA Super 11s",
    icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
    winners: [
      { year: "2025/26", winner: "Team Dumfries (Premier Division)" },
    ],
  },
];

export default function HonoursPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">Honours</h1>
        <p className="text-gray-400 text-sm mt-1">
          A record of Dumfries Pool League champions and competition winners
        </p>
      </div>

      <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 sm:p-5 mb-10 flex items-start gap-3">
        <svg className="w-5 h-5 text-gold shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-gray-300 text-sm">
          Historical records are currently being retrieved from the league archives. Full honours going back to the league’s founding will be added here shortly. If you have records or photos from past seasons please contact us.
        </p>
      </div>

      <div className="space-y-8">
        {competitions.map((comp) => (
          <div key={comp.id} className="bg-navy-light/50 border border-gold/10 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gold/10">
              <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={comp.icon} />
                </svg>
              </div>
              <h2 className="text-white font-bold text-base">{comp.title}</h2>
            </div>

            {comp.winners.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-gold/5">
                    <th className="px-5 py-3 text-left">Season</th>
                    <th className="px-5 py-3 text-left">Winner</th>
                  </tr>
                </thead>
                <tbody>
                  {comp.winners.map((w, i) => (
                    <tr key={i} className={`border-b border-gold/5 last:border-0 ${i === 0 ? "bg-gold/5" : ""}`}>
                      <td className="px-5 py-3 text-gray-400 font-medium">{w.year}</td>
                      <td className="px-5 py-3 text-white font-semibold">
                        {i === 0 && <span className="mr-2">🏆</span>}
                        {w.winner}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="px-5 py-6 text-gray-500 text-sm italic">
                Awaiting archive retrieval…
              </p>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
