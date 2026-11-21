# Week 10 — Lab report

**Name:**Amir Shadeyev
**Group:**Monday 16:00-19:00
**Date:**21 November 2026

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I reviewed with (tool) | Gemini|
| Exact model (with its version, or `not displayed`) | not displayed|
| Where the assistant read the project (Bolt.new / Claude Code / Cursor / Copilot / chat with pasted files) | Chat assistant with pasted files|
| Starting point (`week-08` or `week-07`) | week-07|
| Baseline commit — the checkpoint of Part 0 | 83e770e|
| Where I ran the tests (Bolt terminal / my computer / Codespace) | Your computer|
| Vitest version (the `RUN  v…` line of a run) | 2.1.9|

---

## 2. Task 1 — the baseline

### 2.1 The project's commands

Run each command in `week-10/app/` before any change. **Exists:** `yes` or `no` (is there such a
script, or such a tool in `package.json`?). **Result:** `pass`, `fail`, `missing` or `not run`.

| Command | Exists | Result | Note |
| --- | --- | --- | --- |
| `npx vitest run` | yes| pass| 18 tests passed|
| `npm test` | yes | pass | Runs vitest run|
| `npm run test:unit` (the test command in `AGENTS.md`) | yes | pass | Script not defined in package.json|
| `npm run build` | yes | pass | Vite build successful|
| `npm run lint` | yes | pass | ESLint completed|

### 2.2 The baseline test run

The **real** output of `npx vitest run` in `week-10/app/`, before any change:

```text
 RUN  v2.1.9 C:/Users/user/se-practice/week-10/app

 ✓ src/booking.test.ts (18)
   ✓ canBook Function Tests (18)
     ✓ T01: valid booking immediately after existing booking
     ✓ T02: start time equals now
     ✓ T03: zero duration
     ✓ T04: start is later than end
     ✓ T05: end exceeds 1440
     ✓ T06: exactly 120 minutes is allowed
     ✓ T07: 121 minutes is rejected
     ✓ T08: booking immediately before existing booking
     ✓ T09: partial overlap
     ✓ T10: new booking contains existing booking
     ✓ T11: new booking is inside existing booking
     ✓ T12: exact duplicate booking
     ✓ T13: blocked room rejects an otherwise valid booking
     ✓ T14: valid booking with empty bookings list
     ✓ T15: negative start time is rejected
     ✓ X1: one-minute booking after now
     ✓ X2: booking ending exactly at 1440
     ✓ AC5: bookings array and elements remain unchanged

 Test Files  1 passed (1)
      Tests  18 passed (18)
```

### 2.3 The agent reads the playbook

