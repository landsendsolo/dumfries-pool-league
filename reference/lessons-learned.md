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
