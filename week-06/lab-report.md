# Week 06 — Lab report

**Name:** Amir Shadeyev
**Group:** Monday 16:00-19:00
**Date:** 13-10-2026

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the
grader find your answers by them. Add rows to any table; never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Tool | Bolt.new |
| Exact model (as Bolt shows it, or `not displayed`) | Not displayed by Bolt.new |
| Bolt project link (or `not shared`, and why) | https://bolt.new/~/sb1-dij6ctok |
| Browser and version |  Google Chrome Версия: 155.0.8059.39 |
| If you could not use Bolt.new: the tool you used instead, and why | |

---

## 2. Task 1 — define before generating

**Two predictions, written BEFORE you send the first prompt.** Where do you expect v1 to go wrong?
Fill the first three columns now; fill the last one after Task 3.

| # | What I expect to go wrong | AC it concerns | Was I right? (after Task 3) |
| --- | --- | --- | --- |
| 1 | v1 may incorrectly reject a candidate booking from 11:00 to 12:00 because it touches the existing booking from 10:00 to 11:00. | AC4 | No. T1 returned Available, and T2 returned Unavailable as expected. Touching endpoints were handled correctly. |
| 2 | v1 may use the real system time instead of the supplied current time of 09:00, making the Starts now test unreliable. | AC1 | Not confirmed by the observed tests. T6 returned Unavailable with the correct explanation when current time was set to 09:00. |

**The initial prompt exactly as I sent it** — the deck's prompt with AC1–AC6 pasted in place of
`[paste AC1–AC6]`, nothing else changed:

```text
Build a small responsive Smart Campus Room Availability Checker. Requirements: AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time. AC2: Reject a booking longer than 120 minutes. AC3: Reject the request when the selected room is blocked. AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed. AC5: Show a clear Available / Unavailable decision without changing the existing booking data. AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback. Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.
```

---

## 3. Task 2 — prototype v1

v1 export saved in `original/` and screenshot saved as `evidence/v1.png` **before** any cleanup
prompt: yes 

**Bolt's list of the files/components it created, pasted unedited:**

```text
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
```

**What v1 does — one line per thing that works, or visibly does not:**

-

**Repair prompt** (only if the first build did not run — the deck allows one, then the result is
v1). Leave empty if you did not need it:

```text
Allows the user to select a room and set the candidate start and end times.
Shows Available when a candidate interval touches an existing booking endpoint.
Shows Unavailable when the candidate interval overlaps an existing booking.
Rejects requests for blocked rooms and explains the reason.
Accepts a duration of exactly 120 minutes and rejects 121 minutes.
Rejects a start time equal to the supplied current time.
Rejects reversed time intervals with a validation message.
Repeated availability checks return the same result without reloading the page.
The interface remained usable at approximately 375 px wide during testing.

```

---

## 4. Task 3 — the nine cases

Base for every case unless the row says otherwise: **current time 09:00**, room **not blocked**,
the room's **only booking 10:00–11:00**. The Expected column comes from AC1–AC6 — do not change it.
Write each result exactly as **Available**, **Unavailable** or **Not testable** (the page gives you
no way to set up the case). Save each final run as `evidence/final-T<n>.png`.

| # | Case | What you set up and request | Expected | AC | Result on v1 | Result on final | Final screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 11:00–12:00 | Available | AC4 | Available  | Available  | final-T1.png |
| T2 | Overlap | 10:30–11:30 | Unavailable | AC4 | Unavailable  | Unavailable | final-T2.png |
| T3 | Blocked | 11:00–12:00, room blocked | Unavailable | AC3 | Unavailable| Unavailable| final-T3.png |
| T4 | Exactly 2 hours | 12:00–14:00 | Available | AC2 | Available| Available | final-T4.png |
| T5 | Over 2 hours | 12:00–14:01 | Unavailable | AC2 |Unavailable| Unavailable| final-T5.png |
| T6 | Starts now | 09:00–09:30 (current time 09:00) | Unavailable | AC1 | Unavailable|Unavailable| final-T6.png |
| T7 | Reversed times | 12:00–11:00, and the page says why | Unavailable | AC1, AC6 | Unavailable |Unavailable | final-T7.png |
| T8 | Same check twice | T1, then T1 again without reloading | Available | AC5 | Available| Available | final-T8.png |
| T9 | Narrow screen | T1 at about 375 px wide | Available | AC6 | Available | Available| final-T9.png |

---

## 5. Issue log — cleanup targets

One row per issue you chose to act on (or deliberately not act on). At least **two**: one
functional and one usability or code-quality issue when you have them. If v1 passed every case,
log a justified cleanup that preserves behaviour. Save a screenshot of each as
`evidence/issue-<n>.png`.