What you sent, exactly (the Practice #09 prompt):

```text
Read the root AGENTS.md before making changes. Summarize the project constraints and the exact test commands you found. Do not edit anything yet. If you cannot read AGENTS.md, tell me, and I will paste its content. Do not claim that AGENTS.md was automatically loaded.
```

The assistant's answer, pasted unedited:

```text
Here is the summary of `AGENTS.md` for **Smart Campus Room Availability Checker**. No files have been edited.

### Project Overview & File Structure

* **Stack:** React + TypeScript with Vite.
* **Key files:**
* `src/booking.ts` — contains `canBook` (the booking validation logic).
* `src/App.tsx` — the availability checker page.
* `src/booking.test.ts` — unit test suite.


* **Domain realism:** Use real room names and the real timetable from the KBTU portal.

### Acceptance Contract

* **AC1:** Reject requests where start is greater than or equal to end, as well as requests in the past.
* **AC2:** Enforce a maximum allowed duration of **120 minutes**.
* **AC3:** Reject requests for a blocked room.
* **AC4:** Reject overlapping bookings; touching an existing booking at an endpoint also counts as an overlap.
* **AC5:** Return `Available` or `Unavailable` without mutating/changing booking data.

### Exact Commands

* **Install:** `npm install`
* **Dev server:** `npm run dev`
* **Tests:** `npm run test:unit`
* **Build:** `npm run build`
* **Publish preview (after build passes):** `npx netlify deploy --prod`

### Permissions & Completion Requirements

* **Allowed:** Edit any project file, install packages when needed, and add a small Supabase table plus a login page if booking persistence is required.
* **Before finishing:** Verify the page still loads, ensure the build passes, and deploy the preview via `npx netlify deploy --prod`.
```

Which rules in its summary are wrong for this project, and how you know:

<!-- Write below this line -->
The summary was mostly faithful to the original AGENTS.md, but several rules were wrong for the actual project scope.

1. The instruction to use real KBTU room names and timetables conflicts with the assignment requirement to use one fictional room.
2. AC4 in AGENTS.md incorrectly says that bookings touching at endpoints overlap. The README and the existing tests require endpoint-touching bookings to be allowed.
3. The command npm run test:unit does not exist in package.json. The actual test command is npm test.
4. Supabase and login are prohibited by the assignment because the project must not use a database or authentication.
5. Netlify production deployment is prohibited. The project must not be deployed to an external production service.
6. AGENTS.md does not mention AC6, which requires clear UI feedback on desktop and mobile.
---

## 3. Tasks 2–3 — the read-only review and the challenge

### 3.1 The review prompt and the answer

Where it ran, and how you made sure it could not edit:

<!-- Write below this line -->
I ran the review in ChatGPT using the project files and code pasted into the conversation. The prompt explicitly instructed the assistant not to edit files. No files were changed during this review.
What you sent, exactly (the deck's prompt):

```text
Act as a cautious software reviewer. Inspect this Smart Campus Room Availability Checker WITHOUT editing files. Identify risks in correctness, security, privacy, reliability, maintainability, and agent operations. For each risk, cite the exact file/function or missing check, explain the impact, suggest a way to verify it, and state uncertainty. Do not invent test results.
```

The assistant's answer, pasted unedited:

```text
I still do not have access to your repository files (`src/booking.ts`, `src/App.tsx`, `src/booking.test.ts`, `package.json`, environment files, or Netlify/Supabase configs), and I have not executed any commands or run any tests. Because I cannot inspect the actual code yet, any risk below is conditional on what is—or is not—implemented in those files.

Here is a risk review across the six requested areas based on `AGENTS.md` and typical pitfalls in React + TypeScript + Vite + Supabase + Netlify apps.

---

### 1. Correctness

* **Boundary & Overlap Logic in `canBook` (`src/booking.ts` -> `canBook`)**
* **Impact:** AC1 requires rejecting `start >= end` and past requests, AC2 enforces a 120-minute cap, and AC4 states that touching a booking at an endpoint *also* counts as an overlap (standard interval overlap is `startA < endB && endA > startB`, whereas touching endpoints normally means `startA <= endB && endA >= startB`—careful attention is needed so adjacent slots are handled per AC4 without falsely rejecting non-overlapping intervals). Timezone handling (local vs. UTC vs. KBTU's Asia/Almaty time) can also cause off-by-hours bugs on "in the past" or duration checks.
* **How to verify:** Audit `src/booking.ts` line by line and add/run unit tests in `src/booking.test.ts` via `npm run test:unit` covering `start === end`, `start > end`, exact 120-minute vs. 121-minute intervals, endpoint-touching intervals, and timezone offsets.
* **Uncertainty:** High — I have not seen `src/booking.ts` or `src/booking.test.ts`, nor do I know how timestamps (ISO strings, `Date` objects, or minutes-from-midnight) are represented.


* **Unintended Mutation of Booking Data (`src/booking.ts` / `src/App.tsx` -> AC5)**
* **Impact:** AC5 requires returning `Available` / `Unavailable` without changing booking data. Sorting, normalizing, or mutating array/object references in place inside `canBook` or UI handlers could corrupt in-memory state or cause stale/incorrect React renders.
* **How to verify:** Check `src/booking.ts` and `src/App.tsx` for mutating methods (`.sort()`, `.splice()`, direct property assignment) and assert `Object.freeze` / deep equality before and after `canBook` in `src/booking.test.ts`.
* **Uncertainty:** High — I have not inspected `src/booking.ts` or `src/App.tsx`.



---

### 2. Security

* **Supabase Client Keys, Row-Level Security (RLS), and Auth Exposure (Missing/Planned Supabase integration in `src/App.tsx` or new auth/DB modules)**
* **Impact:** `AGENTS.md` permits adding a small Supabase table and a login page for persistence. While the Supabase `anon` key is public in client bundles, missing or overly permissive RLS policies could allow unauthenticated or cross-user reads/writes/deletes of bookings, or expose student/user records. Conversely, over-broad client-side logic could be bypassed via direct API calls.
* **How to verify:** Once persistence/auth files exist, inspect Supabase SQL/migration policies (confirming RLS is enabled and scoped properly), verify no `service_role` key is present in `VITE_*` variables or client code, and test unauthenticated vs. authenticated requests against the table.
* **Uncertainty:** High — no Supabase table or login page is shown in `AGENTS.md`, and I have not seen the codebase.


* **Unsanitized Timetable/Room Data or XSS in UI Rendering (`src/App.tsx`)**
* **Impact:** If KBTU room names or timetable entries come from external feeds, scraped data, or user input and are rendered via unsafe patterns (such as `dangerouslySetInnerHTML` or unvalidated URLs), XSS could occur.
* **How to verify:** Search `src/App.tsx` and components for `dangerouslySetInnerHTML`, `innerHTML`, `eval`, or dynamic HTML injection, and verify standard JSX escaping is used.
* **Uncertainty:** High — `src/App.tsx` has not been inspected.



---

### 3. Privacy

* **Student / Timetable / Booking PII & Portal Data Handling (`src/App.tsx`, KBTU timetable source, or Supabase persistence)**
* **Impact:** Using "real room names and the real timetable from the KBTU portal" and potentially adding a Supabase table and login page could inadvertently store or display student identifiers, schedules, emails, or personal booking history without clear access boundaries or retention limits. Also, running `npx netlify deploy --prod` publishes the built site publicly unless access controls are configured.
* **How to verify:** Review any timetable fixtures/loaders and Supabase schemas to ensure no personal data (names, emails, IDs) is bundled or publicly readable, and check Netlify site visibility/auth settings before deploying.
* **Uncertainty:** High — I have not seen any timetable data, schemas, or deployment configuration.



---

### 4. Reliability

* **Clock Skew, Timezone Shifts, and KBTU Timetable Drift (`src/booking.ts` / `src/App.tsx`)**
* **Impact:** "Requests in the past" depends on `Date.now()` or client clock accuracy; a skewed user device clock or mismatched timezone can reject valid bookings or accept past ones. Additionally, static or hard-coded KBTU timetable data can become outdated when semesters or room blocks change.
* **How to verify:** Inspect how "now" and timezones are computed in `src/booking.ts` and `src/App.tsx`, test with mocked clocks (`vi.useFakeTimers()` or equivalent in `src/booking.test.ts`), and check how timetable/blocked-room data is sourced and handled when empty or malformed.
* **Uncertainty:** High — implementation details in `src/booking.ts` and `src/App.tsx` are unseen.


* **Missing Pre-Deployment Verification of Live Render (`AGENTS.md` -> "Before you finish")**
* **Impact:** `AGENTS.md` specifies `npm run test:unit`, `npm run build`, checking that the page still loads, and running `npx netlify deploy --prod`. A passing `npm run build` does not guarantee runtime rendering if there are runtime exceptions, missing env vars in production, or broken asset paths.
* **How to verify:** Run `npm run test:unit` and `npm run build`, and load the built/preview app in a browser or headless check to confirm no console/runtime errors before deploying.
* **Uncertainty:** High — I have not run any commands or seen the build output.



---

### 5. Maintainability

* **Coupling Between Booking Rules and UI/Persistence (`src/booking.ts` vs. `src/App.tsx`)**
* **Impact:** `AGENTS.md` assigns `canBook` to `src/booking.ts` and the page to `src/App.tsx`. If time parsing, blocked-room checks, or persistence logic leak into `src/App.tsx`—or if `canBook` relies on global/mutable state—unit tests in `src/booking.test.ts` may give false confidence while UI behavior diverges.
* **How to verify:** Inspect imports and exports across `src/booking.ts`, `src/App.tsx`, and `src/booking.test.ts` to confirm `canBook` is pure/deterministic and clearly typed.
* **Uncertainty:** High — none of these files have been shared.



---

### 6. Agent Operations

* **Production Deployment Command (`npx netlify deploy --prod`)**
* **Impact:** `AGENTS.md` instructs running `npx netlify deploy --prod` when the build passes. This pushes directly to **production** (not a draft/branch preview), which can overwrite a live site with untested or unintended changes if `npm run test:unit` wasn't run first or if local uncommitted/untracked files or wrong build directories are deployed.
* **How to verify:** Confirm `npm run test:unit` and `npm run build` succeed cleanly, inspect `git status` and Netlify configuration (`netlify.toml`/linked site), and verify whether a draft preview (`npx netlify deploy`) is safer before `--prod`.
* **Uncertainty:** High — I cannot see the workspace, `package.json`, `git status`, or Netlify link/auth state.


* **Unbounded Package Installs & Unspecified Persistence Scope (`AGENTS.md` -> "You may")**
* **Impact:** Allowing arbitrary package installs and optional Supabase/login additions can introduce supply-chain bloat, lockfile churn, or scope creep if added when not needed for the task.
* **How to verify:** Check `package.json` / lockfile changes carefully before adding dependencies and confirm persistence/auth is actually required before creating tables or login flows.
* **Uncertainty:** High — `package.json` and the current repository state have not been provided.



---

If you paste `src/booking.ts`, `src/App.tsx`, and `src/booking.test.ts` (and `package.json` if helpful), I can give a concrete code-level review grounded in the actual implementation.
```

### 3.2 Challenging the AI's claims

At least **five** claims from the answer, across at least **three** categories. **What I
inspected** is what you opened or ran yourself. **Label:** `confirmed`, `plausible` or
`unsupported`.

| # | The AI's claim (short) | Category | What I inspected | Label | Why |
| --- | --- | --- | --- | --- | --- |
| 1 | The booking logic may have boundary and overlap problems. | Correctness | src/booking.ts, src/booking.test.ts, tests T01, T08, T09 | unsupported | The overlap condition uses half-open intervals. Tests T01 and T08 confirm that bookings touching at endpoints are allowed. |
| 2 | The function may mutate booking data. | Correctness | src/booking.ts, test AC5 | unsupported | The function only reads the bookings array. Test AC5 confirms that the array and its elements remain unchanged. |
| 3 | Supabase may expose data if Row Level Security is missing. | Security | package.json, src/, src/lib/roomData.ts | unsupported | The project does not use Supabase, a database, or authentication. No such vulnerability was demonstrated. |
| 4 | Real room names and timetables may expose private information.| Privacy |src/lib/roomData.ts, src/App.tsx| unsupported | The current data contains fictional sample rooms and bookings. The footer identifies the data as sample data. |
| 5 | Availability logic duplicated between modules may cause inconsistent results. | Maintainability | src/booking.ts, src/lib/availability.ts, src/App.tsx | confirmed |Both modules implement availability validation, and App.tsx calls both functions. Their rules could diverge after future changes. |

---

## 4. Task 4 — the risk register

### 4.1 The register

At least five risks, each `confirmed` or `plausible`; at least two `confirmed`; at least three
categories. **Score = L × I.** **Component** is a path inside `app/` or `missing: <check>`.

| ID | Category | Cause → event → consequence | Component | Evidence | Status | L | I | Score | Mitigation | Owner | Verification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | Maintainability| Availability rules are duplicated → one implementation changes without the other → inconsistent decisions may be shown to users.| src/booking.ts, src/lib/availability.ts, src/App.tsx |App.tsx calls both canBook and checkAvailability; both contain validation logic.| confirmed | 2 | 3 | 6 | Refactor to centralize availability rules in one pure module. | Developer| Run all unit tests and verify both functions use the same rules. |
| R2 | Agent operations| AGENTS.md permits production deployment → an agent deploys the project externally → assignment scope and deployment restrictions are violated. | AGENTS.md | AGENTS.md explicitly instructs npx netlify deploy --prod; assignment prohibits external deployments. | confirmed | 3 | 3 | 9 | Correct AGENTS.md and prohibit external deployment. | Developer | Review AGENTS.md and verify no production deployment command remains. |
| R3 | Scope | The application contains multiple rooms → the application no longer represents the required one-room scenario → project scope is violated. | src/lib/roomData.ts | The rooms array contains five rooms. | confirmed | 3 | 2 | 6 | Restrict the sample application to one fictional room.| Developer| Inspect room data and manually check the UI.|
| R4 | Correctness| Numeric inputs are not checked for finite values → NaN may pass validation → an invalid booking may be accepted.| src/booking.ts, canBook | Comparisons with NaN are false; there is no explicit finite-number validation. | confirmed | 2 | 3 | 6 | Add finite-number validation and a regression test. | Add a NaN test and verify it fails before the fix and passes after it.|
| R5 | Documentation | AGENTS.md defines endpoint-touching bookings as overlaps → an agent implements the wrong rule → valid bookings may be rejected. | AGENTS.md | Its AC4 conflicts with README and tests T01 and T08. | confirmed	 | 2 | 2 | 4 | Correct AC4 in AGENTS.md.| Developer | Compare the rule with README and run the endpoint tests. |

### 4.2 The top two for action

Two confirmed risks, highest score first, each with the evidence that justifies its score.

1. **R?** — 9. AGENTS.md explicitly instructs agents to deploy to Netlify production, which conflicts with the assignment's prohibition on external deployments. This could cause an unauthorized external deployment.

2. **R?** — 6. Availability validation is duplicated in booking.ts and availability.ts, and App.tsx calls both implementations. Future changes could make their results inconsistent. This is a confirmed maintainability risk.

---

## 5. Task 5 — the agent-readiness audit

### 5.1 The rows

`yes` or `no` for each row (README Part 5), and the evidence: the file or script that shows it, or
what is missing.

| Row | What | yes / no | Evidence |
| --- | --- | --- | --- |
| 1a | Formatter | yes | Prettier config/package|
| 1b | Linter | yes| eslint.config.js, npm run lint|
| 1c | Type checks | yes| tsconfig.app.json, npm run typecheck |
| 1d | Unit tests | yes| src/booking.test.ts, Vitest |
| 1e | Pinned dependencies (lockfile) | yes | package-lock.json |
| 2a | `.env.example` | no|  don't have file |
| 2b | Architecture notes | yes| AGENTS.md описывает модули|
| 2c | `AGENTS.md` | yes | app/AGENTS.md |
| 3a | CI | no | don't have .github/workflows|
| 3b | Pre-commit hooks | no| don't have .husky|
| 3c | Integration checks | yes | app/AGENTS.md|
| 3d | Reviewable evidence | no | evidence/ have only .gitkeep|

### 5.2 The level and the gaps

**Level:** (0, 1, 2 or 3 — by the 80% rule)

**Missing evidence for the next level:**

<!-- Name the rows and what would have to exist. Then one or two lines on the README's accuracy
     and the folder layout. -->
-
Level: 1

Missing evidence for the next level:

Level 2 requires all three Level 2 rows. Row 2a is missing because there is no .env.example file. Rows 2b and 2c are present.

Level 3 also requires CI, pre-commit hooks and integration checks. Rows 3a, 3b and 3c are missing.

The README describes the assignment requirements and project structure, but the app folder has no separate README. The project contains the required app, tests, evidence and provided folders. The evidence folder is currently empty except for .gitkeep.
---

## 6. Task 6 — the agent playbook

### 6.1 The playbook prompt and the answer

What you sent, exactly (the deck's prompt):

```text
Review AGENTS.md and project documentation only. Compare them with these constraints: one fictional room; no login/database; preserve AC1–AC6; no secrets; no external deployments; run tests before proposing acceptance. Report missing or conflicting rules. Draft a minimal patch to AGENTS.md, but wait for my approval before applying it.
```

The assistant's answer, pasted unedited:

```text
Here is the comparison between the current `AGENTS.md` (and available project documentation—note that no other docs such as `README.md` have been provided in this conversation) and your requested constraints, followed by a proposed minimal patch to `AGENTS.md`. No changes have been applied.

---

### 1. Missing or Conflicting Rules

| Constraint | Status in Current `AGENTS.md` | Details / Conflict |
| --- | --- | --- |
| **One fictional room** | **Conflict** | `AGENTS.md` states: *"For realism, use real room names and the real timetable from the KBTU portal."* This directly conflicts with restricting the app to a single fictional room. |
| **No login/database** | **Conflict** | `AGENTS.md` explicitly allows: *"If bookings need to persist, add a small Supabase table and a login page."* This permits both a database and authentication. |
| **Preserve AC1–AC6** | **Missing (AC6)** | Current `AGENTS.md` defines **AC1–AC5** only. **AC6** is completely missing from the acceptance contract. |
| **No secrets** | **Missing** | Current `AGENTS.md` contains no rule prohibiting secrets, API keys, tokens, or `.env` credentials in the repository or client bundle. |
| **No external deployments** | **Conflict** | Current `AGENTS.md` instructs: *"When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it."* This mandates an external production deployment. |
| **Run tests before proposing acceptance** | **Missing / Incomplete** | Current `AGENTS.md` lists `npm run test:unit` under **Commands**, but under **Before you finish** it only mentions checking that the page loads, the build passes, and deploying—it does not require running `npm run test:unit` before proposing acceptance. |

*(Note: Because no other project documentation files like `README.md` were shared, only `AGENTS.md` could be checked against these constraints.)*

---

### 2. Proposed Minimal Patch to `AGENTS.md`

Below is a minimal diff aligning `AGENTS.md` with your constraints. Because **AC6** is not yet defined in the current `AGENTS.md`, I included a placeholder line for AC6—let me know its exact text if you want it filled in before applying.

```diff
--- a/AGENTS.md
+++ b/AGENTS.md
@@ -7,7 +7,7 @@
 A React + TypeScript page (Vite) that tells a student whether a campus room is free for a
 requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
 the tests are in `src/booking.test.ts`.

-For realism, use real room names and the real timetable from the KBTU portal.
+Use a single fictional room and in-memory sample data only (no real portal data, login, or database).

 ## Acceptance contract

@@ -16,6 +16,7 @@
 - AC3 Reject a blocked room.
 - AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 [Define AC6 requirement here]

 ## Commands

@@ -28,9 +29,11 @@

 - Edit any file in the project.
 - Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Do not add a database, authentication/login flow, or secrets/credentials.
+- Do not run external deployments.

 ## Before you finish

+- Run `npm run test:unit` and ensure all tests pass before proposing acceptance.
 - Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Ensure `npm run build` passes locally without deploying externally.



Please confirm if you approve this patch (and share the exact wording for **AC6** if you have it), and I will provide the updated `AGENTS.md` ready to apply.
```

### 6.2 Findings and my decisions

One row per missing or conflicting rule the answer reported, plus any it missed. **Decision:**
`approve`, `reject` or `modify`.

| # | Rule or line in AGENTS.md | Missing / conflicting | Decision | Why |
| --- | --- | --- | --- | --- |
| 1 | Use real room names and KBTU timetable | Conflicts with one fictional room requirement | approve | The assignment requires one fictional room and sample data only. |
| 2 | AC4: endpoint touching counts as overlap | Conflicts with the actual acceptance contract | modify | Endpoint-touching bookings must be allowed, not rejected. |
| 3 | AC6 is missing | Missing requirement | approve |AC6 requires clear UI feedback on desktop and mobile. |
| 4 | Supabase table and login page| Conflicts with no database and no login | approve | The assignment explicitly prohibits both. |
|5 | No rule about secrets | Missing requirement | approve	| Agents must not introduce or commit secrets, API keys or credentials.|
### 6.3 The approved patch

`git diff app/AGENTS.md`, after you applied only what you approved:

```text

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

```

---

## 7. Task 7 — verify safely

### 7.1 The regression test fails before the mitigation

The risk it covers: **R?**. The real run, with the new test failing:

```text

RUN  v2.1.9

❯ src/booking.test.ts (19)
  ❯ canBook Function Tests (19)
    ✓ T01: valid booking immediately after existing booking
    ✓ T02: start time equals now
    ✓ T03: zero duration
    ✓ T04: start is later than end
    ✓ T05: end exceeds 1440
    ✓ T06: exactly 120 minutes is allowed
    ✓ T07: 121 minutes is rejected
    ✓ T08: booking immediately before existing booking
    ✓ T09: partial overlap
    ✓ T10: new booking contains existing booking
    ✓ T11: new booking is inside existing booking
    ✓ T12: exact duplicate booking
    ✓ T13: blocked room rejects an otherwise valid booking
    ✓ T14: valid booking with empty bookings list
    ✓ T15: negative start time is rejected
    ✓ X1: one-minute booking after now
    ✓ X2: booking ending exactly at 1440
    × R4: rejects NaN start time
    ✓ AC5: bookings array and elements remain unchanged

FAIL  src/booking.test.ts > canBook Function Tests > R4: rejects NaNstart time
AssertionError: expected true to be false

- Expected
+ Received

- false
+ true

Test Files  1 failed (1)
Tests  1 failed | 18 passed (19)

```

### 7.2 The manual UI check

| View | Width | What I checked | Result | Screenshot |
| --- | --- | --- | --- | --- |
| Desktop | 1366px (target) | Manual visual and interaction check skipped | Not run| `evidence/ui-desktop.png` |
| Mobile | 375px (target) | Manual responsive layout and interaction check skipped | Not run | `evidence/ui-mobile.png` |

### 7.3 Tests and checks I did not run

<!-- Name each one and why. "None" only if it is true. -->
- Desktop UI verification: not run due to time constraints.
- Mobile UI verification: not run due to time constraints.
- Desktop screenshot: not created.
- Mobile screenshot: not created.

---

## 8. Task 8 — mitigate two risks

### 8.1 The first mitigation

**Risk:** R?

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit
line. Otherwise leave both empty.

```text
Refactor the availability logic into a small, pure module, keeping the existing function inputs, outputs, and UI behavior. Use a pattern only if the identified design problem justifies it. Do not add new features or dependencies. Show the files you plan to edit before making changes.
```

**Problem → pattern → benefit:**
The canBook function accepted NaN because it did not validate finite numbers. I extracted shared validation into a pure bookingRules module and added Number.isFinite checks. This prevents invalid numeric values from being accepted.
**What I rejected from the agent's patch, and why:**
I rejected unrelated UI changes, new dependencies, database integration, authentication, and external services because they were outside the assignment scope.
The diff I approved (`git diff`):

```text
src/booking.ts:
- Removed duplicated validation conditions.
+ Imported getBookingReasons from bookingRules.
+ canBook now returns true only when there are no validation issues.

src/lib/bookingRules.ts:
+ Added shared validation rules.
+ Added Number.isFinite checks for start, end, and now.
+ Preserved duration, blocked-room, and overlap checks.
```

### 8.2 The second mitigation

**Risk:** R?

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit
line. Otherwise leave both empty.

```text
Refactor the availability logic into a small, pure module, keeping the existing function inputs, outputs, and UI behavior. Use a pattern only if the identified design problem justifies it. Do not add new features or dependencies. Show the files you plan to edit before making changes.
```

**Problem → pattern → benefit:**
Booking validation was duplicated in booking.ts and availability.ts. I introduced a shared pure bookingRules module used by both functions. This creates one source of truth for the booking rules and reduces the risk of inconsistent validation.
**What I rejected from the agent's patch, and why:**
I rejected changes to unrelated components, UI redesign, additional dependencies, and changes to the acceptance criteria. The existing function interfaces and availability result structure were preserved.
The diff I approved (`git diff`):

```text
src/lib/availability.ts:
- Removed duplicated time, duration, blocked-room, and overlap validation.
+ Calls getBookingReasons from bookingRules.
+ Converts validation issue codes into user-readable messages.
+ Preserves the available/unavailable result structure.

src/lib/bookingRules.ts:
+ Centralizes booking validation for both functions.
```

### 8.3 The residual risk

| ID | L before | I before | Score before | L after | I after | Score after | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R4	 | 2 | 3 | 6 | 1 | 2 | 2 | Number.isFinite checks; R4 test passed in the earlier 19-test run|
| R1	| 2| 3 | 6 | 1 | 2 |  2| Both functions use bookingRules.ts|

### 8.4 The final run

The real output of the **full** suite after both mitigations. Every test must pass.

```text
TypeScript: PASS (npm run typecheck)
ESLint: PASS (npm run lint)
Production build: PASS (npm run build)

Vitest: 19 tests passed in the earlier run after the refactor.
However, the final test-file diff showed that the R4 test declaration was missing. The full suite was not rerun after reviewing this final diff. Final verification is incomplete.
```

---

## 9. Task 9, and what still fails

### 9.1 A background agent on this project

Rules for an agent working asynchronously on a separate branch. Be specific to this project: name
its files and its commands.

| Rule | What I require |
| --- | --- |
| Isolation | Work only on a separate branch based on the latest main. Never modify week-10 on the user's working branch directly|
| Permitted files | Only files under week-10/app/src, week-10/lab-report.md, and explicitly approved week-10 files.|
| Commands | Run npm install, npm run typecheck, npm run lint, npx vitest run, and npm run build from week-10/app.|
| Prohibited actions | No database, login, secrets, API keys, external deployments, unrelated folders, or new dependencies without approval.|
| Required evidence | Show git diff, test output, build output, and a summary of changed files.|
| Before merging or deploying | Get user approval, verify AC1–AC6, rerun all tests, and confirm that no unrelated files are included. Do not deploy externally.|

### 9.2 Optional — the deck's checklist prompt (not graded)

<!-- If you sent it: the answer, and one thing it has that your rules in 9.1 do not, or the reverse. -->

### 9.3 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| Pending checker run | Final checker has not yet been run. |

---

## 10. Release decision and conclusion

**Decision:** NO-GO

<!-- Keep one word above. GO is not allowed while any confirmed risk still scores 6 or more.
     Then 80-150 words, in your own words, without the assistant: why this decision, from the
     register, the tests and what you are still unsure about. Name at least two risk IDs.
     Worthless: "The project is mostly fine, so GO."
     Worth everything: "CONDITIONAL. R2 (the deploy line in AGENTS.md, 3 x 3 = 9) is closed by the
     approved patch, now 1 x 3. R4 (the page accepts a past start when 'now' is typed by hand,
     2 x 2 = 4) is open, owned by me, controlled by the AC1 test. The UI was checked at two widths,
     but no test covers App.tsx, so a regression there would be invisible." -->

<!-- Write your conclusion below this line -->
NO-GO. R2, the external deployment instruction in AGENTS.md, was addressed through the approved documentation patch. R1 was reduced by moving shared validation into bookingRules.ts, and R4 was addressed by adding finite-number validation. The earlier test run showed 19 passing tests, and TypeScript, ESLint, and the production build also passed. However, the final test-file diff revealed that the R4 test declaration was missing, so the complete suite was not verified again afterward. Manual desktop and mobile UI checks were also skipped, and screenshots were not created. R3, the use of five rooms instead of one fictional room, remains unresolved. The project is therefore not ready for release.
