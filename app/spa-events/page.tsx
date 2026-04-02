import { readFile } from "fs/promises";
import path from "path";
import Link from "next/link";
import type { SpaEvent, SpaEventsData } from "@/lib/spa-event-types";

export const metadata = {
  title: "SPA Events | Dumfries Pool League",
};

export const dynamic = "force-dynamic";

const RANKINGS = [
  { label: "Ladies Tour Rankings", href: "https://bit.ly/2026_SPA_Ladies_Rankings" },
  { label: "Seniors Tour Rankings", href: "https://bit.ly/2026_SPA_Seniors_Rankings" },
  { label: "Masters Tour Rankings", href: "https://bit.ly/2026_SPA_Masters_Rankings" },
  { label: "Grandmasters Tour Rankings", href: "https://bit.ly/2026_SPA_Grandmasters_Rankings" },
  { label: "IM Rankings", href: null, note: "Link available after Event 1" },
  { label: "All Rankings on Cuescore", href: "https://cuescore.com/scottishpoolassociation/rankings" },
];

const SKIP_KEYWORDS = [
  "exec meeting", "exec", "teams meeting", "agm", "manager", "scottish pool association meeting",
];

function shouldSkip(summary: string): boolean {
  const lower = summary.toLowerCase();
  return SKIP_KEYWORDS.some((k) => lower.includes(k));
}

function parseIcsDate(dtstart: string): Date | null {
  try {
    // Handle VALUE=DATE (all-day)
    const allDay = dtstart.match(/^(\d{4})(\d{2})(\d{2})$/);
    if (allDay) {
      return new Date(`${allDay[1]}-${allDay[2]}-${allDay[3]}T00:00:00Z`);
    }
    // Handle datetime
    const dt = dtstart.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z?$/);
    if (dt) {
      return new Date(`${dt[1]}-${dt[2]}-${dt[3]}T${dt[4]}:${dt[5]}:${dt[6]}Z`);
    }
    return null;
  } catch {
    return null;
  }
}

function formatEventDate(start: Date, end: Date): string {
  const sameDay = start.toDateString() === end.toDateString();
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/London" };
  if (sameDay) return start.toLocaleDateString("en-GB", opts);
  const startOpts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", timeZone: "Europe/London" };
  const endOpts = opts;
  return `${start.toLocaleDateString("en-GB", startOpts)} – ${end.toLocaleDateString("en-GB", endOpts)}`;
}

function getMonthLabel(date: Date): string {
  return date.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "Europe/London" });
}

function parseLocation(location: string): string {
  if (!location) return "";
  // Get first part before comma
  const parts = location.replace(/\\/g, "").split(",");
  return parts[0].trim();
}

interface CalEvent {
  summary: string;
  start: Date;
  end: Date;
  location: string;
}