| # | Issue | Evidence: steps → expected → observed | Priority | Decision |
| --- | --- | --- | --- | --- |
| 1 | Newton Lab had an extra booking in the v1 sample data. | Select Newton Lab → expected only a 10:00–11:00 booking for the required fixture → observed bookings at 10:00–11:00 and 17:00–18:00. See evidence/issue-1.png. | Medium | Fix|
| 2 | Unused Supabase dependency in the v1 package configuration. | Inspect package.json and search application source → expected no unused backend dependency because the app uses in-memory data → observed @supabase/supabase-js in dependencies with no source references. See evidence/issue-2.png. | Low | Fix |

---

## 6. Task 4 — cleanup with focused prompts

One issue per prompt. Paste every prompt **as sent** (every `[bracketed field]` and `AC#` filled
in) and Bolt's answer, unedited.

**Functional fix prompt, as sent, and Bolt's answer:**

```text
In the current prototype, selecting Newton Lab shows existing bookings from 10:00–11:00 and 17:00–18:00, but the required test fixture has only one existing booking from 10:00–11:00.Adjust the mock dataset to leave Newton Lab with a single reservation: 10:00–11:00.. Preserve all availability logic and the other acceptance criteria. Explain which file/component you changed and why.
```

**Cleanup prompt, as sent, and Bolt's answer:**
```text
Review the current prototype for an unnecessary dependency. Check whether `@supabase/supabase-js` is used anywhere in the application source. If it is unused, remove only that dependency from `package.json` and update the lockfile if one exists. Do not change the UI, sample data, or availability logic. Explain exactly what you changed.
```

```text
Let me check if `@supabase/supabase-js` is imported anywhere in the source code.

No references to Supabase anywhere in the source. I'll remove the dependency from `package.json` and update the lockfile.

Done. I searched all source files under `src/` for any reference to "supabase" and found none — the app uses in-memory sample data only, so `@supabase/supabase-js` was an unused dependency.

What I changed:
- `package.json` — Removed the `"@supabase/supabase-js": "^2.57.4"` line from the `dependencies` block.
- `package-lock.json` — Updated automatically by running `npm install`, which pruned the package from the lockfile.

No UI, sample data, or availability logic was touched, and the build still passes.
```

```text
626f6c742d63632d6167656e74I'll remove the single booking entry for the 17:00–18:00 Chemistry Seminar in Newton Lab.I changed **`src/lib/roomData.ts`** — I removed the `b6` booking entry (the "Chemistry Seminar" from 17:00–18:00) from the `initialBookings` array. This was the only booking tied to Newton Lab beyond the 10:00–11:00 "Physics Tutorial" slot, so Newton Lab now has exactly one existing booking as the test fixture requires. No availability logic or other sample data was touched.
```

Add further blocks for further prompts.

**Every change or suggestion Bolt made, judged.** Accepting is a decision; so is rejecting. Cite
the AC (or the scope) that justifies it.

| # | What Bolt changed or suggested | accept / reject | Reason — cite the AC or the scope | Retest: which cases, result |
| --- | --- | --- | --- | --- |
| 1 | Removed booking b6, the 17:00–18:00 Chemistry Seminar, from src/lib/roomData.ts. | accept | The required test fixture specifies only the 10:00–11:00 booking. This aligns the fictional sample data with the test setup without changing AC1–AC6 logic.| T1 and T2 retested successfully; all nine final tests passed. |
| 2 | Removed unused @supabase/supabase-js from package.json. | accept | The application uses in-memory sample data and must not add a backend or external API. Removing an unused dependency keeps the implementation within scope. | All nine final tests passed; the checker confirmed the final source stays in scope. |

**Additional functional prompt, as sent, and Bolt's answer:**

```text
In the current prototype, Newton Lab should have only one existing booking from 10:00–11:00. Make the smallest change that fixes this behavior. Preserve the other acceptance criteria. Explain which file/component you changed and why.
```

**Bolt's answer:**
```text
626f6c742d63632d6167656e74This is already fixed. Newton Lab (`r2`) has exactly one booking in the `initialBookings` array: `b3` "Physics Tutorial" from 10:00–11:00 (minutes 600–660). The second booking that previously existed (the 17:00–18:00 "Chemistry Seminar") was already removed in an earlier step.

No change is needed — the sample data in `src/lib/roomData.ts` already matches the required test fixture, and all availability logic and other acceptance criteria remain intact.
```
**Additional cleanup prompt, as sent, and Bolt's answer:**

