"use client";

import { useState, useEffect, useCallback } from "react";
import { saveSinglesResult, resetSinglesResult } from "./actions";
import { AdminNav } from "@/app/admin/components/admin-nav";
import { logout } from "@/app/admin/actions";

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

const ROUND_NAMES = ["Round 1", "Round 2", "Round 3", "Quarter Finals", "Semi Finals", "Final"];

export default function SinglesAdminPage() {
  const [data, setData] = useState<DrawData | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<SinglesMatch | null>(null);
  const [score1, setScore1] = useState("");
  const [score2, setScore2] = useState("");
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedRound, setSelectedRound] = useState(0);

  const fetchData = useCallback(async () => {
    const res = await fetch("/api/singles");
    if (res.ok) setData(await res.json());
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  function selectMatch(match: SinglesMatch) {
    setSelectedMatch(match);
    setScore1(match.score1?.toString() ?? "");
    setScore2(match.score2?.toString() ?? "");
    setPlayer1(match.player1 ?? "");
    setPlayer2(match.player2 ?? "");
    setMessage(null);
  }

  async function handleSave() {
    if (!selectedMatch) return;
    setSaving(true);
    setMessage(null);

    const s1 = parseInt(score1);
    const s2 = parseInt(score2);
    const winner = !isNaN(s1) && !isNaN(s2)
      ? s1 > s2
        ? (player1 || selectedMatch.player1)
        : (player2 || selectedMatch.player2)
      : null;

    try {
      await saveSinglesResult(
        selectedMatch.id,
        player1 || selectedMatch.player1,
        player2 || selectedMatch.player2,
        isNaN(s1) ? null : s1,
        isNaN(s2) ? null : s2,
        winner,
      );
      setMessage({ type: "success", text: "Result saved" });
      fetchData();
    } catch {
      setMessage({ type: "error", text: "Failed to save" });
    }
    setSaving(false);
  }

  async function handleReset() {
    if (!selectedMatch) return;
    setSaving(true);
    try {
      await resetSinglesResult(selectedMatch.id);
      setMessage({ type: "success", text: "Result cleared" });
      setScore1(""); setScore2("");
      fetchData();
    } catch {
      setMessage({ type: "error", text: "Failed to reset" });
    }
    setSaving(false);
  }

  const roundMatches = data?.matches.filter(m => m.round === selectedRound).sort((a, b) => a.position - b.position) ?? [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <AdminNav />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Singles Draw Admin</h1>
          <p className="text-gray-400 text-sm mt-1">Enter results for the Singles Competition 2026</p>
        </div>
        <form action={logout}>
          <button type="submit" className="text-gray-500 hover:text-gray-300 text-xs cursor-pointer">Logout</button>
        </form>
      </div>

      {/* Round selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {ROUND_NAMES.map((name, i) => (
          <button
            key={i}
            onClick={() => { setSelectedRound(i); setSelectedMatch(null); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-colors ${selectedRound === i ? "bg-gold text-navy" : "bg-navy-light/50 border border-gold/20 text-gray-400 hover:text-white"}`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Match list */}
        <div className="bg-navy-light/50 border border-gold/20 rounded-xl p-4">
          <h2 className="text-xs font-bold text-gold uppercase tracking-wider mb-3">{ROUND_NAMES[selectedRound]} Matches</h2>
          <div className="space-y-2">
            {roundMatches.map(match => (
              <button
                key={match.id}
                onClick={() => selectMatch(match)}
                className={`w-full text-left rounded-lg px-3 py-2.5 text-sm transition-colors cursor-pointer border ${selectedMatch?.id === match.id ? "bg-gold/10 border-gold/40" : "bg-navy-dark/30 border-gold/10 hover:border-gold/30"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-xs font-medium ${match.winner === match.player1 ? "text-gold" : "text-white"}`}>
                      {match.player1 || "TBD"}
                    </p>
                    <p className={`truncate text-xs ${match.winner === match.player2 ? "text-gold" : "text-gray-400"}`}>
                      {match.player2 || "TBD"}
                    </p>
                  </div>
                  {match.score1 !== null && (
                    <span className="text-xs text-gold font-bold ml-2 shrink-0">
                      {match.score1}-{match.score2}
                    </span>
                  )}
                </div>
              </button>
            ))}
            {roundMatches.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">No matches in this round</p>
            )}
          </div>
        </div>

        {/* Result entry */}
        <div className="bg-navy-light/50 border border-gold/20 rounded-xl p-4">
          <h2 className="text-xs font-bold text-gold uppercase tracking-wider mb-3">Enter Result</h2>
          {selectedMatch ? (
            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-xs block mb-1">Player 1</label>
                <input
                  value={player1}
                  onChange={e => setPlayer1(e.target.value)}
                  placeholder={selectedMatch.player1 || "Player 1"}
                  className="w-full bg-navy-dark/50 border border-gold/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/50"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs block mb-1">Player 2</label>
                <input
                  value={player2}
                  onChange={e => setPlayer2(e.target.value)}
                  placeholder={selectedMatch.player2 || "Player 2"}
                  className="w-full bg-navy-dark/50 border border-gold/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 text-xs block mb-1">Score P1</label>
                  <input
                    type="number" min={0} max={5}
                    value={score1}
                    onChange={e => setScore1(e.target.value)}
                    className="w-full bg-navy-dark/50 border border-gold/20 rounded-lg px-3 py-2 text-white text-sm text-center focus:outline-none focus:border-gold/50"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs block mb-1">Score P2</label>
                  <input
                    type="number" min={0} max={5}
                    value={score2}
                    onChange={e => setScore2(e.target.value)}
                    className="w-full bg-navy-dark/50 border border-gold/20 rounded-lg px-3 py-2 text-white text-sm text-center focus:outline-none focus:border-gold/50"
                  />
                </div>
              </div>

              {message && (
                <div className={`rounded-lg p-2.5 text-xs ${message.type === "success" ? "bg-green-900/30 border border-green-500/30 text-green-400" : "bg-red-900/30 border border-red-500/30 text-red-400"}`}>
                  {message.text}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-gold text-navy font-bold text-sm px-4 py-2.5 rounded-lg hover:bg-gold/90 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Result"}
                </button>
                <button
                  onClick={handleReset}
                  disabled={saving}
                  className="bg-red-500/20 border border-red-500/30 text-red-400 text-sm px-4 py-2.5 rounded-lg hover:bg-red-500/30 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Reset
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-8">Select a match to enter result</p>
          )}
        </div>
      </div>
    </div>
  );
}
