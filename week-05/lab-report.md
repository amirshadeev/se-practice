# Week 05 — Lab report

**Name:** Amir Shadeyev 
**Group:** Monday 16:00-19:00
**Date:** 07.10.2026

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the
grader find your answers by them. Add rows to any table; never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant (tool) | Gemini |
| **Exact** model name | Gemini 3.6 Flash |
| Language and version | Python 3.10 |
| Path | A |
| My Week 04 declaration for touching bookings | allowed / not-allowed / did not submit |

<!-- If your Week 04 model said touching bookings are NOT allowed: AC4 now says they are.
     One sentence here on what that changes in your Week 04 diagrams. This is a finding, not a penalty. -->

---

## 2. Task 1 — the plan

**The assistant's plan, pasted unedited:**

```text
Check whether the room is blocked (AC3). If blocked is True, return False immediately.

Validate the requested time interval and future-start rule (AC1): 0 <= start < end <= 1440 and start > now. If any condition fails, return False.

Check the maximum duration (AC2): end - start <= 120. If the duration is greater than 120 minutes, return False.

Check for overlap with every existing booking (AC4). Using half-open intervals [start, end), an overlap exists when start < e and s < end. If any overlap exists, return False.

If all checks pass, return True (AC5).
```

**What the plan invented or changed.** One row for every rule in the plan that is not in the contract or in AC1–AC5, or that says something different from them. If you found none, write one row saying which lines of the plan you checked against which AC.

| # | What the plan said | What the contract or the AC says | What I did |
| --- | --- | --- | --- |
| 1 | Existing bookings are treated as an iterable of valid booking tuples. | The contract says existing contains valid (start,end) tuples for active bookings. | Kept this assumption because it matches the contract. |
| 2 | The plan assumes non-integer start/end behavior is not handled. | The contract specifies integer times but does not define behavior for non-integer inputs. | Kept this as not-handled and did not add out-of-contract tests. |

**Boundary cases the assistant suggested that I kept as tests:**

- start == now
- zero-length interval (start == end)
- reversed interval (start > end)
- end == 1440
- end > 1440
- negative start
- exact 120-minute duration
- duration greater than 120 minutes
- touching an existing booking at the end
- touching an existing booking at the start
- partial overlap
- request containing an existing booking
- existing booking contained inside the request
- multiple existing bookings
- empty existing
- unchanged existing

---
## 3. Task 2 — the first version (v1), read before it was run

v1 is saved as `code/original/booking_v1.<ext>`, exactly as the assistant returned it: yes

**AC map.** One row per condition in v1. Quote the line.

| # | Line in v1 | AC it implements | Correct as written? If not, why |
| --- | --- | --- | --- |
| 1 | if blocked: | AC3 | Yes. A blocked room cannot be booked.|
| 2 | if not (0 <= start < end <= 1440 and start > now): | AC1 | Yes. It enforces valid start/end bounds, ordering, and a start strictly after now .|
| 3 | if (end - start) > 120: | AC2 | Yes. It rejects durations greater than 120 minutes and allows exactly 120 minutes. |
| 4 | if start < e and s < end: | AC4 | Yes. It rejects every overlapping half-open interval and allows touching endpoints. |
| 5 | return True | AC5 | Yes. It returns True only after AC1–AC4 have passed. |

**Anything in v1 that no AC asks for** (extra validation, a buffer between bookings, logging,
saving the booking, a different return type):

None. The v1 implementation stays within AC1–AC5 and does not add extra booking behavior.

---

## 4. Task 3 — my tests

Base input for every row unless the row says otherwise: `now=540, blocked=False, existing=[(600, 660)]`.

