# SIS #04 — Report: Evolving the Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 10.), every
     ### sub-heading and every **Label:** word — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> comments if you like. -->

## 1. Setup and starting point

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Starting point: week-08 | week-07 | sis-03 | starter   (README section 3)
     Baseline commit: the commit that brings your starting point into sis-04/app/ UNCHANGED —
     git rev-parse --short HEAD right after that commit. It is your "initial version". -->

| Item | Value |
| --- | --- |
| Assistant (tool) |Gemini |
| Assistant model | not displayed |
| Starting point | sis-03 |
| Baseline commit | 7e941b1 |
| Language (ts or js) | ts |
| Vitest version | 2.1.9 |
| Where I ran the tests | sis-04/app |

### 1.1 Baseline run

<!-- Before you change anything: run the tests of your starting point inside app/ and paste the
     REAL output. No tests yet (starter, sis-03)? Paste the run anyway: Vitest prints
     "No test files found". That is your honest "original" number, 0/0. -->

```text
RUN  v2.1.9 C:/Users/user/se-practice/sis-04/app

include: **/*.{test,spec}.?(c|m)[jt]s?(x)
exclude: **/node_modules/**, **/dist/**, **/cypress/**, **/.{idea,git,cache,output,temp}/**, **/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*

No test files found, exiting with code 1
```

## 2. Context for the assistant

### 2.1 Repository map

<!-- The concise map you gave the assistant: the files that matter and one line each on what
     they do. A tree is fine:  src/App.tsx — the page, holds the rooms and the form … -->

```text
sis-04/app/
├── src/
│   ├── App.tsx — main React page; room selection, booking form, availability result and booking list.
│   ├── index.css — global styles.
│   ├── main.tsx — React application entry point.
│   ├── vite-env.d.ts — Vite TypeScript declarations.
│   └── lib/
│       ├── availability.ts — checkAvailability() and formatTime(); validates booking requests.
│       └── roomData.ts — Room and Booking types, rooms catalog and initialBookings array.
├── package.json — scripts and project dependencies.
└── package-lock.json — locked dependency versions.
```

### 2.2 The context message as sent

<!-- The whole first message of your analysis chat: the map, AC1–AC6, F1–F5 and the constraints
     (no login, payments, live APIs or database; fictional data only). Unedited. -->

