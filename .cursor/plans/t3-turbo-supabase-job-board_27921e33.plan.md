---
name: t3-turbo-supabase-job-board
overview: Set up a Turborepo monorepo using create-t3-turbo, wired to Supabase with Drizzle, magic-link auth, and initial job board UI.
todos:
  - id: scaffold-monorepo
    content: Scaffold create-t3-turbo with pnpm
    status: completed
  - id: db-schema-drizzle
    content: Implement Supabase Drizzle schema+index
    status: completed
    dependencies:
      - scaffold-monorepo
  - id: auth-magic-links
    content: Wire Supabase magic-link auth
    status: completed
    dependencies:
      - scaffold-monorepo
  - id: jobs-api-ui
    content: Implement jobs list/search UI+queries
    status: completed
    dependencies:
      - db-schema-drizzle
      - auth-magic-links
  - id: dx-verification
    content: Add scripts/docs and run checks
    status: completed
    dependencies:
      - jobs-api-ui
---

# T3 Turbo + Supabase Job Board

## Overview

- Scaffold a Turborepo via `create-t3-turbo` using pnpm, targeting a Next.js app for the job board UI.
- Configure Supabase (Postgres + Auth) with Drizzle migrations, including search index and enums.
- Implement magic-link auth using Supabase Auth helpers in the Next.js app.
- Build an initial job board page reflecting the provided UI (search/filter + listings stubbed from DB).

## Steps

1) Scaffold & Workspace Setup

- Generate monorepo with `create-t3-turbo` (pnpm), keep core T3 stack (Next.js + tRPC + Tailwind + next-auth prewiring adjusted for Supabase).
- Set up workspace config for Supabase env vars and shared tooling (ESLint/TS).

2) Database & Drizzle Schema

- Add Drizzle config for Supabase; define enums for `workLocationType`, `ir35Status`, `seniority`.
- Create tables: `companies`, `jobs` (with `jobs_search_idx` on title/techStackText/summary), `ignored_jobs`, `profiles` (link to Supabase auth users), with cascade FKs.
- Add seed or fixtures placeholder for local dev.

3) Supabase Auth (Magic Links)

- Integrate Supabase client and auth helpers in Next.js app; add magic-link sign-in page/flow and protected session fetching.
- Ensure profile row creation/upsert on first login; expose `isPaid` flag.

4) API & Data Access

- Wire server-side routes/tRPC procedures or server actions for jobs list/search filters using Drizzle queries (full-text index usage).
- Add company/job create/update stubs to unblock future scraping pipeline.

5) UI Implementation

- Build landing/job board page to match screenshot: filters (keywords, city, distance, IR35, location type, seniority, day rate, date posted), results list card layout, pagination placeholder.
- Add auth-aware header/sign-in button, basic empty-state/loading states.

6) DX & Verification

- Add scripts for lint/test/db push/migrate; document `.env` requirements and Supabase project setup steps.
- Run initial sanity checks (typecheck/lint) and note any follow-ups.