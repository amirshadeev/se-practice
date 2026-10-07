# SIS #01 — Software Engineering Fundamentals, With an AI in the Loop

<!--
  This is the only file you write your report in. README.md tells you what goes where.

  Rules the checker relies on:
  - Do not delete, rename or renumber the ## headings, the ### headings, or the **Label:** words.
  - Replace every "(write here)" and "(paste here)". None may be left when you submit.
  - Comments like this one are ignored by the word counter. Delete them or leave them.
-->

**Topic:** 1.6

<!-- Exactly one of 1.1 … 1.10, e.g.  **Topic:** 1.4  -->

---

## 1. Scenario

<!-- 100–150 words, labels included. One small scenario, used in every prompt and in your
     whole answer. Anything fictional is labelled in Assumptions. -->

**Question:** 
 How should fundamental software engineering principles such as a defined process, dependability, requirements management and reuse be applied to a small university laboratory booking system?


**Users:** 
 Students and laboratory administrators.

**Problem:** 
Students need to find and reserve available laboratory equipment or rooms without conflicting bookings. Administrators need to manage resources and prevent invalid reservations.


**Constraints:** 
A booking cannot overlap an existing booking. A student can reserve a resource for a maximum of two hours.


**Risk:** 
Incorrect booking validation could allow overlapping reservations, causing students to arrive and find that the resource is already occupied.


**Assumptions:** 
The university and booking system described here are fictional. It is assumed that students have university accounts and that administrators maintain the list of available resources.

## 2. Analysis

<!-- 350–400 words. Your answer to the question, the trade-offs, and how it applies to your
     scenario. Explain at least two engineering decisions and why they fit the scenario. -->

Fundamental software engineering principles help make the laboratory booking system dependable and aligned with user needs. Four principles are especially relevant: requirements management and the defined development process and dependability, and software reuse.

Requirements management should begin by making the booking rules explicit. The main risk in this scenario is incorrect validation that allows overlapping reservations. Therefore, the requirements should state that bookings cannot overlap and that students can reserve a resource for a maximum of two hours. Acceptance criteria should also clarify boundary cases, such as whether a booking ending at 12:00 can be followed by another booking starting at 12:00. The scope of the two-hour rule for administrators should also be clarified because the scenario does not specify it.

A defined development process provides a structured way to move from requirements to design, implementation, and testing. For this system, an important engineering decision is to test the booking validation rules before deployment rather than treating validation as a final coding detail. Unit tests could check duration limits and individual booking rules, while integration testing could check whether the booking service correctly interacts with stored reservations. This process adds development time, but it reduces the risk of incorrect rules reaching users.

Dependability is particularly important because students and administrators need accurate information about resource availability. Basic application-level validation is necessary, but it may not be sufficient when two users attempt to reserve the same resource at nearly the same time. Both requests could potentially pass an availability check before either reservation is stored. This creates a race condition and could result in a double booking. The exact database mechanism required to prevent this should be verified against the chosen technology and expected system load.

Software reuse can reduce duplicated development work. Standard date-time libraries, calendar interface components, and authentication modules can provide general functionality. However, the university's specific rules still require custom logic. A reusable calendar component would not automatically know that students have a two-hour limit or that reservations cannot overlap. Therefore, reuse saves effort, but it does not remove the need to design and test domain-specific validation.This also makes the system rules easier to review before implementation.


## 3. Review

<!-- 250–300 words. What Prompt B's critique said and what you did with it; your two source
     checks and your two substantive revisions, each with a reason. Point at the rows of the
     tables in section 9 ("verification row 2", "change-log row 1"). -->

Prompt B identified several weaknesses in the initial draft. The most important issue was that the draft did not explicitly explain a defined development process, even though it was part of the chosen question. I accepted this feedback and added a process connecting requirements, implementation and testing.

The review also identified a technical limitation in simple application-level validation. If two students attempt to reserve the same resource at almost the same time, both requests might pass an availability check before either reservation is stored. I accepted this concern but kept the explanation at a first-year level. The final analysis therefore mentions the possibility of a race condition and states that the exact database-level solution requires verification.

