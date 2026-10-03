# Week 04 — Lab report: Modeling the System with UML

> The single worksheet for this lab. Fill in every section. **Do not delete, rename or renumber
> the headings** — the checker and the grader find your work by them. Replace every `<...>`
> placeholder; a row that still contains `<...>` counts as empty.

---

## 1. Setup

| Field | Value |
| --- | --- |
| Name | Amir Shadeyev |
| Group | Monday 16:00-19:00 |
| AI assistant | Gemini |
| Exact model | Gemini 3.6 Flash |
| Renderer | VS Code PlantUML extension |
| Behaviour diagram | sequence |
| Stories used | my week-03 stories, revised |

---

## 2. Prompts as sent

Paste every prompt **exactly as you sent it**, in the order you sent it, one code block each. The
AI's first replies are saved as files in `models/original/` — do not paste them here.

### 2.1 Task 1 — use-case prompt

```text
Using the supplied scenario and approved stories, generate PlantUML for a use-case diagram. Include Student and Administrator outside a named system boundary. Model their goals, show justified associations, and list assumptions. Use include or extend only with a clear reason.
```

### 2.2 Task 2 — class prompt

```text
Create a UML domain class diagram in PlantUML for Smart Campus. Start with Student, Room, and Booking. Add attributes, appropriate operations, and association multiplicities. Add other classes only when requirements justify them. Explain each relationship and list assumptions. Avoid unjustified inheritance or composition.
```

### 2.3 Task 3 — behaviour prompt (3A sequence or 3B activity)

```text
Generate PlantUML for Book room. Use Student, BookingService, and BookingRepository lifelines. Validate the supplied rules, then attempt the reservation. Show a successful confirmation and an unavailable-room alternative using alt. Label messages and replies. Explain new design components and all assumptions.
```

### 2.4 Focused correction prompts (if you sent any)

```text
none
```

### 2.5 Critique prompt

```text
Compare my diagrams with the requirements. Identify missing rules, inconsistent names, and unjustified elements. Cite each issue and propose a specific correction.
```

---

## 3. Task 1 — use-case review

**Assumptions the AI listed:**

- The system boundary represents the Smart Campus System and contains the listed use cases.
- R1, R2, and R3 are treated as internal validation rules of the Book Room use case.
- A Student can cancel only a reservation they made.
- Booking and cancellation confirmations are represented by the Send Confirmation use case.
| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Book Room → Send Confirmation | The original include relationship had no `why:` comment. | R4 | Added a `why:` comment above the include relationship. |
| 2 | Cancel Booking → Send Confirmation | The original include relationship had no `why:` comment. | US-07 | Added a `why:` comment above the include relationship. |
| 3 | Book Room | The original diagram did not show R1-R4 near the booking use case. | R1-R4 | Added an R1-R4 note next to Book Room. |
---

## 4. Task 2 — class diagram review

### 4.1 Relationships, read both ways

| Association | Read left → right | Read right → left | Multiplicities |
| --- | --- | --- | --- |
| Student — Booking | One Student makes 0..* bookings | Each Booking belongs to exactly 1 Student | 1 / 0..* |
| Room — Booking | One Room has 0..* bookings | Each Booking belongs to exactly 1 Room | 1 / 0..* |
| Administrator — Room | One Administrator manages 0..* rooms | One Room may be managed by 0..* Administrators | 0..* / 0..* |

### 4.2 Constraints the multiplicities cannot show

- R1: The `Booking` note states that the start time must be in the future and the duration must be greater than 0 and at most 2 hours.
- R2: The `Booking` note states that active bookings for the same room cannot overlap.
- R3: The `Booking` note states that a blocked room cannot accept a new booking.

### 4.3 Assumptions

- A1: Two bookings that touch at the same time are allowed back-to-back; for example, 10:00–12:00 and 12:00–13:00 do not overlap.
- A2: Blocking a room prevents new bookings but does not automatically cancel existing active bookings.
- A3: Multiple Administrators may manage the same room.

### 4.4 Findings

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Booking — BookingStatus | The original used composition for BookingStatus even though status was already an attribute of Booking. | Avoid unjustified composition. | Removed BookingStatus and the composition relationship. |
| 2 | Confirmation | The original added Confirmation as a separate domain class without a requirement that it must be a persistent domain object. | R4 / US-07 | Removed Confirmation from the domain class diagram and kept confirmation as an action outcome. |
| 3 | Booking constraints | The original did not show the no-overlap rule directly on Booking. | R2 | Added a note on Booking containing R1-R3. |
---