async function getSpaCalendar(): Promise<CalEvent[]> {
  try {
    const res = await fetch(
      "https://calendar.google.com/calendar/ical/scottishpool.secretary%40gmail.com/public/basic.ics",
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const text = await res.text();
    const events: CalEvent[] = [];
    const blocks = text.split("BEGIN:VEVENT");
    const now = new Date();

    for (const block of blocks.slice(1)) {
      const getSummary = block.match(/SUMMARY:(.+)/)?.[1]?.trim() ?? "";
      if (!getSummary || shouldSkip(getSummary)) continue;

      const dtStartRaw = block.match(/DTSTART(?:;VALUE=DATE)?(?:;TZID=[^:]+)?:([^
]+)/)?.[1]?.trim() ?? "";
      const dtEndRaw = block.match(/DTEND(?:;VALUE=DATE)?(?:;TZID=[^:]+)?:([^
]+)/)?.[1]?.trim() ?? "";
      const locationRaw = block.match(/LOCATION:([^
]+)/)?.[1]?.replace(/\s+/g, " ").trim() ?? "";

      const start = parseIcsDate(dtStartRaw);
      const end = parseIcsDate(dtEndRaw);
      if (!start || start < now) continue;

      events.push({
        summary: getSummary,
        start,
        end: end ?? start,
        location: parseLocation(locationRaw),
      });
    }

    events.sort((a, b) => a.start.getTime() - b.start.getTime());
    return events;
  } catch {
    return [];
  }
}

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

export default async function SpaEventsPage() {
  let eventsData: SpaEventsData | null = null;
  try {
    const raw = await readFile(path.join(process.cwd(), "data", "spa-events", "events.json"), "utf-8");
    eventsData = JSON.parse(raw);
  } catch {
    eventsData = null;
  }

  const imEvents = eventsData?.events.filter((e) => e.type === "im") ?? [];
  const trophyEvent = eventsData?.events.find((e) => e.type === "trophy");
  const calEvents = await getSpaCalendar();

  // Group calendar events by month
  const byMonth: Record<string, CalEvent[]> = {};
  for (const ev of calEvents) {
    const key = getMonthLabel(ev.start);
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(ev);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

      {/* Page header */}
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">SPA Events 2026</h1>
        <p className="text-gray-400 text-sm mt-1">
          Dumfries &amp; Galloway representation at Scottish Pool Association events
        </p>
      </div>

      {/* IM Series */}
      <section className="mb-10">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Individual Membership Series 2026</h2>
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
                <Link href={`/spa-events/${event.id}`} className="inline-flex items-center gap-1 text-gold text-sm font-semibold hover:underline">
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

      {/* Willie McCartney */}
      {trophyEvent && (
        <section className="mb-10">
          <div className="bg-navy-light/50 border border-gold/20 rounded-xl p-4 sm:p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">{trophyEvent.fullName}</h2>
                <p className="text-gray-400 text-sm mt-1">Finals: {trophyEvent.finals} | {trophyEvent.finalsVenue}</p>
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
                <p className="text-xs font-bold text-gold uppercase tracking-wider mb-2">Dumfries Entries — Awaiting Draw</p>
                <div className="flex flex-wrap gap-2">
                  {trophyEvent.dumfriesEntries.map((name: string) => (
                    <span key={name} className="text-xs bg-navy-dark/60 border border-gold/10 text-gray-300 px-3 py-1 rounded-full">{name}</span>
                  ))}
                </div>
              </div>
            )}
            {trophyEvent.drawAvailable ? (
              <Link href={`/spa-events/${trophyEvent.id}`} className="inline-flex items-center gap-1 text-gold text-sm font-semibold hover:underline">
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

      {/* SPA Rankings */}
      <section className="mb-12">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-2">SPA Rankings 2026</h2>
        <p className="text-gray-400 text-sm mb-6">Official Scottish Pool Association ranking lists</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {RANKINGS.map((r) =>
            r.href ? (
              <a key={r.label} href={r.href} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between bg-navy-light/50 border border-gold/10 rounded-lg px-4 py-3 text-sm text-white hover:border-gold/30 transition-colors group">
                <span>{r.label}</span>
                <svg className="w-4 h-4 text-gray-500 group-hover:text-gold transition-colors shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ) : (
              <div key={r.label} className="flex items-center justify-between bg-navy-light/30 border border-gold/5 rounded-lg px-4 py-3 text-sm">
                <span className="text-gray-500">{r.label}</span>
                <span className="text-gray-600 text-xs italic ml-2">{r.note}</span>
              </div>
            )
          )}
        </div>
      </section>

      {/* Full SPA Calendar 2026 */}
      <section>
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Full SPA Calendar 2026</h2>
          <p className="text-gray-400 text-sm">
            All upcoming Scottish Pool Association events. Any Dumfries player can enter — check{" "}
            <a href="https://scottishpool.org" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">scottishpool.org</a>{" "}
            for entry details.
          </p>
        </div>

        {calEvents.length === 0 ? (
          <p className="text-gray-500 text-sm">Calendar unavailable — check back soon.</p>
        ) : (
          <div className="space-y-8">
            {Object.entries(byMonth).map(([month, events]) => (
              <div key={month}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-px flex-1 bg-gold/20" />
                  <h3 className="text-gold font-semibold text-xs uppercase tracking-widest whitespace-nowrap">{month}</h3>
                  <div className="h-px flex-1 bg-gold/20" />
                </div>
                <div className="space-y-2">
                  {events.map((ev, i) => (
                    <div key={i} className="bg-navy-light/40 border border-gold/10 rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                      <span className="text-gold text-xs font-semibold shrink-0 sm:w-44">
                        {formatEventDate(ev.start, ev.end)}
                      </span>
                      <span className="text-white text-sm font-medium flex-1">{ev.summary}</span>
                      {ev.location && (
                        <span className="text-gray-500 text-xs shrink-0 sm:text-right sm:max-w-[200px] truncate">
                          {ev.location}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
