import { readFile } from "fs/promises";
import path from "path";
import Link from "next/link";
import type { SpaEvent, SpaEventsData } from "@/lib/spa-event-types";

export const metadata = {
  title: "Dumfries SPA Entries | Dumfries Pool League",
};

export const dynamic = "force-dynamic";

function StatusBadge({ status }: { status: SpaEvent["status"] }) {
  const styles = {
    active: "bg-gold/10 text-gold border-gold/30",
    upcoming: "bg-navy-dark/50 text-gray-400 border-gold/10",
    completed: "bg-green-900/30 text-green-400 border-green-500/30",
  };
  const labels = { active: "Active", upcoming: "Upcoming", completed: "Completed" };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export default async function DumfriesSpaPage() {
  let eventsData: SpaEventsData | null = null;
  try {
    const raw = await readFile(
      path.join(process.cwd(), "data", "spa-events", "events.json"),
      "utf-8",
    );
    eventsData = JSON.parse(raw);
  } catch {
    eventsData = null;
  }

  const imEvents = eventsData?.events.filter((e) => e.type === "im") ?? [];
  const trophyEvent = eventsData?.events.find((e) => e.type === "trophy");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Dumfries SPA Entries
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Dumfries &amp; Galloway entries at Scottish Pool Association events
        </p>
      </div>

      {/* IM Series */}
      <section className="mb-10">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
          Individual Membership Series 2026
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          The IM Series consists of 4 events throughout the year. Top performers qualify for the national finals.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {imEvents.map((event) => (
            <div key={event.id} className="bg-navy-light/50 border border-gold/10 rounded-xl p-4 sm:p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-bold text-base">{event.name}</h3>
                  <p className="text-gray-500 text-xs mt-0.5">{event.fullName}</p>
                </div>
                <StatusBadge status={event.status} />
              </div>
              <div className="space-y-1 text-sm text-gray-400 mb-4">
                <p>Finals: {event.finals}</p>
                <p>{event.finalsVenue}</p>
                <p className="text-xs">{event.format} &middot; {event.qualifiers} qualifiers</p>
              </div>
              {event.drawAvailable ? (
                <Link
                  href={`/spa-events/${event.id}`}
                  className="inline-flex items-center gap-1 text-gold text-sm font-semibold hover:underline"
                >
                  View Draw
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <span className="text-gray-500 text-sm italic">Draw coming soon</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Willie McCartney Trophy */}
      {trophyEvent && (
        <section className="mb-10">
          <div className="bg-navy-light/50 border border-gold/20 rounded-xl p-4 sm:p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">{trophyEvent.fullName}</h2>
                <p className="text-gray-400 text-sm mt-1">
                  Finals: {trophyEvent.finals} | {trophyEvent.finalsVenue}
                </p>
              </div>
              <StatusBadge status={trophyEvent.status} />
            </div>
            <div className="space-y-2 text-sm text-gray-400 mb-4">
              <p><span className="text-gray-300 font-medium">Format:</span> {trophyEvent.format} &middot; {trophyEvent.qualifiers} qualifiers</p>
              {trophyEvent.entryFee && <p><span className="text-gray-300 font-medium">Entry Fee:</span> {trophyEvent.entryFee}</p>}
              {trophyEvent.entryDeadline && <p><span className="text-gray-300 font-medium">Entry Deadline:</span> {trophyEvent.entryDeadline}</p>}
              {trophyEvent.notes && <p className="text-xs text-gray-500 italic">{trophyEvent.notes}</p>}
            </div>
            {trophyEvent.dumfriesEntries && trophyEvent.dumfriesEntries.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-bold text-gold uppercase tracking-wider mb-2">
                  Dumfries Entries — Awaiting Draw
                </p>
                <div className="flex flex-wrap gap-2">
                  {trophyEvent.dumfriesEntries.map((name: string) => (
                    <span key={name} className="text-xs bg-navy-dark/60 border border-gold/10 text-gray-300 px-3 py-1 rounded-full">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {trophyEvent.drawAvailable ? (
              <Link
                href={`/spa-events/${trophyEvent.id}`}
                className="inline-flex items-center gap-1 text-gold text-sm font-semibold hover:underline"
              >
                View Draw
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <span className="text-gray-500 text-sm italic">Draw coming soon</span>
            )}
          </div>
        </section>
      )}

      {eventsData?.events.length === 0 && (
        <div className="bg-navy-light/50 border border-gold/10 rounded-xl p-12 text-center">
          <p className="text-gray-400 text-sm">No events added yet. Check back soon.</p>
        </div>
      )}

    </div>
  );
}
