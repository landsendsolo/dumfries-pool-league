"use client";

interface SinglesMatch {
  id: string;
  round: number;
  position: number;
  player1: string | null;
  player2: string | null;
  score1: number | null;
  score2: number | null;
  winner: string | null;
}

const ROUNDS = [
  { name: "Round 1", date: "17th April" },
  { name: "Round 2", date: "17th April" },
  { name: "Round 3", date: "24th April" },
  { name: "Quarter Finals", date: "24th April" },
  { name: "Semi Finals", date: "24th April" },
  { name: "Final", date: "24th April · Abbey Inn" },
];

const MATCHES: SinglesMatch[] = [
  // Round 1 — 18 matches
  { id: "R1-1",  round: 0, position: 1,  player1: "S. McLeod",      player2: "S. Couper",      score1: null, score2: null, winner: null },
  { id: "R1-2",  round: 0, position: 2,  player1: "S. Rutherford",  player2: "G. Hunter",      score1: null, score2: null, winner: null },
  { id: "R1-3",  round: 0, position: 3,  player1: "D. Cruickshank", player2: "D. Young",       score1: null, score2: null, winner: null },
  { id: "R1-4",  round: 0, position: 4,  player1: "L. Donaldson",   player2: "C. Silver",      score1: null, score2: null, winner: null },
  { id: "R1-5",  round: 0, position: 5,  player1: "K. Kirkpatrick", player2: "J. Stewart",     score1: null, score2: null, winner: null },
  { id: "R1-6",  round: 0, position: 6,  player1: "A. Moffat",      player2: "A. Bell",        score1: null, score2: null, winner: null },
  { id: "R1-7",  round: 0, position: 7,  player1: "D. Cameron",     player2: "C. Riddock",     score1: null, score2: null, winner: null },
  { id: "R1-8",  round: 0, position: 8,  player1: "K. Galligan",    player2: "CJ Clapperton",  score1: null, score2: null, winner: null },
  { id: "R1-9",  round: 0, position: 9,  player1: "L. Kerr",        player2: "P. Hamilton",    score1: null, score2: null, winner: null },
  { id: "R1-10", round: 0, position: 10, player1: "A. Lammie Snr",  player2: "J. Kelly",       score1: null, score2: null, winner: null },
  { id: "R1-11", round: 0, position: 11, player1: "J. Deelen",      player2: "O. Brown",       score1: null, score2: null, winner: null },
  { id: "R1-12", round: 0, position: 12, player1: "J. Robertson",   player2: "M. Lockhart",    score1: null, score2: null, winner: null },
  { id: "R1-13", round: 0, position: 13, player1: "R. Kelly",       player2: "C. Robb",        score1: null, score2: null, winner: null },
  { id: "R1-14", round: 0, position: 14, player1: "D. Thom",        player2: "D. Dalgleish",   score1: null, score2: null, winner: null },
  { id: "R1-15", round: 0, position: 15, player1: "R. Turley",      player2: "P. Coulter",     score1: null, score2: null, winner: null },
  { id: "R1-16", round: 0, position: 16, player1: "S. Griggs",      player2: "D. Livingstone", score1: null, score2: null, winner: null },
  { id: "R1-17", round: 0, position: 17, player1: "M. Donnan",      player2: "D. Wylie",       score1: null, score2: null, winner: null },
  { id: "R1-18", round: 0, position: 18, player1: "S. Kirkpatrick", player2: "P. Prange",      score1: null, score2: null, winner: null },

  // Round 2 — top half (7 bye matches)
  { id: "R2-1",  round: 1, position: 1,  player1: "J. Howie",     player2: "R.A. Cooper",   score1: null, score2: null, winner: null },
  { id: "R2-2",  round: 1, position: 2,  player1: "G. Campbell",  player2: "J. McEwan",     score1: null, score2: null, winner: null },
  { id: "R2-3",  round: 1, position: 3,  player1: "R. Hutchison", player2: "A. Lammie Jnr", score1: null, score2: null, winner: null },
  { id: "R2-4",  round: 1, position: 4,  player1: "C. Jackson",   player2: "S. Drysdale",   score1: null, score2: null, winner: null },
  { id: "R2-5",  round: 1, position: 5,  player1: "S. Trainor",   player2: "L. McPherson",  score1: null, score2: null, winner: null },
  { id: "R2-6",  round: 1, position: 6,  player1: "N. Maloney",   player2: "O. Bruce",      score1: null, score2: null, winner: null },
  { id: "R2-7",  round: 1, position: 7,  player1: "A. Parker",    player2: "P. Scott",      score1: null, score2: null, winner: null },

  // Round 2 — bottom half (9 R1 winners vs each other)
  { id: "R2-8",  round: 1, position: 8,  player1: "R1 winner",    player2: "R1 winner",     score1: null, score2: null, winner: null },
  { id: "R2-9",  round: 1, position: 9,  player1: "R1 winner",    player2: "R1 winner",     score1: null, score2: null, winner: null },
  { id: "R2-10", round: 1, position: 10, player1: "R1 winner",    player2: "R1 winner",     score1: null, score2: null, winner: null },
  { id: "R2-11", round: 1, position: 11, player1: "R1 winner",    player2: "R1 winner",     score1: null, score2: null, winner: null },
  { id: "R2-12", round: 1, position: 12, player1: "R1 winner",    player2: "R1 winner",     score1: null, score2: null, winner: null },
  { id: "R2-13", round: 1, position: 13, player1: "R1 winner",    player2: "R1 winner",     score1: null, score2: null, winner: null },
  { id: "R2-14", round: 1, position: 14, player1: "R1 winner",    player2: "R1 winner",     score1: null, score2: null, winner: null },
  { id: "R2-15", round: 1, position: 15, player1: "R1 winner",    player2: "R1 winner",     score1: null, score2: null, winner: null },
  { id: "R2-16", round: 1, position: 16, player1: "R1 winner",    player2: "R1 winner",     score1: null, score2: null, winner: null },

  // Round 3 — 8 matches
  { id: "R3-1", round: 2, position: 1, player1: null, player2: null, score1: null, score2: null, winner: null },
  { id: "R3-2", round: 2, position: 2, player1: null, player2: null, score1: null, score2: null, winner: null },
  { id: "R3-3", round: 2, position: 3, player1: null, player2: null, score1: null, score2: null, winner: null },
  { id: "R3-4", round: 2, position: 4, player1: null, player2: null, score1: null, score2: null, winner: null },
  { id: "R3-5", round: 2, position: 5, player1: null, player2: null, score1: null, score2: null, winner: null },
  { id: "R3-6", round: 2, position: 6, player1: null, player2: null, score1: null, score2: null, winner: null },
  { id: "R3-7", round: 2, position: 7, player1: null, player2: null, score1: null, score2: null, winner: null },
  { id: "R3-8", round: 2, position: 8, player1: null, player2: null, score1: null, score2: null, winner: null },

  // Quarter Finals
  { id: "QF-1", round: 3, position: 1, player1: null, player2: null, score1: null, score2: null, winner: null },
  { id: "QF-2", round: 3, position: 2, player1: null, player2: null, score1: null, score2: null, winner: null },
  { id: "QF-3", round: 3, position: 3, player1: null, player2: null, score1: null, score2: null, winner: null },
  { id: "QF-4", round: 3, position: 4, player1: null, player2: null, score1: null, score2: null, winner: null },

  // Semi Finals
  { id: "SF-1", round: 4, position: 1, player1: null, player2: null, score1: null, score2: null, winner: null },
  { id: "SF-2", round: 4, position: 2, player1: null, player2: null, score1: null, score2: null, winner: null },

  // Final
  { id: "F-1", round: 5, position: 1, player1: null, player2: null, score1: null, score2: null, winner: null },
];

