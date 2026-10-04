import { openDB, type IDBPDatabase } from 'idb';
import { translate } from '../i18n';

export interface WordList {
  id: string;
  name: string;
  words: string[];
  paragraphWords: string[]; // Keywords selected from paragraphs
  paragraphs: string[];  // Full text blocks for pre-dictation
  sentences: string[];  // Sentences split from paragraphs for dictation
  createdAt: number;
  sourceImage?: string; // base64 of the original image
  rawText?: string;     // Original OCR text for reference
  language?: string;    // 'english', 'chinese', 'chinese_trad', 'english_chinese'
  voice?: string;       // 'zh-CN' (Mandarin), 'zh-HK' (Cantonese), 'zh-TW' (Taiwanese)
}

/**
 * One handwriting box in the grid dictation flow.
 * `image` is the child's own stroke drawing (a small PNG dataURL) for that single
 * target character; `recognized`/`correct` are filled in by the one-pass AI check.
 */
export interface HandwritingCell {
  charIndex: number;
  targetChar: string;
  image?: string;      // downscaled PNG dataURL of what the child drew (empty = skipped)
  recognized?: string; // what the OCR engine read for this box
  correct?: boolean;   // AI/parent verdict; may be flipped manually on the marking page
}

export type CheckStatus = 'pending' | 'ai-checked' | 'manual' | 'failed';

export interface DictationSession {
  id: string;
  wordListId: string;
  wordListName: string;
  mode: 'standard' | 'pre-dictation';
  words: string[];
  userAnswers: string[];
  correctAnswers: string[];
  wrongIndices: number[];
  score: number;
  totalWords: number;
  timestamp: number;
  // ── Grid handwriting dictation (optional; absent on legacy/typing sessions) ──
  inputType?: 'handwriting' | 'typing' | 'mixed';
  cells?: HandwritingCell[][];   // parallel to words: one cell array per dictated item
  sheets?: number;               // how many composite images were sent in the single pass
  checkStatus?: CheckStatus;     // lifecycle of the AI/parent check
  markingViewedAt?: number;      // when the marking page was last opened
}

export interface CorrectionSession {
  id: string;
  dictationSessionId: string;
  wrongWords: { word: string; userAnswer: string }[];
  // `attempts` keeps any typed answer; `images` keeps the 3 rewrite drawings per word.
  practiceRounds: { wordIndex: number; attempts: string[]; images?: string[] }[];
  completedAt?: number;
}

/* ─────────── reading (TTS) speed — shared across all pages & languages ─────────── */
// Persisted under the same 'voice_speed' key the Settings page slider writes to,
// so the quick speed button and the slider always stay in sync.
const VOICE_SPEED_KEY = 'voice_speed';
export const READ_SPEED_STEPS = [0.6, 0.8, 1.0, 1.2]; // cycled by the on-page speed button
export function getVoiceSpeed(): number {
  const v = Number(localStorage.getItem(VOICE_SPEED_KEY));
  return Number.isFinite(v) && v >= 0.5 && v <= 1.5 ? v : 0.8;
}
export function setVoiceSpeed(speed: number): void {
  localStorage.setItem(VOICE_SPEED_KEY, String(speed));
  window.dispatchEvent(new Event('voice-speed-changed'));
}
export function speedLabel(speed: number): string {
  if (speed <= 0.6) return translate('speed.slow');
  if (speed < 0.9) return translate('speed.normal');
  if (speed < 1.1) return translate('speed.fast');
  return translate('speed.veryFast');
}
/** Advance to the next preset (wrapping around) and return the new speed. */
export function cycleVoiceSpeed(): number {
  const cur = getVoiceSpeed();
  let idx = READ_SPEED_STEPS.findIndex(s => Math.abs(s - cur) < 0.001);
  idx = idx === -1 ? 0 : (idx + 1) % READ_SPEED_STEPS.length;
  const next = READ_SPEED_STEPS[idx];
  setVoiceSpeed(next);
  return next;
}

// Get current user ID for data isolation
function getUserId(): string {
  const session = localStorage.getItem('current_session');
  if (session) {
    try {
      const user = JSON.parse(session);
      return `user_${user.username}`;
    } catch (e) {
      // ignore
    }
  }
  return 'default';
}

// Get user-prefixed localStorage key
function getUserKey(key: string): string {
  return `${getUserId()}_${key}`;
}

