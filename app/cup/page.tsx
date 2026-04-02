"use client";

import { useState } from "react";
import type { FormEvent } from "react";

const FORMSPREE_URL = "https://formspree.io/f/xnjoblqb";

type FormStatus = "idle" | "submitting" | "success" | "error";

// ── Team Competition — completed ──────────────────────────────
const SF1_WINNER: string = "Abbey A";
const SF2_WINNER: string = "Lochside Tavern";
const FINAL_SCORE: string = "4 - 2";
const CHAMPION: string = "Abbey A";

const SEMI_FINALS = [
  { label: "Semi Final 1", home: "Abbey A", away: "Abbey B", venue: "Abbey", time: "19:30", homeScore: 4, awayScore: 1 },
  { label: "Semi Final 2", home: "Lochside Tavern", away: "Normandy A", venue: "Normandy Bar", time: "19:30", homeScore: 4, awayScore: 3 },
];

function EntryForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [isDplPlayer, setIsDplPlayer] = useState<string>("");
  const [wantsToJoin, setWantsToJoin] = useState<string>("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
        setIsDplPlayer("");
        setWantsToJoin("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="bg-navy-light/50 border border-gold/20 rounded-xl p-5 sm:p-6 mt-6">
      <h3 className="text-gold font-bold text-sm uppercase tracking-wider mb-1">Enter the Competition</h3>
      <p className="text-gray-400 text-xs mb-4">
        Complete the form below then pay your £5 entry fee by bank transfer to{" "}
        <span className="text-white font-medium">Dumfries Pool League</span>,{" "}
        Sort: <span className="text-white font-medium">80-22-60</span>,{" "}
        Account: <span className="text-white font-medium">25616367</span>{" "}
        with your name and “singles” as the reference please.
      </p>

      {status === "success" ? (
        <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 text-green-400 text-sm">
          Entry received! Please remember to send your £5 entry fee. We will be in touch with draw details.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Hidden CC field for Donald */}
          <input type="hidden" name="_cc" value="mcdougall64@icloud.com" />
          <input type="hidden" name="_subject" value="Dumfries Singles 2026 — New Entry" />

          {/* Name */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full bg-navy-dark/50 border border-gold/20 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors"
              placeholder="Your full name"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Mobile Number <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              name="mobile"
              required
              className="w-full bg-navy-dark/50 border border-gold/20 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors"
              placeholder="For draw notifications"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              className="w-full bg-navy-dark/50 border border-gold/20 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors"
              placeholder="Optional"
            />
          </div>

          {/* DPL Player */}
          <div>
            <label className="block text-xs text-gray-400 mb-2">
              Are you a registered DPL player? <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dpl_player"
                  value="Yes"
                  required
                  onChange={() => { setIsDplPlayer("Yes"); setWantsToJoin(""); }}
                  className="accent-gold"
                />
                <span className="text-white text-sm">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dpl_player"
                  value="No"
                  onChange={() => setIsDplPlayer("No")}
                  className="accent-gold"
                />
                <span className="text-white text-sm">No</span>
              </label>
            </div>
          </div>

          {/* Want to join DPL — only shown if not a DPL player */}
          {isDplPlayer === "No" && (
            <div>
              <label className="block text-xs text-gray-400 mb-2">
                Would you like to join the Dumfries Pool League? <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-3 mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="wants_to_join"
                    value="Yes"
                    required
                    onChange={() => setWantsToJoin("Yes")}
                    className="accent-gold"
                  />
                  <span className="text-white text-sm">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="wants_to_join"
                    value="No"
                    onChange={() => setWantsToJoin("No")}
                    className="accent-gold"
                  />
                  <span className="text-white text-sm">No</span>
                </label>
              </div>
              {wantsToJoin === "Yes" && (
                <div className="bg-gold/5 border border-gold/20 rounded-lg p-3 text-xs text-gray-300 leading-relaxed">
                  To enter SPA events as a Dumfries player you must be a registered DPL member playing for a current team, playing under Blackball Rules. This would require joining a current DPL team and ceasing any International Pool Rules events. A committee member will be in touch to discuss joining.
                </div>
              )}
            </div>
          )}

          {/* Payment confirmation */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="payment_confirmed"
                value="Confirmed"
                required
                className="mt-0.5 w-4 h-4 accent-gold shrink-0"
              />
              <span className="text-gray-300 text-xs leading-relaxed">
                I confirm I will now send the £5 entry fee to{" "}
                <span className="text-white font-medium">Dumfries Pool League</span>,{" "}
                Sort: <span className="text-white font-medium">80-22-60</span>,{" "}
                Account: <span className="text-white font-medium">25616367</span>,{" "}
                using my name as the reference. <span className="text-red-400">*</span>
              </span>
            </label>
          </div>

          {status === "error" && (
            <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
              Something went wrong. Please try again or contact us directly.
            </div>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full sm:w-auto bg-gold text-navy font-bold text-sm px-6 py-3 rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-60 cursor-pointer"
          >
            {status === "submitting" ? "Submitting..." : "Submit Entry"}
          </button>
        </form>
      )}
    </div>
  );
}

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
            <p className="text-gold font-bold text-lg">6:00pm</p>
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

        <EntryForm />
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
