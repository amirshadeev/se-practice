def analyze_marks(marks, pass_mark=50):
    if not marks:
        raise ValueError("The marks list cannot be empty.")

    if isinstance(pass_mark, bool) or not isinstance(pass_mark, (int, float)):
        raise ValueError("pass_mark must be a numeric value.")
    
    if not (0 <= pass_mark <= 100):
        raise ValueError("pass_mark must be between 0 and 100.")

    clean_marks = []
    passing_count = 0

    for m in marks:
        if isinstance(m, bool) or not isinstance(m, (int, float)):
            raise ValueError(f"Non-numeric value found in marks: {m}")
        if not (0 <= m <= 100):
            raise ValueError(f"Mark out of valid range [0, 100]: {m}")
        
        clean_marks.append(float(m))
        if m >= pass_mark:
            passing_count += 1

    total_marks = len(clean_marks)
    average = sum(clean_marks) / total_marks
    highest = max(clean_marks)
    lowest = min(clean_marks)
    pass_rate = round((passing_count / total_marks) * 100, 2)

    return {
        "average": average,
        "highest": highest,
        "lowest": lowest,
        "pass_rate": pass_rate,
    }


# ==========================================
# Unit Tests
# ==========================================
import math

def assert_almost_equal(a, b, tol=0.01):
    return math.isclose(a, b, abs_tol=tol)

def run_tests():
    # 1. One mark
    res = analyze_marks([75])
    assert res == {"average": 75.0, "highest": 75.0, "lowest": 75.0, "pass_rate": 100.0}

    # 2. Decimal marks
    res = analyze_marks([40.5, 60.25, 80.75], 50)
    assert assert_almost_equal(res["average"], 60.5)
    assert res["highest"] == 80.75
    assert res["lowest"] == 40.5
    assert assert_almost_equal(res["pass_rate"], 66.67)

    # 3. Custom pass_mark
    res = analyze_marks([40, 60, 80], pass_mark=70)
    assert res["average"] == 60.0
    assert res["highest"] == 80.0
    assert res["lowest"] == 40.0
    assert assert_almost_equal(res["pass_rate"], 33.33)

    # 4. Empty list
    try:
        analyze_marks([])
        assert False, "Should have raised ValueError for empty list"
    except ValueError:
        pass

    # 5. Non-numeric value
    try:
        analyze_marks([50, "sixty", 70])
        assert False, "Should have raised ValueError for non-numeric item"
    except ValueError:
        pass

    try:
        analyze_marks([50, True, 70])
        assert False, "Should have raised ValueError for boolean item"
    except ValueError:
        pass

    # 6. Marks below 0 or above 100
    try:
        analyze_marks([-5, 50, 70])
        assert False, "Should have raised ValueError for mark < 0"
    except ValueError:
        pass

    try:
        analyze_marks([50, 105, 70])
        assert False, "Should have raised ValueError for mark > 100"
    except ValueError:
        pass

run_tests()