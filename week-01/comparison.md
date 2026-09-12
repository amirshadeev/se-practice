# Week 01 — Manual vs AI: Comparison

**Name: Amir Shadeyev**

**Group:**

**Date:**

---

## 1. Facts

|                                       | Manual (Part 1) | Rocket (Part 2)                               |
| ------------------------------------- | --------------- | --------------------------------------------- |
| Language / stack used                 | Python          | Next.js + TypeScript                          |
| Time to first version that ran        | 50 min          | 7 min recorded                                  |
| Time to all 4 test cases passing      | 50 min          | 10 min recorded                                  |
| Number of attempts / prompts needed   | 1               | 1 main prompt + follow-up prompt              |
| Lines of code you actually wrote      | —               | 0                                             |
| Did it handle invalid marks (case B)? | Yes             | Yes                                           |
| Did it handle an empty list (case D)? | Yes             | Yes                                           |
| Did it use the ≥ 50 pass threshold?   | Yes             | Yes                                           |
| Output format matches the spec?       | Yes             | Yes                                           |
| Can you explain every line of it?     | Yes             | No, I did not write the generated code myself |

## 2. Test results

| Case | Input                                 | Manual output                              | Rocket output                              | Spec says                                  | Match? |
| ---- | ------------------------------------- | ------------------------------------------ | ------------------------------------------ | ------------------------------------------ | ------ |
| A    | `85, 23, 45, 90, 92`                  | avg 67.00 · high 92 · low 23 · pass 60.0%  | avg 67.00 · high 92 · low 23 · pass 60.0%  | avg 67.00 · high 92 · low 23 · pass 60.0%  | Yes    |
| B    | `88, 47, -5, 101, abc, 73, 50, , 100` | avg 71.60 · high 100 · low 47 · pass 80.0% | avg 71.60 · high 100 · low 47 · pass 80.0% | avg 71.60 · high 100 · low 47 · pass 80.0% | Yes    |
| C    | `10, 20, 30`                          | avg 20.00 · high 30 · low 10 · pass 0.0%   | avg 20.00 · high 30 · low 10 · pass 0.0%   | avg 20.00 · high 30 · low 10 · pass 0.0%   | Yes    |
| D    | `abc, , xyz`                          | clear message, no crash                    | clear message, no crash                    | clear message, no crash                    | Yes    |

## 3. What the AI added that I never asked for

* It chose Next.js and TypeScript even though I did not specify a technology stack.
* It created a web UI with a clear results view instead of just a simple program.
* It rewrote the request into a more detailed application description.

## 4. What the AI got wrong or silently skipped

* I did not find any incorrect behaviour in the four required test cases.
* The original prompt was vague, so Rocket had to determine additional requirements itself. The important requirements from Part 1 were still satisfied after testing.

## 5. The defect I asked Rocket to fix

**Prompt I used:**

Review the app against the original requirements and improve its input validation and error handling. Do not change the correct behavior.

**Result:** fixed / reviewed successfully. The four test cases continued to work correctly.

**What this tells me:**

Even when the application appears to work correctly, validation and error handling should still be reviewed. The AI can make changes quickly, but the engineer has to test that the changes do not break existing behaviour.

---

## 6. Reflection (200–300 words)

The AI genuinely sped up the development of the application because it generated a complete web application from a short natural-language request. It also chose a technology stack and created a user interface without me having to write the code manually. In comparison, my manual version took about 50 minutes to complete and test.

However, the AI also made decisions that I did not explicitly request. For example, it chose Next.js and TypeScript and created a web interface. This looked useful, but it also showed that a vague prompt can lead to additional scope and technical decisions. I had to check the generated application against the original requirements instead of assuming that it was correct.

I would be more comfortable putting my name on the manual solution because I wrote it myself and understand how it works. I can explain the logic and know why it handles invalid marks and an empty list correctly. The AI version worked correctly on all four test cases, but I did not write all of its code myself.

After this experiment, a human engineer is still responsible for requirements, correctness, testing, maintainability and security. AI can generate software quickly, but it does not remove the need for engineering judgment. The engineer must verify the result and make sure that the software actually solves the required problem rather than only looking correct.
