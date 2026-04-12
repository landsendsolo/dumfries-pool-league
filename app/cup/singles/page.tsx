import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dumfries Singles Pool Event — Draw",
  description: "Full bracket draw for the Dumfries Singles Pool Event 2026",
};

/* ───────────────────────── data ───────────────────────── */

interface Match {
  p1: string;
  p2: string;
}

// LEFT half ─ Round 1 (16 slots: 14 byes + 2 real matches)
const L_R1: Match[] = [
  { p1: "bye", p2: "J. Howie" },
  { p1: "bye", p2: "R.A. Cooper" },
  { p1: "bye", p2: "G. Campbell" },
  { p1: "bye", p2: "J. McEwen" },
  { p1: "bye", p2: "R. Hutchison" },
  { p1: "bye", p2: "A. Lammie Jnr" },
  { p1: "bye", p2: "C. Jackson" },
  { p1: "bye", p2: "S. Drysdale" },
  { p1: "bye", p2: "S. Trainor" },
  { p1: "bye", p2: "L. McPherson" },
  { p1: "bye", p2: "N. Maloney" },
  { p1: "bye", p2: "O. Bruce" },
  { p1: "bye", p2: "A. Parker" },
  { p1: "bye", p2: "P. Scott" },
  { p1: "S. McLeod", p2: "S. Couper" },
  { p1: "S. Rutherford", p2: "G. Hunter" },
];

// LEFT half ─ Round 2 (8 matches)
const L_R2: Match[] = [
  { p1: "J. Howie", p2: "R.A. Cooper" },
  { p1: "G. Campbell", p2: "J. McEwen" },
  { p1: "R. Hutchison", p2: "A. Lammie Jnr" },
  { p1: "C. Jackson", p2: "S. Drysdale" },
  { p1: "S. Trainor", p2: "L. McPherson" },
  { p1: "N. Maloney", p2: "O. Bruce" },
  { p1: "A. Parker", p2: "P. Scott" },
  { p1: "Winner Slot 15", p2: "Winner Slot 16" },
];

// RIGHT half ─ Round 1 (16 real matches)
const R_R1: Match[] = [
  { p1: "D. Cruickshank", p2: "D. Young" },
  { p1: "L. Donaldson", p2: "C. Silver" },
  { p1: "K. Kirkpatrick", p2: "J. Stewart" },
  { p1: "A. Moffat", p2: "A. Bell" },
  { p1: "D. Cameron", p2: "C. Riddick" },
  { p1: "K. Galligan", p2: "C.J. Clapperton" },
  { p1: "L. Kerr", p2: "P. Hamilton" },
  { p1: "A. Lammie Snr", p2: "J. Kelly" },
  { p1: "J. Devlin", p2: "O. Brown" },
  { p1: "J. Robertson", p2: "M. Lockhart" },
  { p1: "R. Kelly", p2: "C. Robb" },
  { p1: "D. Thom", p2: "D. Dalgleish" },
  { p1: "R. Turley", p2: "P. Coulter" },
  { p1: "S. Griggs", p2: "D. Livingstone" },
  { p1: "M. Donnan", p2: "D. Wylie" },
  { p1: "S. Kirkpatrick", p2: "P. Prange" },
];

/* ───────────────────── layout constants ───────────────── */

const SLOT_H = 36;
const SLOT_GAP = 4;
const PAIR_H = SLOT_H * 2 + SLOT_GAP;
const MATCH_GAP = 10;
const COL_W = 170;
const COL_GAP = 50;
const NAME_PAD_X = 8;
const FONT = 11;
const CONN_COLOR = "#D4AF37";
const CONN_OPACITY = 0.35;

/* ────────── helper: y-center of a match block ───────── */
function matchCenterY(index: number, count: number, totalH: number): number {
  const blockH = count * PAIR_H + (count - 1) * MATCH_GAP;
  const topOffset = (totalH - blockH) / 2;
  return topOffset + index * (PAIR_H + MATCH_GAP) + PAIR_H / 2;
}

