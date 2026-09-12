# MPL Ministries Website — Full Project Specification

**Purpose of this document:** Give an AI coding agent (e.g. Antigravity, Codex, Claude Code) everything needed to build, test, debug, and deliver a production-ready website with zero back-and-forth. The agent should build the complete application end-to-end, run tests, fix issues, and hand back a working deployed (or deploy-ready) site.

---

## 1. Project Summary

A website for **MPL Ministries** with a public-facing site and a single-admin dashboard for content management. Zero-budget hosting stack using free tiers only. Single Next.js application handles both frontend and backend. Optional custom domain can be added later by the client.

---

## 2. Core Features (Build All of These)

### 2.1 Live YouTube Streaming (Public Home Page)
- Automatically detect when the ministry's YouTube channel goes live — **no manual link pasting by admin.**
- Implemented as an on-demand API route (not a background cron job — see Section 3 notes) that checks the YouTube Data API v3 for the channel's live broadcast status, with the result cached for a few minutes to avoid burning API quota.
- If live: embed the live stream player automatically.
- If not live: fall back to the most recent uploaded video, or a "No live stream currently — check back soon" placeholder.
- Admin only needs to configure the YouTube Channel ID once in settings.

### 2.2 Event-Based Photo Gallery
- Admin creates new categories/events on the fly (e.g. "Christmas 2026," "Anniversary Service," "Youth Camp") — **no fixed preset list.**
- Each event has: name, creation date, and a set of uploaded images.
- Admin can upload multiple images per event.
- Admin can **reorder images within an event** (drag-and-drop).
- Admin can delete events or individual images.
- Public gallery page lists all events; clicking one opens its image set (lightbox/grid view).

### 2.3 Prayer Request System
- Public form fields:
  - Free text prayer request message
  - Name
  - Contact (phone or email)
  - Category (e.g. Healing, Family, Financial, Guidance, Other)
  - Anonymous/Private toggle
- If marked private/anonymous, the request must be **excluded at the API level** from any public or semi-public views — not just hidden in the UI.
- Spam protection: a **honeypot field only** (no Google reCAPTCHA, per client preference).
- Submissions go directly to the app's own API route and are saved to the database — **no third-party form service** (not Web3Forms, not Netlify Forms).
- **Admin email notification:** on every new submission, the API route sends an email alert to the admin's configured address (subject line + short preview; full details viewed in dashboard). Uses Resend (see Section 3) since it integrates cleanly with a serverless Next.js API route with no extra server needed.
- Admin dashboard view: list, filter by category/status, mark as "prayed for," delete.

### 2.4 About Page
- Displays ministry text and images.
- Fully editable by admin from the dashboard (text and images), no code deploy needed to update content.

### 2.5 Contact & Service Info (New)
A public-facing ministry site typically needs this even if not originally requested — visitors look for it first. Editable by admin from the dashboard, same as the About page. **Sample placeholder content below — replace with real details:**

- **Service Times (sample):**
  - Sunday Worship — 9:00 AM & 11:00 AM
  - Wednesday Bible Study — 7:00 PM
  - Friday Prayer Meeting — 6:30 PM
- **Address (sample):** 123 Faith Street, Your City, State, PIN 000000
- **Phone (sample):** +91 00000 00000
- **Email (sample):** contact@mplministries.org
- **Map:** embed Google Maps using the address (iframe embed, no API key needed for basic embed)
- **Social links (optional, sample):** YouTube channel link, Facebook page link — leave blank fields if not applicable

### 2.6 Admin Dashboard
- **Single admin account only** — no multi-role/permission system needed.
- Secure login: bcrypt-hashed password + JWT session token with expiry.
- Dashboard sections:
  - Live stream settings (YouTube Channel ID)
  - Gallery management (create/edit/delete events, upload/reorder/delete images)
  - Prayer requests (view/filter/mark/delete)
  - About page editor (text + images)
  - Contact & service info editor (service times, address, phone, email, map, social links)
  - Notification settings (admin email address to receive new prayer request alerts)
  - Change admin password

