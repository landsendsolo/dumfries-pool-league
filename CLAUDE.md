@AGENTS.md

## TODO LIST

### Formspree
- Add sponsors@dumfriespoolleague.co.uk to Sponsor Enquiry form workflow in Formspree dashboard
- Add info@dumfriespoolleague.co.uk to Join Enquiry form workflow in Formspree dashboard

### Email
- Set up email forwarding in Fasthosts:
  info@dumfriespoolleague.co.uk → dumfriespoolleague2@gmail.com
  sponsors@dumfriespoolleague.co.uk → dumfriespoolleague2@gmail.com

### Pool Hub
- Add info@dumfriespoolleague.co.uk webmail link to Pool Hub dashboard
- Add sponsors@dumfriespoolleague.co.uk webmail link to Pool Hub dashboard

### Venues
- Add Google Maps directions button to each venue card on /venues page

### Authentication
- NextAuth v5 (Auth.js) with credentials provider
- Config: auth.ts (exports handlers, auth, signIn, signOut)
- API route: app/api/auth/[...nextauth]/route.ts
- Middleware: middleware.ts (protects /admin/* except /admin/login)
- Env vars in .env.local (never committed): ADMIN_USERNAME, ADMIN_PASSWORD_HASH, NEXTAUTH_SECRET, NEXTAUTH_URL
- Template: .env.local.example (committed to git)
- Generate password hash: node scripts/generate-hash.mjs <password>
- To add a new admin: generate hash, update .env.local
- Session: JWT strategy, session cookie (expires when browser closes)
- Route group: app/admin/(protected)/ has server-side auth check layout

### SPA Events Admin
- Admin page: /admin/im-draw (protected by NextAuth)
- Login page: /admin/login
- Data stored in data/spa-events/ (events.json + per-event draw.json + original.xlsx)
- API routes: /api/spa-events (events list, public), /api/spa-events/[eventId] (GET public, POST/DELETE auth required)
- Upload: /api/spa-events/[eventId]/upload (POST .xlsx, auth required, reads Sheet 12 Dumfries area)
- Download: /api/spa-events/[eventId]/download (GET filled .xlsx, auth required)
- Public hub: /spa-events (IM events, Willie McCartney Trophy, SPA Rankings)
- Individual draws: /spa-events/[eventId]

### Cleanup
- Remove public/logo-source.jpg from repo (unnecessary in production)

### Future features
- News/announcements admin panel
- Player profile individual pages
- Hall of fame / season archive
- Homepage hero image

### Forum (Next Session)
- Build fully integrated forum into the website
- Sections: Announcements, General Chat, Match Reports, Season Discussion, Rules & Disputes, Fixtures & Availability, Player Banter, New Players
- Features: User registration/login, player profiles, likes/reactions, admin moderation, mobile responsive, navy/gold design, search
- Tech stack: PostgreSQL on VPS, NextAuth for login, Prisma ORM
- Registration method: TBC (open / invite only / registered players only)
- Moderation: TBC (full controls / basic / none)
- Note: Significant build — plan for 2-3 sessions

## OUTPUT RULES — MANDATORY
- NEVER use the Read tool when the user asks to see file contents
- ALWAYS use bash cat to print file contents as plain text in the chat
- NEVER summarise — print everything in full
- Before making ANY fix, read the actual file first with: cat file.ts && echo "==DONE=="
- If asked to read multiple files: cat file1.ts && echo "==FILE1==" && cat file2.ts && echo "==FILE2=="