```text
Suggest one small cleanup. Do not add features or redesign the whole application. Check whether `@supabase/supabase-js` is unused; if so, remove only that dependency from `package.json`. Do not change the UI, sample data, or availability logic. Explain exactly what you changed.
```

**Bolt's answer:**
```text
626f6c742d63632d6167656e74Let me verify the current state of both the package.json and source files.`@supabase/supabase-js` is not referenced anywhere in the source code, and it's already absent from `package.json` — it was removed in a prior step.

No change is needed. The dependency was already cleaned up earlier: it's gone from `package.json`, the lockfile was updated via `npm install`, and the build passes. The UI, sample data, and availability logic are all untouched.
```

---

## 7. Change log — v1 to final

Two to four concrete changes, each one retested.

| # | Issue | Decision | Change (file or component) | Result after retest |
| --- | --- | --- | --- | --- |
| 1 | Newton Lab contained an extra booking in the v1 fixture. | fix | Removed booking b6 from src/lib/roomData.ts. | T1 and T2 passed after the change; all nine final tests passed. |
| 2 | An unused Supabase dependency was present. | fix | Removed @supabase/supabase-js from prototype/package.json. | All nine final tests passed; final scope check passed. |

---

## 8. One generated component, in my own words

Pick one file or component Bolt generated that matters for AC1–AC5 — the one that decides
availability is the best choice. Name its path in backticks, then explain in your own words, without
the assistant, what it does and how it decides. 60 words or more.

**File:** `src/lib/availability.ts`

<!-- Write your explanation below this line -->
The file `src/lib/availability.ts` contains the main availability-checking function. It receives the candidate start and end times, the supplied current time, the selected room, and the existing bookings. It first checks whether the time interval is valid and starts after the supplied current time. It then rejects intervals longer than 120 minutes and requests for blocked rooms. Finally, it checks whether the candidate interval overlaps an existing booking. The overlap condition allows one booking to start exactly when another ends. The function returns Available only when no rejection reasons were found. Otherwise, it returns Unavailable with explanations. It reads the existing booking data but does not add or modify bookings.

---

## 9. What still fails, and what the criteria do not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | The final checker reports no FAIL or ERROR checks. |

### 9.2 The end of the day

AC1 allows `end ≤ 1440` — a booking may end at 24:00. Can a user of your final page ask for
23:00–24:00? How — and if not, why is that acceptable or not? (This is the value you declare in
`submission.yml` under `assumptions.end_of_day`.)

The availability logic allows an end time of 1440 minutes, which represents 24:00. However, the current time-picker interface does not let the user select 24:00 directly, so a request for 23:00–24:00 cannot be entered through the page. This is a limitation of the interface rather than the interval rule. The prototype should be improved if end-of-day bookings need to be supported through the UI.

-

### 9.3 Which "now"?

AC1 says "after the supplied current time". What did **v1** use as the current time, and what did
that mean for testing case T6?

-
In the copied v1 source, `CURRENT_TIME_DEFAULT` was set to 600 minutes, which represents 10:00. For test T6, I set the supplied current time to 09:00 in the page's current-time control. The interval 09:00–09:30 was rejected because its start was not after the supplied current time. Therefore, T6 tested the supplied time value, not the computer's actual clock.

---

## 10. Conclusion (120–180 words)

<!-- Answer all three, in your own words, without the assistant:
     (a) Which of your two predictions in section 2 was right, and what did v1 actually get wrong?
     (b) Which AI suggestion did you reject, or would have been wrong to accept, and why?
     (c) What is the difference between "the prototype looks finished" and "the prototype meets
         AC1-AC6" - shown with one case from section 4?
     Worthless: "Bolt made some mistakes and I fixed them."
     Worth everything: "T8 failed on v1: the Check button also added the booking to the list, so
     checking 11:00-12:00 a second time said Unavailable. AC5 says the check must not change the
     booking data." -->

<!-- Write your conclusion below this line -->
Both of my predictions were not confirmed by the v1 tests. I expected the touching interval in T1 might be rejected, but v1 correctly returned Available, while T2 correctly rejected an overlapping interval. I also suspected that the current-time check might use the real system clock, but T6 returned Unavailable when the supplied time was set to 09:00. The actual cleanup targets were different: Newton Lab had an extra 17:00–18:00 sample booking, and the project included an unused Supabase dependency. I accepted removing the extra booking because the required test fixture specifies only the 10:00–11:00 booking. I also accepted removing the unused dependency because the application uses in-memory data and must remain within scope. Adding a backend or authentication would have been wrong to accept. A prototype can look finished without meeting every acceptance criterion. For example, a polished mobile layout alone would not prove T9 passes; the narrow-screen test had to be run and captured separately. All nine final tests passed after cleanup.
