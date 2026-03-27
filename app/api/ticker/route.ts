import { NextResponse } from "next/server";
import { getTickerData } from "@/lib/ticker";

export const revalidate = 30;

export async function GET() {
  const data = await getTickerData();
  return NextResponse.json(data);
}
