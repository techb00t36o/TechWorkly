// Detects external contact info that must not leave the platform (PRD 5.8).
// Shared by ChatThread's composer to live-warn and hard-block sends.

const EXTERNAL_CONTACT_PATTERNS = [
  /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/, // email addresses
  /\+?\d[\d\s().-]{7,}\d/, // phone numbers (7+ digit runs)
  /\b(wa\.me|t\.me|whatsapp|telegram|signal|viber)\b/i, // messenger apps
  /https?:\/\/(www\.)?(instagram|facebook|linkedin|twitter|x)\.com/i, // social URLs
]

// Returns true when text contains external contact info that must stay off-platform
export function containsExternalContact(text) {
  return EXTERNAL_CONTACT_PATTERNS.some((re) => re.test(text))
}
