import { readFile } from "fs/promises";
import path from "path";
import type { IMDrawData } from "@/lib/im-draw-types";
import type { SpaEventsData } from "@/lib/spa-event-types";
import { DrawClient } from "./draw-client";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  let eventName = "SPA Event";
  try {
    const raw = await readFile(
      path.join(process.cwd(), "data", "spa-events", "events.json"),
      "utf-8",
    );
    const { events } = JSON.parse(raw) as SpaEventsData;
    const event = events.find((e) => e.id === eventId);
    if (event) eventName = event.name;
  } catch {
    // fallback
  }
  return { title: `${eventName} | Dumfries Pool League` };
}

export default async function EventDrawPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  // Read event metadata
  let eventMeta = null;
  try {
    const raw = await readFile(
      path.join(process.cwd(), "data", "spa-events", "events.json"),
      "utf-8",
    );
    const { events } = JSON.parse(raw) as SpaEventsData;
    eventMeta = events.find((e) => e.id === eventId) ?? null;
  } catch {
    eventMeta = null;
  }

  // Read draw data
  let data: IMDrawData | null = null;
  try {
    const raw = await readFile(
      path.join(process.cwd(), "data", "spa-events", eventId, "draw.json"),
      "utf-8",
    );
    data = JSON.parse(raw);
  } catch {
    data = null;
  }

  return <DrawClient eventId={eventId} initialData={data} initialMeta={eventMeta} />;
}