/* ─────────── draw one column of matches ─────────────── */
function renderColumn(
  matches: Match[],
  x: number,
  totalH: number,
  isBye: boolean,
  roundLabel: string,
) {
  const count = matches.length;
  const blockH = count * PAIR_H + (count - 1) * MATCH_GAP;
  const topOffset = (totalH - blockH) / 2;
  const elements: React.ReactNode[] = [];

  // Round label
  elements.push(
    <text
      key={`label-${roundLabel}-${x}`}
      x={x + COL_W / 2}
      y={topOffset - 12}
      textAnchor="middle"
      fill="#D4AF37"
      fontSize={9}
      fontWeight={700}
      letterSpacing={1.5}
      className="uppercase"
    >
      {roundLabel}
    </text>,
  );

  matches.forEach((m, i) => {
    const my = topOffset + i * (PAIR_H + MATCH_GAP);
    const isTBD = m.p1 === "TBD" && m.p2 === "TBD";
    const p1Bye = m.p1 === "bye";

    // Match background
    elements.push(
      <rect
        key={`bg-${roundLabel}-${i}`}
        x={x}
        y={my}
        width={COL_W}
        height={PAIR_H}
        rx={4}
        fill={isTBD ? "rgba(15,23,42,0.3)" : "rgba(15,23,42,0.7)"}
        stroke={isTBD ? "rgba(212,175,55,0.08)" : "rgba(212,175,55,0.2)"}
        strokeWidth={1}
      />,
    );

    // Divider line
    elements.push(
      <line
        key={`div-${roundLabel}-${i}`}
        x1={x}
        x2={x + COL_W}
        y1={my + SLOT_H + SLOT_GAP / 2}
        y2={my + SLOT_H + SLOT_GAP / 2}
        stroke="rgba(212,175,55,0.12)"
        strokeWidth={1}
      />,
    );

    // Player 1
    const p1Text = p1Bye ? "BYE" : m.p1;
    const p1Fill = p1Bye ? "rgba(156,163,175,0.3)" : isTBD ? "rgba(156,163,175,0.35)" : "#e2e8f0";
    elements.push(
      <text
        key={`p1-${roundLabel}-${i}`}
        x={x + NAME_PAD_X}
        y={my + SLOT_H / 2 + 4}
        fill={p1Fill}
        fontSize={FONT}
        fontStyle={p1Bye ? "italic" : "normal"}
      >
        {p1Text}
      </text>,
    );

    // Player 2
    const p2Fill = isTBD ? "rgba(156,163,175,0.35)" : "#e2e8f0";
    elements.push(
      <text
        key={`p2-${roundLabel}-${i}`}
        x={x + NAME_PAD_X}
        y={my + SLOT_H + SLOT_GAP + SLOT_H / 2 + 4}
        fill={p2Fill}
        fontSize={FONT}
      >
        {m.p2}
      </text>,
    );
  });

  return elements;
}

/* ───────── connector lines between two columns ────────── */
function renderConnectors(
  fromCount: number,
  toCount: number,
  fromX: number,
  toX: number,
  totalH: number,
) {
  const lines: React.ReactNode[] = [];
  for (let i = 0; i < toCount; i++) {
    const srcTop = i * 2;
    const srcBot = i * 2 + 1;
    if (srcTop >= fromCount || srcBot >= fromCount) break;
    const y1 = matchCenterY(srcTop, fromCount, totalH);
    const y2 = matchCenterY(srcBot, fromCount, totalH);
    const yMid = (y1 + y2) / 2;
    const xFrom = fromX + COL_W;
    const xTo = toX;
    const xMid = (xFrom + xTo) / 2;

    // Horizontal from top match
    lines.push(
      <line key={`ct-${fromX}-${i}-h1`} x1={xFrom} y1={y1} x2={xMid} y2={y1}
        stroke={CONN_COLOR} strokeOpacity={CONN_OPACITY} strokeWidth={1} />,
    );
    // Horizontal from bottom match
    lines.push(
      <line key={`ct-${fromX}-${i}-h2`} x1={xFrom} y1={y2} x2={xMid} y2={y2}
        stroke={CONN_COLOR} strokeOpacity={CONN_OPACITY} strokeWidth={1} />,
    );
    // Vertical joining them
    lines.push(
      <line key={`ct-${fromX}-${i}-v`} x1={xMid} y1={y1} x2={xMid} y2={y2}
        stroke={CONN_COLOR} strokeOpacity={CONN_OPACITY} strokeWidth={1} />,
    );
    // Horizontal into next round
    lines.push(
      <line key={`ct-${fromX}-${i}-h3`} x1={xMid} y1={yMid} x2={xTo} y2={yMid}
        stroke={CONN_COLOR} strokeOpacity={CONN_OPACITY} strokeWidth={1} />,
    );
  }
  return lines;
}

