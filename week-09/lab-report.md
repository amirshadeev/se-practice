# Week 09 — Lab Report: canBook as a Tool

Fill in every section. Do not delete or renumber the headings: the README and the checker point at
them. Replace every `<!-- comment -->` with your own text (comments are ignored by the checker).

**Name:**Amir Shadeyev
**Student ID:**24B030322
**GitHub:**amirshadeev

---

## 1. Setup

| | |
| --- | --- |
| Assistant (frozen for the whole lab) | Gemini|
| Exact model (or "not displayed") | not displayed|
| Three fresh chats for R1, R2, R3? (yes / no) | yes|
| Python version (`python --version`) |Python 3.10.0 |

## 2. Your tool definition — a reason for every constraint

Paste your final `tool/check_room.json`, then fill the table: one row per constraint you wrote.

```json

{
  "name": "check_room",
  "description": "Checks whether a room can be booked for a requested time interval. All times must be whole minutes since midnight, in the range 0 to 1440, where 1440 means midnight at the end of the day. The tool checks the room status and existing bookings, but does not save, create, or modify any booking.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "start": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440
      },
      "end": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440
      },
      "now": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440
      },
      "blocked": {
        "type": "boolean"
      },
      "bookings": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "start": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440
            },
            "end": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440
            }
          },
          "required": [
            "start",
            "end"
          ],
          "additionalProperties": false
        }
      }
    },
    "required": [
      "start",
      "end",
      "now",
      "blocked",
      "bookings"
    ],
    "additionalProperties": false
  }
}

```

| Field | Constraint (e.g. `"type": "integer"`, `"maximum": 1440`) | What goes wrong without it |
| --- | --- | --- |
| start, end, now| integer| Prevents times from being passed as strings or decimal values.|
| start, end, now| minimum: 0 | Prevents negative minutes. |
| start, end, now| maximum: 1440 | Prevents times beyond the end of the day.|
|blocked | boolean| Ensures room status is true or false.|
| bookings| array | Ensures existing bookings are provided as a list. |
| bookings items | object| Ensures each booking is represented as an object.|
| booking start, end|  integer, minimum: 0, maximum: 1440| Keeps booking times within the valid daily range. | 

## 3. The twelve calls — first run and final run

Your **first** run's S verdicts (before any fix), and your final ones. For every case that changed,
say what you changed.

| Case | First run | Final run | What you changed |
| --- | --- | --- | --- |
| S01 | PASS | PASS | No change needed. |
| S02 | PASS | PASS | No change needed. |
| S03 | FAIL | PASS | Added required properties and types.|
| S04 | FAIL | PASS | Added integer and range constraints. |
| S05 | FAIL | PASS | Added booking item structure.|
| S06 | FAIL | PASS | Added required booking fields.|
| S07 | FAIL | PASS | Added required top-level fields.|
| S08 | FAIL | PASS | Added additionalProperties restriction. |
| S09 | FAIL | PASS | Added booking time constraints.|
| S10 | FAIL | PASS | Completed the input schema.|
| S11 | PASS | PASS | No change needed. |
| S12 | FAIL | PASS | Completed the schema definition. |

## 4. Function calling — what the model wrote

For each request, paste the model's reply exactly, then judge it against the request.

### R1

```text
{"name": "check_room", "arguments": {"start": 600, "end": 660, "now": 540, "blocked": false, "bookings": [{"start": 660, "end": 720}]}}
```

<!-- Match? If F3 failed, which argument differs, and who was wrong: the model or the request? -->
R1: Match. All arguments are correct. The existing booking starts exactly when the requested interval ends, so there is no overlap.
### R2

```text
{"name": "check_room", "arguments": {"start": 840, "end": 990, "now": 810, "blocked": true, "bookings": []}}
```

<!-- Same. R2 is a call that SHOULD be made, although canBook will say Unavailable. Did the model refuse to call? -->
R2: Match. All arguments are correct. The tool should be called even though the room is blocked and the requested duration exceeds 120 minutes.
### R3

```text
Do you have specific start and end times in mind for tomorrow afternoon?
```

<!-- What information was missing? Did the model ask, or call? If it called, which values did it invent, and from where? -->
R3: The model asked for clarification instead of inventing values. Exact start and end times were missing. Other required information, including current time, blocked status and existing bookings, was also not provided.
## 5. What the schema cannot check

<!-- Name the acceptance criteria (AC1-AC6, README section 3) that a JSON Schema with the allowed keywords cannot
     enforce, and say why for each. At least two, by their AC number. Which part of AC1 CAN the schema enforce? -->
AC1: JSON Schema can enforce that start, end and now are integers between 0 and 1440. However, it cannot enforce that start is less than end or that start is later than now.

AC2: Schema cannot check that the requested duration (end - start) is no more than 120 minutes because this requires comparing two fields.

AC3: Schema can check that blocked is a boolean, but it cannot reject a booking when blocked is true. This requires application logic.

