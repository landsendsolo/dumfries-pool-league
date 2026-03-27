import { readFile, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const DATA_PATH = path.join(process.cwd(), "data", "feedback.json");

interface FeedbackEntry {
  id: string;
  type: string;
  rating: number;
  message: string;
  name: string;
  read: boolean;
  timestamp: string;
}

interface FeedbackData {
  submissions: FeedbackEntry[];
}

async function loadData(): Promise<FeedbackData> {
  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { submissions: [] };
  }
}

async function saveData(data: FeedbackData): Promise<void> {
  await writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

const VALID_TYPES = ["suggestion", "bug", "general", "live-scores"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, rating, message, name } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: "Invalid feedback type" },
        { status: 400 },
      );
    }

    const entry: FeedbackEntry = {
      id: crypto.randomUUID(),
      type,
      rating: Math.min(5, Math.max(0, Math.floor(Number(rating) || 0))),
      message: message.trim(),
      name: typeof name === "string" && name.trim() ? name.trim() : "Anonymous",
      read: false,
      timestamp: new Date().toISOString(),
    };

    const data = await loadData();
    data.submissions.push(entry);
    await saveData(data);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to save feedback" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await loadData();
  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, id } = body;
    const data = await loadData();

    if (action === "markRead" && typeof id === "string") {
      const entry = data.submissions.find((s) => s.id === id);
      if (entry) entry.read = true;
    } else if (action === "markAllRead") {
      for (const s of data.submissions) s.read = true;
    } else if (action === "delete" && typeof id === "string") {
      data.submissions = data.submissions.filter((s) => s.id !== id);
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    await saveData(data);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to update feedback" },
      { status: 500 },
    );
  }
}
