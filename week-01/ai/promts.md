mypromt:
Build a small program that processes a list of student marks and prints:
average, highest, lowest, and pass rate.

Rocket:

Agent detected prompt score : 65%
This is good enough score to proceed. However, a few answers to my questions will help enhance prompt completeness and generate more accurate results.

How will marks get into the app?

Skipped

my promt:
Review the app against the original requirements and improve its input validation and error handling. Do not change the correct behavior.

Rocket:
Fixed StudentTable Mark Input and Validation
What I did

Fixed StudentTable mark input: clearing or typing a non-numeric value now turns the field red and reverts on blur instead of silently storing 0 or NaN; blank student name fields are underlined in red as a visual cue
Improved BulkImportModal parser: invalid rows are no longer silently dropped — each skipped line is listed with its line number and a specific reason (missing comma, empty name, non-numeric mark, out-of-range value)
Hardened computeStats in marksUtils.ts to clamp all marks to 0–100 before computing average, highest, lowest, and pass rate, preventing any out-of-range value from skewing statistics