function MatchCard({ match, isFinal }: { match: SinglesMatch; isFinal: boolean }) {
  const isComplete = match.winner !== null;
  const p1Won = isComplete && match.winner === match.player1;
  const p2Won = isComplete && match.winner === match.player2;
  const isTbd = match.player1 === "R1 winner";

  return (
    <div className={`rounded-lg text-xs border ${isFinal ? "bg-gold/10 border-gold/30" : "bg-navy-light/50 border-gold/10"}`}>
      <div className={`flex items-center justify-between py-1.5 px-2.5 rounded-t-lg ${p1Won ? "bg-gold/5" : ""}`}>
        <span className={`truncate flex-1 ${p1Won ? "text-gold font-semibold" : isTbd ? "text-gray-500 italic" : match.player1 ? "text-white" : "text-gray-500 italic"}`}>
          {isTbd ? "TBD" : match.player1 || "TBD"}
        </span>
        {isComplete && !isTbd && (
          <span className={`ml-2 font-mono tabular-nums ${p1Won ? "text-gold font-bold" : "text-gray-500"}`}>
            {match.score1}
          </span>
        )}
      </div>
      <div className="border-t border-navy/30 mx-1" />
      <div className={`flex items-center justify-between py-1.5 px-2.5 rounded-b-lg ${p2Won ? "bg-gold/5" : ""}`}>
        <span className={`truncate flex-1 ${p2Won ? "text-gold font-semibold" : isTbd ? "text-gray-500 italic" : match.player2 ? "text-white" : "text-gray-500 italic"}`}>
          {isTbd ? "TBD" : match.player2 || "TBD"}
        </span>
        {isComplete && !isTbd && (
          <span className={`ml-2 font-mono tabular-nums ${p2Won ? "text-gold font-bold" : "text-gray-500"}`}>
            {match.score2}
          </span>
        )}
      </div>
      {isFinal && isComplete && (
        <div className="text-center py-1.5 border-t border-gold/20">
          <span className="text-[10px] text-gold font-bold uppercase tracking-wider">Champion</span>
        </div>
      )}
    </div>
  );
}

function RoundColumn({ matches, roundIndex }: { matches: SinglesMatch[]; roundIndex: number }) {
  const round = ROUNDS[roundIndex];
  const gap = Math.pow(2, roundIndex) * 8 + 8;
  const paddingTop = roundIndex > 0 ? (Math.pow(2, roundIndex) - 1) * 24 : 0;

  return (
    <div className="flex-1" style={{ minWidth: "155px" }}>
      <div className="text-center mb-3">
        <span className="text-[11px] text-gold font-bold uppercase tracking-wider block">{round.name}</span>
        <span className="text-[10px] text-gray-500 block">{round.date}</span>
      </div>
      <div className="flex flex-col" style={{ gap: `${gap}px`, paddingTop: `${paddingTop}px` }}>
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} isFinal={roundIndex === 5} />
        ))}
      </div>
    </div>
  );
}

export function SinglesDrawView() {
  const winner = MATCHES.find(m => m.round === 5 && m.winner)?.winner;
  const matchesByRound = ROUNDS.map((_, i) =>
    MATCHES.filter(m => m.round === i).sort((a, b) => a.position - b.position)
  );

  return (
    <div>
      {winner && (
        <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 sm:p-6 mb-6 text-center">
          <span className="text-xs text-gold font-bold uppercase tracking-wider block mb-2">Champion</span>
          <p className="text-white font-bold text-xl sm:text-2xl">🏆 {winner}</p>
        </div>
      )}
      <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        <div className="flex gap-3" style={{ minWidth: "1050px" }}>
          {matchesByRound.map((roundMatches, i) => (
            <RoundColumn key={i} matches={roundMatches} roundIndex={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
