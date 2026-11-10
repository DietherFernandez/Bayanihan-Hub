# GabayPH — Your Everyday Guide to a Better Life

**GabayPH** is a comprehensive, accessible, trustworthy, and free digital platform designed to help Filipinos solve everyday problems by connecting them with verified government services, employment opportunities, financial and medical assistance, free education, community support, and 24/7 emergency resources.

---

## Core Platform Modules

1. **TRABAHO (`/trabaho`)** — Verified CSC & DOLE PhilJobNet career openings, free TESDA scholarship training, an interactive printable Resume Builder, and a Job Scam Reporting Center.
2. **SERBISYO (`/serbisyo`)** — Step-by-step government service guides (PSA Birth Certificate, NBI Clearance with RA 11261 First-Time Jobseeker exemption, PhilSys Digital National ID, PhilHealth Konsulta, SSS) with interactive, printable document checklists and an official agency directory.
3. **PERA (`/pera`)** — Verified financial and medical assistance directory (DSWD AICS, DOH Malasakit Centers, DOLE TUPAD, SSS/Pag-IBIG Calamity Loans) plus client-side Household Budget, Savings/MP2, and Debt Repayment calculators.
4. **BAYANIHAN (`/bayanihan`)** — Community relief hubs, Philippine Red Cross 143 & DSWD NROC volunteer opportunities, local assistance requests, and moderated community submissions.
5. **ARAL (`/aral`)** — CHED Merit & UniFAST scholarships, 150+ free self-paced e-TESDA online courses, and an interactive learning progress tracker.
6. **KALIGTASAN (`/kaligtasan`)** — 24/7 National Emergency Hotlines (`911`, Red Cross `143`, NDRRMC, NCMH `1553`, Citizen Complaint `8888`, Anti-Cybercrime `1326`), regional LGU Evacuation Center directory, interactive 72-hour Go-Bag checklist, and first-aid protocols.
7. **UNIVERSAL SEARCH (`/search` & `/api/search`)** — Instant cross-module search with category, Philippine region, and verification status filters. Works without authentication.
8. **ADMIN & VERIFICATION CONSOLE (`/admin`)** — Protected role-based governance console (`Super Admin`, `Content Admin`, `Regional Moderator`) covering all 13 administration modules including Content Verification, Community Moderation, Reports Triage, and Immutable Audit Logs.

---

## Technology Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide Icons
- **Backend & Database**: Supabase PostgreSQL, Supabase Auth (`@supabase/ssr`), Row Level Security (RLS) migrations (`supabase/migrations/0001`–`0004`)
- **Validation & Security**: Zod input validation, strict HTTP Content-Security-Policy headers, sliding-window rate limiting, `server-only` secret isolation, and Cloudflare Turnstile anti-abuse readiness.

---

## Getting Started Locally

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template (optional for local development — verified seed data runs out-of-the-box)
cp .env.example .env.local

# 3. Run development server
npm run dev

# 4. Run typecheck, linter, unit tests, and production build
npm run typecheck
npm run lint
npm test
npm run build
```