The reuse discussion was also changed. The original wording was too broad because it could suggest that existing components would automatically solve the booking rules. I accepted the feedback and distinguished reusable general components, such as date-time libraries and calendar interfaces, from custom business rules.

I partially rejected the suggestion that administrators should have override permissions. The scenario does not specify such a feature, so adding it as a system capability would introduce an unsupported assumption. Instead, the final version identifies the scope of the two-hour rule for administrators as a requirement that needs clarification.

Finally, I accepted the recommendation to connect requirements management directly to the main risk. The revised analysis uses explicit requirements and acceptance criteria to reduce ambiguity around overlapping bookings and boundary cases.

These changes correspond to verification row 1 and verification row 2, and to change-log rows 1 and 2 in Section 9.


## 4. Conclusion

<!-- 100–150 words. Your recommendation for the scenario and its main limitation. -->

The laboratory booking system should use explicit requirements, a defined development process, dependable validation, and selective software reuse. Requirements should clearly describe the booking constraints and important boundary cases. A structured development process should ensure that these rules are implemented and tested before deployment. Dependability requires more than checking inputs because simultaneous booking attempts may create concurrency problems that require further technical verification. Reuse should be applied to general functionality such as date-time handling and interface components, while university-specific booking rules remain custom. The main limitation is that the scenario does not define the complete technical architecture or administrator permissions, so some implementation decisions cannot be justified without additional requirements and evidence.


## 5. Reflection

<!-- 150–200 words. NOT part of the main total. Written by you, not by the assistant:
     what helped, what you changed, what you learned. Specific beats flattering. -->
Collaborating with AI helped me structure my thoughts on core software engineering principles and uncover non-obvious connections. While the initial draft established a solid foundation for requirements management, system dependability, and software reuse, the AI introduced unwarranted assumptions—such as admin override capabilities and heavy concurrent traffic—that fell outside my original scope.

The review phase was critical in highlighting overly broad statements. For instance, basic pre-save validation is insufficient to prevent race conditions when two users attempt to book the same resource simultaneously. Additionally, I refined my take on software reuse, noting that while third-party libraries offer general functionality, they cannot automatically handle custom university business logic.

Ultimately, this experience reinforced that AI output requires rigorous validation. Though the AI generates plausible technical explanations, key claims still demand verification. Furthermore, it proved that requirements must be precise enough to catch edge cases and eliminate ambiguity prior to development.This changed how I evaluate AI-generated technical claims.

## 6. References

<!-- Full references, one per line, each starting with "- ". Only sources you actually opened.
     Every URL used in the verification table must also appear here. Example:
     - Sommerville, I. (2016). Software Engineering, 10th ed., Global Edition. Pearson. Ch. 1.
-->

- Sommerville, I. (2016). Software Engineering (10th ed.). Pearson. Chapter 1, Section 1.1, “Professional software development”. Available through the Pearson Software Engineering 10th edition page. Accessed 2026-10-07.


## 7. Appendix A — Initial outline

<!-- Written BEFORE you run Prompt A. Five points, your own words, numbered. These are the
     "five points" you paste into Prompt A. -->

1. **Clear Requirements:** Detailed specifications for the booking system must be fully defined prior to implementation.
2. **Validation:** The system needs to verify booking details before persisting them to eliminate scheduling conflicts.
3. **Dependability:** Data accuracy is essential, as user trust relies heavily on the system's consistency and correctness.
4. **Code Reuse:** Leveraging pre-existing components and validation logic minimizes code duplication and speeds up development.
5. **Balanced Priorities:** Speed should not compromise accuracy: a fast system that generates invalid bookings creates serious operational issues.
## 8. Appendix B — AI exchanges

