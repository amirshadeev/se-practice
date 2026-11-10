# Week 07 — Lab report

**Name:**Amir Shadeyev
**Group:**Monday 16:00-19:00
**Date:**06 November 2026

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Project I continue (`week-06` = my Week 06 Bolt project, `starter` = the provided starter) | week-06|
| Bolt project link (or `not shared`, and why) | not shared — the project is submitted through the GitHub repository|
| Assistant that generated the tests (tool) | Gemini|
| Exact model (with its version, or `not displayed`) | Gemini 3.6 Flash|
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer (VS code)|
| Vitest version (the `RUN  v…` line of a run) | 2.1.9|
| Test command | npx vitest run|

---
## 2. Task 1 — baseline and the booking function

**Before editing:** where did the booking decision live in the project you started from?

| | |
| --- | --- |
| File and function (or "inside the page component") | `app/src/lib/availability.ts` — `checkAvailability()` |
| Its inputs | start, end, currentTime, room, bookings |
| What it returned | A Decision object: available or unavailable with reasons |
| How the page used it | `App.tsx` called `checkAvailability()` when the user clicked the check button and displayed the result. |
**What I changed to extract `canBook`.**

I extracted the booking validation logic into a separate file called `app/src/booking.ts`. I created the `canBook()` function, which receives the requested start time, end time, current time, blocked status and existing bookings. It returns a boolean value: true if the booking is allowed and false otherwise. The function checks the time range, maximum duration, room blocking and overlapping bookings. The page component `App.tsx` now calls `canBook()` to check whether the requested booking is valid. The existing `checkAvailability()` function remains responsible for providing understandable reasons when a booking is unavailable. This separation makes the booking rules easier to test independently. The same validation conditions are used, so the extraction does not intentionally change the booking rules.

---
## 3. Task 2 — the test plan

Default fixture: `now = 540`, `blocked = false`, `bookings = [{ start: 600, end: 660 }]`, fresh
for every test. **The Expected column comes from AC1–AC4, never from the code.** Write the
**reason** for each expected result **before** you send the generation prompt.

| ID | Candidate / changed input | Expected | AC | Reason (in your words) |
| --- | --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 | The new booking starts exactly when the existing booking ends. |
| T02 | 540–570 (starts now) | false | AC1 | The start time is equal to the current time.|
| T03 | 720–720 (zero duration) | false | AC1 | The interval has zero duration.|
| T04 | 750–720 (reversed) | false | AC1 | The start time is later than the end time.|
| T05 | 1380–1441 (past day end) | false | AC1 | The end time exceeds 1440 minutes.|
| T06 | 720–840 (120 minutes) | true | AC2 | The duration is exactly 120 minutes, which is allowed.|
| T07 | 720–841 (121 minutes) | false | AC2 | The duration is 121 minutes, exceeding the limit.|
| T08 | 570–600 (touching before) | true | AC4 | The new booking ends exactly when the existing booking starts.|
| T09 | 630–690 (partial overlap) | false | AC4 | The intervals partially overlap.|
| T10 | 570–690 (contains booking) | false | AC4 | The new interval contains the existing booking.|
| T11 | 615–645 (inside booking) | false | AC4 | The new interval is inside the existing booking.|
| T12 | 600–660 (identical interval) | false | AC4 | Both intervals are identical.|
| T13 | 660–720, blocked = true | false | AC3 | The room is blocked.|
| T14 | 630–690, bookings = [] | true | AC4 | There are no existing bookings to overlap with.|
| AC5 | an Available request — the bookings after the call equal the bookings before | true, data unchanged | AC5 | Ending exactly at 1440 minutes is valid|
| X1 | 541–542| true| The booking starts one minute after the current time and does not overlap.| 
| X2 | 1320–1440| true| Ending exactly at 1440 minutes is valid.| 

X1 and X2 are **your own two cases**: a boundary or a state that T01–T14 do not reach. Fill all
five columns.

---

## 4. Task 3 — the generation prompt and the first suite