## 5. Task 3 — behaviour diagram review

**Option chosen and why:** 3A sequence — it clearly shows the interaction between the Student, BookingService, and BookingRepository during the Book Room process.

**Design components added beyond the domain model:** 
- `BookingService` — validates booking rules, checks room availability, and coordinates the reservation process.
- `BookingRepository` — checks room status, finds active bookings, and saves a valid booking.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | R1 validation | The original diagram checked R1, but the end time used later was not explicitly calculated. | R1: Future start with duration greater than 0 and at most 2 hours. | Added `calculateEndTime(startTime, durationMinutes)` before checking availability. |
| 2 | Reservation attempt | The original diagram saved the booking after availability checks, but the successful reservation path was not explicitly separated from the unavailable path with simple guards. | R2 and R3: no overlapping active booking and blocked rooms cannot accept new bookings. | Added `alt created` and `else unavailable` branches. |
| 3 | Failed reservation | The original diagram returned an error for an unavailable room but did not explicitly show that no booking is saved in that branch. | R2 and R3. | The revised diagram places `saveBooking` only inside the `created` branch, so the unavailable branch returns a rejection without saving. |
---

## 6. AI critique

Run the critique prompt once, on all your revised diagrams together. At least **three** rows. A
critique is another claim to evaluate, not a verdict: reject what is wrong and say why.

| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |

| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1 | The class and sequence diagrams use different parameters for booking. | `Student.bookRoom()` / `BookingService.bookRoom()` | accept | The class diagram uses a `Room` object, while the sequence diagram uses `roomId`. The interfaces are inconsistent across the diagrams. |
| 2 | Availability checking is represented in different places. | `Room.checkAvailability()` / `BookingService` | accept | The class diagram gives Room a `checkAvailability()` operation, while the sequence diagram performs the R2/R3 checks through BookingService and BookingRepository. The design should use one consistent responsibility. |
| 3 | The Administrator–Room `0..* / 0..*` association is not directly required by the stories. | Administrator — Room | accept | US-04 and US-05 require administrators to block and unblock rooms, but they do not define ownership or management relationships between administrators and rooms. The multiplicity is therefore an assumption that should be documented or removed. |
| 4 | Booking needs an explicit `studentId` attribute to enforce cancellation ownership. | Booking | reject | US-03 already states that a Student can cancel only a reservation they made, and the Student–Booking association already represents this ownership. A duplicate `studentId` attribute is not required by the domain model. |
| 5 | Confirmation should be added to the class diagram for booking and cancellation. | Confirmation | reject | US-07 requires confirmation after booking or cancellation, but it does not require Confirmation to be a persistent domain class. The revised class diagram intentionally treats confirmation as an action outcome. |
| 6 | The sequence diagram is missing a cancellation confirmation flow. | Sequence diagram | reject | Task 3 specifically asks for the `Book room` behavior, not `Cancel Booking`. US-07 is already represented by the use-case relationship for cancellation confirmation. |
---

## 7. Consistency table

One row for each of **R1–R4**, then one row for **every use case in your revised use-case
diagram**, spelled exactly as in the diagram, with the story ID it traces to.

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | Book Room | Booking (`startTime`, `endTime`) | `validate R1`, `calculateEndTime()` |
| R2 | Book Room | Room, Booking, note on Booking | `findActiveBookings(roomId, startTime, endTime)` and `alt created / unavailable` |
| R3 | Book Room | Room (`isBlocked`), Booking | `isRoomBlocked(roomId)` and `alt created / unavailable` |
| R4 | Send Confirmation | Booking, Student | `bookingConfirmation(bookingRecord)` |
| US-01 | View Available Rooms | Student, Room, Booking | Not shown in the Book Room sequence; represented by the use case |
| US-02 | Book Room | Student, Room, Booking | `bookRoom(...)` → validation → `saveBooking(...)` |
| US-03 | Cancel Booking | Student, Booking | Not shown in the Book Room sequence; represented by the use case |
| US-04 | Block Room | Administrator, Room | Not shown in the Book Room sequence; represented by the use case |
| US-05 | Unblock Room | Administrator, Room | Not shown in the Book Room sequence; represented by the use case |
| US-06 | Review Room Usage | Administrator, Room, Booking | Not shown in the Book Room sequence; represented by the use case |
| US-07 | Send Confirmation | Student, Booking | `bookingConfirmation(bookingRecord)` for booking; cancellation confirmation is represented by the use-case diagram |
---

