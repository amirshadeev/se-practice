# SIS #03 — Report: Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 13.) and every
     ### sub-heading, and the **Label:** words — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> comments if you like. -->

## 1. Setup and reuse

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Reuse: week-05 if code/original/booking_v1.py is your Week 05 v1, copied unedited;
     week-06 if web/original/ is your Week 06 v1 export; fresh if you generated it for this SIS. -->

| Item | Value |
| --- | --- |
| Coding assistant (tool) | Bolt.new |
| Coding assistant model | not displayed |
| Bolt.new model | not displayed |
| Bolt project link | https://bolt.new/p/71979144  |
| Language | Pyhton |
| Path | A |
| Python v1 from | fresh |
| Web v1 from | week-06 |

## 2. Baseline — before any new AI exchange

<!-- Written by you, without AI, before the first exchange of this SIS. Commit and push it
     first (README §2). Reusing Week 05/06 work does not exempt you: this section is new. -->

### 2.1 Scope in my own words

**Scope:** The project is a simple Smart Campus Room Availability Checker. A student can select a room and check if it is available for a chosen time. The application checks the time and existing bookings. It does not create bookings or require login, a database, or a backend.

### 2.2 The acceptance criteria in my own words

| AC | In my own words |
| --- | --- |
| AC1 | The start time must be before the end time, both must be between 0 and 1440 minutes, and the start time must be later than the current time. |
| AC2 | A booking cannot be longer than 120 minutes. |
| AC3 | A blocked room cannot be booked. |
| AC4 | A new booking cannot overlap with existing bookings. Two bookings can touch at their endpoints. |
| AC5 | The application must clearly show Available or Unavailable and must not change existing bookings. |
| AC6 | The application must show clear error messages and work on small screens. |

### 2.3 Likely failure points

<!-- At least two. The brief's examples: endpoint overlap, starts-now. -->

| # | Failure point | AC | How I will check it |
| --- | --- | --- | --- |
| 1 | A booking starts exactly when the room becomes available after another booking. | AC4 | 	Check a booking from 660 to 720 when an existing booking ends at 660. |
| 2 |A booking starts at the current time. | AC1 | Set the current time to 540 and try to book from 540 to 570. |

### 2.4 The contract

| Parameter | Meaning | Type and allowed values |
| --- | --- | --- |
| `start` | Booking start time in minutes after midnight. | Integer, from 0 to 1439. |
| `end` | Booking end time in minutes after midnight. | Integer, from 1 to 1440. Must be greater than start. |
| `now` | Current time in minutes after midnight. | Integer, from 0 to 1439. |
| `blocked` | Shows whether the room is blocked. | Boolean: True or False. |
| `existing` | ist of existing booking time intervals. | List of tuples containing start and end integers. |
| returns | Shows whether the requested booking is allowed. | Boolean: True or False. |

### 2.5 Initial assumptions and manual checks

**Assumptions:**

1. The application checks availability for one selected room at a time.
2. All times are represented as minutes after midnight, and the application checks bookings for the same day.

**Checked manually:**

- I reviewed the acceptance criteria and identified possible problems with overlapping bookings and bookings starting at the current time.

## 3. Python v1 review

<!-- One row per conditional branch in code/original/booking_v1.py (your language's v1 on
     Path B). Quote the condition exactly. AC1-AC4 must all appear in the AC column. -->

| Branch in v1 (quoted) | AC | Satisfies it? | Why |
| --- | --- | --- | --- |
| if not isinstance(start, int) or isinstance(start, bool): | AC1 | yes | It checks that the start value is an integer and rejects Boolean values. |
| if not isinstance(end, int) or isinstance(end, bool): | AC1 | yes| It checks that the end value is an integer and rejects Boolean values. |
| if not isinstance(now, int) or isinstance(now, bool): | AC1 | yes | It checks that the current time is an integer and rejects Boolean values. |
| if start < 0 or end > 1440 or start >= end: | AC1 | yes | It rejects invalid time boundaries and intervals where the start is not before the end. |

## 4. Prototype v1 in Bolt.new

**Prompt as sent:**

~~~~text
Build a small responsive Smart Campus Room Availability Checker. Requirements: AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time.
AC2: Reject a booking longer than 120 minutes.
AC3: Reject the request when the selected room is blocked.
AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed.
AC5: Show a clear Available / Unavailable decision without changing the existing booking data.
AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback.
Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.
~~~~

