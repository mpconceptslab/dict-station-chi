/**
 * Analyze raw OCR text and separate it into:
 * - paragraphs: full text blocks for pre-dictation
 * - words: individual keywords for keyword dictation
 * 
 * Smart detection: 
 * - Lines with many words (3+) are treated as paragraphs/sentences
 * - Lines with 1-2 words are treated as word list items
 * - If the whole text looks like a paragraph, extract keywords from it
 */
export function analyzeContent(rawText: string): { words: string[]; paragraphs: string[] } {
  if (!rawText || !rawText.trim()) {
    return { words: [], paragraphs: [] };
  }

  // Normalize line endings
  const normalized = rawText.replace(/\r\n/g, '\n').trim();

  // Split into lines
  const lines = normalized
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);

  // Remove common list numbering patterns
  const cleanedLines = lines.map(l =>
    l.replace(/^\d+[.)]\s*/, '')    // "1. word" -> "word"
       .replace(/^[a-z][.)]\s*/i, '') // "a) word" -> "word"
       .replace(/^[-*•]\s*/, '')      // "- word" or "* word" -> "word"
       .trim()
  ).filter(l => l.length > 0);

  // Classify each line
  const wordListLines: string[] = [];
  const paragraphLines: string[] = [];

  for (const line of cleanedLines) {
    const wordCount = line.split(/\s+/).filter(w => w.length > 0).length;

    if (wordCount >= 3) {
      // This line looks like a sentence/paragraph
      paragraphLines.push(line);
    } else {
      // Could be comma-separated words on one line
      const commaSplit = line.split(/[,;]+/).map(w => w.trim()).filter(w => w.length > 0);
      if (commaSplit.length >= 3) {
        // Multiple comma-separated items - treat as word list
        wordListLines.push(...commaSplit);
      } else {
        wordListLines.push(line);
      }
    }
  }

  // Extract keywords from paragraphs (for word list)
  const keywordsFromParagraphs = paragraphLines.flatMap(line => extractKeywords(line));

  // Parse word list lines into individual words
  const wordsFromList = wordListLines.flatMap(line => {
    // Split on commas, semicolons, tabs
    return line.split(/[,;\t]+/)
      .map(w => w.trim())
      .filter(w => w.length > 0 && w.length < 50);
  });

  // Combine all words, remove duplicates
  const allWords = [...new Set([...wordsFromList, ...keywordsFromParagraphs])];

  // Deduplicate case-insensitive, keep first occurrence
  const seen = new Set<string>();
  const uniqueWords = allWords.filter(word => {
    const lower = word.toLowerCase();
    if (seen.has(lower)) return false;
    seen.add(lower);
    return true;
  });

  // Clean paragraphs - remove numbering and extra artifacts
  const paragraphs = paragraphLines.map(p =>
    p.replace(/\d+\.\s*/g, '').replace(/\s+/g, ' ').trim()
  ).filter(p => p.length > 0);

  return { words: uniqueWords, paragraphs };
}

/**
 * Extract meaningful keywords from a sentence/paragraph.
 * Filters out common stop words, short words, and punctuation.
 * Handles both English and Chinese text.
 */
function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    // Articles & determiners
    'the', 'a', 'an', 'this', 'that', 'these', 'those',
    // Be verbs
    'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    // Have/do verbs
    'have', 'has', 'had', 'do', 'does', 'did',
    // Modal verbs
    'will', 'would', 'could', 'should', 'may', 'might', 'shall', 'can', 'need', 'dare', 'ought',
    // Prepositions (short ones)
    'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'up', 'out', 'off', 'over',
    'under', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'about',
    'against', 'along', 'among', 'around', 'back', 'down', 'near', 'past', 'since', 'till',
    // Conjunctions
    'and', 'but', 'or', 'nor', 'yet', 'so',
    // Pronouns
    'i', 'me', 'my', 'he', 'she', 'it', 'they', 'we', 'you', 'us', 'him', 'her', 'them',
    'his', 'its', 'our', 'your', 'their', 'myself', 'yourself', 'himself', 'herself',
    // Question words
    'what', 'which', 'who', 'whom', 'how', 'why', 'when', 'where',
    // Common filler words
    'not', 'no', 'yes', 'just', 'very', 'too', 'also', 'than', 'then', 'once',
    'more', 'most', 'less', 'least', 'all', 'any', 'few', 'some', 'other', 'such', 'only', 'own',
    'same', 'each', 'every', 'both', 'either', 'neither', 'because', 'if', 'while',
    // Common short verbs
    'go', 'got', 'get', 'let', 'say', 'said', 'come', 'came', 'take', 'took', 'make', 'made',
    'see', 'saw', 'know', 'knew', 'think', 'thought', 'give', 'gave', 'tell', 'told',
    // Misc short words
    'there', 'here', 'now', 'way', 'use', 'used', 'try', 'tried', 'put', 'run', 'set',
  ]);

  // Check if text contains Chinese characters
  const hasChinese = /[\u4e00-\u9fff]/.test(text);

  if (hasChinese) {
    // For Chinese text: extract Chinese words (2+ character sequences)
    // Keep Chinese characters, letters, numbers, apostrophes, hyphens
    const cleaned = text.replace(/[^\u4e00-\u9fff a-zA-Z0-9'-]/g, ' ');
    
    // Split into tokens
    const tokens = cleaned.split(/\s+/).map(w => w.trim()).filter(w => w.length > 0);
    
    // Extract Chinese keywords (2+ character sequences)
    const chineseWords: string[] = [];
    for (const token of tokens) {
      // Check if it's a Chinese word
      if (/[\u4e00-\u9fff]/.test(token)) {
        // Extract 2+ character Chinese sequences
        const matches = token.match(/[\u4e00-\u9fff]{2,}/g);
        if (matches) {
          chineseWords.push(...matches);
        }
      } else {
        // English word - apply normal filtering
        if (token.length >= 3 && !stopWords.has(token.toLowerCase())) {
          chineseWords.push(token);
        }
      }
    }
    
    // Deduplicate
    return [...new Set(chineseWords)];
  }

  // For English text: original logic
  const words = text
    .replace(/[^a-zA-Z\s'-]/g, ' ')  // keep letters, apostrophes, hyphens
    .split(/\s+/)
    .map(w => w.trim())
    .filter(w => {
      if (w.length === 0) return false;
      // Skip words shorter than 3 letters (a, I, up, on, etc.)
      if (w.length < 3) return false;
      // Skip if it's a stop word
      if (stopWords.has(w.toLowerCase())) return false;
      return true;
    });

  // Deduplicate
  return [...new Set(words)];
}

/**
 * Parse OCR-extracted text into individual words (backward compatible)
 * Uses analyzeContent internally
 */
export function parseWordsFromText(rawText: string): string[] {
  const { words } = analyzeContent(rawText);
  return words;
}

/**
 * Select a random subset of words from a list
 */
export function selectRandomWords(words: string[], count: number): string[] {
  if (count >= words.length) return [...words];

  const shuffled = [...words];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

/**
 * Convert words to a paragraph string for pre-dictation mode
 */
export function wordsToParagraph(words: string[]): string {
  return words.join(' ');
}