| # | Test name | Request (start, end) | What differs from the base input | Expected | AC | Result on v1 | Result on final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | test_touching_end_is_allowed | (660, 720) | None| True | AC4 | True| true|
| 2 | test_overlap_is_rejected | (630, 690) | None | False| AC4 | False| false|
| 3 | test_blocked_room_is_rejected| (660, 720) | blocked=True| false | AC3 | false| false |
| 4 | test_exactly_two_hours_is_allowed| (720, 840) | None | True| AC2 | true|true |
| 5 | test_over_two_hours_is_rejected| (720, 841)| none | false| AC2| false |false |
| 6 | test_starting_now_is_rejected| (540, 570)|none |false | AC1 | false | flase |
| 7 | test_zero_length_is_rejected| (600, 600)| existing=[] |false | AC1 |false |false |
| 8 | test_reversed_time_is_rejected| (700, 600)| existing=[] |False| AC1 |false |false | 
| 9 | test_end_at_1440_is_allowed | (1320, 1440)| now=1200, existing=[] | true | AC1| true| true|
| 10 | test_empty_existing_allows_free_slot| (600, 720)| existing=[] | true | AC4 |True |true |
| 11 | test_input_existing_is_unchanged | (840, 900)| existing=[(600,660),(720,780)] True; existing unchanged| AC5| true | true |
|12 |test_negative_start_is_rejected|(-1, 100)| `now=0, existing=[]`| False |AC1 | False|False|
|13|`test_end_after_1440_is_rejected`|(1320,1441)| `now=1200, existing=[]`| False | AC1 | False| False|
| 14 | `test_partial_overlap_at_end_is_rejected`| (650, 700) | None| False| AC4 | False | False|
| 15 |`test_partial_overlap_at_start_is_rejected`| (550, 610) | None  | False| AC4 | False|
| 16 |`test_request_contains_existing_booking_is_rejected` | (570, 690)| None| False | AC4 | False | False |
| 17 | `test_second_existing_booking_is_checked`| (720, 750)| existing=[(600,660),(700,740)]| False| AC4 | False| False |
| 18 | `test_touching_start_is_allowed`| (540, 600)| `now=500`| True | AC4 | True | True            |
| 19 | `test_result_is_boolean`| (660, 720) | None| True and type is bool | AC5 | True| True|
---

## 5. Task 4 — debugging with evidence

One row per defect you found — in v1, in a later version, or in your own tests. If v1 passed
everything, the row is the **new edge case you added**, with expected and actual equal, and the
cause column says why no change was needed.

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | can_book(720, 840, 540, False, [(600, 660)]) | true | true | No defect was found. The v1 line if (end - start) > 120: correctly allows the exact 120-minute boundary.| No code change was needed. The boundary case was retained as a test.| No fix needed; boundary case proposed by the assistant.|

**The debug prompt I sent, and the assistant's answer** (leave the block empty if you did not use it):


Review this implementation of can_book against the contract and AC1-AC5 only. List at most five concrete issues. For each one, quote the line and name the acceptance criterion or contract line it concerns. Do not rewrite the function.
Assistant answer: 1. AC1 / Contract Line: now is valid 0–1439 Quote: if not (0 <= start < end <= 1440 and start > now): Issue: The check does not validate that now satisfies 0 <= now <= 1439. If an invalid value for now (e.g., now = -10 or now = 2000) is provided alongside a valid start time, the function can evaluate to True instead of False. 2. AC4 / Contract Line: existing contains valid (start, end) tuples Quote: for s, e in existing: Issue: The check assumes existing booking intervals are valid (s < e). If existing contains a reversed or zero-length interval where s >= e, start < e and s < end can evaluate to False (reporting no overlap) even when the requested booking overlaps with s.
---

## 6. Task 5 — the critique

**The assistant's critique, pasted unedited:**

```text
1. AC1 / Contract Line: `now is valid 0–1439`

   - Quote: `if not (0 <= start < end <= 1440 and start > now):`

   - Issue: The check does not validate that `now` satisfies 0 <= now <= 1439. If an invalid value for `now` (e.g., `now = -10` or `now = 2000`) is provided alongside a valid `start` time, the function can evaluate to `True` instead of `False`.

2. AC4 / Contract Line: `existing contains valid (start, end) tuples`

   - Quote: `for s, e in existing:`

   - Issue: The check assumes existing booking intervals are valid (s < e). If `existing` contains a reversed or zero-length interval where `s >= e`, `start < e and s < end` can evaluate to `False` (reporting no overlap) even when the requested booking overlaps with `s`.
```

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | Validate that `now` is between 0 and 1439. | reject | The contract explicitly states that `now` is valid 0–1439. Therefore invalid `now` values are outside the input contract and are not required by AC1. | No change; 19 tests, OK |
| 2 | Validate that every existing booking has `s < e`. | reject | The contract states that `existing` contains valid `(start,end)` tuples. Handling invalid existing bookings is outside the stated contract and AC4. | No change; 19 tests, OK |

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | code/test_booking.py: expanded from the starter touching-end test to 19 tests.| To cover the required table cases and additional boundary, overlap, duration, Boolean-result, and input-immutability cases.| python -m unittest -v: 19 tests, OK|
|2 | code/booking.py: no change from v1. | The assistant's v1 implementation already satisfied the contract and AC1–AC5.|Checker F1–F10: all PASS; O1: PASS|
---

## 8. Evidence — real output

### 8.1 My suite, final run

Paste the **complete** terminal output. For Python: everything `python -m unittest -v` printed.


