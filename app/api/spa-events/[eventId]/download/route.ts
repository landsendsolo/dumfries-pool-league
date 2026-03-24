import { readFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import type { SpaEventsData, CellMap } from "@/lib/spa-event-types";
import type { IMDrawData, IMDrawMatch } from "@/lib/im-draw-types";

export const dynamic = "force-dynamic";

const DATA_DIR = path.join(process.cwd(), "data", "spa-events");
const PASSWORD = "2507";

interface DrawDataWithCellMap extends IMDrawData {
  cellMap?: CellMap;
  sheetName?: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
) {
  const { eventId } = await params;
  const password = request.nextUrl.searchParams.get("password");

  if (password !== PASSWORD) {
    return NextResponse.json(
      { error: "Invalid password" },
      { status: 401 },
    );
  }

  try {
    // Validate event
    const eventsRaw = await readFile(
      path.join(DATA_DIR, "events.json"),
      "utf-8",
    );
    const { events } = JSON.parse(eventsRaw) as SpaEventsData;
    const event = events.find((e) => e.id === eventId);
    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 },
      );
    }

    if (!event.hasSpreadsheet) {
      return NextResponse.json(
        { error: "No spreadsheet uploaded for this event" },
        { status: 400 },
      );
    }

    // Read draw data
    const drawRaw = await readFile(
      path.join(DATA_DIR, eventId, "draw.json"),
      "utf-8",
    );
    const drawData = JSON.parse(drawRaw) as DrawDataWithCellMap;

    if (!drawData.cellMap) {
      return NextResponse.json(
        { error: "Draw has no cell mapping — re-upload the spreadsheet" },
        { status: 400 },
      );
    }

    // Load original spreadsheet
    const xlsxPath = path.join(DATA_DIR, eventId, "original.xlsx");
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(xlsxPath);

    // Find the Dumfries sheet
    let ws: ExcelJS.Worksheet | undefined;
    if (drawData.sheetName) {
      ws = workbook.getWorksheet(drawData.sheetName);
    }
    if (!ws) {
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
    }

    if (!ws) {
      return NextResponse.json(
        { error: "Could not find Dumfries sheet in spreadsheet" },
        { status: 500 },
      );
    }

    // Write scores for completed non-bye matches
    for (const match of drawData.matches) {
      if (!match.winner || match.bye) continue;

      const mapping = drawData.cellMap[match.id];
      if (!mapping) continue;

      const colNum =
        mapping.scoreCol.charCodeAt(0) - 64; // "K" -> 11, "N" -> 14, etc.

      if (match.score1 !== null) {
        ws.getCell(mapping.p1Row, colNum).value = match.score1;
      }
      if (match.score2 !== null) {
        ws.getCell(mapping.p2Row, colNum).value = match.score2;
      }
    }

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Create filename
    const safeName = event.name.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "-");
    const filename = `Dumfries-${safeName}-Results.xlsx`;

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("Download error:", err);
    return NextResponse.json(
      { error: "Failed to generate download" },
      { status: 500 },
    );
  }
}
