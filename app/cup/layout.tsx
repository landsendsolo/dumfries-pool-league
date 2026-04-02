import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "League Competitions | Dumfries Pool League",
};

export default function CupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