```text
I am working on KBTU SITE SIS-04: AI-Assisted Software Evolution, Refactoring and Quality Improvement.

I need you to analyze my existing codebase before I modify any source files. Do not write or generate implementation code yet. First identify maintainability risks and propose a safe, prioritized refactoring plan.

**Starting point:** SIS-03, copied into `sis-04/app` unchanged. Baseline commit: `7e941b1`.

**Repository map:**
- `src/App.tsx` — main React page; room selection, booking form, availability result and booking list.
- `src/index.css` — global styles.
- `src/main.tsx` — React entry point.
- `src/lib/availability.ts` — `checkAvailability()` and `formatTime()`.
- `src/lib/roomData.ts` — `Room` and `Booking` types, `rooms` catalog and `initialBookings` array.
- `package.json` — project scripts and dependencies.

**Current implementation:**
- `Room` has id, name, building, capacity and blocked.
- `Booking` has id, roomId, start, end and title.
- Rooms and bookings are stored in separate arrays.
- `checkAvailability()` checks the requested time, duration, blocked status and overlapping bookings.
- `App.tsx` filters bookings by selected room and calls `checkAvailability()` directly.
- There are currently no automated tests in the original application.

**Acceptance criteria to preserve:**
- AC1: Reject requests where start >= end and requests in the past.
- AC2: Maximum booking duration is 120 minutes.
- AC3: A blocked room must not be available.
- AC4: Reject overlapping bookings, but allow bookings whose endpoints touch.
- AC5: Return Available/Unavailable without mutating booking data.
- AC6: Provide clear, responsive feedback on desktop and mobile.

**New functional requirements:**
- F1: A room must have capacity greater than or equal to the requested number of attendees.
- F2: A room must contain all selected equipment.
- F3: A blocked room must never be shown as Available.
- F4: Show a clear empty state when no rooms match the filters.
- F5: Changing the selected room must refresh availability using that room's own bookings.

**Required architecture:**
- `src/rooms.ts`: define `Room` with id, name, capacity, equipment, blocked and bookings; export `ROOMS` with at least four fictional rooms.
- `src/filter.ts`: implement `filterRooms(rooms, { attendees, equipment }): Room[]`.
- `src/booking.ts`: implement `canBook({ start, end, now, blocked, bookings }): boolean` and `checkRoom(rooms, roomId, { start, end }): boolean`.
- `checkRoom()` must find the selected room and use only that room's blocked status and bookings. Unknown room IDs must return unavailable.
- Keep room data and repeated business rules out of UI components.

**Constraints:**
- No login, payments, live APIs or database.
- Fictional data only.
- Preserve the existing React/Vite application.
- Use TypeScript and Vitest.
- Do not change source files until the analysis and plan are documented and committed.
- Do not silently change the acceptance criteria.

Please provide:
1. At least three maintainability risks found in the described existing code, with file/function, evidence and priority.
2. A prioritized, numbered refactoring plan with small, safe steps.
3. At least two design decisions with alternatives and reasons.
4. Potential edge cases and risks that should be checked manually.
5. One recommendation you consider unnecessary or risky, explaining why.

Do not implement anything yet. Clearly distinguish facts from assumptions and do not invent details about files you have not seen.
```

## 3. Codebase analysis (Task 1)

### 3.1 Maintainability risks

<!-- At least three, found in YOUR starting code. "Where" names a file or a function(),
     e.g. src/App.tsx, check(). Evidence is what you saw, not what the assistant said.
     Priority: High / Medium / Low. -->

| # | Risk | Where (file / function) | Evidence | Priority |
| --- | --- | --- | --- | --- |
| 1 | UI contains booking data filtering logic | src/App.tsx, roomBookings|App filters the shared bookings array by selected room ID | High  |
| 2 | Availability logic depends on the old data structure | src/lib/availability.ts, checkAvailability() | Function accepts a Room object and a separate Booking array, then filters bookings by room ID | High  |
| 3 | Room data and bookings are stored separately |src/lib/roomData.ts | rooms and initialBookings are separate arrays; Room has no equipment or bookings properties | High  |

### 3.2 Improvement plan — before editing

<!-- Numbered, in the order you will do it, smallest safe step first. Written BEFORE you change
     code: the commit that adds this section comes before the commit that changes app/src. -->

1. Create a room catalog module with a Room type that includes equipment and room-specific bookings.
2. Implement filterRooms() in a separate filter.ts module to handle capacity and equipment filtering.
3. Refactor availability logic into booking.ts with canBook() and checkRoom(), preserving the required booking rules.
4. Create src/rooms.ts with the Room type and at least four fictional rooms, each containing its own equipment and bookings.

5. Implement src/booking.ts with canBook() and checkRoom(), preserving AC1–AC5 and using the selected room's own bookings.

6. Implement src/filter.ts with filterRooms() to support capacity and equipment filtering (F1 and F2).

7. Update src/App.tsx to use the new modules, handle room selection, show an empty state (F4), and refresh availability when the selected room changes (F5).

8. Add and run Vitest tests for all required acceptance criteria, functional requirements, boundary cases and integration behavior.

9. Remove obsolete code from src/lib/ only after checking that the application no longer depends on it.

10. Run TypeScript checks, tests, lint and production build. Manually verify desktop and mobile layouts and capture the required screenshots.

### 3.3 One AI suggestion I rejected or modified