<!-- Complete prompts and complete responses, as text — never screenshots. Paste each inside
     the fenced block that follows its label. If a response itself contains ``` lines, open
     and close that block with ~~~~ instead. You may add B4, B5 … after B3 if you ran more. -->

### B1 — Draft (Prompt A)

- **Tool:** Gemini
- **Model:** Gemini 3.6 Flash
- **Date:** 2026-10-07
- **Purpose:** contextual draft

<!-- Model: the exact model with its version, as the tool shows it (e.g. "GPT-5 Thinking",
     "Claude Sonnet 4.5"). If the tool does not show it, write: not displayed
     Date: YYYY-MM-DD -->

**Prompt:**

```text
Act as a software engineering tutor. Help me analyze topic 1.6 Fundamental engineering principles for a first-year-level university assignment.

My scenario is students and laboratory administrators using a small fictional university laboratory booking system. Students need to find and reserve available laboratory equipment or rooms without conflicting bookings. Administrators need to manage resources and prevent invalid reservations. The constraints are that a booking cannot overlap an existing booking and a student can reserve a resource for a maximum of two hours. The main risk is that incorrect booking validation could allow overlapping reservations. My initial ideas are:
1. Clear requirements should be defined before implementation of the booking system.
2. The system should validate booking details before saving a reservation to prevent scheduling conflicts.
3. Dependability is important because students and administrators need accurate and consistent booking information.
4. Reusing existing components and validation logic can reduce duplicated work and development effort.
5. Development speed should not compromise accuracy because invalid bookings can create practical problems for users.

Draft a 400–500 word explanation using these details.

Separate facts from assumptions. Explain trade-offs and identify claims I should verify. Do not invent quotations, references or page numbers.
```

**Response:**

```text
Here is a drafted response for your university assignment, structured to help you analyze the fundamental software engineering principles while clearly separating facts from assumptions, examining trade-offs, and highlighting claims to verify.

---

### Topic 1.6: Fundamental Engineering Principles in a University Laboratory Booking System

In software engineering, fundamental principles guide how systems are designed, built, and maintained to ensure reliability and user satisfaction. Applying these principles to a university laboratory booking system helps satisfy both student and administrator requirements while managing critical operational constraints.

#### Application of Fundamental Engineering Principles

1. **Requirements Specification Before Implementation:** Establishing clear requirements early is critical. Defining constraints upfront—such as enforcing a maximum two-hour reservation limit and prohibiting overlapping time slots—ensures the system architecture directly supports validation needs before writing code.
2. **Defensive Design & Rigorous Validation:** The core risk of this system is incorrect booking validation resulting in overlapping reservations. Validating booking inputs (checking start times, end times, and duration limits) prior to writing data to the database guarantees system integrity and prevents scheduling conflicts.
3. **Dependability and Consistency:** Dependability requires accurate, real-time availability status for both students and administrators. If state changes are not handled consistently, concurrent reservation attempts could yield race conditions, leading to double bookings and disrupting laboratory operations.
4. **Reuse and Modular Logic:** Applying software reuse—such as leveraging existing scheduling components, standard date-time libraries, or centralized validation logic—reduces development effort and minimizes duplicated code where validation bugs might otherwise hide.
5. **Quality over Speed:** While rapid development is often desirable, accuracy cannot be sacrificed. Speeding through validation design risks introducing logic errors, leading to real-world friction like equipment double-booking.

---

### Fact vs. Assumption Analysis

To write an effective academic analysis, you must distinguish what is explicitly given in your scenario from what is assumed:

* **Facts (Explicitly given in the scenario):**
* Primary users are students and laboratory administrators.
* System rules require preventing overlapping bookings and enforcing a 2-hour maximum reservation limit.
* The key operational risk is incorrect booking validation allowing overlapping reservations.


* **Assumptions (Inferred context to handle cautiously):**
* Assuming high concurrent access (e.g., many students attempting to book the same room simultaneously during peak hours).
* Assuming that pre-existing, reusable scheduling components are readily available for integration.
* Assuming administrators require manual override capabilities for administrative or maintenance holds.



---

### Key Trade-Offs