## 8. Change log

At least **three** rows, and at least one for each required diagram (use case, class, your
behaviour diagram). "Before" is what the AI produced; "After" is what you submitted.


| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | use case | Include relationships had no `why:` comments. | Added `why:` comments above the include relationships and added the R1-R4 note. | Required relationship justification and clearer rule visibility. |
| 2 | class | The original had Confirmation and BookingStatus composition. | Removed both unjustified elements and added the R1-R3 note to Booking. | Avoided unjustified domain elements and made constraints explicit. |
| 3 | sequence | The original did not explicitly calculate endTime and used nested alternatives. | Added calculateEndTime and used `alt created` / `else unavailable`. | Made the booking flow and failure path explicit. |
---

## 9. Checker output

Paste the complete output of `python tests/check_models.py`, then explain **every FAIL you are
keeping**. The same IDs go in `submission.yml` under `checker.kept_fails`. A FAIL you report and explain costs you nothing. One you hide costs the whole criterion.

```text
Week 04 structural check - shape only, never quality

UC1  PASS  Student and Administrator declared
UC2  PASS  named system boundary: "Smart Campus System"
UC3  PASS  all actors declared outside the boundary
UC4  PASS  all scenario goals present (7 use cases)
UC5  PASS  no actor is associated with a confirmation use case
UC6  PASS  actor responsibilities match the scenario
UC7  PASS  use cases are goals, not screens or components
UC8  PASS  every include / extend / generalization carries a ' why: comment (or there are none)
UC9  PASS  revised diagram differs from the AI's original
CL1  PASS  Student, Room and Booking present
CL2  PASS  Booking is associated with Student and with Room
CL3  PASS  every association has multiplicities at both ends
CL4  PASS  1 student / 1 room per booking, 0..* bookings per student and per room
CL5  PASS  every inheritance / composition / aggregation carries a' why: comment (or there are none)
CL6  PASS  only domain concepts in the class diagram
CL7  PASS  attributes needed by R1-R3 are present
CL8  PASS  a note states R2 (no overlapping active bookings)
SQ1  PASS  Student, BookingService and BookingRepository lifelinespresent
SQ2  PASS  alt block with a guard on every branch (2 branches)
SQ3  PASS  validation happens before creation
SQ4  PASS  nothing is saved on a failure branch
SQ5  PASS  every message is labelled
SQ6  PASS  R1 (time range) is visible - checked or stated as a precondition
SQ7  PASS  R3 (blocked room) is visible
FI1  PASS  the AI's original output is kept for every diagram
FI2  PASS  a rendered image for every diagram
LR1  PASS  §1 setup filled (tool and model recorded)
LR2  PASS  5 prompts pasted in §2
LR3  PASS  3 use-case findings in §3
LR4  PASS  §4 relationships read both ways, 3 assumption(s) declared
LR5  PASS  3 behaviour-diagram findings in §5
LR6  PASS  6 critique issues with a verdict
LR7  PASS  3 change-log rows covering all three diagrams
CS1  PASS  7 approved stories
CS2  PASS  §7 traces R1-R4 into the diagrams
CS3  PASS  every use case traces to an approved story
CS4  PASS  every lifeline is a domain class or an explained designcomponent

SUMMARY pass=37 fail=0 error=0
```

**FAILs I am keeping, and why:** none

---

## 10. Conclusion (120–180 words)

The class diagram required the most review. The AI originally added a `Confirmation` class and a composition between `Booking` and `BookingStatus`, although the requirements did not justify either as a separate domain structure. The composition was especially unnecessary because `status` was already an attribute of `Booking`. I removed these elements and added the R1-R3 constraints as a note on `Booking`.

The sequence diagram also contained a design issue: it used `endTime` in repository calls without explicitly showing how it was calculated. If this were implemented without review, the booking logic could receive an undefined or incorrectly calculated end time, affecting overlap validation. I added `calculateEndTime()` before the availability checks and made `saveBooking()` appear only in the successful `alt created` branch.

The AI critique identified inconsistent booking parameters and duplicated availability responsibility. These were useful findings because the class and sequence diagrams used different interfaces. However, it also claimed that `Confirmation` and `studentId` had to be added to the revised class diagram. I rejected those claims because the revised model already represented Student–Booking ownership through an association, and confirmation did not need to be a domain class.
