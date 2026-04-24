import { readFile, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

const DATA_PATH = path.join(process.cwd(), "data", "singles-draw.json");

export async function GET() {
  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    return NextResponse.json(JSON.parse(raw), {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to read draw data" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { matchId, score1, score2, winner, player1, player2 } = await request.json();
    const raw = await readFile(DATA_PATH, "utf-8");
    const data = JSON.parse(raw);

    const match = data.matches.find((m: { id: string }) => m.id === matchId);
    if (!match) return NextResponse.json({ error: "Match not found" }, { status: 404 });

    if (player1 !== undefined) match.player1 = player1;
    if (player2 !== undefined) match.player2 = player2;
    if (score1 !== undefined) match.score1 = score1;
    if (score2 !== undefined) match.score2 = score2;
    if (winner !== undefined) match.winner = winner;

    await writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
    return NextResponse.json({ ok: true, match });
  } catch {
    return NextResponse.json({ error: "Failed to update match" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { matchId } = await request.json();
    const raw = await readFile(DATA_PATH, "utf-8");
    const data = JSON.parse(raw);

    const match = data.matches.find((m: { id: string }) => m.id === matchId);
    if (!match) return NextResponse.json({ error: "Match not found" }, { status: 404 });

    match.score1 = null;
    match.score2 = null;
    match.winner = null;

    await writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to reset match" }, { status: 500 });
  }
}
