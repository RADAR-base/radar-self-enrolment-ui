// Simplified UK Postcode string taken from https://stackoverflow.com/questions/164979/regex-for-matching-uk-postcodes
const SIMPLIFIED_REGEXP = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/
// Below contains edge cases
const COMPLICATED_REGEXP_STRING = /^(([A-Z][A-HJ-Y]?\d[A-Z\d]?|ASCN|STHL|TDCU|BBND|[BFS]IQQ|PCRN|TKCA) ?\d[A-Z]{2}|BFPO ?\d{1,4}|(KY\d|MSR|VG|AI)[ -]?\d{4}|[A-Z]{2} ?\d{2}|GE ?CX|GIR ?0A{2}|SAN ?TA1)$/

export default function ukPostcode(s: string): boolean {
  return SIMPLIFIED_REGEXP.test(s)
}