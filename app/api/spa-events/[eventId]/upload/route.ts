import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import type { IMDrawMatch, IMDrawRound } from "@/lib/im-draw-types";
import type { SpaEventsData, CellMap } from "@/lib/spa-event-types";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

const DATA_DIR = path.join(process.cwd(), "data", "spa-events");

/** Round column layout in the SPA spreadsheet */
const ROUND_COLS = [
  { playerCol: 10, scoreCol: 11, name: "Last 2048" }, // J/K
  { playerCol: 13, scoreCol: 14, name: "Last 1024" }, // M/N
  { playerCol: 16, scoreCol: 17, name: "Last 512" },  // P/Q
  { playerCol: 19, scoreCol: 20, name: "Last 256" },  // S/T
] as const;

function colLetter(colNum: number): string {
  return String.fromCharCode(64 + colNum);
}

/** Get cell value as string, resolving formulas to their cached result */
function getCellText(
  ws: ExcelJS.Worksheet,
  row: number,
  col: number,
): string | null {
  const cell = ws.getCell(row, col);
  if (cell.formula) {
    // For formula cells, try to get the cached result
    const result = cell.result;
    if (typeof result === "string" && result.length > 0) return result;
    if (typeof result === "number") return String(result);
    return null;
  }
  if (typeof cell.value === "string" && cell.value.length > 0)
    return cell.value;
  if (typeof cell.value === "number") return String(cell.value);
  return null;
}

/** Get cell formula text */
function getCellFormula(
  ws: ExcelJS.Worksheet,
  row: number,
  col: number,
): string | null {
  const cell = ws.getCell(row, col);
  if (cell.formula) return cell.formula;
  return null;
}

/** Check if a formula references column D directly (i.e., a player entering this round) */
function isDirectPlayerRef(formula: string | null): boolean {
  if (!formula) return false;
  return /^D\d+$/.test(formula.trim());
}

/** Check if a formula is an IF winner-determination formula */
function isWinnerFormula(formula: string | null): boolean {
  if (!formula) return false;
  return formula.startsWith("IF(");
}

