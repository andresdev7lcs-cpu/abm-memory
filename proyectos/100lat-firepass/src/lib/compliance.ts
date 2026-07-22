const bannedWords = ['iul', 'annuity', 'insurance'];

export function hasComplianceIssue(text: string) {
  const lower = text.toLowerCase();
  return bannedWords.some((word) => lower.includes(word));
}
