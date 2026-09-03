import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Detect if text is primarily Chinese
 * Returns 'en-US', 'zh-CN', or the provided voiceOverride if Chinese detected
 */
function detectLanguage(text: string, voiceOverride?: string): string {
  const chineseChars = (text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
  const totalChars = text.replace(/\s/g, '').length;
  if (totalChars === 0) return 'en-US';
  if (chineseChars / totalChars > 0.3) {
    // If user chose a Chinese voice variant, use it; default to Mandarin
    return voiceOverride || 'zh-CN';
  }
  return 'en-US';
}

/**
 * Split text into sentences - handles both English and Chinese
 */
function splitSentences(text: string): string[] {
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

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = 1;
      utterance.lang = lang || detectLanguage(text, voiceOverride);

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        lastSpokenRef.current = text;
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

          const utterance = new SpeechSynthesisUtterance(words[idx]);
          utterance.rate = rate;
          utterance.pitch = 1;
          utterance.lang = lang || detectLanguage(words[idx], voiceOverride);

          utterance.onend = () => {
            lastSpokenRef.current = words[idx];
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
          const utterance = new SpeechSynthesisUtterance(sentence.trim());
          utterance.rate = rate;
          utterance.pitch = 1;
          utterance.lang = detectedLang;
          utterance.onend = () => {
            lastSpokenRef.current = sentence.trim();
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
