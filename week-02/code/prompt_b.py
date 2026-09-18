def analyze_marks(marks, pass_mark=50):
    if not marks:
        raise ValueError("The marks list cannot be empty.")

    validated_marks = []
    for mark in marks:
        # Check for non-numeric values (excluding booleans since bool is a subclass of int)
        if isinstance(mark, bool) or not isinstance(mark, (int, float)):
            raise ValueError(f"Non-numeric value encountered: {mark}")
        
        # Check range constraints
        if not (0 <= mark <= 100):
            raise ValueError(f"Mark out of range [0, 100]: {mark}")
            
        validated_marks.append(float(mark))

    total_count = len(validated_marks)
    passed_count = sum(1 for mark in validated_marks if mark >= pass_mark)

    return {
        "average": sum(validated_marks) / total_count,
        "highest": max(validated_marks),
        "lowest": min(validated_marks),
        "pass_rate": (passed_count / total_count) * 100
    }