**The prompt exactly as I sent it.** Use the deck's prompt with `[our test framework]` replaced by
`Vitest`, followed by the case table from section 3:

```text
Generate tests for the existing booking function using Vitest. Use AC1–AC6 and the reviewed case table below.
Import the real function used by the page. Keep its code unchanged. Use fixed time and fresh fixtures. Assert exact decisions and unchanged booking data.
Return the test file, run command, and AC mapping. Flag unclear requirements. We will run the tests ourselves.
Case table:
T01: start=660, end=720, now=540, blocked=false, bookings=[{start:600,end:660}], expected=true.
T02: start=540, end=570, now=540, blocked=false, bookings=[{start:600,end:660}], expected=false.
T03: start=720, end=720, now=540, blocked=false, bookings=[{start:600,end:660}], expected=false.
T04: start=750, end=720, now=540, blocked=false, bookings=[{start:600,end:660}], expected=false.
T05: start=1380, end=1441, now=540, blocked=false, bookings=[{start:600,end:660}], expected=false.
T06: start=720, end=840, now=540, blocked=false, bookings=[{start:600,end:660}], expected=true.
T07: start=720, end=841, now=540, blocked=false, bookings=[{start:600,end:660}], expected=false.
T08: start=570, end=600, now=540, blocked=false, bookings=[{start:600,end:660}], expected=true.
T09: start=630, end=690, now=540, blocked=false, bookings=[{start:600,end:660}], expected=false.
T10: start=570, end=690, now=540, blocked=false, bookings=[{start:600,end:660}], expected=false.
T11: start=615, end=645, now=540, blocked=false, bookings=[{start:600,end:660}], expected=false.
T12: start=600, end=660, now=540, blocked=false, bookings=[{start:600,end:660}], expected=false.
T13: start=630, end=690, now=540, blocked=true, bookings=[{start:600,end:660}], expected=false.
T14: start=630, end=690, now=540, blocked=false, bookings=[], expected=true.
X1: start=541, end=542, now=540, blocked=false, bookings=[{start:600,end:660}], expected=true.
X2: start=1320, end=1440, now=540, blocked=false, bookings=[{start:600,end:660}], expected=true.
booking.ts:export interface Booking {
  start: number;
  end: number;
}

interface CanBookInput {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: Booking[];
}

export function canBook({
  start,
  end,
  now,
  blocked,
  bookings,
}: CanBookInput): boolean {
  // AC1: valid time range and future start
  if (start < 0 || start >= end || end > 1440 || start <= now) {
    return false;
  }

  // AC2: maximum duration is 120 minutes
-   if (end
start > 120) {
    return false;
  }

  // AC3: room must not be blocked
  if (blocked) {
    return false;
  }

  // AC4: overlapping bookings are not allowed
  for (let i = 0; i < bookings.length; i++) {
    if (start < bookings[i].end && end > bookings[i].start) {
      return false;
    }
  }

  return true;
}
```

**The assistant's answer: run command, AC mapping and any unclear requirements it flagged,
pasted unedited.** Its test file goes to `suites/first/` and is not pasted here:

```text
Here is the complete Vitest test file, run command, and AC mapping for the `canBook` function based on the provided test cases and acceptance criteria.
```
#### 1. Run Command

To run the tests using Vitest:

```bash
npx vitest run booking.test.ts

```

---

#### 2. AC Mapping & Flagged Requirements

* **AC1 (Valid time range and future start):** Tested via bounds checking (`start < 0`, `end > 1440`), range validity (`start >= end`), and future start requirement (`start <= now`). Covered by cases **T02**, **T03**, **T04**, **T05**, **T07**, **X1**.
* **AC2 (Maximum duration is 120 minutes):** Checked via `end - start > 120`. Covered by cases **T05**, **T07**, **X2**. *(Note: See flagged issue below regarding line truncation in the source file).*
* **AC3 (Room must not be blocked):** Checked via `blocked` flag. Covered by case **T13**.
* **AC4 (No overlapping bookings):** Checked via overlapping interval checks. Covered by cases **T09**, **T10**, **T11**, **T12**.
* **AC5 & AC6:** Covered implicitly by valid edge cases (**T01**, **T06**, **T08**, **T14**, **X1**, **X2**).

