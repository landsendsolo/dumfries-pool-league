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
  { p1: "TBD", p2: "TBD" },
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
const STEP = COL_W + COL_GAP;
const NAME_PAD_X = 8;
const FONT = 11;
const CONN_COLOR = "#D4AF37";
const CONN_OPACITY = 0.35;

/* ── precompute Y center positions (shared by both halves) ── */

const TOP_PAD = 40;
const R1_SPACING = PAIR_H + MATCH_GAP;

// Round 1: 16 evenly spaced — this is the baseline grid
const r1Ys: number[] = [];
for (let i = 0; i < 16; i++) {
  r1Ys.push(TOP_PAD + i * R1_SPACING + PAIR_H / 2);
}

// Round 2: midpoint of each R1 pair
const r2Ys: number[] = [];
for (let i = 0; i < 8; i++) {
  r2Ys.push((r1Ys[i * 2] + r1Ys[i * 2 + 1]) / 2);
}

// Round 3: midpoint of each R2 pair
const r3Ys: number[] = [];
for (let i = 0; i < 4; i++) {
  r3Ys.push((r2Ys[i * 2] + r2Ys[i * 2 + 1]) / 2);
}

// Round 4: midpoint of each R3 pair
const r4Ys: number[] = [];
for (let i = 0; i < 2; i++) {
  r4Ys.push((r3Ys[i * 2] + r3Ys[i * 2 + 1]) / 2);
}

// Final: midpoint of the two R4 matches
const finalCenterY = (r4Ys[0] + r4Ys[1]) / 2;

const TOTAL_H = TOP_PAD + 15 * R1_SPACING + PAIR_H + 20;

/* ──────── render a single match box at centerY ──────── */

function renderMatch(
  m: Match,
  x: number,
  centerY: number,
  key: string,
): React.ReactNode[] {
  const topY = centerY - PAIR_H / 2;
  const isTBD = m.p1 === "TBD" && m.p2 === "TBD";
  const p1Bye = m.p1 === "bye";
  const els: React.ReactNode[] = [];

  els.push(
    <rect
      key={`bg-${key}`}
      x={x}
      y={topY}
      width={COL_W}
      height={PAIR_H}
      rx={4}
      fill={isTBD ? "rgba(15,23,42,0.3)" : "rgba(15,23,42,0.7)"}
      stroke={isTBD ? "rgba(212,175,55,0.08)" : "rgba(212,175,55,0.2)"}
      strokeWidth={1}
    />,
  );

  els.push(
    <line
      key={`div-${key}`}
      x1={x}
      x2={x + COL_W}
      y1={topY + SLOT_H + SLOT_GAP / 2}
      y2={topY + SLOT_H + SLOT_GAP / 2}
      stroke="rgba(212,175,55,0.12)"
      strokeWidth={1}
    />,
  );

  const p1Text = p1Bye ? "BYE" : m.p1;
  const p1Fill = p1Bye
    ? "rgba(156,163,175,0.3)"
    : isTBD
      ? "rgba(156,163,175,0.35)"
      : "#e2e8f0";
  els.push(
    <text
      key={`p1-${key}`}
      x={x + NAME_PAD_X}
      y={topY + SLOT_H / 2 + 4}
      fill={p1Fill}
      fontSize={FONT}
      fontStyle={p1Bye ? "italic" : "normal"}
    >
      {p1Text}
    </text>,
  );

  const p2Fill = isTBD ? "rgba(156,163,175,0.35)" : "#e2e8f0";
  els.push(
    <text
      key={`p2-${key}`}
      x={x + NAME_PAD_X}
      y={topY + SLOT_H + SLOT_GAP + SLOT_H / 2 + 4}
      fill={p2Fill}
      fontSize={FONT}
    >
      {m.p2}
    </text>,
  );

  return els;
}

/* ──── render a round label above the first match ──── */

function renderLabel(
  label: string,
  x: number,
  firstCenterY: number,
  key: string,
): React.ReactNode {
  return (
    <text
      key={`label-${key}`}
      x={x + COL_W / 2}
      y={firstCenterY - PAIR_H / 2 - 10}
      textAnchor="middle"
      fill="#D4AF37"
      fontSize={9}
      fontWeight={700}
      letterSpacing={1.5}
      className="uppercase"
    >
      {label}
    </text>
  );
}