* **Strict Validation vs. System Responsiveness:** Enforcing synchronous, strict validation logic against a central database prevents double bookings but may slightly increase response latency during high-traffic periods.
* **Component Reuse vs. Custom Constraints:** Reusing off-the-shelf scheduling or calendar libraries saves time, but adapting them to enforce custom rules (e.g., strict two-hour limits per user) may require additional wrapper logic or workarounds.
* **Development Velocity vs. Verification Rigor:** Prioritizing thorough automated testing and edge-case validation takes initial development time, but it protects against post-deployment failures and double-booking risks.

---

### Claims to Verify & Further Questions

Before submitting your final draft, verify these key claims and considerations:

1. **Concurrency handling:** Verify whether standard validation logic alone is sufficient or if database-level locking/transactions are necessary to prevent race conditions during simultaneous bookings.
2. **Edge-case boundary conditions:** Confirm how the two-hour maximum constraint behaves when back-to-back reservations are placed by the same student.
3. **Course alignment:** Check your course slides/textbook for Topic 1.6 to ensure your terminology (e.g., *requirements engineering*, *dependability*, *software reuse*) matches the specific definitions taught in class.
```

### B2 — Critique (Prompt B)

- **Tool:** Gemini
- **Model:** Gemini 3.6 Flash
- **Date:** 2026-10-07
- **Purpose:** critical review of the draft

**Prompt:**

```text
Review the draft below against my chosen question and scenario. Identify inaccuracies, missing reasoning, vague claims and unsupported assumptions.

For each concern, explain why it matters and how I could check it. Include a counterexample or alternative interpretation. Do not rewrite the answer yet.

Question: How should fundamental software engineering principles such as a defined process, dependability, requirements management and reuse be applied to a small university laboratory booking system?

Scenario: Students and laboratory administrators use a small fictional university laboratory booking system. Students need to find and reserve available laboratory equipment or rooms without conflicting bookings. Administrators need to manage resources and prevent invalid reservations. A booking cannot overlap an existing booking. A student can reserve a resource for a maximum of two hours. The main risk is that incorrect booking validation could allow overlapping reservations.


```text
Draft:
Here is a drafted response for your university assignment, structured to help you analyze the fundamental software engineering principles while clearly separating facts from assumptions, examining trade-offs, and highlighting claims to verify.

---

### Topic 1.6: Fundamental Engineering Principles in a University Laboratory Booking System

In software engineering, fundamental principles guide how systems are designed, built, and maintained to ensure reliability and user satisfaction. Applying these principles to a university laboratory booking system helps satisfy both student and administrator requirements while managing critical operational constraints.

#### Application of Fundamental Engineering Principles

1. **Requirements Specification Before Implementation:** Establishing clear requirements early is critical. Defining constraints upfront—such as enforcing a maximum two-hour reservation limit and prohibiting overlapping time slots—ensures the system architecture directly supports validation needs before writing code.
2. **Defensive Design & Rigorous Validation:** The core risk of this system is incorrect booking validation resulting in overlapping reservations. Validating booking inputs (checking start times, end times, and duration limits) prior to writing data to the database guarantees system integrity and prevents scheduling conflicts.
3. **Dependability and Consistency:** Dependability requires accurate, real-time availability status for both students and administrators. If state changes are not handled consistently, concurrent reservation attempts could yield race conditions, leading to double bookings and disrupting laboratory operations.
4. **Reuse and Modular Logic:** Applying software reuse—such as leveraging existing scheduling components, standard date-time libraries, or centralized validation logic—reduces development effort and minimizes duplicated code where validation bugs might otherwise hide.
5. **Quality over Speed:** While rapid development is often desirable, accuracy cannot be sacrificed. Speeding through validation design risks introducing logic errors, leading to real-world friction like equipment double-booking.

---

### Fact vs. Assumption Analysis

To write an effective academic analysis, you must distinguish what is explicitly given in your scenario from what is assumed:

* **Facts (Explicitly given in the scenario):**
* Primary users are students and laboratory administrators.
* System rules require preventing overlapping bookings and enforcing a 2-hour maximum reservation limit.
* The key operational risk is incorrect booking validation allowing overlapping reservations.


* **Assumptions (Inferred context to handle cautiously):**
* Assuming high concurrent access (e.g., many students attempting to book the same room simultaneously during peak hours).
* Assuming that pre-existing, reusable scheduling components are readily available for integration.
* Assuming administrators require manual override capabilities for administrative or maintenance holds.



---

### Key Trade-Offs

* **Strict Validation vs. System Responsiveness:** Enforcing synchronous, strict validation logic against a central database prevents double bookings but may slightly increase response latency during high-traffic periods.
* **Component Reuse vs. Custom Constraints:** Reusing off-the-shelf scheduling or calendar libraries saves time, but adapting them to enforce custom rules (e.g., strict two-hour limits per user) may require additional wrapper logic or workarounds.
* **Development Velocity vs. Verification Rigor:** Prioritizing thorough automated testing and edge-case validation takes initial development time, but it protects against post-deployment failures and double-booking risks.

---

### Claims to Verify & Further Questions

Before submitting your final draft, verify these key claims and considerations:

1. **Concurrency handling:** Verify whether standard validation logic alone is sufficient or if database-level locking/transactions are necessary to prevent race conditions during simultaneous bookings.
2. **Edge-case boundary conditions:** Confirm how the two-hour maximum constraint behaves when back-to-back reservations are placed by the same student.
3. **Course alignment:** Check your course slides/textbook for Topic 1.6 to ensure your terminology (e.g., *requirements engineering*, *dependability*, *software reuse*) matches the specific definitions taught in class.



```