#### Flagged Unclear Requirements / Code Defect:

* **Syntax Error in AC2:** In the provided `booking.ts` file, line 21 contains a syntax error / truncation: `if (end - start > 120) {` appears as `-   if (end\nstart > 120) {` or similar. Be sure to fix the source code to `if (end - start > 120)` for tests to compile and run properly.

---

#### 3. Test File (`booking.test.ts`)

```typescript
import { describe, it, expect } from 'vitest';
import { canBook, Booking } from './booking';

describe('canBook Function Tests', () => {
  const baseBookings: Booking[] = [{ start: 600, end: 660 }];

  it('T01: valid booking slot immediately after existing booking', () => {
    const result = canBook({
      start: 660,
      end: 720,
      now: 540,
      blocked: false,
      bookings: baseBookings,
    });
    expect(result).toBe(true);
  });

  it('T02: start time is in the past (start <= now)', () => {
    const result = canBook({
      start: 540,
      end: 570,
      now: 540,
      blocked: false,
      bookings: baseBookings,
    });
    expect(result).toBe(false);
  });

  it('T03: zero duration booking (start === end)', () => {
    const result = canBook({
      start: 720,
      end: 720,
      now: 540,
      blocked: false,
      bookings: baseBookings,
    });
    expect(result).toBe(false);
  });

  it('T04: negative duration (start > end)', () => {
    const result = canBook({
      start: 750,
      end: 720,
      now: 540,
      blocked: false,
      bookings: baseBookings,
    });
    expect(result).toBe(false);
  });

  it('T05: exceeds maximum duration of 120 minutes', () => {
    const result = canBook({
      start: 1380,
      end: 1441,
      now: 540,
      blocked: false,
      bookings: baseBookings,
    });
    expect(result).toBe(false);
  });

  it('T06: valid booking with maximum allowed duration (120 minutes)', () => {
    const result = canBook({
      start: 720,
      end: 840,
      now: 540,
      blocked: false,
      bookings: baseBookings,
    });
    expect(result).toBe(true);
  });

  it('T07: duration exceeds 120 minutes by 1 minute', () => {
    const result = canBook({
      start: 720,
      end: 841,
      now: 540,
      blocked: false,
      bookings: baseBookings,
    });
    expect(result).toBe(false);
  });

  it('T08: valid booking slot immediately before existing booking', () => {
    const result = canBook({
      start: 570,
      end: 600,
      now: 540,
      blocked: false,
      bookings: baseBookings,
    });
    expect(result).toBe(true);
  });

  it('T09: partial overlap with existing booking (starts during, ends after)', () => {
    const result = canBook({
      start: 630,
      end: 690,
      now: 540,
      blocked: false,
      bookings: baseBookings,
    });
    expect(result).toBe(false);
  });

  it('T10: completely encapsulates existing booking', () => {
    const result = canBook({
      start: 570,
      end: 690,
      now: 540,
      blocked: false,
      bookings: baseBookings,
    });
    expect(result).toBe(false);
  });

  it('T11: completely contained within existing booking', () => {
    const result = canBook({
      start: 615,
      end: 645,
      now: 540,
      blocked: false,
      bookings: baseBookings,
    });
    expect(result).toBe(false);
  });

  it('T12: exact duplicate of existing booking', () => {
    const result = canBook({
      start: 600,
      end: 660,
      now: 540,
      blocked: false,
      bookings: baseBookings,
    });
    expect(result).toBe(false);
  });

  it('T13: room is blocked', () => {
    const result = canBook({
      start: 630,
      end: 690,
      now: 540,
      blocked: true,
      bookings: baseBookings,
    });
    expect(result).toBe(false);
  });

  it('T14: valid booking when bookings list is empty', () => {
    const result = canBook({
      start: 630,
      end: 690,
      now: 540,
      blocked: false,
      bookings: [],
    });
    expect(result).toBe(true);
  });

  it('X1: valid minimal duration booking in the near future', () => {
    const result = canBook({
      start: 541,
      end: 542,
      now: 540,
      blocked: false,
      bookings: baseBookings,
    });
    expect(result).toBe(true);
  });

  it('X2: valid maximum-duration booking late in the day', () => {
    const result = canBook({
      start: 1320,
      end: 1440,
      now: 540,
      blocked: false,
      bookings: baseBookings,
    });
    expect(result).toBe(true);
  });

  it('Immutability check: ensures bookings array and elements are unchanged', () => {
    const bookings: Booking[] = [{ start: 600, end: 660 }];
    const bookingsCopy = JSON.parse(JSON.stringify(bookings));

    canBook({
      start: 660,
      end: 720,
      now: 540,
      blocked: false,
      bookings,
    });

    expect(bookings).toEqual(bookingsCopy);
  });
});


```

