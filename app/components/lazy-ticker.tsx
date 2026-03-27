"use client";

import dynamic from "next/dynamic";

const Ticker = dynamic(
  () => import("./ticker").then((m) => ({ default: m.Ticker })),
  { ssr: false },
);

export function LazyTicker() {
  return <Ticker />;
}
