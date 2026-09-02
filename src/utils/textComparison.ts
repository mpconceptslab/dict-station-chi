/**
 * Normalize a word for comparison: lowercase, trim, remove extra spaces
 */
export function normalizeWord(word: string): string {
  return word.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Calculate Levenshtein distance between two strings
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Check if user's answer matches the expected word (case-insensitive, allows minor typos)
 * Returns { isCorrect, similarity } where similarity is 0-1
 */
export function checkWord(userAnswer: string, expectedWord: string): { isCorrect: boolean; similarity: number } {
  const normalizedUser = normalizeWord(userAnswer);
  const normalizedExpected = normalizeWord(expectedWord);

  if (normalizedUser === normalizedExpected) {
    return { isCorrect: true, similarity: 1 };
  }

  const maxLen = Math.max(normalizedUser.length, normalizedExpected.length);
  if (maxLen === 0) return { isCorrect: true, similarity: 1 };

  const distance = levenshteinDistance(normalizedUser, normalizedExpected);
  const similarity = 1 - distance / maxLen;

  // Allow very minor typos (similarity > 0.85) as "close but wrong" - still mark wrong for learning
  return { isCorrect: false, similarity };
}

/**
 * Compare full text answers word by word
 * Returns arrays of correct and wrong word positions
 */
export function compareText(
  userText: string,
  expectedText: string
): {
  results: { expected: string; user: string; correct: boolean }[];
  score: number;
  totalWords: number;
} {
  const expectedWords = normalizeWord(expectedText).split(/\s+/);
  const userWords = normalizeWord(userText).split(/\s+/);

  const results: { expected: string; user: string; correct: boolean }[] = [];
  const maxLen = Math.max(expectedWords.length, userWords.length);

  for (let i = 0; i < maxLen; i++) {
    const expected = expectedWords[i] || '';
    const user = userWords[i] || '';
    const check = checkWord(user, expected);
    results.push({ expected, user, correct: check.isCorrect });
  }

  const correctCount = results.filter(r => r.correct).length;

  return {
    results,
    score: correctCount,
    totalWords: expectedWords.length,
  };
}