The first suite was saved to `suites/first/` **before** I changed anything in it: yes 

---

## 5. Task 4 — review of the first suite

Review it **before** you run it. Look at the imports, the expected values, isolation, duplicates
and skipped tests. Make one row per decision. At least **two** rows, and each one names the kind of
weakness (the deck's table: *no exception occurred* · *expected = current output* · *only valid
requests* · *mocked booking function*, or your own) and the AC that decides it.

| # | Test or part of the suite | What is weak or wrong | Decision: accept / revise / reject | AC or reason |
| --- | --- | --- | --- | --- |
| 1 | T13: blocked room test| The test used a booking interval that also overlapped an existing booking. Therefore, it could fail because of AC4 instead of AC3.| revise | AC3 — the test should isolate the blocked-room condition.|
| 2 | T05: end exceeds 1440|The test checks an invalid end time, but it does not independently test the maximum booking duration. | accept  | AC1 — the test correctly checks that the end time cannot exceed 1440. AC2 is separately checked by T06 and T07.|

---

## 6. Task 5 — running, diagnosing, improving

### 6.1 The first run

The **real** terminal output of the first run of the first suite, pasted unedited. Include the
`RUN  v…` line and the `Tests` summary line. A build message or the assistant saying "tests pass"
is not a run.

```text
Command: npx vitest run

RUN v2.1.9 C:/Users/user/se-practice/week-07/app

✓ src/booking.test.ts (17)
✓ canBook Function Tests (17)

Test Files  1 passed (1)
Tests       17 passed (17)
Duration    1.44s
```

**Each failure, diagnosed** (the deck's table: import/runner error · assertion mismatch · result
changing per run · no tests discovered). Write `none` in the first row if nothing failed.

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
| | | | | |

### 6.2 The improvement prompt

The deck's improvement prompt exactly as sent, followed by the actual output from 6.1. Then
paste the assistant's answer, unedited:

