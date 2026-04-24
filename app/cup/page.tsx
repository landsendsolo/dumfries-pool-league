"use client";

import Link from "next/link";

// ── Team Competition — completed ──────────────────────────────
const SF1_WINNER: string = "Abbey A";
const SF2_WINNER: string = "Lochside Tavern";
const FINAL_SCORE: string = "4 - 2";
const CHAMPION: string = "Abbey A";

const SEMI_FINALS = [
  { label: "Semi Final 1", home: "Abbey A", away: "Abbey B", venue: "Abbey", time: "19:30", homeScore: 4, awayScore: 1 },
  { label: "Semi Final 2", home: "Lochside Tavern", away: "Normandy A", venue: "Normandy Bar", time: "19:30", homeScore: 4, awayScore: 3 },
];

export default function LeagueCompetitionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

      {/* ── SINGLES COMPETITION — UPCOMING ── */}
      <div className="mb-12">
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
            <p className="text-gold font-bold text-lg">6:30pm</p>
            <p className="text-gray-400 text-xs mt-1">Start — Both Nights</p>
          </div>
          <div className="bg-navy-light/50 border border-gold/20 rounded-xl p-4 text-center">
            <p className="text-gold font-bold text-lg">£5</p>
            <p className="text-gray-400 text-xs mt-1">Entry Fee</p>
          </div>
        </div>

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

        {/* Entries closed */}
        <div className="bg-navy-light/50 border border-gold/20 rounded-xl p-4 text-center mb-6 mt-6">
          <p className="text-gold font-semibold text-sm">Entries are now closed</p>
          <p className="text-gray-400 text-xs mt-1">Thank you to everyone who entered. Good luck!</p>
        </div>

        {/* View Draw link */}
        <Link
          href="/cup/singles"
          className="block bg-navy-light/50 border border-gold/30 rounded-xl p-5 text-center hover:border-gold/50 transition-colors group"
        >
          <span className="text-gold font-bold text-sm uppercase tracking-wider group-hover:text-gold/90">
            Dumfries Singles Pool Event — View Draw
          </span>
          <span className="block text-gray-400 text-xs mt-1">Full draw with all 32 players</span>
          <svg className="w-5 h-5 text-gold/60 group-hover:text-gold mx-auto mt-2 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
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
          <svg className="w-4 h-4 text-gold transition-transform group-open:rotate-180 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>

        <div className="mt-2 space-y-4">
          <div className="bg-gold/10 border-2 border-gold/40 rounded-xl p-6 text-center">
            <span className="text-xs font-bold text-gold uppercase tracking-widest block mb-2">Champions 2026</span>
            <p className="text-white font-bold text-2xl sm:text-3xl">🏆 {CHAMPION}</p>
            <p className="text-gray-400 text-sm mt-1">beat {SF2_WINNER} {FINAL_SCORE} in the Final</p>
            <p className="text-gray-500 text-xs mt-1">Normandy Bar — 27th March 2026</p>
          </div>

          <div className="bg-navy-light/50 border border-gold/20 rounded-xl p-5 sm:p-6 text-center">
            <span className="text-xs font-bold text-gold uppercase tracking-widest block mb-4">The Final</span>
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              <span className={`text-lg sm:text-xl font-bold ${CHAMPION === SF1_WINNER ? "text-gold" : "text-gray-500"}`}>{SF1_WINNER}</span>
              <span className="text-gold font-bold text-lg sm:text-xl bg-navy/60 rounded px-3 py-1">{FINAL_SCORE}</span>
              <span className={`text-lg sm:text-xl font-bold ${CHAMPION === SF2_WINNER ? "text-gold" : "text-gray-500"}`}>{SF2_WINNER}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SEMI_FINALS.map((sf) => {
              const winner = sf.homeScore > sf.awayScore ? sf.home : sf.away;
              return (
                <div key={sf.label} className="bg-navy-light/50 border border-gold/10 rounded-xl p-4 sm:p-5">
                  <span className="text-xs font-bold text-gold uppercase tracking-wider block mb-3">{sf.label}</span>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-base font-bold ${winner === sf.home ? "text-gold" : "text-gray-500"}`}>{sf.home}</span>
                      <span className={`text-lg font-bold tabular-nums ${winner === sf.home ? "text-gold" : "text-gray-500"}`}>{sf.homeScore}</span>
                    </div>
                    <div className="border-t border-gold/10" />
                    <div className="flex items-center justify-between">
                      <span className={`text-base font-bold ${winner === sf.away ? "text-gold" : "text-gray-500"}`}>{sf.away}</span>
                      <span className={`text-lg font-bold tabular-nums ${winner === sf.away ? "text-gold" : "text-gray-500"}`}>{sf.awayScore}</span>
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
        </div>
      </details>

    </div>
  );
}