/* ── left-side connectors (exit right edge → enter left edge) ── */

function leftConnectors(
  fromYs: number[],
  toYs: number[],
  fromX: number,
  toX: number,
  keyPrefix: string,
): React.ReactNode[] {
  const lines: React.ReactNode[] = [];
  const exitX = fromX + COL_W;
  const entryX = toX;
  const midX = (exitX + entryX) / 2;

  for (let i = 0; i < toYs.length; i++) {
    const y1 = fromYs[i * 2];
    const y2 = fromYs[i * 2 + 1];
    const yMid = toYs[i];

    lines.push(
      <line key={`${keyPrefix}-${i}-h1`} x1={exitX} y1={y1} x2={midX} y2={y1}
        stroke={CONN_COLOR} strokeOpacity={CONN_OPACITY} strokeWidth={1} />,
      <line key={`${keyPrefix}-${i}-h2`} x1={exitX} y1={y2} x2={midX} y2={y2}
        stroke={CONN_COLOR} strokeOpacity={CONN_OPACITY} strokeWidth={1} />,
      <line key={`${keyPrefix}-${i}-v`} x1={midX} y1={y1} x2={midX} y2={y2}
        stroke={CONN_COLOR} strokeOpacity={CONN_OPACITY} strokeWidth={1} />,
      <line key={`${keyPrefix}-${i}-h3`} x1={midX} y1={yMid} x2={entryX} y2={yMid}
        stroke={CONN_COLOR} strokeOpacity={CONN_OPACITY} strokeWidth={1} />,
    );
  }
  return lines;
}

/* ── right-side connectors (exit left edge → enter right edge) ── */

function rightConnectors(
  fromYs: number[],
  toYs: number[],
  fromX: number,
  toX: number,
  keyPrefix: string,
): React.ReactNode[] {
  const lines: React.ReactNode[] = [];
  const exitX = fromX;
  const entryX = toX + COL_W;
  const midX = (exitX + entryX) / 2;

  for (let i = 0; i < toYs.length; i++) {
    const y1 = fromYs[i * 2];
    const y2 = fromYs[i * 2 + 1];
    const yMid = toYs[i];

    lines.push(
      <line key={`${keyPrefix}-${i}-h1`} x1={exitX} y1={y1} x2={midX} y2={y1}
        stroke={CONN_COLOR} strokeOpacity={CONN_OPACITY} strokeWidth={1} />,
      <line key={`${keyPrefix}-${i}-h2`} x1={exitX} y1={y2} x2={midX} y2={y2}
        stroke={CONN_COLOR} strokeOpacity={CONN_OPACITY} strokeWidth={1} />,
      <line key={`${keyPrefix}-${i}-v`} x1={midX} y1={y1} x2={midX} y2={y2}
        stroke={CONN_COLOR} strokeOpacity={CONN_OPACITY} strokeWidth={1} />,
      <line key={`${keyPrefix}-${i}-h3`} x1={midX} y1={yMid} x2={entryX} y2={yMid}
        stroke={CONN_COLOR} strokeOpacity={CONN_OPACITY} strokeWidth={1} />,
    );
  }
  return lines;
}

/* ──── TBD match generator ──── */

function tbdMatches(n: number): Match[] {
  return Array.from({ length: n }, () => ({ p1: "TBD", p2: "TBD" }));
}

/* ═══════════════════ page component ═══════════════════ */

