def analyze_marks(marks, pass_mark=50):
    if not isinstance(marks, list) or not marks:
        raise ValueError("The 'marks' argument must be a non-empty list.")
    
    # Check for empty list or valid numeric range
    processed_marks = []
    for mark in marks:
        # Exclude booleans since isinstance(True, int) evaluates to True in Python
        if isinstance(mark, bool) or not isinstance(mark, (int, float)):
            raise ValueError(f"Invalid non-numeric value found: {mark}")
        if not (0 <= mark <= 100):
            raise ValueError(f"Mark {mark} is out of range [0, 100].")
        processed_marks.append(float(mark))

    total_count = len(processed_marks)
    highest = max(processed_marks)
    lowest = min(processed_marks)
    average = sum(processed_marks) / total_count
    
    passed_count = sum(1 for mark in processed_marks if mark >= pass_mark)
    pass_rate = (passed_count / total_count) * 100

    return {
        "average": round(average, 2),
        "highest": highest if not highest.is_integer() else int(highest),
        "lowest": lowest if not lowest.is_integer() else int(lowest),
        "pass_rate": round(pass_rate, 2)
    }


# ==========================================
# Tests
# ==========================================
import unittest

class TestAnalyzeMarks(unittest.TestCase):

    def test_single_mark(self):
        self.assertEqual(
            analyze_marks([75]),
            {"average": 75, "highest": 75, "lowest": 75, "pass_rate": 100.0}
        )

    def test_decimals(self):
        self.assertEqual(
            analyze_marks([40.5, 60.25, 80.75], pass_mark=50),
            {"average": 60.5, "highest": 80.75, "lowest": 40.5, "pass_rate": 66.67}
        )

    def test_custom_pass_mark(self):
        # 60 and 80 pass when pass_mark is 60 (2 out of 3 = 66.67%)
        self.assertEqual(
            analyze_marks([40, 60, 80], pass_mark=60),
            {"average": 60, "highest": 80, "lowest": 40, "pass_rate": 66.67}
        )

    def test_empty_list(self):
        with self.assertRaises(ValueError):
            analyze_marks([])

    def test_text_value(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, "eighty", 70])

    def test_out_of_range_low(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, -5, 70])

    def test_out_of_range_high(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, 105, 70])


if __name__ == "__main__":
    unittest.main(verbosity=2)