**Response:**

```text
Here is a critical review of your draft evaluated against your question and scenario.

---

### 1. Inaccuracy in Terminology & Mapping to Principles

* **Concern:** Your original draft introduces concepts like *"Defensive Design"* and *"Quality over Speed"* which are general concepts, but missed explicitly addressing **Defined Process**—one of the core four principles named in your prompt (along with *dependability*, *requirements management*, and *reuse*).
* **Why it matters:** Academic markers look for direct alignment between the prompt’s specified principles and your subheadings. Missing "Defined Process" leaves a core part of the essay question unanswered.
* **How to check it:** Compare your draft's headings directly against the key terms listed in your question prompt: *Defined Process*, *Dependability*, *Requirements Management*, and *Reuse*.
* **Counterexample / Alternative:** Instead of framing Point 5 as a vague trade-off between quality and speed, frame it under **Defined Process**: choosing a structured lifecycle model (like iterative development or incremental delivery) ensures that booking validation rules are tested and verified before deployment.

---

### 2. Missing Technical Reasoning: Concurrency & Race Conditions

* **Concern:** Point 2 mentions validating details before saving to the database, but it assumes simple application-level validation (e.g., checking `if start_time < existing_end_time`) is enough to prevent overlapping bookings. It omits the technical mechanism for *how* this happens under concurrent load.
* **Why it matters:** If two students submit a booking for the exact same room at the exact same millisecond, simple validation code will pass for both students, resulting in a double-booking. Without mentioning concurrency mechanisms (like database transactions, optimistic/pessimistic locking, or unique constraints), the analysis of "dependability" remains superficial.
* **How to check it:** Review your software engineering textbook or lecture notes on concurrency control, database ACID properties, or race conditions.
* **Counterexample / Alternative:** Application-layer validation alone fails during high-traffic periods (e.g., when a popular lab opens for registration). An alternative explanation must highlight that validation logic must be tied to atomic database operations or transaction locks to guarantee zero overlaps.

---

### 3. Unclear Boundary on "Reuse" (Vague Claim)

* **Concern:** Point 4 advocates for "reusing existing components and validation logic," but it remains vague about *what* is being reused and whether reuse is actually beneficial for custom validation rules.
* **Why it matters:** Off-the-shelf components rarely come pre-packaged with niche domain constraints like "maximum 2-hour student limit." Claiming that reuse solves validation logic without discussing the effort to customize or override existing behavior creates an unrealistic trade-off assessment.
* **How to check it:** Ask yourself: *If I import a standard open-source calendar widget (e.g., FullCalendar), does it automatically enforce my 2-hour maximum rule and prevent database overlaps, or do I still have to write custom validation?*
* **Counterexample / Alternative:** Reusing UI widgets or standard date-time libraries saves front-end and date-parsing development, but core business logic validation (2-hour limit, double-booking checks) is domain-specific and usually must be custom-coded rather than reused.

---

### 4. Unsupported Assumptions About Administrator Workflows & System Scope

* **Concern:** The draft assumes administrators only need to manage resources, but it doesn't account for administrative overrides or operational edge cases.
* **Why it matters:** Requirements management requires identifying edge cases early. If administrators need to book a room for an all-day maintenance window or a 4-hour workshop, a strict system-wide "2-hour max rule" applied to admins would break system functionality.
* **How to check it:** Check the scenario wording: "A *student* can reserve a resource for a maximum of two hours." Does this rule apply to administrators too?
* **Counterexample / Alternative:** You might assume the 2-hour limit applies universally, but in reality, administrator user stories require role-based permission overrides (RBAC). Failing to separate student constraints from admin capabilities represents incomplete requirements management.

---

### 5. Weak Connection Between Requirements Management and System Risk

* **Concern:** Point 1 discusses clear requirements definition, but does not explicitly connect requirements management to the primary risk identified in the scenario (incorrect booking validation).
* **Why it matters:** Requirements management isn't just writing a list of features at the start; it involves traceability, specification of non-functional requirements (like accuracy and availability), and acceptance criteria.
* **How to check it:** Evaluate if your draft explains *how* requirements management mitigates the specific risk of overlapping bookings (e.g., through explicit Given-When-Then criteria or formal boundary-value testing specifications).
* **Counterexample / Alternative:** Instead of stating "requirements should be defined before implementation," explain that using clear acceptance criteria (e.g., defining boundary conditions for exact start/end times like 10:00–12:00 vs. 12:00–14:00) prevents misinterpretation by developers, directly mitigating the risk of overlap bugs.

```

