"use client";

import dynamic from "next/dynamic";
import type { TickerData } from "@/lib/ticker";

const Ticker = dynamic(
  () => import("./ticker").then((m) => ({ default: m.Ticker })),
  { ssr: false },
);

export function LazyTicker({ initialData }: { initialData?: TickerData }) {
  return <Ticker initialData={initialData} />;
}