---

## 3. Technology Stack

| Layer | Choice | Hosting |
|---|---|---|
| Frontend + Backend | Next.js (React) with API Routes / Route Handlers | Vercel (free tier) |
| Database | MongoDB Atlas (free M0 cluster) | MongoDB Atlas |
| Image storage | Cloudinary (free tier) | Cloudinary |
| Email notifications | Resend (free tier: 3,000 emails/month, 100/day) | Resend |
| Auth | bcrypt + JWT | — |
| Domain | Optional, added later | Vercel free subdomain by default |

**Why no separate backend (Express/Render):**
Next.js API Routes run as serverless functions on Vercel and can handle everything a separate Express backend would — admin auth, database access, gallery/prayer-request CRUD, and the YouTube live-status check. This removes the need for a second hosting service entirely, simplifying deployment to a single codebase and a single host.

**Important architecture notes for the agent:**
- **No background cron for YouTube polling.** Vercel's free Hobby plan restricts cron jobs to once per day, which is too infrequent for live-detection. Instead, check live status on-demand inside the homepage's API route, caching the result (e.g. in a MongoDB collection or in-memory with a timestamp) for ~5 minutes so repeat visits don't call the YouTube API every time.
- **MongoDB connections in serverless functions** must use a cached/reused connection pattern (a `global` cached client in Next.js) to avoid exhausting connections across many function invocations. This is a standard, well-documented pattern — just make sure it's implemented, not opened fresh per request.
- **Image uploads should bypass the Vercel function body entirely.** Generate a signed Cloudinary upload signature from an API route, then upload the file directly from the browser to Cloudinary. This avoids serverless function payload/duration limits and keeps the Cloudinary API secret server-side.
- **Email notifications before a custom domain exists:** Resend requires a verified sending domain for production use, but since a custom domain isn't purchased yet, use Resend's shared test sender for now; once a real domain is bought and linked, verify it in Resend and switch the "from" address over — no code change needed beyond an environment variable.

---

## 4. Security Requirements

- Passwords hashed with bcrypt — never stored in plain text.
- JWT for admin sessions, with expiry, stored in an httpOnly cookie.
- All secrets/API keys in environment variables — never committed to source code.
- Input validation and sanitization on every form (prayer request, login, gallery upload, about page edit).
- Rate limiting on public API routes (especially the prayer request submission route).
- HTTPS enforced by default (Vercel provides this automatically).
- Private/anonymous prayer requests filtered out server-side, not just client-side.
- Admin API routes protected by JWT-verification middleware/helper checked on every request.

---

## 5. Suggested Database Schema (MongoDB Collections)

```
admin
  - username
  - passwordHash

events (gallery)
  - name
  - createdAt
  - images: [ { url, publicId (Cloudinary), order } ]

prayerRequests
  - name
  - contact
  - category
  - message
  - isPrivate (boolean)
  - status (e.g. "new", "prayed")
  - createdAt

aboutPage
  - text
  - images: [ url ]
  - updatedAt

settings
  - youtubeChannelId
  - notificationEmail   # admin address that receives new prayer request alerts

contactInfo
  - serviceTimes: [ { label, time } ]
  - address
  - phone
  - email
  - mapEmbedUrl
  - socialLinks: [ { platform, url } ]
  - updatedAt

liveStatusCache
  - isLive (boolean)
  - videoId (string, if live or most recent)
  - checkedAt (timestamp)   # used to decide whether to re-query YouTube API
```

---

## 6. Suggested Site Map / Pages

**Public:**
- `/` — Home (live stream / latest video)
- `/gallery` — All events
- `/gallery/[eventId]` — Event image view
- `/prayer-request` — Submission form
- `/about` — About page
- `/contact` — Service times, address, map, phone/email, social links

**Admin (protected):**
- `/admin/login`
- `/admin/dashboard`
- `/admin/gallery` (manage events/images)
- `/admin/prayer-requests`
- `/admin/about-editor`
- `/admin/settings` (YouTube channel ID, change password)