### B3 — Revision (Prompt C)

- **Tool:** Gemini
- **Model:** Gemini 3.6 Flash
- **Date:** 2026-10-07
- **Purpose:** revision using my decisions and verified evidence

**Prompt:**

```text
Revise the draft using my review decisions and source notes below. Keep the answer relevant to my scenario and preserve uncertainty where evidence is limited.

My decisions:
1. Accepted the feedback about Defined Process. The final answer should explicitly explain how a defined development process helps the booking system, especially by ensuring requirements, implementation, testing and validation are handled systematically.
2. Accepted the feedback about concurrency and race conditions. The final answer should mention that application-level validation alone may be insufficient when two users try to book the same resource simultaneously. However, keep the explanation at a first-year software engineering level.
3. Accepted the feedback about reuse. The final answer should distinguish between reusable general components such as date-time libraries or UI components and custom business rules such as the two-hour student limit and overlap validation.
4. Partially accepted the feedback about administrator overrides. The scenario does not state that administrators have override permissions, so do not invent such functionality. Instead, identify the administrator scope and the applicability of the two-hour rule as requirements that should be clarified.
5. Accepted the feedback about requirements management. The final answer should connect explicit requirements and acceptance criteria to the main risk of incorrect booking validation and overlapping reservations.

Verified evidence:
No external sources have been verified yet. Do not invent citations, quotations, references, page numbers, URLs, or source claims. Preserve uncertainty where technical details require verification.

Show what you changed and why. Use only the sources I supplied. Flag remaining gaps instead of inventing details.

```text
Draft:
Here is a drafted response for your university assignment, structured to help you analyze the fundamental software engineering principles while clearly separating facts from assumptions, examining trade-offs, and highlighting claims to verify.

---

### Topic 1.6: Fundamental Engineering Principles in a University Laboratory Booking System

In software engineering, fundamental principles guide how systems are designed, built, and maintained to ensure reliability and user satisfaction. Applying these principles to a university laboratory booking system helps satisfy both student and administrator requirements while managing critical operational constraints.

#### Application of Fundamental Engineering Principles

