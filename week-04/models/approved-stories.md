# Approved stories — Smart Campus study room booking

**Source of this set:** my Week 03 stories, revised after review

## Scenario

Students view room availability, book a room, and cancel their own bookings. Administrators block or unblock rooms and review usage.

- **R1** Future start, with duration greater than 0 and at most 2 hours.
- **R2** Active bookings for the same room cannot overlap.
- **R3** A blocked room cannot accept a new booking.
- **R4** A successful booking produces a confirmation.

## Approved user stories

### US-01

**Story:** As a Student, I want to view available rooms and their open time slots, so that I can find a suitable room for my individual or group study session.

**Priority:** High

**Assumption:** Room availability is determined by existing bookings and whether a room is blocked.

### US-02

**Story:** As a Student, I want to book an available room for a selected future time slot of up to two hours, so that I can reserve a suitable room for my study session.

**Priority:** High

**Assumption:** A booking lasting exactly two hours is allowed.

### US-03

**Story:** As a Student, I want to cancel a reservation I previously made, so that the room becomes available again for other students if my plans change.

**Priority:** Medium

**Assumption:** A Student can cancel only a reservation they made.

### US-04

**Story:** As an Administrator, I want to block a study room from being booked, so that students cannot reserve it while it is blocked.

**Priority:** High

**Assumption:** A blocked room cannot be booked.

### US-05

**Story:** As an Administrator, I want to unblock a previously blocked study room, so that students can reserve it again when it is available.

**Priority:** Medium

**Assumption:** An unblocked room can be considered for future bookings.

### US-06

**Story:** As an Administrator, I want to review how rooms are being used over a specified period, so that I can monitor room usage in the library.

**Priority:** Low

**Assumption:** Usage information is based on room bookings during the selected period.

### US-07

**Story:** As a Student, I want the system to confirm my booking or cancellation, so that I know that the action was confirmed.

**Priority:** High

**Assumption:** The system provides a confirmation after a booking or cancellation.