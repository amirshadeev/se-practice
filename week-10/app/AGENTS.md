
# AGENTS.md — Smart Campus Room Availability Checker

Instructions for any coding agent working in this project. Read this file before you change anything, and follow it over any general habit of yours.

## Project

A React + TypeScript page (Vite) that tells a student whether a campus room is free for a requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`; the tests are in `src/booking.test.ts`.

Use one fictional room and fictional in-memory sample data only.

## Acceptance contract

- AC1 Reject start >= end and requests in the past.
- AC2 Enforce the maximum allowed duration (120 minutes).
- AC3 Reject a blocked room.
- AC4 Reject overlaps. A request that touches a booking at an endpoint is allowed.
- AC5 Return Available / Unavailable without changing booking data.
- AC6 Preserve clear UI feedback on desktop and mobile.

## Commands

- Install: `npm install`
- Dev server: `npm run dev`
- Tests: `npm test`
- Build: `npm run build`

## You may

- Edit only files under app/.
- Add packages when a task needs them.
- Do not add a database, login/authentication, secrets, API keys, or credentials.

## Before you finish

- Run npm test and make sure all tests pass before proposing acceptance.
- Make sure the page still loads.
- Ensure npm run build passes locally.
- Do not deploy to external services.