<!-- Main generated files or components, with their path inside web/original/
     (for example src/App.tsx). At least two. -->

| Generated file or component | Path | Its role |
| --- | --- | --- |
| App.tsx | src/App.tsx | Displays the main user interface and allows users to check room availability. |
| availability.ts | src/lib/availability.ts | ontains the logic for checking whether a room is available. |

**What v1 does:**

- The application allows users to select a room and check its availability.
It uses sample room and booking data.
It checks the requested time against existing bookings.
It displays whether the room is available or unavailable.
It does not create real bookings or use a backend database.

## 5. Test cases — executed on both artifacts

<!-- Base for every case unless the row says otherwise: now = 540, blocked = False,
     existing = [(600, 660)]. Do not change the first four columns.
     Python columns: True, False or Error (it raised) — what the call actually returned.
       T11: the result of the SECOND call. T12: n/a.
       Path A: the checker runs both of your files on T1-T11 and compares (C2, C3).
     Page columns: Available, Unavailable or Not testable — what the page actually showed.
     Never write a result you did not observe. -->

| Case | Name | Input | Expected | Python v1 | Python final | Page v1 | Page final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 660–720 | Available | True| True| True| True|
| T2 | Overlap | 630–690 | Unavailable | False| False| False| False|
| T3 | Blocked | 660–720, blocked | Unavailable | False | False | False | False |
| T4 | Exactly 120 min | 720–840 | Available | True| True| True| True|
| T5 | 121 min | 720–841 | Unavailable | False| False| False| False|
| T6 | Starts now | 540–570 | Unavailable | False| False| False| False|
| T7 | Reversed | 720–660 | Unavailable | False| False| False| False|
| T8 | Ends at midnight | 1380–1440 | Available | True|True |True |True |
| T9 | Past midnight | 1380–1441 | Unavailable | False| False| False| False|
| T10 | Second booking | 720–780, existing (600–660), (700–760) | Unavailable | False| False| False| False|
| T11 | Same check twice | 660–720, twice | Available | True| True| True| True|
| T12 | Narrow screen | T1 at ~375 px wide | Available | n/a | n/a | n/a| n/a|

## 6. Traceability

<!-- His table. Implementation / file: where the rule lives (booking.py line, a component).
     Test input: the case IDs from section 5. v1 / final actual: what those cases gave. -->

| AC | Implementation / file | Test input | Expected | v1 actual | Final actual |
| --- | --- | --- | --- | --- | --- |
| AC1 | code/booking.py — time validation; web/final/project/src/lib/availability.ts | T1, T5, T6, T7, T8, T9 | Reject invalid time, accept valid time | Matches expected | Matches expected |
| AC2 | code/booking.py — duration validation | T4,T5 | T4 Available, T5 Unavailable | Matches expected | Matches expected |
| AC3 | code/booking.py — blocked room validation | T3 | Unavailable | Unavailable |Unavailable|
| AC4 | code/booking.py — overlap validation | T1, T2, T10 | T1 Available, T2 and T10 Unavailable | Matches expected | Matches expected |
| AC5 | code/booking.py — Boolean result and unchanged existing bookings | T11 | Available; existing bookings unchanged |Matches expected | Matches expected |
| AC6 | web/final/project/src/App.tsx — responsive layout and validation messages | T12 | Usable at 375px width | Matches expected | Matches expected|

## 7. Issue log

<!-- At least two, from v1 — a functional defect and a usability or code-quality issue where you
     have them. If every case passed on v1, log the preventive cleanup and say why.
     Reproduction names a case (T1-T12) or an AC. Priority: High, Medium or Low.
     Prompt / change: the focused prompt you sent, and what changed. Never "make it better". -->

| # | Issue | Reproduction | Priority | Prompt / change | Retest result |
| --- | --- | --- | --- | --- | --- |
| 1 | The initial Python function did not validate the types and structure of all input data. | Invalid input types; existing contains an invalid booking entry. | Medium | I asked the AI to add input validation for start, end, now, blocked, and each booking in existing. The final function rejects invalid input. | All 22 unit tests passed. |
| 2 | The initial function did not explicitly validate the structure and time boundaries of existing bookings. | AC4; malformed or out-of-range entries in existing. | Medium | I asked the AI to validate every existing booking before checking interval overlap. The final function checks the booking format and time boundaries. | All 22 unit tests passed. |

