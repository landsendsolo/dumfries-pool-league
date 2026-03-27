"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

interface LiveMatch {
  home: string;
  away: string;
  score: string;
  matchId: string;
}

interface SpecialEvent {
  urgency: string;
  label: string;
  details: string;
  link: string;
}

interface LiveData {
  mode: "live" | "idle";
  matches: LiveMatch[];
  specialEvents: SpecialEvent[];
  nextFixtures: {
    date: string;
    time: string;
    home: string;
    away: string;
    venue: string;
  }[];
  latestResults: { home: string; away: string; score: string }[];
  updatedAt: string;
}

const REFRESH_INTERVAL = 10;

function isMatchWindow(): boolean {
  const now = new Date();
  const uk = new Date(
    now.toLocaleString("en-US", { timeZone: "Europe/London" }),
  );
  const day = uk.getDay(); // 0=Sun, 5=Fri
  const mins = uk.getHours() * 60 + uk.getMinutes();

  // Friday 19:00-23:59
  if (day === 5 && mins >= 19 * 60) return true;
  // Saturday 00:00-01:00 (continuation of Friday night)
  if (day === 6 && mins <= 60) return true;

  return false;
}

function shouldRefresh(data: LiveData | null): boolean {
  // Always refresh if live matches detected
  if (data?.mode === "live" && data.matches.length > 0) return true;
  // Refresh during match window (Friday 19:00-01:00 UK time)
  return isMatchWindow();
}

