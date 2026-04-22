"use client";

import type { IMDrawData, IMDrawMatch, IMDrawRound } from "@/lib/im-draw-types";

const SLOT_H = 58;

function MatchCard({ match, isFinal }: { match: IMDrawMatch; isFinal: boolean }) {
  const isComplete = match.winner !== null;
  const p1Won = isComplete && match.winner === match.player1;
  const p2Won = isComplete && match.winner === match.player2;

  return (
    <div
      className={`rounded-lg text-xs border ${
        isFinal
          ? "bg-gold/10 border-gold/30"
          : "bg-navy-light/50 border-gold/10"
      }`}
    >
      {/* Player 1 */}
      <div
        className={`flex items-center justify-between py-1.5 px-2.5 rounded-t-lg ${
          p1Won ? "bg-gold/5" : ""
        }`}
      >
        <span
          className={`truncate flex-1 ${
            p1Won
              ? "text-gold font-semibold"
              : match.player1
                ? "text-white"
                : "text-gray-500 italic"
          }`}
        >
          {match.player1 || "TBD"}
          {match.bye && (
            <span className="text-gray-500 text-[10px] ml-1">(BYE)</span>
          )}
        </span>
        {isComplete && !match.bye && (
          <span className={`ml-2 font-mono tabular-nums ${p1Won ? "text-gold font-bold" : "text-gray-500"}`}>
            {match.score1}
          </span>
        )}
      </div>

      <div className="border-t border-navy/30 mx-1" />

      {/* Player 2 */}
      <div
        className={`flex items-center justify-between py-1.5 px-2.5 rounded-b-lg ${
          p2Won ? "bg-gold/5" : ""
        }`}
      >
        <span
          className={`truncate flex-1 ${
            p2Won
              ? "text-gold font-semibold"
              : match.player2
                ? "text-white"
                : match.bye
                  ? "text-gray-600"
                  : "text-gray-500 italic"
          }`}
        >
          {match.bye ? "—" : match.player2 || "TBD"}
        </span>
        {isComplete && !match.bye && (
          <span className={`ml-2 font-mono tabular-nums ${p2Won ? "text-gold font-bold" : "text-gray-500"}`}>
            {match.score2}
          </span>
        )}
      </div>

      {/* Walkover badge */}
      {match.walkover && !match.bye && (
        <div className="text-center py-1 border-t border-navy/30">
          <span className="text-[9px] text-gray-500 bg-navy-dark/50 rounded px-1.5 py-0.5">
            W/O
          </span>
        </div>
      )}

      {/* Qualifier badge */}
      {isFinal && isComplete && (
        <div className="text-center py-1.5 border-t border-gold/20">
          <span className="text-[10px] text-gold font-bold uppercase tracking-wider">
            Both Qualify
          </span>
        </div>
      )}
    </div>
  );
}

function getPlayerStatus(
  name: string,
  matches: IMDrawMatch[],
): "qualified" | "eliminated" | "active" {
  const finalMatch = matches.find((m) => m.round === 4);
  if (finalMatch?.winner) {
    if (finalMatch.player1 === name || finalMatch.player2 === name) {
      return "qualified";
    }
  }

  const nonByeMatches = matches.filter((m) => !m.bye);
  for (const match of nonByeMatches) {
    if (match.winner && (match.player1 === name || match.player2 === name)) {
      if (match.winner !== name) return "eliminated";
    }
  }

  return "active";
}

export function IMDrawView({ data }: { data: IMDrawData }) {
  const rounds = data.rounds;
  const matchesByRound: IMDrawMatch[][] = rounds.map((_, i) =>
    data.matches
      .filter((m) => m.round === i)
      .sort((a, b) => a.position - b.position),
  );

  const allPlayers = [
    ...data.players.seeds.map((s) => ({ name: s.name, seed: s.seed })),
    ...data.players.entries.map((e) => ({ name: e.name, seed: null as number | null })),
  ];

  const finalMatch = data.matches.find((m) => m.round === 4);
  const qualifiers = finalMatch?.winner
    ? [finalMatch.player1, finalMatch.player2].filter(Boolean)
    : [];

  return (
    <div>
      {/* Qualifiers banner */}
      {qualifiers.length === 2 && (
        <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 sm:p-6 mb-6 text-center">
          <span className="text-xs text-gold font-bold uppercase tracking-wider block mb-2">
            Qualified for Finals
          </span>
          <div className="flex items-center justify-center gap-4 sm:gap-8">
            {qualifiers.map((name) => (
              <div key={name} className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="text-white font-bold text-sm sm:text-lg">{name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Draw */}
      <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        <div className="flex gap-3 sm:gap-4" style={{ minWidth: "920px" }}>
          {matchesByRound.map((roundMatches, roundIndex) => (
            <RoundColumn
              key={roundIndex}
              roundInfo={rounds[roundIndex]}
              matches={roundMatches}
              roundIndex={roundIndex}
              isFinal={roundIndex === 4}
              round0Count={matchesByRound[0]?.length ?? 1}
            />
          ))}
        </div>
      </div>

      {/* Players list */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-white mb-4">Players</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {allPlayers.map((player) => {
            const status = getPlayerStatus(player.name, data.matches);
            return (
              <div
                key={player.name}
                className={`flex items-center justify-between py-2 px-3 rounded-lg border text-sm ${
                  status === "qualified"
                    ? "bg-gold/10 border-gold/30"
                    : status === "eliminated"
                      ? "bg-navy-light/30 border-navy-light/50 opacity-60"
                      : "bg-navy-light/50 border-gold/10"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {player.seed && (
                    <span className="text-[10px] text-gold font-bold bg-gold/10 rounded px-1.5 py-0.5 shrink-0">
                      S{player.seed}
                    </span>
                  )}
                  <span
                    className={`truncate ${
                      status === "qualified"
                        ? "text-gold font-semibold"
                        : status === "eliminated"
                          ? "text-gray-500"
                          : "text-white"
                    }`}
                  >
                    {player.name}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider shrink-0 ml-2 ${
                    status === "qualified"
                      ? "text-gold"
                      : status === "eliminated"
                        ? "text-red-400/70"
                        : "text-green-400/70"
                  }`}
                >
                  {status === "qualified"
                    ? "Qualified"
                    : status === "eliminated"
                      ? "Eliminated"
                      : "Active"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function RoundColumn({
  roundInfo,
  matches,
  round0Count,
  isFinal,
}: {
  roundInfo: IMDrawRound;
  matches: IMDrawMatch[];
  round0Count: number;
  isFinal: boolean;
}) {
  const totalH = round0Count * SLOT_H;
  const slotH = totalH / matches.length;

  return (
    <div className="flex-1" style={{ minWidth: "160px" }}>
      {/* Round header */}
      <div className="text-center mb-3">
        <span className="text-[11px] text-gold font-bold uppercase tracking-wider block">
          {roundInfo.name}
        </span>
        <span className="text-[10px] text-gray-500 block">{roundInfo.deadline}</span>
      </div>

      {/* Match cards */}
      <div style={{ height: `${totalH}px` }} className="flex flex-col">
        {matches.map((match) => (
          <div key={match.id} style={{ height: `${slotH}px` }} className="flex items-center">
            <div className="w-full">
              <MatchCard match={match} isFinal={isFinal} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