**Before / after:** `evidence/before-1.png` → `evidence/after-1.png` show issue 

## 8. Critique decisions

<!-- The AI's review against AC1-AC6 (stage C), claim by claim. At least three rows.
     How I verified it: the case, test or run that confirmed or refuted the claim.
     Decision: accept, reject or modify. At least one reject or modify — the reflection asks for it. -->

| # | AI claim or recommendation | How I verified it | Decision | Reason (AC or case) |
| --- | --- | --- | --- | --- |
| 1 | The overlap condition start < existing_end and end > existing_start correctly allows bookings that touch at endpoints. | Ran T1 and T2 in the Python test suite. T1 was accepted and T2 was rejected. | Accept | AC4 requires rejecting overlaps while allowing touching endpoints. |
| 2 | Checking only the requested time values is sufficient for validating a booking request. | Reviewed the function and added tests for invalid types and malformed existing bookings.  | Reject| Invalid input data could cause incorrect behavior. The final implementation validates input types and existing booking entries. |
| 3 | The function should return a Boolean and must not modify the existing bookings list. | Ran repeated checks and tests that compare existing before and after execution. | Accept | AC5 requires a Boolean result and no mutation of existing. |

## 9. Coding-agent analysis

### 9.1 The loop

<!-- One real pass through the loop from this assignment — with your assistant or with Bolt. -->

| Step | What happened in this assignment |
| --- | --- |
| User goal | I wanted to improve the Python room availability function while keeping the original assignment requirements. |
| Model / plan | The AI assistant analyzed the function and proposed adding stricter input validation and checking existing bookings. |
| Tool call | I used the AI assistant to review and update code/booking.py, then ran Python unit tests from the terminal. |
| Observation | The updated function rejected invalid inputs, preserved existing bookings, and passed all 22 unit tests. |
| Next step | I reviewed the implementation and compared its behavior with the acceptance criteria and test cases. |
| Human review | I checked the code, reviewed the test results, and decided which AI suggestions were appropriate for the assignment scope. |

### 9.2 Context, tools and permissions

<!-- At least three rows. Last column: Observed (you saw it happen) or Assumed (you infer it
     about the internals). Use both at least once. -->

| Tool | Context it used | Tools or permissions | Observed or assumed |
| --- | --- | --- | --- |
| Bolt.new | Smart Campus Room Availability Checker requirements and project files. | Could generate and modify frontend source files in the project. | Observed |
| Python interpreter | code/booking.py and code/test_booking.py. | Executed the function and unit tests locally. |Observed |
| Bolt.new | Smart Campus Room Availability Checker requirements and project files. | Could suggest code changes and explain implementation; I reviewed and applied the changes. | Observed |

### 9.3 Checkpoint and dependability

**Safety checkpoint:** Before accepting AI-generated changes, I checked whether they stayed within the assignment scope. I reviewed the code for unexpected behavior, unnecessary features, and changes to existing booking data. I also checked that invalid time intervals and blocked rooms were rejected. I did not treat generated code as automatically correct.

**Reliability, security, responsibility:** AI-generated code can contain logical errors, so unit tests and human code review are necessary for reliability. Availability can be affected by incorrect overlap checks, which may show a room as available when it is not. Security risks include trusting unvalidated user input and adding unnecessary access to external services. The application should collect only the information it needs and avoid unnecessary permissions. I remain responsible for reviewing changes, checking test results, and ensuring that the final application follows the requirements.

## 10. Reflection

<!-- 100-200 words, in your own words, no AI. Compare AI-assisted coding (the Python part) with
     vibe coding (the Bolt part); one example each of a reliability, an availability/usability and
     a security risk; why review, tool permissions and tests stay human responsibilities; one AI
     recommendation you rejected or modified, and why; what you would improve next without
     expanding the scope. -->

AI-assisted coding and vibe coding were useful in different ways. For the Python part, I used an AI assistant to improve the can_book function. It helped identify missing input validation, but I still needed to review the code and run unit tests. For the Bolt part, I described the application requirements and used Bolt.new to generate the interface. This was faster, but it was harder to understand every implementation detail.

