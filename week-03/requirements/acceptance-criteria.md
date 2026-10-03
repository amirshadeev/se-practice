# Acceptance criteria — three selected stories

Assumptions first, then the criteria. Each block names the story it belongs to. 3 to 5 criteria per
story, every one in Given / When / Then form, and every set covers a validation or error case — not
three happy paths.

---

## Assumptions

These must settle the two questions the scenario leaves open. Either answer is accepted; no answer
is not.

- **Overlap:** a booking that ends exactly when another begins is not allowed under R3, because adjacent bookings do not share any time interval.
- **Duration:** a booking of exactly two hours is allowed under R2, because the maximum duration is inclusive.
- A Student can cancel only a reservation they made.

---

## US-02 — <Book a room>

### AC-01
- **Given** a Student selects an available room and a future time slot of no more than two hours
- **When** the Student submits the booking
- **Then** the system creates the booking and confirms the booking

### AC-02
- **Given** the booking start time is not in the future
- **When** the Student submits the booking
- **Then** the system rejects the booking

### AC-03
- **Given** another booking already occupies part of the requested time interval
- **When** the Student submits the booking
- **Then** the system rejects the booking

---

## US-03 — <Cancel a booking>

### AC-04
- **Given** a Student has a reservation they made
- **When** the Student cancels it
- **Then** the system releases the reservation and confirms the cancellation

### AC-05
- **Given** a Student does not have a reservation they made
- **When** the Student attempts to cancel that reservation
- **Then** the system rejects the cancellation

### AC-06
- **Given** a Student has a reservation they made for a future time slot
- **When** the Student cancels the reservation
- **Then** the room becomes available for future bookings and the system confirms the cancellation

---

## US-04 — <Block a room>

### AC-07
- **Given** a study room is not blocked
- **When** an Administrator blocks the room
- **Then** the system marks the room as blocked and prevents new bookings for that room

### AC-08
- **Given** a room is blocked
- **When** an Administrator unblocks the room
- **Then** the system makes the room available for consideration for future bookings

### AC-09
- **Given** a room is blocked
- **When** a Student attempts to book the room
- **Then** the system rejects the booking
