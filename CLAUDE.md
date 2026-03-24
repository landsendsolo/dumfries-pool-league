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

### SPA Events Admin
- Admin page: /admin/im-draw (password: 2507)
- Data stored in data/spa-events/ (events.json + per-event draw.json + original.xlsx)
- API routes: /api/spa-events (events list), /api/spa-events/[eventId] (GET/POST/DELETE draw data)
- Upload: /api/spa-events/[eventId]/upload (POST .xlsx, reads Sheet 12 Dumfries area)
- Download: /api/spa-events/[eventId]/download (GET filled .xlsx for SPA submission)
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