/** Extract the two player-column cell references from an IF winner formula */
function extractFeederCells(
  formula: string,
): { col: string; row1: number; row2: number } | null {
  // Pattern: IF(X11="Bye",X12,IF(X12="Bye",X11,...))
  // We need to extract the column letter and two row numbers
  const match = formula.match(/IF\(([A-Z])(\d+)="Bye",\1(\d+)/);
  if (match) {
    return {
      col: match[1],
      row1: parseInt(match[2]),
      row2: parseInt(match[3]),
    };
  }
  return null;
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
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 },
      );
    }

    if (!file.name.endsWith(".xlsx")) {
      return NextResponse.json(
        { error: "File must be .xlsx format" },
        { status: 400 },
      );
    }

    // Validate event exists
    const eventsRaw = await readFile(
      path.join(DATA_DIR, "events.json"),
      "utf-8",
    );
    const eventsData = JSON.parse(eventsRaw) as SpaEventsData;
    const event = eventsData.events.find((e) => e.id === eventId);
    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 },
      );
    }

    // Check for existing results
    let hasExistingResults = false;
    try {
      const existingRaw = await readFile(
        path.join(DATA_DIR, eventId, "draw.json"),
        "utf-8",
      );
      const existing = JSON.parse(existingRaw);
      hasExistingResults = existing.matches?.some(
        (m: IMDrawMatch) => m.winner && !m.bye,
      );
    } catch {
      // No existing draw
    }

    // Load workbook
    const arrayBuf = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuf);

    // Find Dumfries sheet — scan for D3 containing "Dumfries"
    let ws: ExcelJS.Worksheet | undefined;
    workbook.eachSheet((sheet) => {
      const d3 = sheet.getCell("D3").value;
      if (
        d3 &&
        typeof d3 === "string" &&
        d3.toLowerCase().includes("dumfries")
      ) {
        ws = sheet;
      }
    });

    if (!ws) {
      return NextResponse.json(
        { error: "Could not find Dumfries area sheet (no sheet with 'Dumfries' in cell D3)" },
        { status: 400 },
      );
    }

    // Extract metadata
    const eventName =
      getCellText(ws, 2, 8) || event.fullName; // H2
    const totalEntries = Number(ws.getCell("E4").value) || 0;
    const qualifierCount = Number(ws.getCell("E5").value) || 2;

    // Extract round deadlines from row 8
    const roundDeadlines: string[] = ROUND_COLS.map((rc) => {
      const val = getCellText(ws!, 8, rc.playerCol);
      return val?.replace(/^By\s+/i, "").trim() || "";
    });

    // Add Qualifier round deadline (V8)
    const qualDeadline = getCellText(ws, 8, 22);
    roundDeadlines.push(
      qualDeadline?.replace(/^By\s+/i, "").replace(/\xa0/g, " ").trim() || "",
    );

    // Extract seeds from column D (rows 16+, until empty or next section)
    const seeds: { seed: number; name: string }[] = [];
    for (let row = 16; row <= 24; row++) {
      const name = getCellText(ws, row, 4); // Column D
      if (!name || name === "Seeds" || name === "Other Entries") break;
      const seedNum = Number(ws.getCell(row, 3).value); // Column C
      seeds.push({ seed: seedNum || seeds.length + 1, name });
    }

    // Extract other entries from column D (rows 26+)
    const entries: { position: number; name: string }[] = [];
    for (let row = 26; row <= 80; row++) {
      const name = getCellText(ws, row, 4);
      if (!name) break;
      entries.push({ position: entries.length + 1, name });
    }

    // Now parse the bracket structure
    // Step 1: Scan M column (Last 1024) to identify R2 match pairs
    // Each cell in M is either a direct D-ref (bye in R1) or an IF formula (winner from R1)
    const r2Cells: {
      row: number;
      isBye: boolean;
      playerName: string | null;
      feederRows: { row1: number; row2: number } | null;
    }[] = [];

    for (let row = 8; row <= 70; row++) {
      const formula = getCellFormula(ws, row, 13); // Column M
      const value = getCellText(ws, row, 13);
      if (!formula && !value) continue;

      if (isDirectPlayerRef(formula)) {
        // Player enters R2 directly (bye in R1)
        r2Cells.push({
          row,
          isBye: true,
          playerName: value,
          feederRows: null,
        });
      } else if (isWinnerFormula(formula)) {
        // Winner from R1 match
        const feeder = extractFeederCells(formula!);
        r2Cells.push({
          row,
          isBye: false,
          playerName: value,
          feederRows: feeder
            ? { row1: feeder.row1, row2: feeder.row2 }
            : null,
        });
      }
    }

    // Step 2: Pair R2 cells into matches
    const r2MatchPairs: (typeof r2Cells[number])[][] = [];
    for (let i = 0; i < r2Cells.length; i += 2) {
      if (i + 1 < r2Cells.length) {
        r2MatchPairs.push([r2Cells[i], r2Cells[i + 1]]);
      }
    }

    // Step 3: Build all matches
    const matches: IMDrawMatch[] = [];
    const cellMap: CellMap = {};
    let matchCounter = 1;

    // R1 matches (Last 2048) — 2 per R2 match (one per slot)
    const r1MatchCount = r2MatchPairs.length * 2;
    let r1Pos = 1;
    for (let r2Idx = 0; r2Idx < r2MatchPairs.length; r2Idx++) {
      const pair = r2MatchPairs[r2Idx];
      const r2MatchId = `R2-${r2Idx + 1}`;

      for (let slotIdx = 0; slotIdx < 2; slotIdx++) {
        const cell = pair[slotIdx];
        const r1MatchId = `R1-${r1Pos}`;
        const nextSlot = (slotIdx + 1) as 1 | 2;

        if (cell.isBye) {
          // Bye match — player advances directly
          matches.push({
            id: r1MatchId,
            round: 0,
            position: r1Pos,
            player1: cell.playerName,
            player2: null,
            score1: null,
            score2: null,
            walkover: true,
            winner: cell.playerName,
            bye: true,
            nextMatchId: r2MatchId,
            nextSlot,
          });
        } else if (cell.feederRows) {
          // Real R1 match
          const p1Name = getCellText(ws!, cell.feederRows.row1, 10); // J col
          const p2Name = getCellText(ws!, cell.feederRows.row2, 10);
          const s1 = ws!.getCell(cell.feederRows.row1, 11).value; // K col
          const s2 = ws!.getCell(cell.feederRows.row2, 11).value;
          const score1 =
            typeof s1 === "number" ? s1 : s1 !== null ? Number(s1) : null;
          const score2 =
            typeof s2 === "number" ? s2 : s2 !== null ? Number(s2) : null;

          let winner: string | null = null;
          if (
            score1 !== null &&
            score2 !== null &&
            !isNaN(score1) &&
            !isNaN(score2) &&
            score1 !== score2
          ) {
            winner = score1 > score2 ? (p1Name ?? null) : (p2Name ?? null);
          }

          // Check for walkover markers (column I or L)
          const woI1 = getCellText(ws!, cell.feederRows.row1, 9); // I col
          const woI2 = getCellText(ws!, cell.feederRows.row2, 9);
          const woL1 = getCellText(ws!, cell.feederRows.row1, 12); // L col
          const woL2 = getCellText(ws!, cell.feederRows.row2, 12);
          const isWalkover =
            woI1?.toLowerCase() === "w/o" ||
            woI2?.toLowerCase() === "w/o" ||
            woL1?.toLowerCase() === "w/o" ||
            woL2?.toLowerCase() === "w/o";

          matches.push({
            id: r1MatchId,
            round: 0,
            position: r1Pos,
            player1: p1Name ?? null,
            player2: p2Name ?? null,
            score1,
            score2,
            walkover: isWalkover,
            winner,
            bye: false,
            nextMatchId: r2MatchId,
            nextSlot,
          });

          cellMap[r1MatchId] = {
            p1Row: cell.feederRows.row1,
            p2Row: cell.feederRows.row2,
            scoreCol: "K",
          };
        }
        r1Pos++;
      }
    }

    // R2 matches (Last 1024)
    for (let i = 0; i < r2MatchPairs.length; i++) {
      const pair = r2MatchPairs[i];
      const matchId = `R2-${i + 1}`;
      const r2Row1 = pair[0].row;
      const r2Row2 = pair[1].row;

      // Determine player names (from byes or R1 winners)
      let p1: string | null = null;
      let p2: string | null = null;

      const r1Match1 = matches.find(
        (m) => m.nextMatchId === matchId && m.nextSlot === 1,
      );
      const r1Match2 = matches.find(
        (m) => m.nextMatchId === matchId && m.nextSlot === 2,
      );
      p1 = r1Match1?.winner ?? null;
      p2 = r1Match2?.winner ?? null;

      // Read existing scores from Excel
      const s1 = ws.getCell(r2Row1, 14).value; // N col
      const s2 = ws.getCell(r2Row2, 14).value;
      const score1 =
        typeof s1 === "number" ? s1 : s1 !== null ? Number(s1) : null;
      const score2 =
        typeof s2 === "number" ? s2 : s2 !== null ? Number(s2) : null;

      let winner: string | null = null;
      if (
        score1 !== null &&
        score2 !== null &&
        !isNaN(score1) &&
        !isNaN(score2) &&
        score1 !== score2
      ) {
        winner = score1 > score2 ? p1 : p2;
      }

      // Determine next match (R3)
      const r3Idx = Math.floor(i / 2);
      const r3MatchId = `R3-${r3Idx + 1}`;
      const r3Slot = ((i % 2) + 1) as 1 | 2;

      matches.push({
        id: matchId,
        round: 1,
        position: i + 1,
        player1: p1,
        player2: p2,
        score1: score1 !== null && !isNaN(score1!) ? score1 : null,
        score2: score2 !== null && !isNaN(score2!) ? score2 : null,
        walkover: false,
        winner,
        bye: false,
        nextMatchId: r3MatchId,
        nextSlot: r3Slot,
      });

      cellMap[matchId] = {
        p1Row: r2Row1,
        p2Row: r2Row2,
        scoreCol: "N",
      };
    }

    // Scan P column for R3 matches (Last 512)
    const r3Cells: { row: number }[] = [];
    for (let row = 8; row <= 70; row++) {
      const formula = getCellFormula(ws, row, 16); // P col
      if (formula && isWinnerFormula(formula)) {
        r3Cells.push({ row });
      }
    }

    const r3MatchCount = Math.floor(r3Cells.length / 2);
    for (let i = 0; i < r3MatchCount; i++) {
      const matchId = `R3-${i + 1}`;
      const row1 = r3Cells[i * 2].row;
      const row2 = r3Cells[i * 2 + 1].row;

      // Player names come from R2 winners
      const r2Match1 = matches.find(
        (m) => m.nextMatchId === matchId && m.nextSlot === 1,
      );
      const r2Match2 = matches.find(
        (m) => m.nextMatchId === matchId && m.nextSlot === 2,
      );
      const p1 = r2Match1?.winner ?? null;
      const p2 = r2Match2?.winner ?? null;

      const s1 = ws.getCell(row1, 17).value; // Q col
      const s2 = ws.getCell(row2, 17).value;
      const score1 =
        typeof s1 === "number" ? s1 : s1 !== null ? Number(s1) : null;
      const score2 =
        typeof s2 === "number" ? s2 : s2 !== null ? Number(s2) : null;

      let winner: string | null = null;
      if (
        score1 !== null &&
        score2 !== null &&
        !isNaN(score1) &&
        !isNaN(score2) &&
        score1 !== score2
      ) {
        winner = score1 > score2 ? p1 : p2;
      }

      const r4Idx = Math.floor(i / 2);
      const r4MatchId = `R4-${r4Idx + 1}`;
      const r4Slot = ((i % 2) + 1) as 1 | 2;

      matches.push({
        id: matchId,
        round: 2,
        position: i + 1,
        player1: p1,
        player2: p2,
        score1: score1 !== null && !isNaN(score1!) ? score1 : null,
        score2: score2 !== null && !isNaN(score2!) ? score2 : null,
        walkover: false,
        winner,
        bye: false,
        nextMatchId: r4MatchId,
        nextSlot: r4Slot,
      });

      cellMap[matchId] = { p1Row: row1, p2Row: row2, scoreCol: "Q" };
    }

    // Scan S column for R4 matches (Last 256 / Qualifier)
    const r4Cells: { row: number }[] = [];
    for (let row = 8; row <= 70; row++) {
      const formula = getCellFormula(ws, row, 19); // S col
      if (formula && isWinnerFormula(formula)) {
        r4Cells.push({ row });
      }
    }

    const r4MatchCount = Math.floor(r4Cells.length / 2);
    for (let i = 0; i < r4MatchCount; i++) {
      const matchId = `R4-${i + 1}`;
      const row1 = r4Cells[i * 2].row;
      const row2 = r4Cells[i * 2 + 1].row;

      const r3Match1 = matches.find(
        (m) => m.nextMatchId === matchId && m.nextSlot === 1,
      );
      const r3Match2 = matches.find(
        (m) => m.nextMatchId === matchId && m.nextSlot === 2,
      );
      const p1 = r3Match1?.winner ?? null;
      const p2 = r3Match2?.winner ?? null;

      const s1 = ws.getCell(row1, 20).value; // T col
      const s2 = ws.getCell(row2, 20).value;
      const score1 =
        typeof s1 === "number" ? s1 : s1 !== null ? Number(s1) : null;
      const score2 =
        typeof s2 === "number" ? s2 : s2 !== null ? Number(s2) : null;

      let winner: string | null = null;
      if (
        score1 !== null &&
        score2 !== null &&
        !isNaN(score1) &&
        !isNaN(score2) &&
        score1 !== score2
      ) {
        winner = score1 > score2 ? p1 : p2;
      }

      // R4 matches are the final qualifier — no next match
      matches.push({
        id: matchId,
        round: 3,
        position: i + 1,
        player1: p1,
        player2: p2,
        score1: score1 !== null && !isNaN(score1!) ? score1 : null,
        score2: score2 !== null && !isNaN(score2!) ? score2 : null,
        walkover: false,
        winner,
        bye: false,
        nextMatchId: null,
        nextSlot: null,
      });

      cellMap[matchId] = { p1Row: row1, p2Row: row2, scoreCol: "T" };
    }

    // Build rounds
    const rounds: IMDrawRound[] = ROUND_COLS.map((rc, i) => ({
      name: rc.name,
      deadline: roundDeadlines[i] || "",
    }));
    // The Qualifier round is shown as a label column but scores are in S/T (Last 256)
    // Add it as a display round if desired
    rounds.push({
      name: "Qualifier",
      deadline: roundDeadlines[4] || "",
    });

    // Build draw data
    const drawData = {
      competition: event.fullName,
      event: eventName,
      finals: event.finals,
      venue: event.finalsVenue,
      qualifiers: qualifierCount,
      format: event.format,
      updatedAt: new Date().toISOString(),
      rounds,
      players: { seeds, entries },
      matches,
      sheetName: ws.name,
      cellMap,
    };

    // Save files
    const eventDir = path.join(DATA_DIR, eventId);
    await mkdir(eventDir, { recursive: true });
    await writeFile(
      path.join(eventDir, "original.xlsx"),
      Buffer.from(arrayBuf),
    );
    await writeFile(
      path.join(eventDir, "draw.json"),
      JSON.stringify(drawData, null, 2),
      "utf-8",
    );

    // Update events.json
    event.hasSpreadsheet = true;
    event.drawAvailable = true;
    if (event.status === "upcoming") event.status = "active";
    await writeFile(
      path.join(DATA_DIR, "events.json"),
      JSON.stringify(eventsData, null, 2),
      "utf-8",
    );

    const playerCount = seeds.length + entries.length;
    const matchCount = matches.filter((m) => !m.bye).length;

    return NextResponse.json({
      success: true,
      playerCount,
      matchCount,
      warning: hasExistingResults
        ? "Existing draw with results was replaced"
        : undefined,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Failed to process spreadsheet" },
      { status: 500 },
    );
  }
}