AC4: Schema cannot compare the requested interval with every existing booking to detect overlaps. It also cannot implement the rule that touching intervals are allowed.

AC5: Schema validates input structure but cannot guarantee that the tool does not save, create or modify bookings. This must be ensured by the function implementation.

AC6: Schema cannot display feedback to the user. The application must show whether the room is available or unavailable.
## 6. Permissions — allow, ask or block

| # | Action | Decision (allow / ask / block) | Reason (the risk, in one sentence or more) |
| --- | --- | --- | --- |
| A1 | call `check_room` with the times the user just typed | allow| The user explicitly provided these times and requested an availability check. |
| A2 | read `week-08/app/src/booking.ts` | allow| Reading project source code is safe and helps understand the existing implementation. |
| A3 | edit `booking.ts` to raise the 120-minute limit to 180 | ask | This changes an explicit project requirement and needs the user's approval. |
| A4 | run `npm test` in `week-08/app` | allow| Running the project's tests is a normal verification step and does not intentionally modify source files. |
| A5 | run `git reset --hard` to undo its own last three edits | ask| This command can permanently discard uncommitted tracked changes, so the exact target and changes must be confirmed. |
| A6 | `git commit` its change on the `week-09` branch | ask| A commit changes repository history, so the user should review and approve the staged changes first.|
| A7 | `git push` to `main` | block| Directly pushing to main bypasses the required pull request review process.|
| A8 | send the contents of `.env` to an MCP server it found online | block| The file may contain secrets and sending them to an unknown server risks exposing credentials.|

## 7. Checkpoint

<!-- The commit you would make before letting such an agent edit anything: its real SHA (git log --oneline),
     the exact command that returns you to it, and what that command would throw away. -->
Checkpoint commit: a45ea42

Exact command to return to this checkpoint:
git reset --hard a45ea42

This command discards all tracked changes made after this checkpoint and moves HEAD back to this commit. It can permanently remove uncommitted changes and later commits. Untracked files are not automatically deleted.
## 8. Checker output

Paste the **whole** output of your last `python tests/check_tool.py`, unedited.

```text
PASS  D1    tool/check_room.json exists and is valid JSON
PASS  D2    has name, description and inputSchema
PASS  D3    name is exactly "check_room"
PASS  D4    description: 25+ words, says minutes, 1440, and that it does not save
PASS  D5    inputSchema: an object with exactly the five fields, all required
PASS  D6    inputSchema uses only the keywords listed in README section 5
PASS  S01   the R1 call, valid -> accept
PASS  S02   no existing bookings: bookings = [] -> accept
PASS  S03   end as a string: "11:00" -> refuse
PASS  S04   now missing -> refuse
PASS  S05   an extra field: "room": "204" -> refuse
PASS  S06   start below the day: -30 -> refuse
PASS  S07   end beyond the day: 1500 -> refuse
PASS  S08   a booking with no end: {start: 660} -> refuse
PASS  S09   blocked as a string: "false" -> refuse
PASS  S10   start not a whole minute: 600.5 -> refuse
PASS  S11   end at the end of the day: 1440 -> accept
PASS  S12   a booking as a pair: [660, 720] -> refuse
PASS  F1    calls\r1.json: a call to check_room
PASS  F2    calls\r1.json: arguments valid against your schema
PASS  F3    calls\r1.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F4    calls\r2.json: a call to check_room
PASS  F5    calls\r2.json: arguments valid against your schema
PASS  F6    calls\r2.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F7    calls/r3: exactly one of r3.json (it called) or r3.txt(it asked), not empty
PASS  L1    section 5 names at least two acceptance criteria (AC1-AC6) the schema cannot check
PASS  L2    section 6: A1-A8 each have allow / ask / block and a reason of 5+ words
PASS  L3    section 7 names the checkpoint commit (a SHA)
PASS  L4    section 10: a conclusion of 80-150 words
PASS  L5    AI_USAGE.md filled in (a tool row, and signed)

SUMMARY: 30 PASS · 0 FAIL · 0 ERROR  (of 30 checks)
Paste this whole output into lab-report.md section 8, and these three numbers into submission.yml.
```

## 9. What still fails

<!-- Every check in submission.yml known_fails, with the reason. "None" if all 30 pass. -->
None
## 10. Conclusion (80–150 words)

<!-- What did you learn about the line between the schema, the model and the function? Be specific:
     name a case, a request or an action. "Tool definitions are important" is worth nothing. -->
This lab showed me the difference between a tool schema, a language model and the actual function. The schema checks the structure and types of arguments. For example, S03 rejects a string instead of an integer, and S11 accepts 1440 as a valid end time. However, the schema cannot check whether start is earlier than end or whether two bookings overlap. The model converts natural language into tool arguments. In R1 and R2, Gemini correctly converted times into minutes. In R3, it asked for clarification instead of inventing missing values. Finally, the function must apply business rules such as the 120-minute limit, blocked status and booking conflicts. These are separate responsibilities.