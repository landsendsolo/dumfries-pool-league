"use client";

import dynamic from "next/dynamic";

const FeedbackButton = dynamic(
  () => import("./feedback").then((m) => ({ default: m.FeedbackButton })),
  { ssr: false },
);

export function LazyFeedback() {
  return <FeedbackButton />;
}