const DB_NAME = 'dictation-app-db';
const DB_VERSION = 2;

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (!dbPromise) {
    const userId = getUserId();
    const userDbName = `${DB_NAME}-${userId}`;
    dbPromise = openDB(userDbName, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('wordLists')) {
          db.createObjectStore('wordLists', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('sessions')) {
          const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' });
          sessionStore.createIndex('timestamp', 'timestamp');
        }
        if (!db.objectStoreNames.contains('corrections')) {
          db.createObjectStore('corrections', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

// Word Lists
export async function saveWordList(wordList: WordList): Promise<void> {
  const db = await getDB();
  await db.put('wordLists', wordList);
}

export async function getAllWordLists(): Promise<WordList[]> {
  const db = await getDB();
  const lists = await db.getAll('wordLists');
  // Backward compatibility: ensure paragraphs array exists
  for (const list of lists) {
    if (!list.paragraphs) {
      list.paragraphs = [];
    }
    if (!list.paragraphWords) {
      list.paragraphWords = [];
    }
    if (!list.sentences) {
      list.sentences = [];
    }
  }
  return lists.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getWordList(id: string): Promise<WordList | undefined> {
  const db = await getDB();
  const list = await db.get('wordLists', id);
  // Backward compatibility: ensure paragraphs array exists
  if (list) {
    if (!list.paragraphs) {
      list.paragraphs = [];
    }
    if (!list.paragraphWords) {
      list.paragraphWords = [];
    }
    if (!list.sentences) {
      list.sentences = [];
    }
  }
  return list;
}

export async function deleteWordList(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('wordLists', id);
}

// Dictation Sessions
export async function saveSession(session: DictationSession): Promise<void> {
  const db = await getDB();
  await db.put('sessions', session);
}

export async function getRecentSessions(limit = 10): Promise<DictationSession[]> {
  const db = await getDB();
  const sessions = await db.getAllFromIndex('sessions', 'timestamp');
  return sessions.reverse().slice(0, limit);
}

export async function getSession(id: string): Promise<DictationSession | undefined> {
  const db = await getDB();
  return db.get('sessions', id);
}

export async function getAllCorrections(): Promise<CorrectionSession[]> {
  const db = await getDB();
  return db.getAll('corrections');
}

// Correction Sessions
export async function saveCorrection(correction: CorrectionSession): Promise<void> {
  const db = await getDB();
  await db.put('corrections', correction);
}

export async function getCorrection(id: string): Promise<CorrectionSession | undefined> {
  const db = await getDB();
  return db.get('corrections', id);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// Studied Words Tracking
export interface StudiedWords {
  words: string[]; // List of words that have been studied
  lastStudied: number; // Timestamp of last study session
}

export function getStudiedWords(listId: string): StudiedWords {
  const stored = localStorage.getItem(getUserKey(`studied_${listId}`));
  if (stored) {
    return JSON.parse(stored);
  }
  return { words: [], lastStudied: 0 };
}

export function markWordsAsStudied(listId: string, words: string[]): void {
  const existing = getStudiedWords(listId);
  const existingSet = new Set(existing.words);
  
  // Add new words to the set
  for (const word of words) {
    existingSet.add(word);
  }
  
  const updated: StudiedWords = {
    words: Array.from(existingSet),
    lastStudied: Date.now()
  };
  
  localStorage.setItem(getUserKey(`studied_${listId}`), JSON.stringify(updated));
}

export function getUnstudiedWords(listId: string, allWords: string[]): string[] {
  const studied = getStudiedWords(listId);
  const studiedSet = new Set(studied.words);
  return allWords.filter(w => !studiedSet.has(w));
}

export function resetStudiedWords(listId: string): void {
  localStorage.removeItem(getUserKey(`studied_${listId}`));
}

// Paragraph Words Tracking
export interface StudiedParagraphWords {
  words: string[];
  lastStudied: number;
}

export function getStudiedParagraphWords(listId: string): StudiedParagraphWords {
  const stored = localStorage.getItem(getUserKey(`studied_pw_${listId}`));
  if (stored) {
    return JSON.parse(stored);
  }
  return { words: [], lastStudied: 0 };
}

export function markParagraphWordsAsStudied(listId: string, words: string[]): void {
  const existing = getStudiedParagraphWords(listId);
  const existingSet = new Set(existing.words);
  for (const word of words) {
    existingSet.add(word);
  }
  const updated: StudiedParagraphWords = {
    words: Array.from(existingSet),
    lastStudied: Date.now()
  };
  localStorage.setItem(getUserKey(`studied_pw_${listId}`), JSON.stringify(updated));
}

export function getUnstudiedParagraphWords(listId: string, allWords: string[]): string[] {
  const studied = getStudiedParagraphWords(listId);
  const studiedSet = new Set(studied.words);
  return allWords.filter(w => !studiedSet.has(w));
}

export function resetStudiedParagraphWords(listId: string): void {
  localStorage.removeItem(getUserKey(`studied_pw_${listId}`));
}

// Sentences Tracking
export interface StudiedSentences {
  sentences: string[];
  lastStudied: number;
}

export function getStudiedSentences(listId: string): StudiedSentences {
  const stored = localStorage.getItem(getUserKey(`studied_sent_${listId}`));
  if (stored) {
    return JSON.parse(stored);
  }
  return { sentences: [], lastStudied: 0 };
}

export function markSentencesAsStudied(listId: string, sentences: string[]): void {
  const existing = getStudiedSentences(listId);
  const existingSet = new Set(existing.sentences);
  for (const s of sentences) {
    existingSet.add(s);
  }
  const updated: StudiedSentences = {
    sentences: Array.from(existingSet),
    lastStudied: Date.now()
  };
  localStorage.setItem(getUserKey(`studied_sent_${listId}`), JSON.stringify(updated));
}

export function getUnstudiedSentences(listId: string, allSentences: string[]): string[] {
  const studied = getStudiedSentences(listId);
  const studiedSet = new Set(studied.sentences);
  return allSentences.filter(s => !studiedSet.has(s));
}

export function resetStudiedSentences(listId: string): void {
  localStorage.removeItem(getUserKey(`studied_sent_${listId}`));
}

// Seen Syllabus IDs (for "new" badge)
export function getSeenSyllabusIds(): string[] {
  const stored = localStorage.getItem(getUserKey('seen_syllabus_ids'));
  return stored ? JSON.parse(stored) : [];
}

export function markSyllabusAsSeen(listId: string): void {
  const seen = getSeenSyllabusIds();
  if (!seen.includes(listId)) {
    seen.push(listId);
    localStorage.setItem(getUserKey('seen_syllabus_ids'), JSON.stringify(seen));
  }
}

// === Points System ===

export function getPoints(): number {
  const stored = localStorage.getItem(getUserKey('user_points'));
  return stored ? Number(stored) : 0;
}

export function addPoints(amount: number): void {
  const current = getPoints();
  localStorage.setItem(getUserKey('user_points'), String(current + amount));
}

export function deductPoints(amount: number): void {
  const current = getPoints();
  localStorage.setItem(getUserKey('user_points'), String(Math.max(0, current - amount)));
}

// Track if a syllabus has been fully dictated (for re-dictation point reduction)
export function hasCompletedFullSyllabus(listId: string): boolean {
  const stored = localStorage.getItem(getUserKey('completed_full_syllabus'));
  const ids: string[] = stored ? JSON.parse(stored) : [];
  return ids.includes(listId);
}

export function markFullSyllabusCompleted(listId: string): void {
  const stored = localStorage.getItem('completed_full_syllabus');
  const ids: string[] = stored ? JSON.parse(stored) : [];
  if (!ids.includes(listId)) {
    ids.push(listId);
    localStorage.setItem('completed_full_syllabus', JSON.stringify(ids));
  }
}

/**
 * Calculate dictation points:
 * - Before 100% dictation: % of syllabus x mark (= syllabusPct * marksPct / 100)
 * - After 100% dictation (re-dictation): % of syllabus x mark / 2
 * - Full 100% syllabus dictation: % of syllabus x mark (= 100 points max)
 * - Perfect score bonus: +20 points if 100 marks on 100% full dictation
 */
export function calculateDictationPoints(
  listId: string,
  wordsDictated: number,
  totalWordsInSyllabus: number,
  marksPct: number
): { points: number; bonus: number } {
  const syllabusPct = (wordsDictated / Math.max(totalWordsInSyllabus, 1)) * 100;
  const hasCompleted = hasCompletedFullSyllabus(listId);
  
  let points: number;
  let bonus = 0;
  
  // Full 100% syllabus dictation (first time or re-dictation at 100%)
  if (syllabusPct >= 100) {
    points = Math.floor(syllabusPct * marksPct / 100);
    
    // Perfect score bonus
    if (marksPct === 100) {
      bonus = 20;
    }
    
    // Mark as completed
    markFullSyllabusCompleted(listId);
  } else if (hasCompleted) {
    // Re-dictation after 100% was already completed: half points
    points = Math.max(1, Math.floor(syllabusPct * marksPct / 200));
  } else {
    // First time dictation, not yet 100%: full points
    points = Math.max(1, Math.floor(syllabusPct * marksPct / 100));
  }
  
  return { points, bonus };
}

/**
 * Calculate study/revision points:
 * - Before or after 100% dictation: % of syllabus x mark / 10
 */
export function calculateStudyPoints(
  _listId: string,
  cardsReviewed: number,
  totalCardsInSyllabus: number,
  accuracyPct: number
): number {
  const syllabusPct = (cardsReviewed / Math.max(totalCardsInSyllabus, 1)) * 100;
  // % of syllabus x mark / 10
  return Math.max(1, Math.floor(syllabusPct * accuracyPct / 1000));
}

// === Gift Reward System ===

export interface Gift {
  id: string;
  name: string;
  pointsCost: number;
}

export function getGifts(): Gift[] {
  const stored = localStorage.getItem('user_gifts');
  return stored ? JSON.parse(stored) : [];
}

export function saveGifts(gifts: Gift[]): void {
  localStorage.setItem('user_gifts', JSON.stringify(gifts));
}

// === Redeem Records ===

export interface RedeemRecord {
  id: string;
  giftName: string;
  pointsCost: number;
  redeemedAt: number;
  purchased?: boolean;
}

export function getRedeemRecords(): RedeemRecord[] {
  const stored = localStorage.getItem('redeem_records');
  return stored ? JSON.parse(stored) : [];
}

export function addRedeemRecord(giftName: string, pointsCost: number): void {
  const records = getRedeemRecords();
  records.unshift({
    id: generateId(),
    giftName,
    pointsCost,
    redeemedAt: Date.now(),
    purchased: false,
  });
  localStorage.setItem('redeem_records', JSON.stringify(records));
}

export function markRecordPurchased(recordId: string): void {
  const records = getRedeemRecords();
  const updated = records.map(r =>
    r.id === recordId ? { ...r, purchased: true } : r
  );
  localStorage.setItem('redeem_records', JSON.stringify(updated));
}

// === Credit System ===
const PROMO_CODES: Record<string, number> = {
  'free10': 10,
  'free20': 20,
  'free30': 30,
  'free40': 40,
};

export function getCredits(): number {
  const stored = localStorage.getItem(getUserKey('credits'));
  return stored ? parseInt(stored, 10) : 0;
}

export function setCredits(amount: number): void {
  localStorage.setItem(getUserKey('credits'), amount.toString());
}

export function addCredits(amount: number): number {
  const current = getCredits();
  const newTotal = current + amount;
  setCredits(newTotal);
  return newTotal;
}

export function useCredit(): boolean {
  const current = getCredits();
  if (current <= 0) return false;
  setCredits(current - 1);
  return true;
}

export function hasCredits(): boolean {
  return getCredits() > 0;
}

export function validatePromoCode(code: string): { valid: boolean; credits: number } {
  const normalizedCode = code.trim().toLowerCase();
  const credits = PROMO_CODES[normalizedCode];
  if (credits !== undefined) {
    return { valid: true, credits };
  }
  return { valid: false, credits: 0 };
}

export function redeemPromoCode(code: string): { success: boolean; credits: number; message: string } {
  const result = validatePromoCode(code);
  if (result.valid) {
    const newTotal = addCredits(result.credits);
    return { success: true, credits: result.credits, message: `已加入 ${result.credits} 次！目前剩餘 ${newTotal} 次` };
  }
  return { success: false, credits: 0, message: '無效的推廣碼' };
}

// === Review System ===
export interface Review {
  id: string;
  username: string;
  text: string;
  rating: number; // 1-5 stars
  beforePhoto?: string; // base64
  afterPhoto?: string; // base64
  createdAt: number;
}

const REVIEW_CREDIT_REWARD = 5;

export function getReviews(): Review[] {
  const stored = localStorage.getItem('app_reviews');
  return stored ? JSON.parse(stored) : [];
}

export function addReview(username: string, text: string, rating: number, beforePhoto?: string, afterPhoto?: string): { success: boolean; message: string } {
  if (text.trim().length < 20) {
    return { success: false, message: '評論至少需要20個字' };
  }

  const reviews = getReviews();
  
  // Check if user already reviewed
  const existingReview = reviews.find(r => r.username === username);
  if (existingReview) {
    return { success: false, message: '你已經提交過評論了' };
  }

  const newReview: Review = {
    id: generateId(),
    username,
    text: text.trim(),
    rating,
    beforePhoto,
    afterPhoto,
    createdAt: Date.now(),
  };

  reviews.unshift(newReview);
  localStorage.setItem('app_reviews', JSON.stringify(reviews));

  // Award 5 credits
  const newTotal = addCredits(REVIEW_CREDIT_REWARD);
  return { success: true, message: `感謝你的評論！已獲得 ${REVIEW_CREDIT_REWARD} 次使用次數，目前剩餘 ${newTotal} 次` };
}

export function hasUserReviewed(username: string): boolean {
  const reviews = getReviews();
  return reviews.some(r => r.username === username);
}