1. **Requirements Specification Before Implementation:** Establishing clear requirements early is critical. Defining constraints upfront—such as enforcing a maximum two-hour reservation limit and prohibiting overlapping time slots—ensures the system architecture directly supports validation needs before writing code.
2. **Defensive Design & Rigorous Validation:** The core risk of this system is incorrect booking validation resulting in overlapping reservations. Validating booking inputs (checking start times, end times, and duration limits) prior to writing data to the database guarantees system integrity and prevents scheduling conflicts.
3. **Dependability and Consistency:** Dependability requires accurate, real-time availability status for both students and administrators. If state changes are not handled consistently, concurrent reservation attempts could yield race conditions, leading to double bookings and disrupting laboratory operations.
4. **Reuse and Modular Logic:** Applying software reuse—such as leveraging existing scheduling components, standard date-time libraries, or centralized validation logic—reduces development effort and minimizes duplicated code where validation bugs might otherwise hide.
5. **Quality over Speed:** While rapid development is often desirable, accuracy cannot be sacrificed. Speeding through validation design risks introducing logic errors, leading to real-world friction like equipment double-booking.

---

### Fact vs. Assumption Analysis

To write an effective academic analysis, you must distinguish what is explicitly given in your scenario from what is assumed:

* **Facts (Explicitly given in the scenario):**
* Primary users are students and laboratory administrators.
* System rules require preventing overlapping bookings and enforcing a 2-hour maximum reservation limit.
* The key operational risk is incorrect booking validation allowing overlapping reservations.


* **Assumptions (Inferred context to handle cautiously):**
* Assuming high concurrent access (e.g., many students attempting to book the same room simultaneously during peak hours).
* Assuming that pre-existing, reusable scheduling components are readily available for integration.
* Assuming administrators require manual override capabilities for administrative or maintenance holds.



---

### Key Trade-Offs

* **Strict Validation vs. System Responsiveness:** Enforcing synchronous, strict validation logic against a central database prevents double bookings but may slightly increase response latency during high-traffic periods.
* **Component Reuse vs. Custom Constraints:** Reusing off-the-shelf scheduling or calendar libraries saves time, but adapting them to enforce custom rules (e.g., strict two-hour limits per user) may require additional wrapper logic or workarounds.
* **Development Velocity vs. Verification Rigor:** Prioritizing thorough automated testing and edge-case validation takes initial development time, but it protects against post-deployment failures and double-booking risks.

---

### Claims to Verify & Further Questions

Before submitting your final draft, verify these key claims and considerations:

1. **Concurrency handling:** Verify whether standard validation logic alone is sufficient or if database-level locking/transactions are necessary to prevent race conditions during simultaneous bookings.
2. **Edge-case boundary conditions:** Confirm how the two-hour maximum constraint behaves when back-to-back reservations are placed by the same student.
3. **Course alignment:** Check your course slides/textbook for Topic 1.6 to ensure your terminology (e.g., *requirements engineering*, *dependability*, *software reuse*) matches the specific definitions taught in class.


```

**Response:**

```text
Here is a revised, 400–500 word draft tailored to a first-year software engineering assignment that incorporates all your review decisions and preserves appropriate technical uncertainty.

---

### Fundamental Engineering Principles in a University Laboratory Booking System

Applying fundamental software engineering principles ensures that a laboratory booking system remains dependable, maintainable, and aligned with user needs. In a shared university environment, systematic engineering practices are critical to prevent scheduling conflicts and system failures.

#### Application of Core Principles

