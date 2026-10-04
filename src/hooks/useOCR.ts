import { useState, useCallback, useRef } from 'react';
import { createWorker } from 'tesseract.js';

type WorkerRef = Awaited<ReturnType<typeof createWorker>> | null;

export function useOCR() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const workerRef = useRef<WorkerRef>(null);
  const currentLangRef = useRef<string>('');

  const getWorker = useCallback(async (language: string): Promise<WorkerRef> => {
    // Map language to Tesseract language code
    let langCode = 'eng';
    if (language === 'chinese' || language === 'chinese_trad') {
      langCode = 'chi_tra'; // Traditional Chinese
    } else if (language === 'english_chinese' || language === 'english_chinese_trad') {
      langCode = 'eng+chi_tra';
    }

    // Only reuse worker if same language
    if (workerRef.current && currentLangRef.current === langCode) {
      return workerRef.current;
    }

    // Terminate old worker if exists
    if (workerRef.current) {
      await workerRef.current.terminate();
      workerRef.current = null;
    }

    console.log('OCR: Creating worker for language:', langCode);
    const worker = await createWorker(langCode);
    workerRef.current = worker;
    currentLangRef.current = langCode;
    return worker;
  }, []);

  const recognizeText = useCallback(async (
    imageSource: string | File,
    language: string = 'english'
  ): Promise<string> => {
    setIsProcessing(true);
    setProgress(10);
    setError(null);

    try {
      const worker = await getWorker(language);
      if (!worker) throw new Error('Failed to create OCR worker');

      setProgress(30);
      console.log('OCR: Using Tesseract.js for language:', language);

      const { data: { text } } = await worker.recognize(imageSource);
      
      setProgress(100);
      console.log('OCR: Extracted text:', text.trim());

      setIsProcessing(false);
      return text.trim();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'OCR processing failed';
      setError(message);
      setIsProcessing(false);
      console.error('OCR Error:', err);
      throw err;
    }
  }, [getWorker]);

  return { recognizeText, isProcessing, progress, error };
}
