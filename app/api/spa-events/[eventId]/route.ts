import { readFile, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import type { IMDrawData, IMDrawMatch } from "@/lib/im-draw-types";
import type { SpaEventsData } from "@/lib/spa-event-types";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

const DATA_DIR = path.join(process.cwd(), "data", "spa-events");

function drawPath(eventId: string) {
  return path.join(DATA_DIR, eventId, "draw.json");
}

async function validateEventId(eventId: string): Promise<boolean> {
  try {
    const raw = await readFile(
      path.join(DATA_DIR, "events.json"),
      "utf-8",
    );
    const { events } = JSON.parse(raw) as SpaEventsData;
    return events.some((e) => e.id === eventId);
  } catch {
    return false;
  }
}

async function readData(eventId: string): Promise<IMDrawData> {
  const raw = await readFile(drawPath(eventId), "utf-8");
  return JSON.parse(raw);
}

async function writeData(
  eventId: string,
  data: IMDrawData,
): Promise<void> {
  data.updatedAt = new Date().toISOString();
  await writeFile(drawPath(eventId), JSON.stringify(data, null, 2), "utf-8");
}

function cascadeReset(
  matches: IMDrawMatch[],
  matchId: string,
  slot: 1 | 2,
) {
  const match = matches.find((m) => m.id === matchId);
  if (!match) return;

  if (slot === 1) match.player1 = null;
  else match.player2 = null;

  if (match.winner) {
    match.score1 = null;
    match.score2 = null;
    match.winner = null;
    match.walkover = false;

    if (match.nextMatchId && match.nextSlot) {
      cascadeReset(matches, match.nextMatchId, match.nextSlot);
    }
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
) {
  const { eventId } = await params;

  if (!(await validateEventId(eventId))) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  try {
    const data = await readData(eventId);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Draw data not available" },
      { status: 404 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
) {
  const { eventId } = await params;

  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { matchId, score1, score2, walkover } = body;

    if (!(await validateEventId(eventId))) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 },
      );
    }

    const data = await readData(eventId);
    const match = data.matches.find((m) => m.id === matchId);

    if (!match) {
      return NextResponse.json(
        { error: "Match not found" },
        { status: 404 },
      );
    }

    if (!match.player1 || !match.player2) {
      return NextResponse.json(
        { error: "Both players must be set before entering a result" },
        { status: 400 },
      );
    }

    if (match.bye) {
      return NextResponse.json(
        { error: "Cannot update a bye match" },
        { status: 400 },
      );
    }

    const finalScore1 = walkover ? 7 : Number(score1);
    const finalScore2 = walkover ? 0 : Number(score2);

    if (
      !Number.isInteger(finalScore1) ||
      !Number.isInteger(finalScore2) ||
      finalScore1 < 0 ||
      finalScore1 > 7 ||
      finalScore2 < 0 ||
      finalScore2 > 7
    ) {
      return NextResponse.json(
        { error: "Scores must be integers between 0 and 7" },
        { status: 400 },
      );
    }

    if (finalScore1 === finalScore2) {
      return NextResponse.json(
        { error: "Scores cannot be equal" },
        { status: 400 },
      );
    }

    match.score1 = finalScore1;
    match.score2 = finalScore2;
    match.walkover = walkover || false;
    match.winner =
      finalScore1 > finalScore2 ? match.player1 : match.player2;

    if (match.nextMatchId && match.nextSlot) {
      const nextMatch = data.matches.find(
        (m) => m.id === match.nextMatchId,
      );
      if (nextMatch) {
        if (match.nextSlot === 1) {
          nextMatch.player1 = match.winner;
        } else {
          nextMatch.player2 = match.winner;
        }
      }
    }

    await writeData(eventId, data);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to update result" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
) {
  const { eventId } = await params;

  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { matchId } = body;

    if (!(await validateEventId(eventId))) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 },
      );
    }

    const data = await readData(eventId);
    const match = data.matches.find((m) => m.id === matchId);

    if (!match) {
      return NextResponse.json(
        { error: "Match not found" },
        { status: 404 },
      );
    }

    if (match.bye) {
      return NextResponse.json(
        { error: "Cannot reset a bye match" },
        { status: 400 },
      );
    }

    if (!match.winner) {
      return NextResponse.json(
        { error: "Match has no result to reset" },
        { status: 400 },
      );
    }

    match.score1 = null;
    match.score2 = null;
    match.winner = null;
    match.walkover = false;

    if (match.nextMatchId && match.nextSlot) {
      cascadeReset(data.matches, match.nextMatchId, match.nextSlot);
    }

    await writeData(eventId, data);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to reset result" },
      { status: 500 },
    );
  }
}