export default function LivePage() {
  const [data, setData] = useState<LiveData | null>(null);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dataRef = useRef<LiveData | null>(null);

  const clearTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  const startTimers = useCallback(
    (fetchFn: () => Promise<void>) => {
      clearTimers();
      intervalRef.current = setInterval(fetchFn, REFRESH_INTERVAL * 1000);
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => (prev <= 1 ? REFRESH_INTERVAL : prev - 1));
      }, 1000);
    },
    [clearTimers],
  );

  useEffect(() => {
    async function fetchLive() {
      try {
        const res = await fetch("/api/live");
        if (!res.ok) return;
        const json: LiveData = await res.json();
        setData(json);
        dataRef.current = json;

        // Re-evaluate auto-refresh after each fetch
        const should = shouldRefresh(json);
        setAutoRefresh(should);
      } catch {
        // fail silently
      } finally {
        setLoading(false);
        setCountdown(REFRESH_INTERVAL);
      }
    }

    // Initial fetch
    fetchLive();

    // Check match window every 60s (handles 19:00 transition)
    const windowCheck = setInterval(() => {
      const should = shouldRefresh(dataRef.current);
      setAutoRefresh(should);
    }, 60_000);

    return () => {
      clearTimers();
      clearInterval(windowCheck);
    };
  }, [clearTimers]);

  // Start/stop polling based on autoRefresh state
  useEffect(() => {
    if (autoRefresh) {
      async function fetchLive() {
        try {
          const res = await fetch("/api/live");
          if (!res.ok) return;
          const json: LiveData = await res.json();
          setData(json);
          dataRef.current = json;

          const should = shouldRefresh(json);
          setAutoRefresh(should);
        } catch {
          // fail silently
        } finally {
          setCountdown(REFRESH_INTERVAL);
        }
      }

      startTimers(fetchLive);
    } else {
      clearTimers();
    }

    return clearTimers;
  }, [autoRefresh, startTimers, clearTimers]);

  function formatTime(isoString: string): string {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Europe/London",
      });
    } catch {
      return "";
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-gray-400 text-lg">Loading live scores...</p>
      </div>
    );
  }

  const isLive = data?.mode === "live" && data.matches.length > 0;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Header */}
      <div className="text-center mb-8">
        {isLive ? (
          <>
            <span className="inline-flex items-center gap-2 bg-[#e24b4a] text-white text-sm font-bold px-4 py-2 rounded-lg mb-4">
              <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
              LIVE
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Live Scores
            </h1>
          </>
        ) : (
          <>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Live Scores
            </h1>
            <p className="text-gray-400">
              No live matches right now — check back on match nights
            </p>
          </>
        )}

        {/* Refresh info — only shown when auto-refreshing */}
        {autoRefresh && data && (
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-500">
            <span>Updated {formatTime(data.updatedAt)}</span>
            <span>Refreshing in {countdown}s</span>
          </div>
        )}
      </div>

      {/* LIVE: Match cards */}
      {isLive && (
        <div className="space-y-6">
          {data!.matches.map((match, i) => (
            <div
              key={i}
              className="bg-navy-light/50 border border-gold/20 rounded-xl p-6 sm:p-8"
            >
              <p className="text-xl sm:text-2xl font-bold text-white">
                {match.home}
              </p>
              <p className="text-5xl sm:text-6xl font-bold text-gold text-center py-4 tabular-nums">
                {match.score}
              </p>
              <p className="text-xl sm:text-2xl font-bold text-white text-right">
                {match.away}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Special events */}
      {!isLive && data && data.specialEvents && data.specialEvents.length > 0 && (
        <div className="mb-8 space-y-4">
          {data.specialEvents.map((event, i) => (
            <Link
              key={i}
              href={event.link}
              className="block bg-navy-light/50 border-2 border-gold/40 rounded-xl p-5 sm:p-6 hover:border-gold/60 transition-colors"
            >
              <span className="inline-flex items-center gap-2 bg-[#e24b4a] text-white text-xs font-bold px-3 py-1 rounded mb-3">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                {event.urgency}
              </span>
              <p className="text-xl sm:text-2xl font-bold text-white mb-1">
                {event.label}
              </p>
              <p className="text-gray-400 text-sm mb-3">{event.details}</p>
              <span className="text-gold text-sm font-medium">
                View draw &rarr;
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* IDLE: Next fixtures */}
      {!isLive && data && data.nextFixtures.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gold/20" />
            <h2 className="text-gold font-semibold text-sm uppercase tracking-wider whitespace-nowrap">
              Next Fixtures
            </h2>
            <div className="h-px flex-1 bg-gold/20" />
          </div>

          <div className="space-y-3">
            {data.nextFixtures.map((f, i) => (
              <div
                key={i}
                className="bg-navy-light/50 border border-gold/10 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <span className="text-xs text-gray-500 sm:w-28 shrink-0">
                  {f.date} {f.time}
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
                  <span className="text-xs text-gray-500 sm:w-40 sm:text-right truncate shrink-0">
                    {f.venue}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-3 text-center">
            <Link
              href="/fixtures"
              className="text-gold text-sm hover:underline"
            >
              View all fixtures &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* IDLE: Latest results */}
      {!isLive && data && data.latestResults.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gold/20" />
            <h2 className="text-gold font-semibold text-sm uppercase tracking-wider whitespace-nowrap">
              Latest Results
            </h2>
            <div className="h-px flex-1 bg-gold/20" />
          </div>

          <div className="space-y-3">
            {data.latestResults.map((r, i) => (
              <div
                key={i}
                className="bg-navy-light/50 border border-gold/10 rounded-lg p-3 sm:p-4"
              >
                <div className="flex items-center justify-between min-w-0">
                  <span className="text-white font-medium text-xs sm:text-sm flex-1 truncate">
                    {r.home}
                  </span>
                  <span className="text-gold font-bold px-2 sm:px-4 text-sm bg-navy/60 rounded py-1 mx-1 sm:mx-2 whitespace-nowrap shrink-0">
                    {r.score}
                  </span>
                  <span className="text-white font-medium text-xs sm:text-sm flex-1 text-right truncate">
                    {r.away}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 text-center">
            <Link
              href="/results"
              className="text-gold text-sm hover:underline"
            >
              View all results &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
