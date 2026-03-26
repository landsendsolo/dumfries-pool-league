"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import type { IMDrawData, IMDrawMatch } from "@/lib/im-draw-types";
import type { SpaEvent } from "@/lib/spa-event-types";
import { logout } from "@/app/admin/actions";
import { AdminNav } from "@/app/admin/components/admin-nav";

export default function AdminSpaEventsPage() {
  const [events, setEvents] = useState<SpaEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [data, setData] = useState<IMDrawData | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<SpaEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch("/api/spa-events");
      if (!res.ok) throw new Error("Failed to fetch events");
      const json = await res.json();
      setEvents(json.events || []);
      const active = (json.events as SpaEvent[]).find(
        (e) => e.status === "active",
      );
      const first = active || json.events[0];
      if (first && !selectedEventId) {
        setSelectedEventId(first.id);
      }
    } catch {
      setError("Failed to load events");
    }
  }, [selectedEventId]);

  const fetchDrawData = useCallback(async () => {
    if (!selectedEventId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/spa-events/${selectedEventId}`);
      if (res.status === 404) {
        setData(null);
        setError(null);
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setData(json);
      setError(null);
    } catch {
      setData(null);
      setError("Failed to load draw data");
    } finally {
      setLoading(false);
    }
  }, [selectedEventId]);

  useEffect(() => {
    fetchEvents().then(() => setLoading(false));
  }, [fetchEvents]);

  useEffect(() => {
    if (selectedEventId) {
      fetchDrawData();
      const evt = events.find((e) => e.id === selectedEventId);
      setSelectedEvent(evt ?? null);
    }
  }, [selectedEventId, fetchDrawData, events]);

  function refreshAll() {
    fetchEvents();
    fetchDrawData();
  }

  if (loading && !data && events.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <AdminNav />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            SPA Events Admin
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage draws and results
          </p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="text-gray-500 hover:text-gray-300 text-xs cursor-pointer"
          >
            Logout
          </button>
        </form>
      </div>

      {/* Event selector */}
      <EventSelector
        events={events}
        selectedId={selectedEventId}
        onChange={setSelectedEventId}
      />

      {selectedEvent && (
        <>
          <UploadSection
            event={selectedEvent}
            onUpdate={refreshAll}
          />

          {data ? (
            <>
              <OverviewSection data={data} />
              <EnterResultSection
                data={data}
                eventId={selectedEventId}
                onUpdate={fetchDrawData}
              />
              <DownloadSection
                event={selectedEvent}
                eventId={selectedEventId}
              />
              <ResultsTableSection
                data={data}
                eventId={selectedEventId}
                onUpdate={fetchDrawData}
              />
              <PlayerStatusSection data={data} />
            </>
          ) : (
            <div className="bg-navy-light/50 border border-gold/10 rounded-xl p-8 text-center">
              <p className="text-gray-400 text-sm">
                No draw data available for this event. Upload a
                spreadsheet to get started.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function EventSelector({
  events,
  selectedId,
  onChange,
}: {
  events: SpaEvent[];
  selectedId: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="bg-navy-light/50 border border-gold/20 rounded-xl p-4 sm:p-6 mb-6">
      <h2 className="text-sm font-bold text-gold uppercase tracking-wider mb-3">
        Select Event
      </h2>
      <select
        value={selectedId}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-navy-dark/50 border border-gold/20 rounded-lg px-4 py-3 text-white text-base focus:outline-none focus:border-gold/50 transition-colors cursor-pointer"
      >
        {events.map((e) => (
          <option key={e.id} value={e.id}>
            {e.name} — {e.status === "active" ? "Active" : e.status === "completed" ? "Completed" : "Upcoming"}
          </option>
        ))}
      </select>
    </div>
  );
}

function UploadSection({
  event,
  onUpdate,
}: {
  event: SpaEvent;
  onUpdate: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "warning";
    text: string;
  } | null>(null);

  async function handleUpload(e: FormEvent) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/spa-events/${event.id}/upload`, {
        method: "POST",
        body: formData,
      });

      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      const body = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: body.error || "Upload failed" });
        return;
      }

      let text = `Draw created: ${body.playerCount} players, ${body.matchCount} matches`;
      if (body.warning) {
        setMessage({ type: "warning", text: `${text}. Warning: ${body.warning}` });
      } else {
        setMessage({ type: "success", text });
      }
      setFile(null);
      onUpdate();
    } catch {
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="bg-navy-light/50 border border-gold/20 rounded-xl p-4 sm:p-6 mb-6">
      <h2 className="text-sm font-bold text-gold uppercase tracking-wider mb-4">
        Upload Spreadsheet
      </h2>

      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <input
            type="file"
            accept=".xlsx"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gold/10 file:text-gold hover:file:bg-gold/20 file:cursor-pointer cursor-pointer"
          />
          <p className="text-gray-500 text-xs mt-1">
            Upload the SPA Excel spreadsheet (.xlsx). Sheet 12 (Dumfries
            area) will be read.
          </p>
        </div>

        {event.hasSpreadsheet && (
          <p className="text-yellow-500/80 text-xs bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2">
            This event already has a spreadsheet. Uploading will replace the
            existing draw and any entered results.
          </p>
        )}

        <button
          type="submit"
          disabled={!file || uploading}
          className="w-full bg-gold text-navy font-bold text-base px-6 py-3 rounded-lg hover:bg-gold/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? "Uploading..." : "Upload Draw Spreadsheet"}
        </button>

        {message && (
          <div
            className={`rounded-lg p-3 text-sm ${
              message.type === "success"
                ? "bg-green-900/30 border border-green-500/30 text-green-400"
                : message.type === "warning"
                  ? "bg-yellow-900/30 border border-yellow-500/30 text-yellow-400"
                  : "bg-red-900/30 border border-red-500/30 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}

function OverviewSection({ data }: { data: IMDrawData }) {
  const nonByeMatches = data.matches.filter((m) => !m.bye);
  const completed = nonByeMatches.filter((m) => m.winner);
  const total = nonByeMatches.length;

  let currentRound = data.rounds.length - 1;
  for (let i = 0; i < data.rounds.length; i++) {
    const roundMatches = nonByeMatches.filter((m) => m.round === i);
    if (roundMatches.some((m) => !m.winner)) {
      currentRound = i;
      break;
    }
  }

  return (
    <div className="bg-navy-light/50 border border-gold/20 rounded-xl p-4 sm:p-6 mb-6">
      <h2 className="text-sm font-bold text-gold uppercase tracking-wider mb-3">
        Overview
      </h2>
      <div className="flex flex-wrap gap-4 text-sm">
        <div>
          <span className="text-gray-400">Current Round:</span>{" "}
          <span className="text-white font-medium">
            {data.rounds[currentRound]?.name ?? "—"}
          </span>
        </div>
        <div>
          <span className="text-gray-400">Results:</span>{" "}
          <span className="text-gold font-bold">{completed.length}</span>
          <span className="text-gray-400"> / {total}</span>
        </div>
      </div>
      <div className="mt-3 h-2 bg-navy-dark/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-gold rounded-full transition-all"
          style={{
            width: `${total > 0 ? (completed.length / total) * 100 : 0}%`,
          }}
        />
      </div>
    </div>
  );
}

function EnterResultSection({
  data,
  eventId,
  onUpdate,
}: {
  data: IMDrawData;
  eventId: string;
  onUpdate: () => void;
}) {
  const [selectedRound, setSelectedRound] = useState<number>(0);
  const [selectedMatchId, setSelectedMatchId] = useState<string>("");
  const [score1, setScore1] = useState("");
  const [score2, setScore2] = useState("");
  const [isWalkover, setIsWalkover] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    for (let i = 0; i < data.rounds.length; i++) {
      const playable = data.matches.filter(
        (m) =>
          m.round === i && !m.bye && !m.winner && m.player1 && m.player2,
      );
      if (playable.length > 0) {
        setSelectedRound(i);
        break;
      }
    }
  }, [data]);

  const playableMatches = data.matches.filter(
    (m) =>
      m.round === selectedRound &&
      !m.bye &&
      !m.winner &&
      m.player1 &&
      m.player2,
  );

  const selectedMatch = data.matches.find((m) => m.id === selectedMatchId);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!selectedMatchId) return;
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/spa-events/${eventId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: selectedMatchId,
          score1: isWalkover ? 7 : parseInt(score1),
          score2: isWalkover ? 0 : parseInt(score2),
          walkover: isWalkover,
        }),
      });

      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      const body = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: body.error || "Failed to save" });
        return;
      }

      setMessage({ type: "success", text: "Result saved successfully" });
      setSelectedMatchId("");
      setScore1("");
      setScore2("");
      setIsWalkover(false);
      onUpdate();
    } catch {
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-navy-light/50 border border-gold/20 rounded-xl p-4 sm:p-6 mb-6">
      <h2 className="text-sm font-bold text-gold uppercase tracking-wider mb-4">
        Enter Result
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-gray-400 text-xs block mb-1">Round</label>
          <select
            value={selectedRound}
            onChange={(e) => {
              setSelectedRound(parseInt(e.target.value));
              setSelectedMatchId("");
            }}
            className="w-full bg-navy-dark/50 border border-gold/20 rounded-lg px-4 py-3 text-white text-base focus:outline-none focus:border-gold/50 transition-colors cursor-pointer"
          >
            {data.rounds.map((r, i) => (
              <option key={i} value={i}>
                {r.name} — {r.deadline}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-gray-400 text-xs block mb-1">Match</label>
          {playableMatches.length === 0 ? (
            <p className="text-gray-500 text-sm py-2">
              No playable matches in this round
            </p>
          ) : (
            <select
              value={selectedMatchId}
              onChange={(e) => setSelectedMatchId(e.target.value)}
              className="w-full bg-navy-dark/50 border border-gold/20 rounded-lg px-4 py-3 text-white text-base focus:outline-none focus:border-gold/50 transition-colors cursor-pointer"
            >
              <option value="">Select a match...</option>
              {playableMatches.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.id}: {m.player1} vs {m.player2}
                </option>
              ))}
            </select>
          )}
        </div>

        {selectedMatch && selectedMatch.player1 && selectedMatch.player2 && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-gray-400 text-xs block mb-1">
                  {selectedMatch.player1}
                </label>
                <input
                  type="number"
                  min={0}
                  max={7}
                  value={isWalkover ? "7" : score1}
                  onChange={(e) => setScore1(e.target.value)}
                  disabled={isWalkover}
                  className="w-full bg-navy-dark/50 border border-gold/20 rounded-lg px-4 py-3 text-white text-base text-center focus:outline-none focus:border-gold/50 transition-colors disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs block mb-1">
                  {selectedMatch.player2}
                </label>
                <input
                  type="number"
                  min={0}
                  max={7}
                  value={isWalkover ? "0" : score2}
                  onChange={(e) => setScore2(e.target.value)}
                  disabled={isWalkover}
                  className="w-full bg-navy-dark/50 border border-gold/20 rounded-lg px-4 py-3 text-white text-base text-center focus:outline-none focus:border-gold/50 transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 py-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isWalkover}
                onChange={(e) => setIsWalkover(e.target.checked)}
                className="w-5 h-5 rounded border-gold/30 bg-navy-dark/50 accent-gold"
              />
              <span className="text-gray-300 text-sm">
                Walkover (Player 1 wins 7-0)
              </span>
            </label>

            <button
              type="submit"
              disabled={submitting || (!isWalkover && (!score1 || !score2))}
              className="w-full bg-gold text-navy font-bold text-base px-6 py-3 rounded-lg hover:bg-gold/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Saving..." : "Save Result"}
            </button>
          </>
        )}

        {message && (
          <div
            className={`rounded-lg p-3 text-sm ${
              message.type === "success"
                ? "bg-green-900/30 border border-green-500/30 text-green-400"
                : "bg-red-900/30 border border-red-500/30 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}

function DownloadSection({
  event,
  eventId,
}: {
  event: SpaEvent;
  eventId: string;
}) {
  if (!event.hasSpreadsheet) return null;

  return (
    <div className="bg-navy-light/50 border border-gold/20 rounded-xl p-4 sm:p-6 mb-6">
      <h2 className="text-sm font-bold text-gold uppercase tracking-wider mb-3">
        Download for SPA Submission
      </h2>
      <p className="text-gray-400 text-sm mb-4">
        Download the original spreadsheet with Dumfries area results filled
        in.
      </p>
      <button
        onClick={() => {
          window.open(
            `/api/spa-events/${eventId}/download`,
            "_blank",
          );
        }}
        className="w-full bg-gold/10 border border-gold/30 text-gold font-bold text-base px-6 py-3 rounded-lg hover:bg-gold/20 transition-colors cursor-pointer"
      >
        Download Excel for SPA Submission
      </button>
    </div>
  );
}

function ResultsTableSection({
  data,
  eventId,
  onUpdate,
}: {
  data: IMDrawData;
  eventId: string;
  onUpdate: () => void;
}) {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const completedMatches = data.matches.filter(
    (m) => m.winner && !m.bye,
  );

  async function handleDelete(matchId: string) {
    setDeleting(true);
    try {
      const res = await fetch(`/api/spa-events/${eventId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId }),
      });

      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      if (res.ok) {
        setConfirmId(null);
        onUpdate();
      }
    } catch {
      // ignore
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="bg-navy-light/50 border border-gold/20 rounded-xl p-4 sm:p-6 mb-6">
      <h2 className="text-sm font-bold text-gold uppercase tracking-wider mb-4">
        Results Entered ({completedMatches.length})
      </h2>

      {completedMatches.length === 0 ? (
        <p className="text-gray-500 text-sm">No results entered yet.</p>
      ) : (
        <div className="space-y-2">
          {completedMatches.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between bg-navy-dark/30 border border-gold/10 rounded-lg px-3 py-2 text-sm"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-gray-500 text-xs shrink-0">
                  {m.id}
                </span>
                <span className="text-[10px] text-gold bg-gold/10 rounded px-1.5 py-0.5 shrink-0">
                  {data.rounds[m.round]?.name}
                </span>
                <span
                  className={`truncate ${
                    m.winner === m.player1
                      ? "text-gold font-semibold"
                      : "text-gray-400"
                  }`}
                >
                  {m.player1}
                </span>
                <span className="text-gold font-bold shrink-0">
                  {m.score1}-{m.score2}
                </span>
                <span
                  className={`truncate ${
                    m.winner === m.player2
                      ? "text-gold font-semibold"
                      : "text-gray-400"
                  }`}
                >
                  {m.player2}
                </span>
                {m.walkover && (
                  <span className="text-[9px] text-gray-500 bg-navy-dark/50 rounded px-1.5 py-0.5 shrink-0">
                    W/O
                  </span>
                )}
              </div>

              <div className="shrink-0 ml-2">
                {confirmId === m.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(m.id)}
                      disabled={deleting}
                      className="text-red-400 bg-red-500/20 border border-red-500/30 text-xs px-2 py-1 rounded hover:bg-red-500/30 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {deleting ? "..." : "Confirm"}
                    </button>
                    <button
                      onClick={() => setConfirmId(null)}
                      className="text-gray-400 text-xs px-2 py-1 rounded hover:text-gray-300 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmId(m.id)}
                    className="text-red-400/60 hover:text-red-400 text-xs px-2 py-1 cursor-pointer transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PlayerStatusSection({ data }: { data: IMDrawData }) {
  const allPlayers = [
    ...data.players.seeds.map((s) => ({ name: s.name, seed: s.seed })),
    ...data.players.entries.map((e) => ({
      name: e.name,
      seed: null as number | null,
    })),
  ];

  function getStatus(
    name: string,
  ): "active" | "eliminated" | "qualified" {
    const maxRound = Math.max(...data.matches.map((m) => m.round));
    const finalMatches = data.matches.filter((m) => m.round === maxRound);
    for (const fm of finalMatches) {
      if (
        fm.winner &&
        (fm.player1 === name || fm.player2 === name)
      ) {
        if (fm.winner === name) return "qualified";
      }
    }

    const nonByeMatches = data.matches.filter((m) => !m.bye);
    for (const match of nonByeMatches) {
      if (
        match.winner &&
        (match.player1 === name || match.player2 === name) &&
        match.winner !== name
      ) {
        return "eliminated";
      }
    }

    return "active";
  }

  return (
    <div className="bg-navy-light/50 border border-gold/20 rounded-xl p-4 sm:p-6">
      <h2 className="text-sm font-bold text-gold uppercase tracking-wider mb-4">
        Player Status
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {allPlayers.map((player) => {
          const status = getStatus(player.name);
          return (
            <div
              key={player.name}
              className="flex items-center justify-between py-1.5 px-3 rounded-lg text-sm"
            >
              <div className="flex items-center gap-2 min-w-0">
                {player.seed && (
                  <span className="text-[10px] text-gold font-bold bg-gold/10 rounded px-1.5 py-0.5 shrink-0">
                    S{player.seed}
                  </span>
                )}
                <span
                  className={`truncate ${
                    status === "eliminated" ? "text-gray-500" : "text-white"
                  }`}
                >
                  {player.name}
                </span>
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider shrink-0 ml-2 px-2 py-0.5 rounded ${
                  status === "qualified"
                    ? "text-gold bg-gold/10"
                    : status === "eliminated"
                      ? "text-red-400/70 bg-red-500/10"
                      : "text-green-400/70 bg-green-500/10"
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
  );
}
