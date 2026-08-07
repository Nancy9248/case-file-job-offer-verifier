# Case File — Job Offer Verification Desk

**Project Viksit Bharat 2026 — Frontend Arena Hackathon**
**Problem Statement 14 (Cybersecurity): "The Fake Job Offer"**
**Team: Hack Buddies** — Tarushi Sanjoy Tapaswy (Team Lead), Jesica Wawale

## Problem

Job seekers — especially final-year students and freshers — regularly lose
money, personal data, and time to fake job offers that mimic real recruitment
emails and demand fees before any real hiring process begins. Verifying an
offer today means manually Googling the company or asking someone
experienced: slow, inconsistent, and easy to skip when a message pressures
you to act fast.

## Solution

Case File is a platform that lets a job seeker paste any offer, email, or
message and get an instant, explainable fraud-risk assessment — plus a
dedicated company verification lookup, a shared community scam-report feed,
and a red-flags awareness hub.

## Stage 2 — What's new since Stage 1

Stage 1 was a single-page rule-based scanner with a company name lookup
against a small local list. Stage 2 expands this into a full multi-page
application with real shared data:

| Area | Stage 1 | Stage 2 |
|---|---|---|
| Pages | 1 (scanner only) | 5 (Scan, Company Lookup, Community Reports, Red Flags, My History) |
| Data | Browser localStorage only | Firebase Firestore (shared, cross-device) + localStorage fallback |
| Company verification | Name-only match against ~10 companies | Name match **+ domain cross-check** against ~30 companies — flags when a recruiter's email domain doesn't match the real company's domain (a strong impersonation signal) |
| Community reports | Local counter only | Live shared feed via Firestore — every user sees every report |
| Scoring rules | 5 patterns | 7 patterns, including a "vague low-skill task + high payout" template |
| Identity | None | Silent anonymous auth (Firebase) — lets "My History" persist per-device without a login screen |

## Tech stack

- **Frontend:** React 19 + Vite 8, React Router 7, Tailwind CSS 4
- **Backend:** Firebase (Firestore for data, Anonymous Auth for lightweight identity)
- **Detection logic:** Client-side rule-based classifier (regex + weighted
  scoring) plus a domain-cross-verification check against a curated
  employer reference dataset

## Project structure

```
src/
  App.jsx              routing shell + anonymous auth bootstrap
  components/
    Nav.jsx             top navigation across pages
    ResultPanel.jsx      shared verdict stamp + findings display
  data/
    companies.js         verified employer reference list + domain-check logic
  lib/
    scoring.js            rule-based risk scoring engine
    firebase.js           Firebase init, auth, Firestore read/write helpers
    storage.js             unified storage layer (Firebase when configured, else localStorage)
  pages/
    Scan.jsx               main offer scanner (home page)
    Verify.jsx              dedicated company verification lookup
    Community.jsx           shared community scam reports feed
    Awareness.jsx            red-flags education hub
    History.jsx              personal case history log
```

## Running locally

```bash
npm install
npm run dev
```

Works out of the box with localStorage — no setup required for a quick look.
To enable the shared Firebase backend (recommended for the live demo), see
[`FIREBASE_SETUP.md`](./FIREBASE_SETUP.md).

## Roadmap (beyond Stage 2)

- Replace the static verified-employer list with live MCA/GST registry lookups
- LLM-generated plain-language explanations of why an offer was flagged
  (Gemini/OpenAI API)
- Browser extension that scans job postings inline on LinkedIn/Naukri/Indeed
- Node.js/Express backend for more advanced verification logic, if client-side
  checks prove insufficient at scale

## Known limitations 

- Company verification is a curated demo list (~30 companies), not a live
  government registry — this is explicitly flagged in the roadmap and in the
  Verify page's own UI copy
- Scoring is rule-based (regex + weights), not a trained ML model — chosen
  deliberately for explainability and hackathon-timeline feasibility over a
  black-box classifier
- Firestore security rules ship in test mode by default; see
  `FIREBASE_SETUP.md` step 6 for production-appropriate rules
