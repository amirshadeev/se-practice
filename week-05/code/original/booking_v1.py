def can_book(start, end, now, blocked, existing):
    # AC3: Check if the room is blocked
    if blocked:
        return False

    # AC1: Validate time range boundaries and ensure booking starts strictly in the future
    if not (0 <= start < end <= 1440 and start > now):
        return False

    # AC2: Check maximum duration limit (at most 120 minutes)
    if (end - start) > 120:
        return False

    # AC4: Check for interval overlap with any active existing bookings
    # Interval rule: [start, end) overlaps with [s, e) if start < e and s < end
    for s, e in existing:
        if start < e and s < end:
            return False

    # AC5: Return True only when AC1–AC4 all hold
    return True