/* ──────────── build one half (left or right) ──────────── */
function buildHalf(
  rounds: { label: string; matches: Match[]; isBye?: boolean }[],
  startX: number,
  totalH: number,
) {
  const els: React.ReactNode[] = [];
  let x = startX;
  rounds.forEach((round, ri) => {
    els.push(...renderColumn(round.matches, x, totalH, !!round.isBye, round.label));
    if (ri < rounds.length - 1) {
      const nextX = x + COL_W + COL_GAP;
      els.push(...renderConnectors(round.matches.length, rounds[ri + 1].matches.length, x, nextX, totalH));
    }
    x += COL_W + COL_GAP;
  });
  return els;
}

/* ──────────────── TBD match generators ────────────────── */
function tbdMatches(n: number): Match[] {
  return Array.from({ length: n }, () => ({ p1: "TBD", p2: "TBD" }));
}

/* ═══════════════════ page component ═══════════════════ */

export default function SinglesBracketPage() {
  /* Left half rounds */
  const leftRounds = [
    { label: "Round 1", matches: L_R1, isBye: true },
    { label: "Round 2", matches: L_R2 },
    { label: "Round 3", matches: tbdMatches(4) },
    { label: "Round 4", matches: tbdMatches(2) },
  ];

  /* Right half rounds */
  const rightRounds = [
    { label: "Round 1", matches: R_R1 },
    { label: "Round 2", matches: tbdMatches(8) },
    { label: "Round 3", matches: tbdMatches(4) },
    { label: "Round 4", matches: tbdMatches(2) },
  ];

  /* Height: driven by 16-match column (tallest) */
  const maxMatches = 16;
  const totalH = maxMatches * PAIR_H + (maxMatches - 1) * MATCH_GAP + 60;

  /* Widths */
  const halfCols = 4;
  const halfW = halfCols * COL_W + (halfCols - 1) * COL_GAP;
  const centerGap = 100;
  const finalW = 180;
  const svgW = halfW * 2 + centerGap + finalW + 40;
  const leftStartX = 20;
  const rightStartX = leftStartX + halfW + centerGap + finalW;

  /* Final box position */
  const finalX = leftStartX + halfW + (centerGap + finalW) / 2 - finalW / 2;
  const finalY = totalH / 2 - 50;

  return (
    <div className="min-h-screen bg-navy">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Link
          href="/cup"
          className="inline-flex items-center gap-2 text-gold/70 hover:text-gold text-sm transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Cups
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            Dumfries Singles Pool Event
          </h1>
          <p className="text-gray-400 text-sm">
            Sponsored by GH Gardening and Labouring Services
          </p>
        </div>
      </div>

      {/* Bracket */}
      <div className="overflow-x-auto pb-8">
        <div className="min-w-max px-4">
          <svg
            width={svgW}
            height={totalH + 20}
            viewBox={`0 0 ${svgW} ${totalH + 20}`}
            className="mx-auto"
          >
            {/* Left half */}
            {buildHalf(leftRounds, leftStartX, totalH)}

            {/* Right half (rendered right-to-left visually, we reverse column order) */}
            {(() => {
              const els: React.ReactNode[] = [];
              const reversedRounds = [...rightRounds].reverse();
              let x = rightStartX;
              reversedRounds.forEach((round, ri) => {
                els.push(...renderColumn(round.matches, x, totalH, false, round.label));
                if (ri < reversedRounds.length - 1) {
                  const nextX = x + COL_W + COL_GAP;
                  // connectors go from right column into left column (towards center)
                  els.push(...renderConnectors(
                    round.matches.length,
                    reversedRounds[ri + 1].matches.length,
                    x,
                    nextX,
                    totalH,
                  ));
                }
                x += COL_W + COL_GAP;
              });
              return els;
            })()}

            {/* Connectors from L-R4 into Final */}
            {(() => {
              const l4X = leftStartX + 3 * (COL_W + COL_GAP);
              const lY1 = matchCenterY(0, 2, totalH);
              const lY2 = matchCenterY(1, 2, totalH);
              const lMidY = (lY1 + lY2) / 2;
              return (
                <>
                  <line x1={l4X + COL_W} y1={lY1} x2={l4X + COL_W + 15} y2={lY1}
                    stroke={CONN_COLOR} strokeOpacity={CONN_OPACITY} strokeWidth={1} />
                  <line x1={l4X + COL_W} y1={lY2} x2={l4X + COL_W + 15} y2={lY2}
                    stroke={CONN_COLOR} strokeOpacity={CONN_OPACITY} strokeWidth={1} />
                  <line x1={l4X + COL_W + 15} y1={lY1} x2={l4X + COL_W + 15} y2={lY2}
                    stroke={CONN_COLOR} strokeOpacity={CONN_OPACITY} strokeWidth={1} />
                  <line x1={l4X + COL_W + 15} y1={lMidY} x2={finalX} y2={totalH / 2}
                    stroke={CONN_COLOR} strokeOpacity={CONN_OPACITY} strokeWidth={1} />
                </>
              );
            })()}

            {/* Connectors from R-R4 into Final */}
            {(() => {
              // R-R4 is the last reversed column, which is at rightStartX + 3*(COL_W+COL_GAP)
              const r4X = rightStartX + 3 * (COL_W + COL_GAP);
              const rY1 = matchCenterY(0, 2, totalH);
              const rY2 = matchCenterY(1, 2, totalH);
              const rMidY = (rY1 + rY2) / 2;
              return (
                <>
                  <line x1={r4X + COL_W} y1={rY1} x2={r4X + COL_W + 15} y2={rY1}
                    stroke={CONN_COLOR} strokeOpacity={CONN_OPACITY} strokeWidth={1} />
                  <line x1={r4X + COL_W} y1={rY2} x2={r4X + COL_W + 15} y2={rY2}
                    stroke={CONN_COLOR} strokeOpacity={CONN_OPACITY} strokeWidth={1} />
                  <line x1={r4X + COL_W + 15} y1={rY1} x2={r4X + COL_W + 15} y2={rY2}
                    stroke={CONN_COLOR} strokeOpacity={CONN_OPACITY} strokeWidth={1} />
                  <line x1={r4X + COL_W + 15} y1={rMidY} x2={finalX + finalW} y2={totalH / 2}
                    stroke={CONN_COLOR} strokeOpacity={CONN_OPACITY} strokeWidth={1} />
                </>
              );
            })()}

            {/* ── FINAL BOX ── */}
            <rect
              x={finalX}
              y={finalY}
              width={finalW}
              height={100}
              rx={6}
              fill="rgba(16,185,129,0.08)"
              stroke="rgba(16,185,129,0.4)"
              strokeWidth={2}
            />
            <text
              x={finalX + finalW / 2}
              y={finalY + 18}
              textAnchor="middle"
              fill="#10b981"
              fontSize={9}
              fontWeight={700}
              letterSpacing={1.5}
              className="uppercase"
            >
              Final
            </text>
            <line
              x1={finalX + 10}
              x2={finalX + finalW - 10}
              y1={finalY + 28}
              y2={finalY + 28}
              stroke="rgba(16,185,129,0.2)"
              strokeWidth={1}
            />
            <text
              x={finalX + finalW / 2}
              y={finalY + 48}
              textAnchor="middle"
              fill="rgba(156,163,175,0.4)"
              fontSize={FONT}
            >
              TBD
            </text>
            <text
              x={finalX + finalW / 2}
              y={finalY + 66}
              textAnchor="middle"
              fill="rgba(156,163,175,0.15)"
              fontSize={8}
            >
              vs
            </text>
            <text
              x={finalX + finalW / 2}
              y={finalY + 82}
              textAnchor="middle"
              fill="rgba(156,163,175,0.4)"
              fontSize={FONT}
            >
              TBD
            </text>

            {/* Champion label */}
            <text
              x={finalX + finalW / 2}
              y={finalY + 120}
              textAnchor="middle"
              fill="rgba(16,185,129,0.5)"
              fontSize={10}
              fontWeight={700}
              letterSpacing={1}
              className="uppercase"
            >
              Champion
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
