def analyze_marks(marks):
    if not marks:
        return None

    total_students = len(marks)
    average = sum(marks) / total_students
    highest = max(marks)
    lowest = min(marks)
    passing_count = sum(1 for mark in marks if mark >= 50)
    pass_rate = (passing_count / total_students) * 100

    return {
        "total_students": total_students,
        "average": average,
        "highest": highest,
        "lowest": lowest,
        "passed": passing_count,
        "failed": total_students - passing_count,
        "pass_rate_percentage": pass_rate,
    }


# Example usage:
if __name__ == "__main__":
    student_marks = [85, 42, 90, 67, 55, 38, 73, 91]
    results = analyze_marks(student_marks)

    for key, value in results.items():
        print(f"{key.replace('_', ' ').title()}: {value:.2f}" if isinstance(value, float) else f"{key.replace('_', ' ').title()}: {value}")