| Suggestion (as the assistant made it) | Decision | Why — with the AC, F-rule, test or file behind it |
| --- | --- | --- |
| Use an optional default clock parameter inside checkRoom() to provide the current time. | Modified | The required function signature explicitly includes now in { start, end, now }. I will pass now explicitly to checkRoom() and then to canBook(). This follows the required interface and makes time-dependent tests deterministic. |

## 4. Feature extension (Task 2)

### 4.1 What I added

<!-- Short: the catalog (how many rooms, which equipment), how the filter is chosen on the page,
     what the empty state says, what happens to an old result when the room changes. -->

I added a room catalog containing five fictional rooms with different capacities, equipment sets, blocked statuses, and existing bookings. Users can filter rooms by the number of attendees and by required equipment using the page controls. The application displays only rooms that satisfy both requirements. If no rooms match, it displays: "No rooms match the selected capacity and equipment requirements." When the selected room changes, the previous availability result is cleared. The user must check availability again for the newly selected room.
### 4.2 Demonstration

<!-- One row per screenshot in evidence/. Say what is on it: the filter values, the rooms shown,
     the room selected, the times entered and the result. -->

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | The attendee count is 20 and the required equipment is projector and computers. Newton Lab is the matching room. |
| `evidence/filter-empty.png` | The attendee count is 200. No room matches the capacity requirement, and the empty-state message is displayed. |
| `evidence/switch-a.png` | Newton Lab is selected. The requested time is 10:00–11:00 and current time is 09:00. The result is Unavailable because the room already has a booking during that interval. |
| `evidence/switch-b.png` | Athena Hall is selected with the same time values: 10:00–11:00 and current time 09:00. The result is Available. |
| `evidence/narrow.png` | The application is displayed in a narrow mobile Safari viewport. |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | Defines the Booking and Room types and exports the ROOMS catalog containing five rooms. |
| `src/booking.ts` |Implements canBook() for booking validation and checkRoom() for checking availability using the selected room's own bookings and blocked status. |
| `src/filter.ts` | Implements filterRooms() to select rooms that have sufficient capacity and contain all required equipment. |
| `src/App.tsx` | Handles user input, room selection, filtering, availability checks, and displaying results and empty states. |
| `src/booking.test.ts` | Tests booking validation, room availability, and integration between filtering and availability checking.|
| `src/filter.test.ts` | Tests room filtering, capacity boundaries, equipment requirements, empty results, and catalog immutability. |


### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| Keep booking validation in canBook() and use checkRoom() to find the selected room. | Keep availability checks directly in App.tsx or duplicate validation in multiple functions. | This separates booking rules from the UI and ensures that availability is checked using the selected room's own bookings and blocked status. |
| Use options.equipment.every() and compare capacity with >= in filterRooms(). | Check only one equipment item or require capacity to be greater than the attendee count. | A room must contain all requested equipment, and a room with capacity exactly equal to the attendee count must be included. |


### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| src/App.tsx — filtered bookings by selectedRoomId to get bookings for the selected room. | src/booking.ts — checkRoom() gets the selected room and uses its own bookings. |
| src/lib/availability.ts — contained booking availability validation rules. | src/booking.ts — canBook() contains the centralized booking validation rules. |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | AC1: rejects past bookings and invalid time ranges | Past booking (500–560, now 600) and zero duration (700–700) → false. |
| AC2 | AC2: rejects bookings longer than 120 minutes | 700–821 (121 minutes) → false. |
| AC3 | AC3: rejects blocked rooms | blocked = true, valid time 700–760 → false. |
| AC4 | AC4: rejects overlapping bookings | Requested 590–620, existing booking 600–660 → false. |
| AC5 | AC5: does not modify the bookings array |Valid request 700–760; compare bookings before and after → unchanged. |
| F1 | F1: includes rooms with enough capacity | 40 attendees, no equipment requirements → rooms r1 and r2 included; r4 excluded. |
| F2 | F2: requires all selected equipment | 1 attendee, projector and computers required → only r2. |
| F3 | F3: returns no rooms when requirements cannot be met | 200 attendees, no equipment requirements → empty array. |
| F4 | F4: includes a room when capacity exactly matches attendees | 40 attendees → r2 (capacity 40) included. |
| F5 | F5: does not modify the original room catalog | Filter catalog and compare it before and after → unchanged. |
| B1 | B1: accepts exactly 120 minutes | 700–820 (120 minutes), now 600 → true. |
| B2 | B2: rejects 121 minutes | 700–821 (121 minutes), now 600 → false. |
| B3 | B3: allows bookings that touch an existing booking endpoint | Requested 660–720, existing booking 600–660 → true. |
| B4 | B4: rejects a partial overlap | Requested 650–700, existing booking 600–660 → false. |
| B5 | B5: includes a room when capacity equals attendees | 40 attendees, no equipment requirements → r2 included. |
| B6 | B6: excludes a room when capacity is one less than attendees | 41 attendees → r2 (capacity 40) excluded. |
| INT | INT: checks availability using the selected room bookings | Check r2 and r1 for 660–720, now 600 → both true using their own bookings. |

### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```text

npm run typecheck
npx vitest run src/filter.test.ts
npx vitest run
npm run lint
npm run build

```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```text
RUN  v2.1.9 C:/Users/user/se-practice/sis-04/app

✓ src/booking.test.ts (12)
✓ src/filter.test.ts (8)

Test Files  2 passed (2)
     Tests  20 passed (20)
  Start at  15:55:14
  Duration  1.22s (transform 90ms, setup 0ms, collect 128ms, tests 12ms, environment 0ms, prepare 387ms)

```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | 0/0 |  20/20 | Ran npx vitest run on the baseline and final code. The baseline had no test files. |
| Duplicated logic locations removed | 0 | 2 | Compared the original locations with the refactored modules in §5.3. |
| Code structure: modules and their responsibilities | App.tsx, src/lib/availability.ts, src/lib/roomData.ts | App.tsx, rooms.ts, filter.ts, booking.ts, booking.test.ts, filter.test.ts | Inspected the source files and their responsibilities. |
| Remaining limitation | No automated tests; room data is local and static. |  Room data is still local and static; there is no backend or database persistence. | Inspected the application architecture and current implementation. |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** Gemini not displayed
**Date:** 22 November 2026
**Purpose:** Analyze the original SIS-03 codebase and identify maintainability risks before editing source files.

**Prompt:**

```text
I am working on KBTU SITE SIS-04: AI-Assisted Software Evolution, Refactoring and Quality Improvement.

I need you to analyze my existing codebase before I modify any source files. Do not write or generate implementation code yet. First identify maintainability risks and propose a safe, prioritized refactoring plan.

Starting point: SIS-03, copied into sis-04/app unchanged. Baseline commit: 7e941b1.

The original application has App.tsx, src/lib/availability.ts and src/lib/roomData.ts. App.tsx handles room selection, booking form, availability results and booking lists. The availability module contains checkAvailability() and formatTime(). The room data module contains Room and Booking types, rooms and initialBookings.

Acceptance criteria:
- AC1: Reject invalid time ranges and past requests.
- AC2: Maximum booking duration is 120 minutes.
- AC3: Blocked rooms must not be available.
- AC4: Reject overlapping bookings but allow touching endpoints.
- AC5: Do not mutate booking data.
- AC6: Provide clear responsive feedback.

New requirements:
- Filter rooms by capacity and all selected equipment.
- Show an empty state when no rooms match.
- Refresh availability when the selected room changes.

Identify maintainability risks and propose a prioritized refactoring plan. Do not generate implementation code.
```

**Output used:**

```text
1. UI contains booking data filtering logic in App.tsx, specifically roomBookings.
2. Availability logic depends on the old data structure in src/lib/availability.ts.
3. Room data and bookings are stored separately in src/lib/roomData.ts.

