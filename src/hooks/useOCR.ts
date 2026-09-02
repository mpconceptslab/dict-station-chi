import { useState, useCallback } from 'react';

// Use tesseract.js from CDN to avoid Google Drive sync issues
const TESSERACT_CDN = 'https://cdn.jsdelivr.net/npm/tesseract.js@7/dist/tesseract.min.js';

let tesseractPromise: Promise<any> | null = null;

function loadTesseract(): Promise<any> {
  if (!tesseractPromise) {
    tesseractPromise = new Promise((resolve, reject) => {
      // Check if already loaded
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

/**
 * Convert a File/Blob to a data URL for Tesseract compatibility
 */
function fileToDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

export function useOCR() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const recognizeText = useCallback(async (imageSource: string | File): Promise<string> => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      const Tesseract = await loadTesseract();
      const { createWorker } = Tesseract;

      // Convert File to data URL for reliable cross-browser support
      let imageInput: string;
      if (typeof imageSource !== 'string') {
        imageInput = await fileToDataUrl(imageSource);
      } else {
        imageInput = imageSource;
      }

      // Create worker with logger for progress tracking
      const worker = await createWorker('eng', 1, {
        logger: (m: any) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      // Run OCR
      const { data } = await worker.recognize(imageInput);
      const text = data.text;

      // Clean up worker
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
