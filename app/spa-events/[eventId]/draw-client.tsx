"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { IMDrawData } from "@/lib/im-draw-types";
import { IMDrawView } from "../draw";

interface EventMeta {
  fullName?: string;
  [key: string]: unknown;
}

export function DrawClient({
  eventId,
  initialData,
  initialMeta,
}: {
  eventId: string;
  initialData: IMDrawData | null;
  initialMeta: EventMeta | null;
}) {
  const [data, setData] = useState<IMDrawData | null>(initialData);
  const [eventMeta] = useState<EventMeta | null>(initialMeta);

  useEffect(() => {
    const load = () =>
      fetch(`/api/spa-events/${eventId}`)
        .then((r) => r.json())
        .then((d) => { if (d && !d.error) setData(d); })
        .catch(() => {});
    load();
    const interval = setInterval(load, 15000);
    const onVisible = () => { if (!document.hidden) load(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [eventId]);

  const totalPlayers = data
    ? data.players.seeds.length + data.players.entries.length
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Back link */}
      <Link
        href="/dumfries-spa"
        className="inline-flex items-center gap-1 text-gray-400 text-sm hover:text-gold transition-colors mb-6"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Dumfries SPA Entries
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          {eventMeta?.fullName ?? "SPA Event Draw"}
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Dumfries Area Draw
        </p>
      </div>

      {data ? (
        <>
          {/* Competition info banner */}
          <div className="bg-navy-light/50 border border-gold/20 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-gold"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  {data.event}
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Finals: {data.finals} | {data.venue}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
              <span className="bg-navy-dark/50 border border-gold/10 rounded-lg px-3 py-1.5 text-gray-300">
                <span className="text-gold font-bold">{totalPlayers}</span>{" "}
                players
              </span>
              <span className="bg-navy-dark/50 border border-gold/10 rounded-lg px-3 py-1.5 text-gray-300">
                <span className="text-gold font-bold">
                  {data.qualifiers}
                </span>{" "}
                qualifiers
              </span>
              <span className="bg-navy-dark/50 border border-gold/10 rounded-lg px-3 py-1.5 text-gray-300">
                {data.format}
              </span>
            </div>
          </div>

          <IMDrawView data={data} />
        </>
      ) : (
        <div className="bg-navy-light/50 border border-gold/10 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gold"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h2 className="text-white font-semibold text-lg mb-2">
            Draw Not Yet Available
          </h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            The draw for this event hasn&apos;t been set up yet. Check back
            later.
          </p>
        </div>
      )}
    </div>
  );
}