export default function SinglesBracketPage() {
  /* ── X positions ── */
  const leftStartX = 20;
  const L_R1_X = leftStartX;
  const L_R2_X = leftStartX + STEP;
  const L_R3_X = leftStartX + 2 * STEP;
  const L_R4_X = leftStartX + 3 * STEP;

  const halfW = 3 * STEP + COL_W;
  const centerGap = 40;
  const finalW = 180;
  const finalGap = 40;

  const finalX = leftStartX + halfW + centerGap;
  const finalY = finalCenterY - 50;

  /* Right half: R4 closest to center, R1 on the far right */
  const R_R4_X = finalX + finalW + finalGap;
  const R_R3_X = R_R4_X + STEP;
  const R_R2_X = R_R4_X + 2 * STEP;
  const R_R1_X = R_R4_X + 3 * STEP;

  const svgW = R_R1_X + COL_W + 20;

  /* TBD round data */
  const L_R3 = tbdMatches(4);
  const L_R4 = tbdMatches(2);
  const R_R2 = tbdMatches(8);
  const R_R3 = tbdMatches(4);
  const R_R4 = tbdMatches(2);

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
            height={TOTAL_H}
            viewBox={`0 0 ${svgW} ${TOTAL_H}`}
            className="mx-auto"
          >
            {/* ── LEFT HALF ── */}

            {renderLabel("Round 1", L_R1_X, r1Ys[0], "L-R1")}
            {L_R1.map((m, i) => renderMatch(m, L_R1_X, r1Ys[i], `L-R1-${i}`))}

            {leftConnectors(r1Ys, r2Ys, L_R1_X, L_R2_X, "lc-12")}

            {renderLabel("Round 2", L_R2_X, r2Ys[0], "L-R2")}
            {L_R2.map((m, i) => renderMatch(m, L_R2_X, r2Ys[i], `L-R2-${i}`))}

            {leftConnectors(r2Ys, r3Ys, L_R2_X, L_R3_X, "lc-23")}

            {renderLabel("Round 3", L_R3_X, r3Ys[0], "L-R3")}
            {L_R3.map((m, i) => renderMatch(m, L_R3_X, r3Ys[i], `L-R3-${i}`))}

            {leftConnectors(r3Ys, r4Ys, L_R3_X, L_R4_X, "lc-34")}

            {renderLabel("Round 4", L_R4_X, r4Ys[0], "L-R4")}
            {L_R4.map((m, i) => renderMatch(m, L_R4_X, r4Ys[i], `L-R4-${i}`))}

            {/* L-R4 → Final */}
            {leftConnectors(r4Ys, [finalCenterY], L_R4_X, finalX, "lc-4f")}

            {/* ── RIGHT HALF ── */}

            {renderLabel("Round 1", R_R1_X, r1Ys[0], "R-R1")}
            {R_R1.map((m, i) => renderMatch(m, R_R1_X, r1Ys[i], `R-R1-${i}`))}

            {rightConnectors(r1Ys, r2Ys, R_R1_X, R_R2_X, "rc-12")}

            {renderLabel("Round 2", R_R2_X, r2Ys[0], "R-R2")}
            {R_R2.map((m, i) => renderMatch(m, R_R2_X, r2Ys[i], `R-R2-${i}`))}

            {rightConnectors(r2Ys, r3Ys, R_R2_X, R_R3_X, "rc-23")}

            {renderLabel("Round 3", R_R3_X, r3Ys[0], "R-R3")}
            {R_R3.map((m, i) => renderMatch(m, R_R3_X, r3Ys[i], `R-R3-${i}`))}

            {rightConnectors(r3Ys, r4Ys, R_R3_X, R_R4_X, "rc-34")}

            {renderLabel("Round 4", R_R4_X, r4Ys[0], "R-R4")}
            {R_R4.map((m, i) => renderMatch(m, R_R4_X, r4Ys[i], `R-R4-${i}`))}

            {/* R-R4 → Final (right-to-left into Final's right edge) */}
            {(() => {
              const exitX = R_R4_X;
              const entryX = finalX + finalW;
              const midX = (exitX + entryX) / 2;
              return (
                <>
                  <line x1={exitX} y1={r4Ys[0]} x2={midX} y2={r4Ys[0]}
                    stroke={CONN_COLOR} strokeOpacity={CONN_OPACITY} strokeWidth={1} />
                  <line x1={exitX} y1={r4Ys[1]} x2={midX} y2={r4Ys[1]}
                    stroke={CONN_COLOR} strokeOpacity={CONN_OPACITY} strokeWidth={1} />
                  <line x1={midX} y1={r4Ys[0]} x2={midX} y2={r4Ys[1]}
                    stroke={CONN_COLOR} strokeOpacity={CONN_OPACITY} strokeWidth={1} />
                  <line x1={midX} y1={finalCenterY} x2={entryX} y2={finalCenterY}
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
