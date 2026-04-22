# Lessons Learned

## Claude Code Behaviour Rules
- NEVER use the Read tool when asked for file contents — always use bash cat
- NEVER summarise file contents — print full raw output
- NEVER guess at file contents — always read first before making changes
- When asked to read files, run: cat file1 && cat file2 etc
- Always print output as plain text in the chat, not in tool panels

## Next.js Caching Rules
- revalidatePath() does NOT work on API routes — only page routes
- To make an API route never cache: export const dynamic = "force-dynamic"
- To bypass browser cache on fetch: { cache: "no-store" }
- revalidate = N only works for page routes, not API responses

## Deployment
- Always use ./scripts/deploy.sh "message"
- data/ticker-settings.json, data/feedback.json, data/spa-events/*/draw.json are gitignored
- These files are written by the admin panel on VPS — never overwrite them via git
- VPS git conflicts: git stash → git pull → git stash pop

## Header Component
- Adding position:absolute children to header breaks homepage stats
- Use a different approach — CSS class on header itself, not absolute children

## Live Scores
- LeagueAppLive only shows a match in livedata.php once scoring starts
- competitionid=1397 needed for Team Comp matches
- Blacklist invalid match IDs in BLACKLISTED_MATCH_IDS array in app/api/live/route.ts

## Two Window System
- Claude.ai window — strategy and decisions only, never executes commands
- Claude Code — executes all commands, reads files, makes changes
- Always get full file contents with bash cat before writing fix prompts
- Never write prompts based on guessed file structure

## Live Scores — Match Blacklist

- Blacklist location: `app/api/live/route.ts` — `BLACKLISTED_MATCH_IDS` array at top of file
- Add a match ID to the array to prevent it showing in the live feed
- Currently blacklisted: 301883 (ghost/test match — no players), 315619 (completed cup semi-final)
- 301873 was blacklisted during Team Competition finals (March 2026) then unblacklisted April 2026 — it is a real league match (Lochside Tavern vs Normandy A)
- LeagueAppLive only adds a match to the live feed once scoring starts — 0-0 matches appear in feed but are valid
- Both default and competitionid=1397 URLs return identical data — no need to fetch twice
- Match detail pages always contain a golf handicap table at the top (Geoff Baker, Graham Audis etc) — this is a LeagueApp template, ignore it

## events.json Must Be Gitignored (22 April 2026)
- `data/spa-events/events.json` is VPS-written and must never be tracked by git
- Added to `.gitignore` on 22 April 2026 after repeated VPS merge conflicts caused by SCP vs git pull conflicts
- When adding an already-tracked file to `.gitignore`, must also run `git rm --cached <file>` — simply adding to `.gitignore` does not stop git tracking

## SinglesDrawView Must Be Explicitly Placed in JSX
- Importing a component does not render it — it must be placed in the JSX return
- After multiple refactors the SinglesDrawView was imported but never placed in the cup page JSX, causing scores to not display

## Server Components Cannot Be Used Inside Client Components
- `singles-draw.tsx` was converted to a server component but `cup/page.tsx` is `"use client"`, so the draw was never rendered server-side
- Fix: created separate `singles-draw-client.tsx` client component that fetches from `/api/singles`

## revalidatePath Does Not Work on Static Pages
- `/cup` was rendering as static (○) so `revalidatePath("/cup")` had no effect
- Fix: add `export const dynamic = "force-dynamic"` to `app/cup/layout.tsx`

## IM Draw and Singles Draw Alignment Fix
- The exponential spacing algorithm (`Math.pow(2, roundIndex)`) breaks when match counts are non-standard
- Fix is fixed slot height: `SLOT_H=58`, `totalH=round0Count*SLOT_H`, `slotH=totalH/matches.length`
- Each match centred in its slot with flexbox (`flex items-center`)
- Applied to both `app/spa-events/draw.tsx` and `app/cup/singles/page.tsx`

## Willie McCartney Spreadsheet Has Different Column Layout
- The upload parser is hardcoded for IM format (columns J/K/M/P/S)
- Willie McCartney uses H/I/K/L/N/O columns — parser silently produces empty draw
- Fix: manually create `draw.json` with correct structure and SCP to VPS

## Winner Propagation in Draw Brackets Must Be Explicit
- Saving a result does not automatically populate next round player slots
- A `withFeeders()` helper is needed that reads winner fields from the match lookup and fills null player slots in subsequent rounds
- Must be applied in both the public draw page and the admin page
- Pattern: `p1: m.p1 === "TBD" ? (md[feeder1Id]?.winner ?? "TBD") : m.p1`
