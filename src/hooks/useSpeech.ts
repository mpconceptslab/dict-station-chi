import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Detect if text is primarily Chinese
 * Returns 'en-US', 'zh-CN', 'zh-HK', or 'zh-TW' based on voiceOverride
 */
function detectLanguage(text: string, voiceOverride?: string): string {
  const chineseChars = (text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
  const totalChars = text.replace(/\s/g, '').length;
  if (totalChars === 0) return 'en-US';
  if (chineseChars / totalChars > 0.3) {
    // If user chose a Chinese voice variant, use it
    if (voiceOverride === 'zh-HK') return 'zh-HK';
    if (voiceOverride === 'zh-TW') return 'zh-TW';
    return 'zh-CN'; // Default to Mandarin
  }
  return 'en-US';
}

/**
 * Get the best available voice for the given language
 */
function getBestVoice(lang: string): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  
  // Try to find an exact match first
  let voice = voices.find(v => v.lang === lang);
  if (voice) return voice;
  
  // Try to find a voice with the same language prefix
  const langPrefix = lang.split('-')[0];
  voice = voices.find(v => v.lang.startsWith(langPrefix));
  if (voice) return voice;
  
  // For Cantonese, try to find any Chinese voice
  if (lang === 'zh-HK') {
    voice = voices.find(v => v.lang.startsWith('zh'));
    if (voice) return voice;
  }
  
  return null;
}

/**
 * Split text into sentences - handles both English and Chinese
 */
export function splitSentences(text: string): string[] {
  // Try English sentence splitting first
  const enSentences = text.match(/[^.!?]+[.!?]?\s*/g);
  if (enSentences && enSentences.length > 1) return enSentences;

  // Try Chinese sentence splitting (。！？；)
  const zhSentences = text.match(/[^。！？；]+[。！？；]?\s*/g);
  if (zhSentences && zhSentences.length > 1) return zhSentences;

  // Fall back: split by commas for Chinese, or return as-is
  const commaSplit = text.match(/[^，,]+[，,]?\s*/g);
  if (commaSplit && commaSplit.length > 1) return commaSplit;

  return [text];
}

/**
 * Punctuation-mark name maps used to expand marks into their spoken names
 * before feeding text to the SpeechSynthesis engine. The map chosen depends
 * on the TTS language so the names are pronounced naturally.
 */
const PUNCT_EN: Record<string, string> = {
  '——': ' dash ', '…': ' ellipsis ',
  '。': ' full stop ', '，': ' comma ', '？': ' question mark ', '！': ' exclamation mark ',
  '：': ' colon ', '；': ' semicolon ', '、': ' enumeration comma ',
  '「': ' open quotation mark ', '」': ' close quotation mark ',
  '『': ' open double quotation mark ', '』': ' close double quotation mark ',
  '（': ' open parenthesis ', '）': ' close parenthesis ',
  '.': ' full stop ', ',': ' comma ', '?': ' question mark ', '!': ' exclamation mark ',
  ':': ' colon ', ';': ' semicolon ',
  "'": ' apostrophe ', '"': ' quotation mark ',
  '-': ' hyphen ',
  '(': ' open parenthesis ', ')': ' close parenthesis ',
  '[': ' open bracket ', ']': ' close bracket ',
  '/': ' slash ',
};

const PUNCT_ZH: Record<string, string> = {
  '——': ' 破折號 ', '…': ' 省略號 ',
  '。': ' 句號 ', '，': ' 逗號 ', '？': ' 問號 ', '！': ' 感嘆號 ',
  '：': ' 冒號 ', '；': ' 分號 ', '、': ' 頓號 ',
  '「': ' 左引號 ', '」': ' 右引號 ',
  '『': ' 左雙引號 ', '』': ' 右雙引號 ',
  '（': ' 左括號 ', '）': ' 右括號 ',
  // Latin punctuation with Chinese names
  '.': ' 句號 ', ',': ' 逗號 ', '?': ' 問號 ', '!': ' 感嘆號 ',
  ':': ' 冒號 ', ';': ' 分號 ',
  "'": ' 撇號 ', '"': ' 引號 ',
  '-': ' 連字號 ',
  '(': ' 左括號 ', ')': ' 右括號 ',
  '[': ' 左方括號 ', ']': ' 右方括號 ',
  '/': ' 斜線 ',
};

