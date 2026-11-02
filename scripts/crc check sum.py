def crc_remainder(data: str, divisor: str) -> str:
    n = len(divisor) - 1
    bits = list(data + "0" * n)
    for i in range(len(data)):
        if bits[i] == "1":
            for j in range(len(divisor)):
                bits[i + j] = str(int(bits[i + j]) ^ int(divisor[j]))
    return "".join(bits[-n:])

divisor  = "10011"
original = "11010110"
target   = crc_remainder(original, divisor)
print("Original CRC:", target)

matches = []
for x in range(32):                      # all 5-bit "*" values
    cand = "111" + format(x, "05b")
    if crc_remainder(cand, divisor) == target:
        matches.append(cand)

print("Valid data values:", matches)