```text
Here is a rigorous review of the test suite against AC1–AC6 and the case table, identifying weaknesses, gaps, and precise improvements.

---

### 1. Review Findings

#### A. Weak Assertions & Boundary Overlap (T05)

* **Issue:** Case **T05** specifies `start=1380, end=1441`. In the implementation, `end > 1440` is checked in **AC1** *before* **AC2** (`end - start > 120`).
* **Defect:** T05 actually tests the AC1 daily boundary violation (`end > 1440`) rather than cleanly isolating the AC2 duration rule (`end - start > 120`), since $1441 > 1440$ short-circuits the function early.

#### B. Missing Boundaries

* **Issue:** **AC1** explicitly guards against negative start times (`start < 0`), but the current test suite has no test case verifying this boundary.
* **Defect:** A regression changing `start < 0` to `start <= 0` or removing it entirely would go undetected by the existing suite.

#### C. Duplicated or Redundant Logic Checks

* **Issue:** **T03** (`start=720, end=720`) and **T04** (`start=750, end=720`) both test invalid range/zero-duration conditions (`start >= end`). While having multiple invalid range variants is acceptable, T05's intended AC2 purpose is shadowed by AC1.

---

### 2. Proposed Changes & Defect Detections

| Proposed Change | Requirement / AC | Defect It Could Detect |
| --- | --- | --- |
| **Isolate AC2 Test Case** | AC2 (Max duration 120 min) | Adjusting T05 to valid day bounds (e.g., `start=1300, end=1421` duration 121 mins) ensures AC2 is genuinely tested instead of short-circuiting on AC1's `end > 1440`. |
| **Add Negative Start Test (`T15`)** | AC1 (Valid time range: `start < 0`) | Catches regressions where negative integers are mistakenly accepted as valid time indices. |
| **Strengthen Immutability Assertions** | AC5/AC6 (Unchanged booking data) | Ensures that internal operations (like sorting or mutating booking objects in place) do not corrupt the reference input array. |

---

### 3. Separated Fixes

#### A. Implementation Fixes (Source Code Correction)

* **Syntax/Truncation Correction:** In the provided `can_book` function source, ensure AC2 reads cleanly without line corruption:
```typescript
// Corrected implementation line for AC2
if (end - start > 120) {
  return false;
}

```



#### B. Test Repairs (`booking.test.ts`)

Update T05 to properly test AC2 within valid daily bounds and add the missing negative boundary test (`T15`):

```typescript
import { describe, it, expect } from 'vitest';
import { canBook, Booking } from './booking';

describe('canBook Function Tests', () => {
  const baseBookings: Booking[] = [{ start: 600, end: 660 }];

  it('T01: valid booking slot immediately after existing booking', () => {
    expect(canBook({ start: 660, end: 720, now: 540, blocked: false, bookings: baseBookings })).toBe(true);
  });

  it('T02: start time is in the past (start <= now)', () => {
    expect(canBook({ start: 540, end: 570, now: 540, blocked: false, bookings: baseBookings })).toBe(false);
  });

  it('T03: zero duration booking (start === end)', () => {
    expect(canBook({ start: 720, end: 720, now: 540, blocked: false, bookings: baseBookings })).toBe(false);
  });

  it('T04: negative duration (start > end)', () => {
    expect(canBook({ start: 750, end: 720, now: 540, blocked: false, bookings: baseBookings })).toBe(false);
  });

  it('T05 (Repaired): exceeds maximum duration of 120 minutes within valid daily range', () => {
    // start=1300, end=1421 duration is 121 mins (valid range <= 1440, but invalid duration > 120)
    expect(canBook({ start: 1300, end: 1421, now: 540, blocked: false, bookings: baseBookings })).toBe(false);
  });

  it('T06: valid booking with maximum allowed duration (120 minutes)', () => {
    expect(canBook({ start: 720, end: 840, now: 540, blocked: false, bookings: baseBookings })).toBe(true);
  });

  it('T07: duration exceeds 120 minutes by 1 minute', () => {
    expect(canBook({ start: 720, end: 841, now: 540, blocked: false, bookings: baseBookings })).toBe(false);
  });

  it('T08: valid booking slot immediately before existing booking', () => {
    expect(canBook({ start: 570, end: 600, now: 540, blocked: false, bookings: baseBookings })).toBe(true);
  });

  it('T09: partial overlap with existing booking', () => {
    expect(canBook({ start: 630, end: 690, now: 540, blocked: false, bookings: baseBookings })).toBe(false);
  });

  it('T10: completely encapsulates existing booking', () => {
    expect(canBook({ start: 570, end: 690, now: 540, blocked: false, bookings: baseBookings })).toBe(false);
  });

  it('T11: completely contained within existing booking', () => {
    expect(canBook({ start: 615, end: 645, now: 540, blocked: false, bookings: baseBookings })).toBe(false);
  });

  it('T12: exact duplicate of existing booking', () => {
    expect(canBook({ start: 600, end: 660, now: 540, blocked: false, bookings: baseBookings })).toBe(false);
  });

  it('T13: room is blocked', () => {
    expect(canBook({ start: 630, end: 690, now: 540, blocked: true, bookings: baseBookings })).toBe(false);
  });

  it('T14: valid booking when bookings list is empty', () => {
    expect(canBook({ start: 630, end: 690, now: 540, blocked: false, bookings: [] })).toBe(true);
  });

  it('T15 (New Boundary): negative start time is rejected', () => {
    expect(canBook({ start: -10, end: 60, now: -20, blocked: false, bookings: [] })).toBe(false);
  });

  it('X1: valid minimal duration booking in the near future', () => {
    expect(canBook({ start: 541, end: 542, now: 540, blocked: false, bookings: baseBookings })).toBe(true);
  });

  it('X2: valid maximum-duration booking late in the day', () => {
    expect(canBook({ start: 1320, end: 1440, now: 540, blocked: false, bookings: baseBookings })).toBe(true);
  });

  it('Immutability check: ensures bookings array and elements are unchanged', () => {
    const bookings: Booking[] = [{ start: 600, end: 660 }];
    const originalSnapshot = JSON.stringify(bookings);

    canBook({ start: 660, end: 720, now: 540, blocked: false, bookings });

    expect(JSON.stringify(bookings)).toBe(originalSnapshot);
  });
});

