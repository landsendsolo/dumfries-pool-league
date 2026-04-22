'use server';

import { readFile, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

const DATA_PATH = path.join(process.cwd(), "data", "singles-draw.json");

export async function saveSinglesResult(
  matchId: string,
  player1: string | null,
  player2: string | null,
  score1: number | null,
  score2: number | null,
  winner: string | null,
) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const raw = await readFile(DATA_PATH, "utf-8");
  const data = JSON.parse(raw);

  const match = data.matches.find((m: { id: string }) => m.id === matchId);
  if (!match) throw new Error("Match not found");

  match.player1 = player1;
  match.player2 = player2;
  match.score1 = score1;
  match.score2 = score2;
  match.winner = winner;

  await writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
  revalidatePath("/cup");
}

export async function resetSinglesResult(matchId: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const raw = await readFile(DATA_PATH, "utf-8");
  const data = JSON.parse(raw);

  const match = data.matches.find((m: { id: string }) => m.id === matchId);
  if (!match) throw new Error("Match not found");

  match.score1 = null;
  match.score2 = null;
  match.winner = null;

  await writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
  revalidatePath("/cup");
}
