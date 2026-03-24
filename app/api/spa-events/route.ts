import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const EVENTS_PATH = path.join(
  process.cwd(),
  "data",
  "spa-events",
  "events.json",
);

export async function GET() {
  try {
    const raw = await readFile(EVENTS_PATH, "utf-8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json(
      { error: "Failed to read events" },
      { status: 500 },
    );
  }
}