```


### 6.3 The final run

The **real** output of the final suite (`booking.test.*` beside your module), after every
change and after restoring the correct code from section 7. Every test must pass. If a real defect
is still open, leave its test failing and explain it in 9.1.

```text
Command: npx vitest run

RUN v2.1.9 C:/Users/user/se-practice/week-07/app

✓ src/booking.test.ts (18)
✓ canBook Function Tests (18)

Test Files  1 passed (1)
Tests       18 passed (18)
Duration    1.36s
```

---

## 7. Task 6 — deliberate defects

You need a reviewed, passing suite first. Then introduce **one** defect at a time in your booking
module, leave the tests unchanged, run, record, and **restore** the code. A syntax or import
error does not count as detection.

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added |
| --- | --- | --- | --- | --- |
| M1 | Reject duration >= 120 instead of > 120 | Detected |T06, X2| N/A|
| M2 | Treat touching endpoints as an overlap | Detected | T01, T08 | N/A|
| M3 | Remove the blocked-room rejection | Detected  | T13 | N/A |

**The run of each mutant, pasted unedited.** Paste the `Tests` summary line and the failing test
names at least:

```text
PS C:\Users\user\se-practice\week-07\app> npx vitest run           

 RUN  v2.1.9 C:/Users/user/se-practice/week-07/app

 ❯ src/booking.test.ts (18)
   ❯ canBook Function Tests (18)
     × T01: valid booking immediately after existing booking
     ✓ T02: start time equals now
     ✓ T03: zero duration
     ✓ T04: start is later than end
     ✓ T05: end exceeds 1440
     ✓ T06: exactly 120 minutes is allowed
     ✓ T07: 121 minutes is rejected
     × T08: booking immediately before existing booking
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

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
 FAIL  src/booking.test.ts > canBook Function Tests > T01: valid booking immediately after existing booking
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:12:9
     10|       start: 660, end: 720, now: 540,
     11|       blocked: false, bookings: baseBookings,
     12|     })).toBe(true);
       |         ^
     13|   });
     14| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯
 FAIL  src/booking.test.ts > canBook Function Tests > T08: bookingimmediately before existing booking
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:61:9
     59|       start: 570, end: 600, now: 540,
     60|       blocked: false, bookings: baseBookings,
     61|     })).toBe(true);
       |         ^
     62|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯
 Test Files  1 failed (1)
      Tests  2 failed | 16 passed (18)
   Start at  22:48:34
   Duration  1.36s (transform 133ms, setup 0ms, collect 131ms, tests 12ms, environment 0ms, prepare 209ms)

