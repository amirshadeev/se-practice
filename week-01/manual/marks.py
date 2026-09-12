a = [85, 23, 45, 90, 92]
b = [88, 47, -5, 101, "abc", 73, 50, "", 100]
c = [10, 20, 30]
d = ["abc", "", "xyz", ]
x = 0
a = [x for x in a if type(x) is int and 0 <= x <= 100]
b = [x for x in b if type(x) is int and 0 <= x <= 100]
c = [x for x in c if type(x) is int and 0 <= x <= 100]
d = [x for x in d if type(x) is int and 0 <= x <= 100]
pass_rateA = [x for x in a if x >= 50]
pass_rateB = [x for x in b if x >= 50]
pass_rateC = [x for x in c if x >= 50]
pass_rateD = [x for x in d if x >= 50]

avgA = sum(a) / len(a)
avgB = sum(b) / len(b)
avgC = sum(c)/ len(c)
if len(d) > 0:
    avgD = sum(d) / len(d)

print("A case")

print(f"Valid: {len(a)}")
print(f"avg: {avgA:.2f}")
print(f"max: {max(a)}")
print(f"min: {min(a)}")
print(f"pass: {(len(pass_rateA) / len(a)) * 100}%") 

print("\n")
print("B CASE")

print(f"Valid: {len(b)}")
print(f"avg: {avgB:.2f}")
print(f"max: {max(b)}")
print(f"min: {min(b)}")
print(f"pass: {(len(pass_rateB) / len(b)) * 100}%")

print("\n")
print("C case")

print(f"Valid: {len(c)}")
print(f"avg: {avgC:.2f}")
print(f"max: {max(c)}")
print(f"min: {min(c)}")
print(f"pass: {(len(pass_rateC) / len(c)) * 100}%") 

print("\n")
if len(d) > 0:

    print("D case")

    print(f"Valid: {len(d)}")
    print(f"avg: {avgD:.2f}")
    print(f"max{max(d)}")
    print(f"min{min(d)}")
    print(f"pass: {(len(pass_rateD) / len(d)) * 100}%") 
else:print("Case is empty!")