/**
 * Replace every punctuation mark in `text` with its spoken name so that
 * TTS reads the mark aloud (e.g. "doing?" -> "doing question mark").
 */
function expandPunctuation(text: string, lang: string): string {
  const names = lang.startsWith('zh') ? PUNCT_ZH : PUNCT_EN;
  // Collapse consecutive identical marks into one (e.g. "……" -> "…")
  let result = text.replace(/…{2,}/g, '…').replace(/-{3,}/g, '——');
  // Longer marks first so "——" is replaced before "-"
  const sortedMarks = Object.keys(names).sort((a, b) => b.length - a.length);
  for (const mark of sortedMarks) {
    const escaped = mark.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(new RegExp(escaped, 'g'), names[mark]);
  }
  return result;
}

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const currentIndexRef = useRef(0);
  const lastSpokenRef = useRef<string>('');

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback((text: string, rate = 0.8, lang?: string, voiceOverride?: string): Promise<void> => {
    return new Promise((resolve) => {
      window.speechSynthesis.cancel();

      const detectedLang = lang || detectLanguage(text, voiceOverride);
      const spokenText = expandPunctuation(text, detectedLang);
      const utterance = new SpeechSynthesisUtterance(spokenText);
      utterance.rate = rate;
      utterance.pitch = 1;
      utterance.lang = detectedLang;
      
      // Try to get the best voice for the language
      const bestVoice = getBestVoice(detectedLang);
      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        lastSpokenRef.current = spokenText;
        resolve();
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        resolve();
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    });
  }, []);

  const speakWordsSequentially = useCallback(
    (words: string[], rate = 0.7, gapMs = 800, lang?: string, voiceOverride?: string): {
      start: () => void; pause: () => void; resume: () => void; stop: () => void;
      replayLast: () => void;
    } => {
      let stopped = false;
      let paused = false;
      let currentIdx = 0;
      let pausePromise: Promise<void> | null = null;
      let pauseResolver: (() => void) | null = null;

      const ensureNotPaused = (): Promise<void> => {
        if (!paused) return Promise.resolve();
        if (!pausePromise) {
          pausePromise = new Promise((resolve) => {
            pauseResolver = resolve;
          });
        }
        return pausePromise;
      };

      const wait = (ms: number): Promise<void> => {
        return new Promise((resolve) => {
          let elapsed = 0;
          const interval = setInterval(() => {
            if (stopped) { clearInterval(interval); resolve(); return; }
            if (paused) return;
            elapsed += 50;
            if (elapsed >= ms) { clearInterval(interval); resolve(); }
          }, 50);
        });
      };

      const speakWord = (idx: number): Promise<void> => {
        return new Promise((resolve) => {
          if (idx >= words.length || stopped) { resolve(); return; }

          const wordLang = lang || detectLanguage(words[idx], voiceOverride);
          const expandedWord = expandPunctuation(words[idx], wordLang);
          const utterance = new SpeechSynthesisUtterance(expandedWord);
          utterance.rate = rate;
          utterance.pitch = 1;
          utterance.lang = wordLang;

          utterance.onend = () => {
            lastSpokenRef.current = expandedWord;
            resolve();
          };
          utterance.onerror = () => resolve();

          currentIndexRef.current = idx;
          utteranceRef.current = utterance;
          window.speechSynthesis.speak(utterance);
        });
      };

      const run = async () => {
        setIsSpeaking(true);
        for (let i = currentIdx; i < words.length; i++) {
          if (stopped) break;
          await ensureNotPaused();
          if (stopped) break;
          await speakWord(i);
          if (!stopped && i < words.length - 1) {
            await wait(gapMs);
          }
        }
        setIsSpeaking(false);
        setIsPaused(false);
      };

      const start = () => {
        stopped = false;
        paused = false;
        pausePromise = null;
        pauseResolver = null;
        currentIdx = 0;
        run();
      };

      const pause = () => {
        paused = true;
        setIsPaused(true);
        window.speechSynthesis.pause();
      };

      const resume = () => {
        paused = false;
        setIsPaused(false);
        window.speechSynthesis.resume();
        if (pauseResolver) {
          pauseResolver();
          pauseResolver = null;
          pausePromise = null;
        }
      };

      const stop = () => {
        stopped = true;
        paused = false;
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
        if (pauseResolver) {
          pauseResolver();
          pauseResolver = null;
          pausePromise = null;
        }
      };

      const replayLast = () => {
        const last = lastSpokenRef.current;
        if (!last) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(last);
        utterance.rate = rate;
        utterance.pitch = 1;
        utterance.lang = lang || detectLanguage(last, voiceOverride);
        window.speechSynthesis.speak(utterance);
      };

      return { start, pause, resume, stop, replayLast };
    },
    []
  );

  const speakParagraph = useCallback(
    (text: string, rate = 0.7, lang?: string, voiceOverride?: string): {
      start: () => void; pause: () => void; resume: () => void; stop: () => void;
      replayLast: () => void;
    } => {
      const sentences = splitSentences(text);
      const detectedLang = lang || detectLanguage(text, voiceOverride);
      let stopped = false;
      let paused = false;
      let pausePromise: Promise<void> | null = null;
      let pauseResolver: (() => void) | null = null;

      const ensureNotPaused = (): Promise<void> => {
        if (!paused) return Promise.resolve();
        if (!pausePromise) {
          pausePromise = new Promise((resolve) => {
            pauseResolver = resolve;
          });
        }
        return pausePromise;
      };

      const speakSentence = (sentence: string): Promise<void> => {
        return new Promise((resolve) => {
          if (stopped) { resolve(); return; }
          const expandedSentence = expandPunctuation(sentence.trim(), detectedLang);
          const utterance = new SpeechSynthesisUtterance(expandedSentence);
          utterance.rate = rate;
          utterance.pitch = 1;
          utterance.lang = detectedLang;
          utterance.onend = () => {
            lastSpokenRef.current = expandedSentence;
            resolve();
          };
          utterance.onerror = () => resolve();
          utteranceRef.current = utterance;
          window.speechSynthesis.speak(utterance);
        });
      };

      const run = async () => {
        setIsSpeaking(true);
        for (const sentence of sentences) {
          if (stopped) break;
          await ensureNotPaused();
          if (stopped) break;
          await speakSentence(sentence);
        }
        setIsSpeaking(false);
        setIsPaused(false);
      };

      return {
        start: () => {
          stopped = false;
          paused = false;
          pausePromise = null;
          pauseResolver = null;
          run();
        },
        pause: () => {
          paused = true;
          setIsPaused(true);
          window.speechSynthesis.pause();
        },
        resume: () => {
          paused = false;
          setIsPaused(false);
          window.speechSynthesis.resume();
          if (pauseResolver) {
            pauseResolver();
            pauseResolver = null;
            pausePromise = null;
          }
        },
        stop: () => {
          stopped = true;
          paused = false;
          window.speechSynthesis.cancel();
          setIsSpeaking(false);
          setIsPaused(false);
          if (pauseResolver) {
            pauseResolver();
            pauseResolver = null;
            pausePromise = null;
          }
        },
        replayLast: () => {
          const last = lastSpokenRef.current;
          if (!last) return;
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(last);
          utterance.rate = rate;
          utterance.pitch = 1;
          utterance.lang = detectedLang;
          window.speechSynthesis.speak(utterance);
        },
      };
    },
    []
  );

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  return { speak, speakWordsSequentially, speakParagraph, isSpeaking, isPaused, pause, resume, stop };
}
