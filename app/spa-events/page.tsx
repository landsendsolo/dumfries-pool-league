import Link from "next/link";

export const metadata = {
  title: "SPA Events | Dumfries Pool League",
};

export const dynamic = "force-dynamic";

const SKIP_KEYWORDS = [
  "exec meeting", "exec", "teams meeting", "agm", "manager", "scottish pool association meeting",
];

function shouldSkip(summary: string): boolean {
  const lower = summary.toLowerCase();
  return SKIP_KEYWORDS.some((k) => lower.includes(k));
}

function parseIcsDate(dtstart: string): Date | null {
  try {
    const allDay = dtstart.match(/^(\d{4})(\d{2})(\d{2})$/);
    if (allDay) {
      return new Date(`${allDay[1]}-${allDay[2]}-${allDay[3]}T00:00:00Z`);
    }
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
  return `${start.toLocaleDateString("en-GB", startOpts)} – ${end.toLocaleDateString("en-GB", opts)}`;
}

function getMonthLabel(date: Date): string {
  return date.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "Europe/London" });
}

function parseLocation(location: string): string {
  if (!location) return "";
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
      const getSummary = (block.split("SUMMARY:")[1] ?? "").split("\n")[0].trim();
      if (!getSummary || shouldSkip(getSummary)) continue;

      const dtStartRaw = (block.split("DTSTART").find((s, i) => i > 0) ?? "").split(":").slice(1).join(":").split("\n")[0].trim();
      const dtEndRaw = (block.split("DTEND").find((s, i) => i > 0) ?? "").split(":").slice(1).join(":").split("\n")[0].trim();
      const locationRaw = (block.split("LOCATION:")[1] ?? "").split("\n")[0].replace(/\s+/g, " ").trim();

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

export default async function SpaEventsPage() {
  const calEvents = await getSpaCalendar();

  const byMonth: Record<string, CalEvent[]> = {};
  for (const ev of calEvents) {
    const key = getMonthLabel(ev.start);
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(ev);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">SPA Calendar 2026</h1>
        <p className="text-gray-400 text-sm mt-1">
          All upcoming Scottish Pool Association events. Any Dumfries player can enter — check{" "}
          <a href="https://www.facebook.com/ScottishPool" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
            scottishpool.org
          </a>{" "}
          for entry details. For Dumfries area entries see{" "}
          <a href="/dumfries-spa" className="text-gold hover:underline">
            Dumfries SPA Entries
          </a>.
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
    </div>
  );
}
