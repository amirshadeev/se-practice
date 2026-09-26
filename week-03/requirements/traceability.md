# Traceability — use cases → stories → criteria

One row per use case. All six rows stay, even the ones with nothing behind them: an empty cell is a
finding you report, not a failure you hide. Use real IDs, comma-separated; write `none` where there
is nothing.

| Use case | Stories (US-nn) | Criteria (AC-nn) | Gap? |
| --- | --- | --- | --- |
| UC-01 View availability | US-01 | none | Yes — no acceptance criteria selected for this use case. |
| UC-02 Book room | US-02 | AC-01, AC-02, AC-03 | No |
| UC-03 Cancel booking | US-03 | AC-04, AC-05, AC-06 | No |
| UC-04 Block or unblock room | US-04, US-05 | AC-07, AC-08, AC-09 | No |
| UC-05 Review usage | US-06 | none | Yes — no acceptance criteria selected for this use case. |
| UC-06 Send confirmation | US-07 | none | Yes — no direct acceptance criteria selected for this use case. |

**Stories that belong to no use case:** None

**What the gaps tell you:** All six use cases have at least one supporting user story. However, the selected acceptance criteria directly cover UC-02, UC-03, and UC-04, leaving UC-01, UC-05, and UC-06 without direct acceptance-criteria coverage.