```

All three changes reverted, and the full suite run again (section 6.3): yes 

---

## 8. Task 7 — manual UI checks

Use `now = 09:00` and an existing `10:00–11:00` booking. Do them in the page in a browser. Save a
screenshot of each as `evidence/ui-1.png` … `evidence/ui-5.png`. Take **ui-4 at phone width**
(about 375 px, portrait).

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00–12:00, unblocked | Available, with the fixed sample booking | AC5 | No known failing checks remain in the test suite.| Pass |
| U2 | Enable blocked, then check again | Unavailable replaces the earlier result | AC3, AC5 | No known failing checks remain in the test suite.| Pass |
| U3 | Clear a required input and submit | Understandable validation feedback | AC6 | No known failing checks remain in the test suite| Pass  |
| U4 | Use a narrow (phone) width | Controls and result remain usable | AC6 | No known failing checks remain in the  test suite| Pass  |
| U5 | Repeat the checks on the same data | Existing bookings remain unchanged | AC5 | No known failing checks remain in the test suite| Pass  |

---

## 9. Comparison and what still fails

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none |No known failing checks remain in the final test suite.|

### 9.2 Original and improved suites

| Measure | First suite | Improved suite |
| --- | --- | --- |
| Executed / passed / failed | 17 / 17 / 0| 18 / 18 / 0|
| Requirements with meaningful tests (AC IDs and gaps) | AC1, AC2, AC4, AC5. AC3 test was weak because the blocked case also overlapped an existing booking. AC6 was not covered by unit tests.| AC1, AC2, AC3, AC4, AC5. AC6 still requires manual UI checks.|
| Selected mutants detected | M1, M2; M3 was not reliably tested because T13 also overlapped an existing booking.| M1, M2, M3|
| Accepted / revised / rejected tests | Initial AI-generated tests were reviewed.| T13 was revised to isolate AC3; T15 was added for a negative start time; AC5 immutability assertion was strengthened.|
| Remaining limitations | No negative-start boundary test; weak AC3 test; no UI validation.| AC6 depends on manual UI checks. Invalid existing booking behaviour is not specified by the ACs.|

### 9.3 What no AC decides

Call your function with `bookings = [{ start: 700, end: 650 }]` (a reversed existing booking)
and a request of 660–720. What does it return? Does any AC say what it should return? (This is
the value you declare in `submission.yml` under `assumptions.invalid_existing_booking`.)

-
The function returns `true` for the requested booking from 660 to 720 when the existing booking is `{ start: 700, end: 650 }`. The overlap condition does not detect an intersection because the existing booking has a reversed time range. None of the acceptance criteria specifies how invalid existing bookings should be handled. Therefore, this behaviour is an assumption rather than a defined requirement.
---

## 10. Conclusion (120–180 words)

<!-- Answer all three in your own words, without the assistant:
     (a) Which mistake in the FIRST suite would have let a wrong canBook pass, and how did you find it?
     (b) What does your final green run prove, and what does it NOT prove? Use a mutant or a UI check.
     (c) One testing limitation that remains.
     Worthless: "The AI wrote good tests and they all passed."
     Worth everything: "The first suite expected T06 (exactly 120 minutes) to be rejected. That
     contradicts AC2, and it failed on a correct canBook. If I had changed the code to make it
     pass, M1 would have become the real behaviour." -->

<!-- Write your conclusion below this line -->
In this lab, I learned that a passing test suite does not always mean that the tests are complete. One weakness in my first suite was the missing negative start-time test. A wrong implementation could accept a booking with a negative start time and still pass all 17 tests. I found this gap by comparing the test cases with AC1 and checking which boundary conditions were not covered. I added T15 to detect this mistake.

The final green run proves that all 18 tests pass with my current implementation. It also does not prove that the implementation is free of every possible defect. My mutation tests provided stronger evidence: the suite detected three introduced mistakes, including incorrect duration handling and missing blocked-room validation. The manual UI checks also covered only five selected scenarios.

One limitation remains: the tests use fixed input data and do not cover every possible combination of bookings or real-world usage conditions.