import { readFile, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

const SETTINGS_PATH = path.join(
  process.cwd(),
  "data",
  "ticker-settings.json",
);

interface TickerSettings {
  enabled: {
    leagueLeader: boolean;
    topPlayer: boolean;
    nextFixtures: boolean;
    eventDeadlines: boolean;
    recentResults: boolean;
    sosChampions: boolean;
  };
  customMessages: string[];
}

const DEFAULTS: TickerSettings = {
  enabled: {
    leagueLeader: true,
    topPlayer: true,
    nextFixtures: true,
    eventDeadlines: true,
    recentResults: true,
    sosChampions: true,
  },
  customMessages: [],
};

export async function GET() {
  try {
    const raw = await readFile(SETTINGS_PATH, "utf-8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json(DEFAULTS);
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as TickerSettings;

    if (!body.enabled || typeof body.enabled !== "object") {
      return NextResponse.json(
        { error: "Invalid settings format" },
        { status: 400 },
      );
    }

    if (!Array.isArray(body.customMessages)) {
      return NextResponse.json(
        { error: "customMessages must be an array" },
        { status: 400 },
      );
    }

    const settings: TickerSettings = {
      enabled: {
        leagueLeader: !!body.enabled.leagueLeader,
        topPlayer: !!body.enabled.topPlayer,
        nextFixtures: !!body.enabled.nextFixtures,
        eventDeadlines: !!body.enabled.eventDeadlines,
        recentResults: !!body.enabled.recentResults,
        sosChampions: !!body.enabled.sosChampions,
      },
      customMessages: body.customMessages
        .filter((m): m is string => typeof m === "string" && m.trim().length > 0)
        .map((m) => m.trim()),
    };

    await writeFile(SETTINGS_PATH, JSON.stringify(settings, null, 2), "utf-8");
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 },
    );
  }
}