**API Routes (all within the same Next.js app):**
- `/api/auth/login`
- `/api/live-status` (checks/returns cached YouTube live status)
- `/api/gallery` (CRUD for events/images)
- `/api/cloudinary-signature` (generates signed upload params)
- `/api/prayer-requests` (create + admin list/update/delete; sends admin email notification via Resend on create)
- `/api/about` (get/update)
- `/api/contact` (get/update service times, address, phone, email, map, social links)
- `/api/settings` (get/update YouTube channel ID, notification email, change password)

---

## 7. Production-Readiness Checklist

- [ ] HTTPS enabled (default on Vercel)
- [ ] All secrets in environment variables
- [ ] Input validation/sanitization on all forms
- [ ] Rate limiting on API routes
- [ ] Error logging on API routes
- [ ] Automated database backups (MongoDB Atlas built-in)
- [ ] Fully mobile-responsive UI
- [ ] Graceful fallback if YouTube API or Cloudinary is temporarily unreachable
- [ ] MongoDB connection caching implemented correctly for serverless
- [ ] Manual QA pass: login, gallery upload/reorder, prayer request submit (public + private), about page edit, contact info edit, admin email notification received, live-stream detection
- [ ] Automated tests for API routes where practical
- [ ] Basic SEO: page titles, meta descriptions, favicon, sitemap.xml, robots.txt

---

## 8. What the Client Must Provide / Change Before Going Live

The agent should generate a placeholder `.env` file and clearly flag these for the client to fill in themselves:

**`.env.local` (single Next.js app):**
```
MONGODB_URI=              # from MongoDB Atlas
JWT_SECRET=                # generate a long random string
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
YOUTUBE_API_KEY=           # from Google Cloud Console
YOUTUBE_CHANNEL_ID=        # MPL Ministries' channel ID
RESEND_API_KEY=            # from Resend, for admin email notifications
ADMIN_NOTIFICATION_EMAIL=  # where new prayer request alerts are sent
ADMIN_INITIAL_USERNAME=
ADMIN_INITIAL_PASSWORD=    # to be hashed on first setup, then changed
```

**Accounts the client needs to create (all free tier):**
1. MongoDB Atlas account + cluster
2. Cloudinary account
3. Google Cloud Console project + YouTube Data API v3 key
4. Resend account (for admin email notifications)
5. Vercel account (hosting — frontend and backend together)

**Content the client needs to supply:**
- About page initial text and images
- Ministry logo/branding assets (if any)
- Desired prayer request categories list
- YouTube channel ID/handle
- Real service times, address, phone, email, and social links (to replace the sample placeholder content in Section 2.5)
- Admin email address to receive prayer request notifications

---

## 9. Instructions for the Development Agent

- Build as a **single Next.js application** (App Router recommended), deployed to Vercel. Do not create a separate Express/Render backend.
- Implement YouTube live detection as an on-demand, cached API route — not a Vercel Cron job (Hobby plan cron is limited to once/day, too infrequent for this purpose).
- Implement a reusable cached MongoDB connection helper for use across API routes.
- Implement signed Cloudinary uploads: API route generates the signature, browser uploads directly to Cloudinary.
- Protect all `/admin` pages and `/api/*` admin routes with JWT verification.
- Single admin user only — do not build a multi-role permission system.
- Do not integrate any third-party form backend (Web3Forms, Netlify Forms, etc.) — the prayer request form must POST directly to the app's own API route.
- No reCAPTCHA — honeypot field only for spam protection.
- Build the `/contact` page and admin editor for it using the sample placeholder content in Section 2.5 — clearly mark it as sample data the client will replace.
- Send an admin email notification (via Resend) on every new prayer request submission; admin's notification email address is configurable in Settings.
- Add basic SEO essentials (titles, meta tags, sitemap, robots.txt, favicon) since this is a public-facing ministry site meant to be found.
- After building, run through the full feature list above, fix any bugs found, and confirm the app builds and runs cleanly before handoff.
- Deliver a final short list of exactly what remains for the client to configure (matching Section 8 above).
