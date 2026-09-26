# Lab report — Practice #02: The Prompt Is an Engineering Input

**Name:Amir Shadeyev**
**Group:**
**Date:**

> Fill in every section. **Do not delete or renumber the headings** — the grading pass reads them
> by number. If something did not happen, write "did not happen" and why; an empty section and a
> fabricated one are graded the same way.

---

## 1. The frozen experiment

| | |
| --- | --- |
| AI assistant | Gemini |
| Exact model name | Gemini 3.6 Flash |
| Implementation language | Python |
| Date of the runs | 18 September 2026 |

**Non-Python students only** — paste your substituted Prompt B text here, so the substitution can
be checked:

```
(paste here, or write "n/a — used Python")
```

**Confirmations:**

- Each prompt was sent in a **fresh chat**: yes 
- No follow-up questions were asked before Part 7: yes
- Every output was saved **before** any editing: yes 

---

## 2. Prompt A — minimal

**Prompt sent** (should be exactly one sentence):

```

```

**Assumptions the AI made that I never gave it** — list them, one per line. A data format, a pass
threshold, a rounding rule, an input method, an invented feature all count.

1. It assumed the passing threshold is 50.
2. It assumed that the function should also calculate total_students, passed, and failed.
3. It assumed that empty input should return None instead of raising an error.
4. It assumed that the result should contain pass_rate_percentage rather than the required pass_rate key.
5. It assumed that example usage and a command-line-style __main__ block were useful.

**Questions it should have asked and did not:**

1. What should the passing threshold be?
2. What should happen for an empty list or invalid marks?

**Is the function named `analyze_marks` with the required signature?** 
no

**First impression before testing** (one sentence — you will compare this with section 6 later):

The code looks simple and readable, but it makes several assumptions and does not follow the required function signature or return structure..

## 3. Prompt B — structured context

**Prompt sent** (paste it in full, including any substitutions):
You are a Python developer. Implement analyze_marks(marks, pass_mark=50). Return
average, highest, lowest, and pass_rate in a dictionary. Accept marks from 0 to 100;
raise ValueError for an empty list, non-numeric values, or out-of-range values. Use
no external libraries. Return code plus a short explanation.

**What B fixed compared to A:**
- It used the required function signature `analyze_marks(marks, pass_mark=50)`.
- It returned the required dictionary keys: `average`, `highest`, `lowest`, and `pass_rate`.
- It added validation for an empty list.
- It added validation for non-numeric values.
- It added validation for marks outside the range 0–100.
- It correctly used the custom `pass_mark` parameter.
- It removed the unnecessary extra fields from Prompt A.

**What B still leaves open:**

- The prompt does not explicitly state whether `pass_rate` should be rounded to two decimal places.
- The prompt does not explicitly define how special numeric values such as `NaN` or infinity should be handled.
- The AI added an explicit rejection of boolean values, although this was not specified in the prompt.
---

## 4. Prompt C — examples and tests

**What I appended to Prompt B:**
Example: analyze_marks([40, 60, 80], 50) → average 60, highest 80, lowest 40,
pass_rate 66.67. Include tests for: one mark, decimals, custom pass_mark, empty list,
text value, and marks below 0 or above 100. State any remaining assumptions before
the code.

**Tests the AI wrote for itself** — how many, and which situations do they cover?

| Situation | Covered by the AI's tests? |
| --- | --- |
| one mark | yes |
| decimals | yes |
| custom pass_mark | yes |
| empty list | yes |
| text value | yse |
| below 0 / above 100 | yes |

The AI wrote 7 tests in total. They cover all six requested situations; the below 0 and above 100 cases were tested separately.

**Do the AI's own tests pass against the AI's own code?** yes

**Do they agree with the harness in section 6?** yes — the AI's code passed all 6 harness cases.


**Assumptions C stated explicitly before the code:**

- The output is a dictionary.
- `pass_rate` and `average` are rounded to two decimal places.
- Marks can be integers or floats.
- Boolean values are rejected even though Python treats them as integers.
---

## 5. Prompt D — my combined prompt