1. **Requirements Management:**
Requirements management involves explicitly defining and tracing system rules to mitigate operational risks. For this booking system, the primary risk is incorrect validation resulting in overlapping reservations. Clear acceptance criteria—such as specifying boundary conditions for exact start and end times—ensure developers implement unambiguous logic. Explicit requirements also prevent misunderstandings regarding constraint scope, such as whether the maximum two-hour reservation rule applies strictly to students or also to laboratory administrators.
2. **Defined Process:**
A defined software development process provides a structured lifecycle, guiding the system systematically through requirements analysis, design, implementation, and testing. Following an iterative or structured process ensures that validation logic is not written hastily. Instead, conflict detection rules are formally verified through unit and integration testing before deployment, directly reducing the likelihood of scheduling bugs reaching production.
3. **Dependability:**
Dependability guarantees that the system consistently reflects true resource availability to both students and administrators. At a first-year level, basic application checks (such as verifying that a requested time slot does not fall within an existing reservation) are necessary. However, simple application-level validation alone may be insufficient during peak usage. If two users attempt to reserve the same laboratory equipment at the exact same moment, a race condition can occur, potentially causing both requests to pass validation and creating a double booking. Ensuring true dependability requires exploring concurrent access controls at the database level.
4. **Software Reuse:**
Reusing existing software components reduces development effort and prevents reinventing standard functionality. In this scenario, reusable assets include standard UI calendar controls, user authentication modules, and robust date-time parsing libraries. However, domain-specific rules—such as enforcing the two-hour student limit and preventing overlapping bookings—generally cannot be handled by off-the-shelf components alone and require custom implementation.

---

### Fact vs. Assumption Analysis

* **Facts (Explicitly given in scenario):**
* System users are students and laboratory administrators.
* Bookings must not overlap, and students are limited to a two-hour maximum reservation.
* The primary system risk is incorrect validation permitting overlapping bookings.


* **Assumptions & Open Clarifications:**
* **Administrator Capabilities:** It is assumed that administrators manage resources, but it remains unconfirmed whether administrators require unique privileges or if the two-hour rule applies to them.
* **System Load:** It is assumed that simultaneous booking attempts may occur, though exact concurrent traffic volumes require further verification.



---

### Trade-Offs & Claims to Verify

* **Custom Logic vs. Reuse:** Reusing general date-time libraries simplifies calendar handling, but custom validation logic must still be written and tested to enforce specific university policies.
* **Claims to Verify:**
1. *Concurrency Handling:* Verify whether basic application logic is sufficient for expected user traffic or if database-level locking/transaction mechanisms are required to prevent simultaneous double-booking.
2. *Boundary Testing:* Confirm how edge-case boundaries (e.g., contiguous booking slots like 10:00–12:00 and 12:00–14:00) are evaluated by the validation algorithm.
```

## 9. Appendix C — Evidence tables

### Verification table

<!-- At least two complete rows. Source and locator: title + page / slide / section / chapter,
     or title + URL + access date (YYYY-MM-DD). Decision: keep, qualify or reject — one word. -->

| AI claim | Source and locator | Evidence found | Decision |
| --- | --- | --- | --- |
| Fundamental software engineering principles include a managed development process and requirements management. | Sommerville, Software Engineering, 10th ed., Chapter 1, Section 1.1 “Professional software development”; Pearson edition page, accessed 2026-10-07. | The source identifies a managed and understood development process and states that understanding and managing software specifications and requirements are fundamental. | keep |
| Software reuse means making effective use of existing software/resources instead of developing everything from scratch. | Sommerville, Software Engineering, 10th ed., Chapter 1, Section 1.1 “Professional software development”; Pearson edition page, accessed 2026-10-07. | The source states that existing resources should be used effectively and that software should be reused where appropriate. The book also has a dedicated chapter on Software Reuse. | keep |

### Change log

<!-- At least two substantive revisions. Your final version must differ from the AI wording,
     and the reason must say which evidence or scenario constraint made you change it. -->

| AI wording / suggestion | Your final version | Reason for change |
| --- | --- | --- |
| “Defined Process” should be explicitly addressed as one of the core principles. | The analysis explains how a defined development process connects requirements, implementation and testing. | Changed because the scenario question explicitly asks about fundamental principles, and Sommerville identifies a managed development process as one of the fundamental principles. |
| “Basic application-level validation alone may be insufficient” when simultaneous users attempt to book the same resource. | The analysis states that simultaneous booking attempts may create a race condition and that the exact database-level solution requires further verification. | Changed to preserve technical uncertainty because the scenario does not specify the database technology or concurrency mechanism. |
