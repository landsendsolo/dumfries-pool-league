import { readFile } from "fs/promises";
import path from "path";

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

interface Round {
  name: string;
  date: string;
}

interface DrawData {
  rounds: Round[];
  matches: SinglesMatch[];
}

const SLOT_H = 58;
const R1_COUNT = 18;

function MatchCard({ match, isFinal }: { match: SinglesMatch; isFinal: boolean }) {
  const isComplete = match.winner !== null;
  const p1Won = isComplete && match.winner === match.player1;
  const p2Won = isComplete && match.winner === match.player2;

  return (
    <div className={`rounded-lg text-xs border ${isFinal ? "bg-gold/10 border-gold/30" : "bg-navy-light/50 border-gold/10"}`}>
      <div className={`flex items-center justify-between py-1.5 px-2.5 rounded-t-lg ${p1Won ? "bg-gold/5" : ""}`}>
        <span className={`truncate flex-1 ${p1Won ? "text-gold font-semibold" : match.player1 ? "text-white" : "text-gray-500 italic"}`}>
          {match.player1 || "TBD"}
        </span>
        {isComplete && (
          <span className={`ml-2 font-mono tabular-nums ${p1Won ? "text-gold font-bold" : "text-gray-500"}`}>
            {match.score1}
          </span>
        )}
      </div>
      <div className="border-t border-navy/30 mx-1" />
      <div className={`flex items-center justify-between py-1.5 px-2.5 rounded-b-lg ${p2Won ? "bg-gold/5" : ""}`}>
        <span className={`truncate flex-1 ${p2Won ? "text-gold font-semibold" : match.player2 ? "text-white" : "text-gray-500 italic"}`}>
          {match.player2 || "TBD"}
        </span>
        {isComplete && (
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

function RoundColumn({ matches, roundIndex, roundInfo }: { matches: SinglesMatch[]; roundIndex: number; roundInfo: Round }) {
  const totalH = R1_COUNT * SLOT_H;
  const slotH = totalH / matches.length;

  return (
    <div className="flex-1" style={{ minWidth: "155px" }}>
      <div className="text-center mb-3">
        <span className="text-[11px] text-gold font-bold uppercase tracking-wider block">{roundInfo.name}</span>
        <span className="text-[10px] text-gray-500 block">{roundInfo.date}</span>
      </div>
      <div style={{ height: `${totalH}px`, display: "flex", flexDirection: "column" }}>
        {matches.map((match) => (
          <div key={match.id} style={{ height: `${slotH}px`, display: "flex", alignItems: "center" }}>
            <div style={{ width: "100%" }}>
              <MatchCard match={match} isFinal={roundIndex === 5} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function SinglesDrawView() {
  let data: DrawData;
  try {
    const raw = await readFile(path.join(process.cwd(), "data", "singles-draw.json"), "utf-8");
    data = JSON.parse(raw);
  } catch {
    return <p className="text-gray-500 text-sm text-center py-8">Draw data unavailable.</p>;
  }

  const winner = data.matches.find(m => m.round === 5 && m.winner)?.winner;
  const matchesByRound = data.rounds.map((_, i) =>
    data.matches.filter(m => m.round === i).sort((a, b) => a.position - b.position)
  );

  return (
    <div>
      {winner && (
        <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 sm:p-6 mb-6 text-center">
          <span className="text-xs text-gold font-bold uppercase tracking-wider block mb-2">Champion</span>
          <p className="text-white font-bold text-xl sm:text-2xl">\U0001F3C6 {winner}</p>
        </div>
      )}
      <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        <div className="flex gap-3" style={{ minWidth: "1050px" }}>
          {matchesByRound.map((roundMatches, i) => (
            <RoundColumn key={i} matches={roundMatches} roundIndex={i} roundInfo={data.rounds[i]} />
          ))}
        </div>
      </div>
    </div>
  );
}
