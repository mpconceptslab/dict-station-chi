import { useState, useCallback, useRef, useEffect } from 'react';

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const queueRef = useRef<SpeechSynthesisUtterance[]>([]);
  const currentIndexRef = useRef(0);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback((text: string, rate = 0.8): Promise<void> => {
    return new Promise((resolve) => {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = 1;
      utterance.lang = 'en-US';

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
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
    (words: string[], rate = 0.7, gapMs = 800): { start: () => void; pause: () => void; resume: () => void; stop: () => void } => {
      let stopped = false;
      let paused = false;
      let currentIdx = 0;
      let pausePromise: Promise<void> | null = null;
      let pauseResolver: (() => void) | null = null;

      // Create a pause gate - resolves when not paused
      const ensureNotPaused = (): Promise<void> => {
        if (!paused) return Promise.resolve();
        if (!pausePromise) {
          pausePromise = new Promise((resolve) => {
            pauseResolver = resolve;
          });
        }
        return pausePromise;
      };

      // Pause-aware delay using short intervals instead of setTimeout
      const wait = (ms: number): Promise<void> => {
        return new Promise((resolve) => {
          let elapsed = 0;
          const interval = setInterval(() => {
            if (stopped) {
              clearInterval(interval);
              resolve();
              return;
            }
            if (paused) return; // don't count time while paused
            elapsed += 50;
            if (elapsed >= ms) {
              clearInterval(interval);
              resolve();
            }
          }, 50);
        });
      };

      const speakWord = (idx: number): Promise<void> => {
        return new Promise((resolve) => {
          if (idx >= words.length || stopped) {
            resolve();
            return;
          }

          const utterance = new SpeechSynthesisUtterance(words[idx]);
          utterance.rate = rate;
          utterance.pitch = 1;
          utterance.lang = 'en-US';

          utterance.onend = () => resolve();
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
        // Release the pause gate so the loop continues
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

      return { start, pause, resume, stop };
    },
    []
  );

  const speakParagraph = useCallback(
    (text: string, rate = 0.7): { start: () => void; pause: () => void; resume: () => void; stop: () => void } => {
      // Split into sentences for natural speaking
      const sentences = text.match(/[^.!?]+[.!?]?\s*/g) || [text];
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
          utterance.lang = 'en-US';
          utterance.onend = () => resolve();
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
