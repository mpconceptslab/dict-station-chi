import { useState, useCallback } from 'react';

// Use tesseract.js from CDN to avoid Google Drive sync issues
const TESSERACT_CDN = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';

let tesseractPromise: Promise<any> | null = null;

function loadTesseract(): Promise<any> {
  if (!tesseractPromise) {
    tesseractPromise = new Promise((resolve, reject) => {
      if ((window as any).Tesseract) {
        resolve((window as any).Tesseract);
        return;
      }
      const script = document.createElement('script');
      script.src = TESSERACT_CDN;
      script.onload = () => {
        if ((window as any).Tesseract) {
          resolve((window as any).Tesseract);
        } else {
          reject(new Error('Tesseract.js loaded but global not found'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load Tesseract.js from CDN'));
      document.head.appendChild(script);
    });
  }
  return tesseractPromise;
}

function fileToDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Map language selection to Tesseract language codes
 * 'eng' = English
 * 'chi_sim' = Simplified Chinese
 * 'chi_tra' = Traditional Chinese
 * 'eng+chi_sim' = English + Simplified Chinese (multi-language)
 * 'eng+chi_tra' = English + Traditional Chinese (multi-language)
 */
function getTesseractLang(lang: string): string {
  switch (lang) {
    case 'chinese': return 'chi_sim';
    case 'chinese_trad': return 'chi_tra';
    case 'english_chinese': return 'eng+chi_sim';
    case 'english_chinese_trad': return 'eng+chi_tra';
    default: return 'eng';
  }
}

export function useOCR() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const recognizeText = useCallback(async (
    imageSource: string | File,
    language: string = 'english'
  ): Promise<string> => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      const Tesseract = await loadTesseract();
      const { createWorker } = Tesseract;

      let imageInput: string;
      if (typeof imageSource !== 'string') {
        imageInput = await fileToDataUrl(imageSource);
      } else {
        imageInput = imageSource;
      }

      const langCode = getTesseractLang(language);
      console.log('OCR: Using language code:', langCode, 'for selection:', language);

      // Create worker - Tesseract.js v5 API
      const worker = await createWorker(langCode, {
        logger: (m: any) => {
          console.log('OCR progress:', m.status, Math.round(m.progress * 100));
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      console.log('OCR: Worker created, recognizing...');
      const { data } = await worker.recognize(imageInput);
      const text = data.text;
      console.log('OCR: Extracted text length:', text.length, 'first 100 chars:', text.substring(0, 100));

      await worker.terminate();

      setIsProcessing(false);
      setProgress(100);
      return text;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'OCR processing failed';
      setError(message);
      setIsProcessing(false);
      console.error('OCR Error:', err);
      throw err;
    }
  }, []);

  return { recognizeText, isProcessing, progress, error };
}