```text
test_blocked_room_is_rejected (test_booking.BookingTests) ... ok
test_empty_existing_allows_free_slot (test_booking.BookingTests) ... ok
test_end_after_1440_is_rejected (test_booking.BookingTests) ... ok
test_end_at_1440_is_allowed (test_booking.BookingTests) ... ok
test_exactly_two_hours_is_allowed (test_booking.BookingTests) ... ok
test_input_existing_is_unchanged (test_booking.BookingTests) ... oktest_negative_start_is_rejected (test_booking.BookingTests) ... ok
test_over_two_hours_is_rejected (test_booking.BookingTests) ... ok
test_overlap_is_rejected (test_booking.BookingTests) ... ok
test_partial_overlap_at_end_is_rejected (test_booking.BookingTests) ... ok
test_partial_overlap_at_start_is_rejected (test_booking.BookingTests) ... ok
test_request_contains_existing_booking_is_rejected (test_booking.BookingTests) ... ok
test_result_is_boolean (test_booking.BookingTests) ... ok
test_reversed_time_is_rejected (test_booking.BookingTests) ... ok
test_second_existing_booking_is_checked (test_booking.BookingTests) ... ok
test_starting_now_is_rejected (test_booking.BookingTests) ... ok
test_touching_end_is_allowed (test_booking.BookingTests) ... ok
test_touching_start_is_allowed (test_booking.BookingTests) ... ok
test_zero_length_is_rejected (test_booking.BookingTests) ... ok

----------------------------------------------------------------------
Ran 19 tests in 0.004s

OK
```



### 8.2 The checker, final run

Paste the **complete** output of `python tests/check_booking.py`. Paste it **last**: if you edit
this file afterwards, run the checker again and paste again.

```text
(paste here)
```

### 8.3 Path B only — three faults I planted myself

Break your own function on purpose, one line at a time, run your suite, restore the line.

| # | Line I changed (before → after) | AC it breaks | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

The three failing runs (Path A students leave this block empty):

```text
```

---
## 9. What still fails, and what the contract does not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| M2 | The mutation is not caught by the contract-valid test suite because the corresponding AC1 boundary is redundant with `start > now` when `now` is guaranteed to be 0–1439. No contract-valid input can make `start < 0` the only reason for rejection. |
| M10 | The checker reports that this AC5 mutation is not caught by the current contract-valid tests. I did not add an out-of-contract test or change the implementation only to target the hidden mutation. |

### 9.2 Outside the contract

The contract says times are integers. It does not say what `can_book` does when one is not — `600.5`, or the string `"600"`. What does your function do, and why is that the right call?

Non-integer behavior is `not-handled`. The contract defines `start`, `end`, and `now` as integer minutes, so non-integer inputs are outside the specified input domain. The function may accept some numeric values such as `600.5`, but no behavior for such inputs is promised. A string such as `"600"` causes a type error during the comparisons. I did not add special handling because that would extend the contract beyond AC1–AC5.

### 9.3 A bound that never decides

One of the bounds written in AC1 can never be the only reason a request is rejected. Which one, and why?

The lower bound `start >= 0` can never be the only reason for rejection. The contract guarantees `now >= 0`, and AC1 also requires `start > now`. Therefore, if `start < 0`, `start > now` is already false. This means the lower bound on `start` is redundant as an independent rejection reason under the stated contract.

## 10. Conclusion (120–180 words)

<!-- Answer all three, in your own words, without the assistant:
     (a) Explain the overlap condition in your final code — why those two comparisons, and why
         they let touching bookings through.
     (b) Which fault did your tests miss the longest, and what did the missing test have in common
         with the ones you already had?
     (c) What did you have to decide that neither the contract nor the assistant decided for you?
     Worthless: "the AI made a mistake and I fixed it."
     Worth everything: "F7 failed on can_book(570, 600, ...): v1 compared with <= on the start
     side, so a booking that ends exactly when another begins was rejected." -->

<!-- Write your conclusion below this line -->
The final code checks overlap using start < e and s < end. These two comparisons test whether the requested interval starts before the existing booking ends and the existing booking starts before the requested interval ends. If both are true, the intervals overlap. Strict < comparisons are important because the bookings use half-open intervals [start, end). Therefore, if one booking ends exactly when another starts, such as [600, 660) and [660, 720), neither comparison treats them as overlapping, so the new booking is allowed.

The fault my tests missed longest was M2. The missing case was not a normal contract-valid case: the lower bound start >= 0 cannot be the only rejection reason because now is guaranteed to be non-negative and AC1 also requires start > now. My tests already covered the meaningful valid boundaries and invalid time ordering.

The main decision not explicitly defined by the contract was the behavior for non-integer times. I chose not-handled because the contract defines times as integers and does not require validation or special handling for other types.