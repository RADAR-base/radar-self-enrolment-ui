function generateCheckDigit(s: string): number {
  let sum = 0;
  for (let i = 0; i < (s.length - 1); i++) {
    sum += (parseInt(s.charAt(i)) * (10 - i))
  }
  return 11 - (sum % 11);
}

export default function nhsNumber(s: string): boolean {
  s = s.replaceAll(' ', '').replaceAll('-', '')
  console.log(s)
  if (s.length != 10) {
    return false
  }
  let checkDigit = generateCheckDigit(s)
  if (checkDigit == 11) {
    checkDigit = 0
  } else if (checkDigit == 10) {
    return false
  }
  return parseInt(s.charAt(9)) == checkDigit
}