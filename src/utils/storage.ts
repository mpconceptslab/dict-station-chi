import { openDB, type IDBPDatabase } from 'idb';

export interface WordList {
  id: string;
  name: string;
  words: string[];
  paragraphs: string[];  // Full text blocks for pre-dictation
  createdAt: number;
  sourceImage?: string; // base64 of the original image
  rawText?: string;     // Original OCR text for reference
}

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
}

export interface CorrectionSession {
  id: string;
  dictationSessionId: string;
  wrongWords: { word: string; userAnswer: string }[];
  practiceRounds: { wordIndex: number; attempts: string[] }[];
  completedAt?: number;
}

const DB_NAME = 'dictation-app-db';
const DB_VERSION = 2;

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
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
  }
  return lists.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getWordList(id: string): Promise<WordList | undefined> {
  const db = await getDB();
  const list = await db.get('wordLists', id);
  // Backward compatibility: ensure paragraphs array exists
  if (list && !list.paragraphs) {
    list.paragraphs = [];
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