**The complete prompt I wrote** (one message, sent to a fresh chat):
```text
You are a Python developer. Implement exactly this function:

analyze_marks(marks, pass_mark=50)

Requirements:
- Return a dictionary with exactly these keys: average, highest, lowest, pass_rate.
- Calculate average as the arithmetic mean of all marks.
- highest is the maximum mark.
- lowest is the minimum mark.
- pass_rate is the percentage of marks that are greater than or equal to pass_mark.
- Accept marks from 0 to 100, including decimals.
- If marks is empty, raise ValueError.
- If any mark is non-numeric, raise ValueError.
- If any mark is below 0 or above 100, raise ValueError.
- Use no external libraries.
- Do not add extra return fields.
- Do not add unnecessary example/demo output outside the function.
- Use the exact function signature shown above.

Example:
analyze_marks([40, 60, 80], 50)
must produce average=60, highest=80, lowest=40, pass_rate=66.67.

Required tests must cover:
1. one mark
2. decimal marks
3. custom pass_mark
4. empty list
5. non-numeric value
6. marks below 0 or above 100

Resolve the pass_rate precision ambiguity as follows:
- pass_rate must be rounded to exactly 2 decimal places.
- The average should NOT be rounded unless necessary for the calculation; return the calculated numeric value.
- The test harness allows a numeric tolerance of 0.01.

Before the code, briefly state any remaining assumptions. Then provide the implementation and tests.

**What I deliberately added that A, B and C did not have:**

1.I explicitly required the dictionary to contain exactly the four required keys and prohibited extra return fields.
2.I explicitly resolved the pass_rate precision ambiguity by requiring rounding to two decimal places while keeping the average unrounded.
3.I explicitly required the exact function signature and prohibited unnecessary example/demo output.

**The ambiguity I found in the specification, and how I resolved it inside Prompt D:**
The specification and example show pass_rate as 66.67, but the harness accepts values within a tolerance of 0.01. I resolved this by explicitly requiring pass_rate to be rounded to exactly two decimal places. I also specified that average should remain unrounded because the specification does not require rounding it.
---

## 6. Test results — the evidence

Six cases × four prompts. Verdicts are **PASS**, **FAIL** or **ERROR** only.

| # | Call | Required | A | B | C | D |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `analyze_marks([40, 60, 80], 50)` | avg 60 · high 80 · low 40 · rate 66.67 | ERROR | PASS | PASS | PASS |
| 2 | `analyze_marks([100], 50)` | avg 100 · high 100 · low 100 · rate 100 | ERROR | PASS | PASS | PASS |
| 3 | `analyze_marks([49.5, 50], 50)` | avg 49.75 · high 50 · low 49.5 · rate 50 | ERROR | PASS | PASS | PASS |
| 4 | `analyze_marks([], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| 5 | `analyze_marks([40, "60"], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| 6 | `analyze_marks([-1, 50, 101], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| | **Totals** | | /6 | /6 | /6 | /6 |

**For every FAIL and ERROR above, one line: what was returned or raised instead.**

| Prompt | Case | What actually happened |
| --- | --- | --- |
| A | 1 | Raised TypeError: analyze_marks() takes 1 positional argument but 2 were given |
| A | 2 | Raised TypeError: analyze_marks() takes 1 positional argument but 2 were given |
| A | 3 | Raised TypeError: analyze_marks() takes 1 positional argument but 2 were given |
| A | 4 | Raised TypeError instead of the required ValueError because the function accepts only one argument |
| A | 5 | Raised TypeError instead of the required ValueError because the function accepts only one argument |
| A | 6 | Raised TypeError instead of the required ValueError because the function accepts only one argument |

### Pasted terminal output — all four runs

> This is the part that makes the table above count. Paste the **whole** output, unedited,
> including the header lines. A table with nothing behind it is not accepted.

**Prompt A**
PS C:\Users\user\se-practice\week-02> python tests/test_analyze_marks.py code/prompt_a.py
========================================================================
analyze_marks harness — code/prompt_a.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  ERROR  analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : raised TypeError: analyze_marks() takes 1 positional argument but 2 were given
------------------------------------------------------------------------
case 2  ERROR  analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : raised TypeError: analyze_marks() takes 1 positional argument but 2 were given
------------------------------------------------------------------------
case 3  ERROR  analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : raised TypeError: analyze_marks() takes 1 positional argument but 2 were given
------------------------------------------------------------------------
case 4  ERROR  analyze_marks([], 50)
          expect: ValueError
          got   : raised TypeError instead of ValueError: analyze_marks() takes 1 positional argument but 2 were given
------------------------------------------------------------------------
case 5  ERROR  analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised TypeError instead of ValueError: analyze_marks() takes 1 positional argument but 2 were given
------------------------------------------------------------------------
case 6  ERROR  analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised TypeError instead of ValueError: analyze_
------------------------------------------------------------------------
RESULT  0 PASS · 0 FAIL · 6 ERROR   (code/prompt_a.py)
========================================================================

**Prompt B**
PS C:\Users\user\se-practice\week-02> python tests/test_analyze_marks.py code/prompt_b.py
========================================================================
analyze_marks harness — code/prompt_b.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80.0, lowest=40.0, pass_rate=66.66666666666666
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100.0, lowest=100.0, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50.0, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: The marks list cannot be empty.
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: Non-numeric value encountered: 60
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (code/prompt_b.py)
========================================================================

**Prompt C**
PS C:\Users\user\se-practice\week-02> python tests/test_analyze_marks.py code/prompt_c.py
========================================================================
analyze_marks harness — code/prompt_c.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: The 'marks' argument must be a non-empty list.
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: Invalid non-numeric value found: 60
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (code/prompt_c.py)
========================================================================
**Prompt D**
PS C:\Users\user\se-practice\week-02> python tests/test_analyze_marks.py code/prompt_d.py
========================================================================
analyze_marks harness — code/prompt_d.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80.0, lowest=40.0, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100.0, lowest=100.0, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50.0, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: The marks list cannot be empty.
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: Non-numeric value found in marks: 60
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: Mark out of valid range [0, 100]: -1
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (code/prompt_d.py)
========================================================================

## 7. Scoring

0–2 per criterion, using the rubric in `README.md` Part 7.

| Criterion | A | B | C | D |
| --- | --- | --- | --- | --- |
| Correctness (cases passed) | 0 | 2 | 2 | 2 |
| Requirement coverage | 0 | 2 | 2 | 2 |
| Verifiability (tests) | 0 | 1 | 2 | 2 |
| Assumptions stated | 0 | 1 | 2 | 2 |
| Noise (2 = none) | 1 | 2 | 1 | 2 |
| **Total / 10** | 1 | 8 | 9 | 10 |

**Prompt length, in words:** A = 7 · B = 44  · C = 84 · D = 222

**Words added per point gained** — B over A:(44 − 7) / (8 − 1) = 37 / 7 ≈ 5.29, C over B:(84 − 44) / (9 − 8) = 40, D over C:(222 − 84) / (10 − 9) = 138.
One line on what that ratio says:Early prompt improvements gave large benefits for few added words, while later improvements required much more detail for each additional point.


---

## 8. Conclusion — 150–200 words

Answer in this order: (1) which prompt scored best, and whether it is the one you would actually
use at work; (2) which single addition bought the most correctness, naming the exact case that
changed verdict; (3) what was pure noise; (4) the ambiguity and your resolution.

Name test cases and real returned values. "More detailed prompts work better" scores zero.
Prompt D received the highest score with 10/10, and its structure is close to what I would use at work because it states the exact interface, validation rules, expected output, tests, and the remaining ambiguity. However, Prompt B was already sufficient to pass all six harness cases, so the extra detail in D was not necessary for basic correctness. The single addition that produced the biggest correctness improvement was the required function signature in Prompt B. Prompt A failed all six cases because the generated function accepted only one argument, while the harness called `analyze_marks(marks, pass_mark)`. After B explicitly required `analyze_marks(marks, pass_mark=50)`, all six cases passed. Some additions were mostly noise for the harness, such as prohibiting demo output and explicitly rejecting Boolean values, because none of the six required cases tested these behaviors. The main ambiguity concerned pass_rate precision. Prompt B returned 66.66666666666666 for case 1, but the harness still accepted it because its tolerance was 0.01. In Prompt D, I resolved this by explicitly requiring pass_rate to be rounded to two decimal places, producing 66.67. Thus, the experiment showed that clearer requirements improved correctness, while later additions mainly improved precision and predictability rather than the six-case result.


**Word count:179**

---

## 9. Two questions for the debrief

Written before class, answered in class.

1.How can we decide when an additional prompt requirement is useful engineering information and when it becomes unnecessary noise?
2.If Prompt B already passes all required tests, what practical benefit does Prompt D provide in a real software project?