The proposed plan was to introduce rooms.ts, booking.ts and filter.ts, refactor App.tsx, add Vitest tests, remove obsolete modules after checking dependencies, and run quality checks.
```

**Problems found:**  The original application coupled UI responsibilities with booking-related logic, stored rooms and bookings separately, and had no automated tests.
**Changes made:** Created a new room catalog and separated booking validation and room filtering into dedicated modules. Refactored the UI and added automated tests.
**Verified by:** Inspected the original baseline using git show 7e941b1, reviewed the final source modules, and ran npx vitest run with 20 tests passing.

### 8.2 Exchange 2

**Tool and model:** Gemini not displayed
**Date:**  22 November 2026
**Purpose:** Review the refactoring plan and decide how to implement room availability checks.

**Prompt:**

```text
I am working on SIS-04. Help me plan the refactoring of the room booking application.

The required modules are:
- src/rooms.ts for the Room type and room catalog.
- src/booking.ts for canBook() and checkRoom().
- src/filter.ts for filterRooms().

Preserve AC1–AC5. checkRoom() must use the selected room's own bookings and blocked status. Follow the required function signature with start, end and now.

Review the design and explain how to keep the validation logic separate from the UI.
```

**Output used:**

```text
Use canBook() as the central booking validation function. Let checkRoom() find the selected room and pass its own blocked status and bookings to canBook(). Pass now explicitly through the function arguments. Use filterRooms() to check capacity and all selected equipment.
```

**Problems found:** The availability logic could become coupled to the UI or use bookings from the wrong room. Reading the current time inside the validation function would also make tests less predictable.
**Changes made:** Implemented separate rooms.ts, booking.ts and filter.ts modules. Passed now explicitly to checkRoom() and canBook().
**Verified by:** Ran TypeScript checks and Vitest tests. The final test run passed 20/20 tests.

### 8.3 Exchange 3

**Tool and model:** Gemini not displayed
**Date:** 22 November 2026
**Purpose:** Fix the integration test and verify booking and room filtering behavior.

**Prompt:**

```text
I am working on SIS-04. Review my booking.test.ts and filter.test.ts files.

I need tests for AC1–AC5, F1–F5, B1–B6 and integration behavior (INT). Check whether the integration test correctly filters rooms and then checks availability using the selected room. Help me correct any test errors and verify the final test run.
```

**Output used:**

```text
The integration test was incomplete. It filtered the rooms and checked the matching room ID, but the checkRoom() call was missing. The test needed to call checkRoom() with the matching room ID and the requested start, end and now values.
```

**Problems found:** The integration test contained incomplete code after the filtered room ID assertion. It did not actually call checkRoom().
**Changes made:** Replaced the incomplete section with a checkRoom() call using the first matching room and the interval 660–720, with now = 600.
**Verified by:** Ran npx vitest run. Result: 2 test files passed and 20 tests passed.

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| (write here) | (write here) |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

During the SIS-04 assignment, I learned how important good project structure is. In the original SIS-03 project, many responsibilities were connected inside the user interface. This made the code harder to understand and change. My main task was to separate the room data, filtering logic, and booking validation into different modules.

AI helped me understand the assignment requirements and plan the refactoring. It also suggested how to organize the new files and write tests. One useful suggestion was to create a separate `checkRoom()` function. This function checks the selected room and uses its own bookings and blocked status.

However, I did not accept every suggestion without checking it. I reviewed the code and compared it with the assignment requirements. I also changed some parts to make the implementation match the required behavior. For example, I checked that a booking ending at the same time another booking starts is allowed.

Testing was an important part of this work. The tests helped me check the old requirements and new features. They also helped me find missing integration checks. After fixing the problems, all 20 tests passed.

I also learned that AI-generated code must be tested and understood. In my next project, I want to plan the architecture earlier, write tests during development, and check every important change before committing it. This will help me write more reliable and maintainable code.
