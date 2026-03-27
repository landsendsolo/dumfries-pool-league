"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import type { TickerData } from "@/lib/ticker";

const MOBILE_SPEED = 220; // pixels per second (< 640px)
const DESKTOP_SPEED = 100; // pixels per second (>= 640px)

function formatTickerItem(text: string, isLive: boolean): ReactNode {
  // Highlight scores (4-3, 7-2), percentages (83%), and point totals (23 points)
  const parts = text.split(/(\d+\s*-\s*\d+|\d+(?:\.\d+)?%|\d+ points)/);
  return parts.map((part, i) => {
    if (/\d+\s*-\s*\d+|\d+(?:\.\d+)?%|\d+ points/.test(part)) {
      return (
        <span key={i} className="text-gold font-bold">
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function Ticker({ initialData }: { initialData?: TickerData }) {
  const [data, setData] = useState<TickerData | null>(initialData ?? null);
  const [duration, setDuration] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const modeRef = useRef<string | null>(initialData?.mode ?? null);

  useEffect(() => {
    async function fetchTicker() {
      try {
        const res = await fetch("/api/ticker");
        if (!res.ok) return;
        const json: TickerData = await res.json();
        setData(json);
        modeRef.current = json.mode;
      } catch {
        // Ticker is non-critical — fail silently
      }
    }

    // Skip initial fetch if we already have server data
    if (!initialData) {
      fetchTicker();
    }

    // Set up polling — check mode periodically
    function startPolling() {
      if (intervalRef.current) clearInterval(intervalRef.current);
      const interval = modeRef.current === "live" ? 30_000 : 300_000;
      intervalRef.current = setInterval(fetchTicker, interval);
    }

    startPolling();
    // Re-evaluate polling interval every 30s
    const modeCheck = setInterval(() => {
      const currentInterval =
        modeRef.current === "live" ? 30_000 : 300_000;
      // Only restart if interval needs to change
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(fetchTicker, currentInterval);
      }
    }, 30_000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearInterval(modeCheck);
    };
  }, [initialData]);

  // Measure scrollWidth and calculate duration for target speed
  useEffect(() => {
    if (!scrollRef.current) return;
    const scrollWidth = scrollRef.current.scrollWidth;
    // translateX(-50%) moves half the total width (one copy)
    const dist = scrollWidth / 2;
    const speed = window.innerWidth < 640 ? MOBILE_SPEED : DESKTOP_SPEED;
    setDuration(dist / speed);
  }, [data]);

  if (!data || data.mode === "none" || data.items.length === 0) {
    return null;
  }

  const isLive = data.mode === "live";

  return (
    <div className="w-full h-9 bg-navy flex items-center overflow-hidden border-b border-gold/10">
      {/* Fixed badge */}
      <div className="shrink-0 h-full flex items-center px-2 sm:px-3 z-10 bg-navy">
        {isLive ? (
          <span className="flex items-center gap-1.5 bg-[#e24b4a] text-white text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 rounded">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            LIVE
          </span>
        ) : (
          <span className="bg-gold text-navy text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 rounded">
            NEWS
          </span>
        )}
      </div>

      {/* Scrolling content */}
      <div className="flex-1 overflow-hidden relative">
        <div
          className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-navy to-transparent z-10"
          aria-hidden
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-navy to-transparent z-10"
          aria-hidden
        />
        <div
          ref={scrollRef}
          className="flex whitespace-nowrap"
          style={{
            animation: duration
              ? `ticker-scroll ${duration.toFixed(1)}s linear infinite`
              : "none",
            willChange: "transform",
            transform: "translateZ(0)",
          }}
        >
          {[...data.items, ...data.items].map((item, i) => (
            <span key={i} className="inline-flex items-center">
              <span className="text-[11px] sm:text-xs text-white">
                {formatTickerItem(item, isLive)}
              </span>
              <span className="text-gold/30 mx-3 sm:mx-4 text-xs select-none">
                |
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