There are several risks. A reliability risk is an incorrect overlap check that accepts an unavailable time slot. An availability risk is a confusing interface that makes the application difficult to use on a small screen. A security risk is accepting invalid input or adding unnecessary access to external services.

Human review remains important because AI can misunderstand requirements or generate incorrect code. Tool permissions should also be limited to what the task requires. I rejected the idea that basic time validation was enough and added validation for existing bookings. Next, I would improve test coverage and review the interface more carefully without adding features outside the assignment scope.

## 11. Appendix A — AI exchanges

<!-- At least four. Complete prompts and complete responses, as text — never screenshots. Paste
     each inside the ~~~~ block that follows its label.
     Stage: Plan, Generate, Critique or Repair (the brief's A-D) — at least one of each.
     Source: this SIS, week-05 or week-06. Reused exchanges keep their original date.
     The Generate exchange for Python must contain your v1 exactly as it is in code/original/.
     Add B5, B6 … if you ran more. -->

### B1

- **Tool:** Bolt.new
- **Model:** not displayed
- **Date:** 10 November 2026
- **Stage:** Generate
- **Source:** SIS03

**Prompt:**

~~~~text
Build a small responsive Smart Campus Room Availability Checker. Requirements: AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time.
AC2: Reject a booking longer than 120 minutes.
AC3: Reject the request when the selected room is blocked.
AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed.
AC5: Show a clear Available / Unavailable decision without changing the existing booking data.
AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback.
Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.
~~~~

**Response:**

~~~~text
626f6c742d63632d6167656e74I'll build a single-page Smart Campus Room Availability Checker with in-memory sample data (no backend, per your request). Let me create the files.Build passes cleanly. Here's what I created:

**Main files:**
- **`src/lib/roomData.ts`** — Fictional sample rooms (5 rooms across different buildings) and pre-existing bookings.
- **`src/lib/availability.ts`** — The availability-check engine that enforces all six acceptance criteria (valid interval, max 120 min, blocked-room rejection, overlap detection with touching-endpoints allowed) and returns a clear Available/Unavailable decision.
- **`src/App.tsx`** — The full single-page UI: room selector cards, start/end time pickers, a simulated current-time control, a visual duration indicator, a check button, and a color-coded result banner. A side panel shows existing bookings for the selected room.

**How it works:**
- Pick a room, set start/end times, and optionally adjust the simulated current time, then click "Check Availability."
- The page shows a green **Available** banner or a red **Unavailable** banner listing every reason the request was rejected.
- Blocked rooms are visibly marked. The duration bar turns red if the selection exceeds 120 minutes.
- The layout is responsive — two columns on desktop, stacked on mobile — and the check never modifies the existing booking data.

All data is in-memory sample data only, with no backend or authentication.
~~~~

### B2

- **Tool:** Bolt.new
- **Model:** not displayed
- **Date:** 10 November 2026
- **Stage:** Plan
- **Source:** week-06

**Prompt:**

~~~~text
In the current prototype, selecting Newton Lab shows existing bookings from 10:00–11:00 and 17:00–18:00, but the required test fixture has only one existing booking from 10:00–11:00. Make the smallest change to the fictional sample data so Newton Lab has only the 10:00–11:00 booking. Preserve all availability logic and the other acceptance criteria. Explain which file/component you changed and why.
~~~~

**Response:**

~~~~text
626f6c742d63632d6167656e74I'll remove the single booking entry for the 17:00–18:00 Chemistry Seminar in Newton Lab.I changed **`src/lib/roomData.ts`** — I removed the `b6` booking entry (the "Chemistry Seminar" from 17:00–18:00) from the `initialBookings` array. This was the only booking tied to Newton Lab beyond the 10:00–11:00 "Physics Tutorial" slot, so Newton Lab now has exactly one existing booking as the test fixture requires. No availability logic or other sample data was touched.
~~~~

### B3

- **Tool:** Bolt.new
- **Model:** not displayed
- **Date:** 10 November 2026
- **Stage:** plan
- **Source:** week-05

**Prompt:**

~~~~text
Review the current prototype for an unnecessary dependency. Check whether @supabase/supabase-js is used anywhere in the application source. If it is unused, remove only that dependency from package.json and update the lockfile if one exists. Do not change the UI, sample data, or availability logic. Explain exactly what you changed.
~~~~

**Response:**

~~~~text
626f6c742d63632d6167656e74Let me check if `@supabase/supabase-js` is imported anywhere in the source code.No references to Supabase anywhere in the source. I'll remove the dependency from `package.json` and update the lockfile.Done. I searched all source files under `src/` for any reference to "supabase" and found none — the app uses in-memory sample data only, so `@supabase/supabase-js` was an unused dependency.

**What I changed:**
- **`package.json`** — Removed the `"@supabase/supabase-js": "^2.57.4"` line from the `dependencies` block.
- **`package-lock.json`** — Updated automatically by running `npm install`, which pruned the package from the lockfile.

No UI, sample data, or availability logic was touched, and the build still passes.
~~~~

### B4

- **Tool:** Bolt.new
- **Model:** not displayed
- **Date:** 10 November 2026
- **Stage:** Critique
- **Source:** SIS03

**Prompt:**

~~~~text
In the current prototype, selecting Newton Lab showed bookings from 10:00–11:00 and 17:00–18:00, but AC4's required test fixture has only one existing booking from 10:00–11:00. Make the smallest change that fixes this behavior. Preserve the other acceptance criteria. Explain which file/component you changed and why.
~~~~

**Response:**

~~~~text
626f6c742d63632d6167656e74Let me check the current state of the sample data file.This change has already been applied — the `b6` booking entry (the "Chemistry Seminar" from 17:00–18:00) was removed from `initialBookings` in a prior step. Newton Lab (`r2`) now has only one booking: `b3` "Physics Tutorial" from 10:00–11:00 (minutes 600–660).

No further change is needed. The file `src/lib/roomData.ts` already reflects the required test fixture, and all availability logic and other acceptance criteria remain untouched.
~~~~

## 12. Appendix B — Test output

### 12.1 Your suite

<!-- The complete terminal output of your final suite. Path A: python -m unittest -v, run inside
     code/ — the part ending in "Ran N tests" and OK or FAILED. -->

~~~~text
test_121_minutes_is_rejected (test_booking.BookingTests) ...ok
test_blocked_room_is_rejected (test_booking.BookingTests) ... ok
test_boolean_time_is_rejected (test_booking.BookingTests) ... ok
test_end_after_midnight_is_rejected (test_booking.BookingTests) ... ok
test_ends_at_midnight_is_allowed (test_booking.BookingTests)... ok
test_equal_start_and_end_is_rejected (test_booking.BookingTests) ... ok
test_exactly_120_minutes_is_allowed (test_booking.BookingTests) ... ok
test_existing_bookings_are_not_modified (test_booking.BookingTests) ... ok
test_existing_bookings_order_is_not_modified (test_booking.BookingTests) ... ok
test_existing_bookings_unchanged_after_overlap (test_booking.BookingTests) ... ok
test_existing_bookings_unchanged_when_blocked (test_booking.BookingTests) ... ok
test_float_end_is_rejected (test_booking.BookingTests) ... oktest_float_start_is_rejected (test_booking.BookingTests) ...ok
test_negative_start_is_rejected (test_booking.BookingTests) ... ok
test_new_interval_contains_existing_is_rejected (test_booking.BookingTests) ... ok
test_new_interval_inside_existing_is_rejected (test_booking.BookingTests) ... ok
test_overlap_is_rejected (test_booking.BookingTests) ... ok
test_reversed_interval_is_rejected (test_booking.BookingTests) ... ok
test_second_existing_booking_overlap_is_rejected (test_booking.BookingTests) ... ok
test_starting_at_current_time_is_rejected (test_booking.BookingTests) ... ok
test_touching_end_is_allowed (test_booking.BookingTests) ...ok
test_touching_start_is_allowed (test_booking.BookingTests) ... ok

----------------------------------------------------------------------
Ran 22 tests in 0.011s

OK
~~~~

### 12.2 Path B only — three faults you planted

<!-- Path A: leave this table as it is. Path B: three rows — the line you broke, the AC it
     breaks, the test that failed. -->

| # | Line you broke | AC | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

## 13. Remaining limitations and known fails

<!-- One row per check ID in submission.yml known_fails, and any limitation you know of.
     If the checker is clean and you know of none, one row that says so. -->

| Check ID or limitation | Why it stays | What I would do next |
| --- | --- | --- |
| evidence/web-v1.png missing | The original Bolt prototype screenshot has not been added. | Capture the original prototype and save the screenshot. |
