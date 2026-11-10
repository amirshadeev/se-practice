
import unittest
from booking import can_book


class BookingTests(unittest.TestCase):

    def test_touching_end_is_allowed(self):
        self.assertIs(can_book(660, 720, 540, False, [(600, 660)]), True)

    def test_touching_start_is_allowed(self):
        self.assertIs(can_book(540, 600, 500, False, [(600, 660)]), True)

    def test_overlap_is_rejected(self):
        self.assertIs(can_book(630, 690, 540, False, [(600, 660)]), False)

    def test_blocked_room_is_rejected(self):
        self.assertIs(can_book(660, 720, 540, True, []), False)

    def test_exactly_120_minutes_is_allowed(self):
        self.assertIs(can_book(720, 840, 540, False, []), True)

    def test_121_minutes_is_rejected(self):
        self.assertIs(can_book(720, 841, 540, False, []), False)

    def test_starting_at_current_time_is_rejected(self):
        self.assertIs(can_book(540, 570, 540, False, []), False)

    def test_reversed_interval_is_rejected(self):
        self.assertIs(can_book(720, 660, 540, False, []), False)

    def test_negative_start_is_rejected(self):
        self.assertIs(can_book(-10, 30, -20, False, []), False)

    def test_end_after_midnight_is_rejected(self):
        self.assertIs(can_book(1380, 1441, 540, False, []), False)

    def test_ends_at_midnight_is_allowed(self):
        self.assertIs(can_book(1380, 1440, 540, False, []), True)

    def test_second_existing_booking_overlap_is_rejected(self):
        existing = [(600, 660), (700, 760)]
        self.assertIs(can_book(720, 780, 540, False, existing), False)

    def test_existing_bookings_are_not_modified(self):
        existing = [(600, 660), (800, 900)]
        original = existing.copy()

        can_book(660, 720, 540, False, existing)

        self.assertEqual(existing, original)
    
    def test_float_start_is_rejected(self):
        self.assertIs(can_book(660.5, 720, 540, False, []), False)

    def test_float_end_is_rejected(self):
        self.assertIs(can_book(660, 720.5, 540, False, []), False)

    def test_boolean_time_is_rejected(self):
        self.assertIs(can_book(True, 720, 540, False, []), False)

    def test_new_interval_inside_existing_is_rejected(self):
        self.assertIs(can_book(620, 640, 540, False, [(600, 660)]), False)

    def test_new_interval_contains_existing_is_rejected(self):
        self.assertIs(can_book(590, 670, 540, False, [(600, 660)]), False)

    def test_existing_bookings_unchanged_after_overlap(self):
        existing = [(600, 660)]
        original = existing.copy()

        result = can_book(630, 650, 540, False, existing)

        self.assertIs(result, False)
        self.assertEqual(existing, original)

    def test_existing_bookings_unchanged_when_blocked(self):
        existing = [(600, 660)]
        original = existing.copy()

        result = can_book(660, 720, 540, True, existing)

        self.assertIs(result, False)
        self.assertEqual(existing, original)
    def test_equal_start_and_end_is_rejected(self):
        existing = [(600, 660)]

        result = can_book(720, 720, 540, False, existing)

        self.assertFalse(result)

    def test_existing_bookings_order_is_not_modified(self):
        existing = [(700, 760), (600, 660)]
        original = existing.copy()

        result = can_book(780, 840, 540, False, existing)

        self.assertTrue(result)
        self.assertEqual(existing, original)



if __name__ == "__main__":
    unittest.main()
