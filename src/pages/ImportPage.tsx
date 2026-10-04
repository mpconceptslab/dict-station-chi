import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useOCR } from '../hooks/useOCR';
import { saveWordList, generateId } from '../utils/storage';
import { canScan, recordScan, getScanAllowance, formatReset } from '../utils/limits';
import TopNavBar from '../components/TopNavBar';
import UpgradeModal from '../components/UpgradeModal';
import { showToast } from '../components/Toast';
import ImageCropper from '../components/ImageCropper';
import { usePrefs } from '../context/PrefsContext';
import type { TKey } from '../i18n';

type Step = 'setup' | 'upload' | 'review' | 'select-paragraphs' | 'select-words' | 'split-sentences' | 'cut-sentences';
type Subject = 'cantonese' | 'english' | 'mandarin' | 'other';
type ExamType = 'dictation' | 'quiz' | 'exam' | 'other';

const IMPORT_STEPS: { n: number; titleKey: TKey; descKey?: TKey }[] = [
  { n: 1, titleKey: 'import.step1.title', descKey: 'import.step1.desc' },
  { n: 2, titleKey: 'import.step2.title', descKey: 'import.step2.desc' },
  { n: 3, titleKey: 'import.step3.title', descKey: 'import.step3.desc' },
  { n: 4, titleKey: 'import.step4.title' },
];

/**
 * Reflow OCR'd English text into clean sentences/paragraphs.
 * A scanned English syllabus often comes back with words split across lines or
 * separated by extra blank spaces. This collapses every whitespace run to a
 * single space (so no double spaces remain), drops stray spaces before
 * punctuation, and guarantees one space after sentence punctuation — without
 * touching decimals (e.g. 3.14) or thousands separators (e.g. 1,000).
 */
function cleanEnglishText(input: string): string {
  return input
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.!?;:'")\]])/g, '$1')
    .replace(/([,.!?;:])(?=[A-Za-z])/g, '$1 ')
    .trim();
}

/**
 * Clean OCR'd Chinese text by removing spaces between Chinese characters.
 * Tesseract sometimes inserts spaces between CJK characters; Chinese doesn't
 * use word spaces, so we strip them. Uses lookahead to handle overlapping
 * pairs (e.g. "哥 哥 帶" → "哥哥帶"). Also removes spaces around Chinese
 * punctuation and between CJK and numbers.
 */
function cleanChineseText(input: string): string {
  return input
    // Remove spaces between CJK characters (lookahead avoids consuming the second char)
    .replace(/([\u4e00-\u9fff])\s+(?=[\u4e00-\u9fff])/g, '$1')
    // Remove spaces between CJK and numbers
    .replace(/([\u4e00-\u9fff])\s+(?=[0-9])/g, '$1')
    .replace(/([0-9])\s+(?=[\u4e00-\u9fff])/g, '$1')
    // Remove spaces before/after Chinese punctuation
    .replace(/\s+([，。！？、；：""''（）【】《》])/g, '$1')
    .replace(/([，。！？、；：""''（）【】《》])\s+/g, '$1')
    // Remove spaces before/after Latin punctuation in Chinese text
    .replace(/\s+([,.!?;:\'"\[\](){}])/g, '$1')
    .replace(/([,.!?;:\'"\[\](){}])\s+(?=[\u4e00-\u9fff])/g, '$1')
    .trim();
}

/** Step wizard indicator shown across the import pages (step 4 only appears after auto-split) */
function ImportStepBar({ current, showCutter = false }: { current: number; showCutter?: boolean }) {
  const { t } = usePrefs();
  return (
    <div className="import-steps">
      {IMPORT_STEPS.filter(s => showCutter || s.n <= 3).map(s => {
        const state = s.n === current ? 'active' : s.n < current ? 'done' : 'upcoming';
        return (
          <div key={s.n} className={`import-step import-step-${state}`}>
            <span className="import-step-num">{state === 'done' ? <span className="ico" data-word={t('common.done')}>✓</span> : s.n}</span>
            <span className="import-step-text">
              <span className="import-step-title">{t('import.stepLabel', { n: s.n, title: t(s.titleKey) })}</span>
              <span className="import-step-desc">
                {s.n === 4
                  ? <>{t('import.step4.descPre')}<span className="ico" data-word={t('import.cut')}>✂</span>{t('import.step4.descPost')}</>
                  : s.descKey ? t(s.descKey) : ''}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function ImportPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = usePrefs();
  const { recognizeText, isProcessing, progress, error } = useOCR();
  const [showUpgrade, setShowUpgrade] = useState(false);
  
  // Setup form state (declare first since generateListName depends on these)
  const [examDate, setExamDate] = useState('');
  const [subject, setSubject] = useState<Subject>('cantonese');
  const [otherSubject, setOtherSubject] = useState('');
  const [examType, setExamType] = useState<ExamType>('dictation');
  const [otherExamType, setOtherExamType] = useState('');
  
  function generateListName(): string {
    const date = examDate ? new Date(examDate) : new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const subjectNames: Record<Subject, string> = {
      cantonese: t('import.subject.cantonese'),
      english: t('import.subject.english'),
      mandarin: t('import.subject.mandarin'),
      other: otherSubject || t('import.subject.other'),
    };
    
    const typeNames: Record<ExamType, string> = {
      dictation: t('import.type.dictation'),
      quiz: t('import.type.quiz'),
      exam: t('import.type.exam'),
      other: otherExamType || t('import.type.other'),
    };
    
    return t('import.nameTemplate', { y: year, m: month, d: day, subject: subjectNames[subject], type: typeNames[examType] });
  }

  const [step, setStep] = useState<Step>('setup');
  const [rawText, setRawText] = useState('');
  const [words, setWords] = useState<string[]>([]);
  const [paragraphWords, setParagraphWords] = useState<string[]>([]);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [deletedParagraphs, setDeletedParagraphs] = useState<number[]>([]);
  const [listName, setListName] = useState('');
  const [nameManuallyEdited, setNameManuallyEdited] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [scannedMode, setScannedMode] = useState(false); // OCR path: skip the review page
  const [showSourcePhoto, setShowSourcePhoto] = useState(false);
  const [photoFullscreen, setPhotoFullscreen] = useState(false);
  const [usedAutoSplit, setUsedAutoSplit] = useState(false); // auto-split → extra cutter step; manual selection skips it
  const [cuts, setCuts] = useState<Set<string>>(new Set()); // cutter step: "sentenceIdx|unitIdx" = cut after that unit
  const [language, setLanguage] = useState('chinese_trad');
  const [voice, setVoice] = useState('zh-HK');
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [dragEnd, setDragEnd] = useState<number | null>(null);
  const [wordGroups, setWordGroups] = useState<{ indices: Set<string> }[]>([]);
  const [sentenceGroups, setSentenceGroups] = useState<{ pi: number; start: number; end: number; text: string }[]>([]);
  const [sentencePopup, setSentencePopup] = useState<{ message: string; removeIdx: number } | null>(null);
  const [wordPopup, setWordPopup] = useState<{ message: string; removeIdx: number } | null>(null);
  const dragStartRef = useRef<{ pi: number; ci: number } | null>(null);
  const dragActiveRef = useRef(false);
  const dragEndRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const wordGroupsRef = useRef<{ indices: Set<string> }[]>([]);
  const sentenceGroupsRef = useRef<{ pi: number; start: number; end: number; text: string }[]>([]);

  function handleBack() {
    switch (step) {
      case 'setup':
        navigate('/home');
        break;
      case 'upload':
        setStep('setup');
        break;
      case 'review':
        setStep('upload');
        break;
      case 'select-paragraphs':
        setStep(scannedMode ? 'upload' : 'review');
        break;
      case 'select-words':
        if (paragraphs.length > 0) {
          setStep('select-paragraphs');
        } else {
          setStep('review');
        }
        break;
      case 'split-sentences':
        setStep('select-words');
        break;
      case 'cut-sentences':
        setStep('split-sentences');
        break;
    }
  }

  useEffect(() => {
    // Check if manual mode - skip setup
    const mode = searchParams.get('mode');
    if (mode === 'manual') {
      // Still need to go through setup first
    }
  }, []);

  // Update list name when date/subject/type changes (only if not manually edited)
  useEffect(() => {
    if (!nameManuallyEdited) {
      setListName(generateListName());
    }
  }, [examDate, subject, otherSubject, examType, otherExamType]);

  // Check if form is complete
  const isFormComplete = examDate !== '' && (subject !== 'other' || otherSubject.trim() !== '') && (examType !== 'other' || otherExamType.trim() !== '');

  function handleSetupComplete() {
    if (!examDate) {
      showToast(t('import.selectDate'), 'error');
      return;
    }
    
    // Set language and voice based on subject
    switch (subject) {
      case 'cantonese':
        setLanguage('chinese_trad');
        setVoice('zh-HK');
        break;
      case 'mandarin':
        setLanguage('chinese');
        setVoice('zh-CN');
        break;
      case 'english':
        setLanguage('english');
        break;
    }
    
    setListName(generateListName());
    setStep('upload');
  }

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show the crop editor first; OCR runs after the user confirms the crop
    const previewUrl = URL.createObjectURL(file);
    setCropSrc(previewUrl);
    e.target.value = '';
  }

  async function handleCropConfirm(croppedDataUrl: string) {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
    setImagePreview(croppedDataUrl);

    // Scanning is free but consumes a scan allowance; prompt to upgrade when exhausted.
    if (!canScan()) {
      setShowUpgrade(true);
      return;
    }

    try {
      const text = await recognizeText(croppedDataUrl, language);
      recordScan();
      processText(text);
    } catch (err) {
      console.error('OCR 失敗:', err);
    }
  }

  function handleCropCancel() {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
  }

  function processText(text: string) {
    setRawText(text);
    const cleanedText = text.replace(/\r\n/g, '\n').trim();

    // English syllabus: OCR frequently returns words split across lines or
    // separated by extra blank spaces. Detect English (by subject choice or by
    // Latin-only content) so we can reflow it into full sentences below.
    const isEnglish =
      subject === 'english' ||
      (/[a-zA-Z]/.test(cleanedText) && !/[\u4e00-\u9fff]/.test(cleanedText));

    // Improved paragraph separation:
    // 1. Split by double newlines first
    // 2. Also split by lines starting with numbers (1. 2. 3. etc.)
    // 3. Keep short lines as separate paragraphs
    const lines = cleanedText.split('\n');
    const paragraphsList: string[] = [];
    let currentParagraph = '';
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Check if line starts with number pattern (1. 2. 3. etc.)
      const startsWithNumber = /^\d+[\.\)、]\s*/.test(trimmedLine);
      
      // Empty line = paragraph break
      if (trimmedLine === '') {
        if (currentParagraph.trim()) {
          paragraphsList.push(currentParagraph.trim());
          currentParagraph = '';
        }
      }
      // Line starts with number = new paragraph
      else if (startsWithNumber && currentParagraph.trim()) {
        paragraphsList.push(currentParagraph.trim());
        currentParagraph = trimmedLine;
      }
      // Continue current paragraph. English line-wraps rejoin with a single
      // space so sentences flow; Chinese keeps the newline as before.
      else {
        currentParagraph += (currentParagraph ? (isEnglish ? ' ' : '\n') : '') + trimmedLine;
      }
    }
    
    // Don't forget the last paragraph
    if (currentParagraph.trim()) {
      paragraphsList.push(currentParagraph.trim());
    }
    
    // For English, collapse leftover double spaces / stray line breaks so each
    // paragraph reads as a clean, full sentence. For Chinese, remove the spaces
    // that Tesseract sometimes inserts between CJK characters.
    const finalParagraphs = paragraphsList
      .filter(p => p.length > 0)
      .map(p => (isEnglish ? cleanEnglishText(p) : cleanChineseText(p)));

    setParagraphs(finalParagraphs.filter(p => p.length > 0));
    setDeletedParagraphs([]); // Reset deleted paragraphs
    // Reset any previous selections so the scan goes straight into word selection
    setWords([]);
    setSelectedWords([]);
    setWordGroups([]);
    wordGroupsRef.current = [];
    setSentenceGroups([]);
    sentenceGroupsRef.current = [];
    setUsedAutoSplit(false);
    setCuts(new Set());
    setScannedMode(true);
    setShowSourcePhoto(false);
    setPhotoFullscreen(false);
    // Step 1 — land on the check-and-edit page so the client can delete/fix misread words first
    setStep('select-paragraphs');
  }

  function handleManualEntry() {
    setScannedMode(false);
    setUsedAutoSplit(false);
    setCuts(new Set());
    setRawText('');
    setWords([]);
    setParagraphs([]);
    setSelectedWords([]);
    setParagraphInput('');
    setStep('review');
  }

  const [paragraphInput, setParagraphInput] = useState('');
  const [wordInput, setWordInput] = useState('');

  function handleWordInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',' || e.key === '，') {
      e.preventDefault();
      const word = wordInput.trim();
      if (word && !words.includes(word)) {
        setWords([...words, word]);
        setWordInput('');
      }
    }
  }

  function handleParagraphInputKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const paragraph = paragraphInput.trim();
      if (paragraph) {
        setParagraphs([...paragraphs, paragraph]);
        setParagraphInput('');
      }
    }
  }

  function removeParagraph(index: number) {
    const newParagraphs = paragraphs.filter((_, i) => i !== index);
    setParagraphs(newParagraphs);
  }

  // Native DOM drag handler
  useEffect(() => {
    function getCharFromPoint(x: number, y: number): { pi: number; ci: number } | null {
      const elem = document.elementFromPoint(x, y);
      if (!elem) return null;
      const pi = elem.getAttribute('data-pi');
      const ci = elem.getAttribute('data-ci');
      if (pi === null || ci === null) return null;
      return { pi: parseInt(pi), ci: parseInt(ci) };
    }

    function onStart(x: number, y: number) {
      const target = getCharFromPoint(x, y);
      if (!target) return;
      // Only skip punctuation during word selection, not sentence splitting
      if (stepRef.current === 'select-words') {
        const charEl = document.querySelector(`[data-pi="${target.pi}"][data-ci="${target.ci}"]`);
        if (charEl && charEl.classList.contains('punctuation')) return;
      }
      dragStartRef.current = target;
      dragActiveRef.current = true;
      dragEndRef.current = target.ci;
      setDragActive(true);
      setDragEnd(target.ci);
    }

    function onMove(x: number, y: number) {
      if (!dragActiveRef.current) return;
      const target = getCharFromPoint(x, y);
      if (!target) return;
      if (dragStartRef.current && target.pi !== dragStartRef.current.pi) return;
      // Only skip punctuation during word selection, not sentence splitting
      if (stepRef.current === 'select-words') {
        const charEl = document.querySelector(`[data-pi="${target.pi}"][data-ci="${target.ci}"]`);
        if (charEl && charEl.classList.contains('punctuation')) return;
      }
      dragEndRef.current = target.ci;
      setDragEnd(target.ci);
    }

    function onEnd() {
      if (!dragActiveRef.current || !dragStartRef.current || dragEndRef.current === null) {
        dragActiveRef.current = false;
        dragStartRef.current = null;
        dragEndRef.current = null;
        setDragActive(false);
        setDragEnd(null);
        return;
      }
      const pi = dragStartRef.current.pi;
      const startCi = dragStartRef.current.ci;
      const endCi = dragEndRef.current;
      const minCi = Math.min(startCi, endCi);
      const maxCi = Math.max(startCi, endCi);

      const newIndices = new Set<string>();
      for (let i = minCi; i <= maxCi; i++) {
        newIndices.add(`${pi}-${i}`);
      }

      if (stepRef.current === 'select-words') {
        const currentGroups = wordGroupsRef.current;
        const updatedGroups = currentGroups
          .map(g => {
            const filtered = new Set<string>();
            g.indices.forEach(key => { if (!newIndices.has(key)) filtered.add(key); });
            return { indices: filtered };
          })
          .filter(g => g.indices.size > 0);
        updatedGroups.push({ indices: newIndices });
        wordGroupsRef.current = updatedGroups;
        setWordGroups(updatedGroups);

        // Check word length immediately after selection
        const wordChars = Array.from(paragraphsRef.current[pi] || '');
        const wordText = wordChars.slice(minCi, maxCi + 1).join('');
        if (Array.from(wordText).length > 6) {
          setTimeout(() => setWordPopup({ message: t('import.wordTooLong'), removeIdx: updatedGroups.length - 1 }), 100);
        }
      } else if (stepRef.current === 'split-sentences') {
        const chars = Array.from(paragraphsRef.current[pi] || '');
        // English token ci marks the word's START — extend end to cover the whole word
        // (and any trailing punctuation without a space), otherwise the last word never counts as covered
        let endCi = maxCi;
        while (endCi + 1 < chars.length && !/\s/.test(chars[endCi + 1])) endCi++;
        const text = chars.slice(minCi, endCi + 1).join('');
        const newGroup = { pi, start: minCi, end: endCi, text };
        const updated = [...sentenceGroupsRef.current, newGroup];
        sentenceGroupsRef.current = updated;
        setSentenceGroups(updated);
      }

      dragStartRef.current = null;
      dragActiveRef.current = false;
      dragEndRef.current = null;
      setDragActive(false);
      setDragEnd(null);
    }

    function handleMouseDown(e: MouseEvent) {
      const charEl = (e.target as HTMLElement).closest('[data-ci]');
      if (!charEl) return;
      e.preventDefault();
      onStart(e.clientX, e.clientY);
    }
    function handleMouseMove(e: MouseEvent) {
      onMove(e.clientX, e.clientY);
    }
    function handleMouseUp() {
      onEnd();
    }
    function handleTouchStart(e: TouchEvent) {
      const charEl = (e.target as HTMLElement).closest('[data-ci]');
      if (!charEl) return;
      e.preventDefault();
      const t = e.touches[0];
      onStart(t.clientX, t.clientY);
    }
    function handleTouchMove(e: TouchEvent) {
      if (!dragActiveRef.current) return;
      e.preventDefault();
      const t = e.touches[0];
      onMove(t.clientX, t.clientY);
    }
    function handleTouchEnd() {
      onEnd();
    }

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const stepRef = useRef<Step>(step);
  useEffect(() => { stepRef.current = step; }, [step]);
  const paragraphsRef = useRef<string[]>(paragraphs);
  useEffect(() => { paragraphsRef.current = paragraphs; }, [paragraphs]);

  function extractWordsFromHighlights(): string[] {
    const extractedWords: string[] = [];
    
    // Detect if content is primarily English
    const isEnglishContent = subject === 'english' || /[a-zA-Z]/.test(paragraphs.join('')) && !/[\u4e00-\u9fff]/.test(paragraphs.join(''));
    
    for (const group of wordGroups) {
      if (isEnglishContent) {
        // For English: extract full words based on character positions
        const wordSet = new Set<string>();
        group.indices.forEach(key => {
          const [piStr, ciStr] = key.split('-');
          const pi = parseInt(piStr);
          const ci = parseInt(ciStr);
          const para = paragraphs[pi] || '';
          
          // Split by whitespace but keep track of actual character positions
          const words = para.split(/(\s+)/);
          let charCount = 0;
          for (const word of words) {
            const wordStart = charCount;
            const wordEnd = charCount + word.length - 1;
            
            // Check if this character index falls within this word (not whitespace)
            if (ci >= wordStart && ci <= wordEnd && word.trim().length > 0) {
              // This character is part of this word
              const trimmedWord = word.trim();
              if (trimmedWord && !/^[,.!?;:'"\-()\[\]{}\/\\]+$/.test(trimmedWord)) {
                wordSet.add(trimmedWord);
              }
              break;
            }
            charCount += word.length;
          }
        });
        
        // Combine all words in this group
        const words = Array.from(wordSet);
        if (words.length > 0) {
          extractedWords.push(words.join(' '));
        }
      } else {
        // For Chinese: original character-by-character extraction
        const charMap = new Map<number, Map<number, string>>();
        group.indices.forEach(key => {
          const [piStr, ciStr] = key.split('-');
          const pi = parseInt(piStr);
          const ci = parseInt(ciStr);
          if (!charMap.has(pi)) charMap.set(pi, new Map());
          const pChars = Array.from(paragraphs[pi] || '');
          if (ci < pChars.length) {
            charMap.get(pi)!.set(ci, pChars[ci]);
          }
        });
        // Build text for this group (sorted by paragraph, then char index)
        const sortedPis = Array.from(charMap.keys()).sort((a, b) => a - b);
        let text = '';
        for (const pi of sortedPis) {
          const ciMap = charMap.get(pi)!;
          const sortedCis = Array.from(ciMap.keys()).sort((a, b) => a - b);
          for (const ci of sortedCis) {
            text += ciMap.get(ci);
          }
        }
        if (text.trim().length > 0) {
          extractedWords.push(text.trim());
        }
      }
    }
    return extractedWords;
  }

  function handleConfirmWordSelection() {
    const extracted = extractWordsFromHighlights();
    setParagraphWords(extracted);
    setStep('split-sentences');
  }

  function handleConfirmSentenceSplit() {
    // Manual selections have no length limit — the client may pick as much as she wants.
    // Check if all non-space characters in all paragraphs are covered
    const coveredChars = new Set<string>();
    for (const sg of sentenceGroups) {
      for (let ci = sg.start; ci <= sg.end; ci++) {
        coveredChars.add(`${sg.pi}-${ci}`);
      }
    }
    let allCovered = true;
    for (let pi = 0; pi < paragraphs.length; pi++) {
      const chars = Array.from(paragraphs[pi]);
      for (let ci = 0; ci < chars.length; ci++) {
        if (/\s/.test(chars[ci])) continue; // spaces/newlines need not be inside a sentence
        if (!coveredChars.has(`${pi}-${ci}`)) {
          allCovered = false;
          break;
        }
      }
      if (!allCovered) break;
    }
    if (!allCovered) {
      setSentencePopup({ message: t('import.selectAllFirst'), removeIdx: -1 });
      return;
    }

    // Auto-split sentences can be long → extra cutter step; manual selection saves straight to 選擇溫書範圍
    if (usedAutoSplit) {
      setStep('cut-sentences');
    } else {
      handleSave();
    }
  }

  function handleConfirmFromReview() {
    // Add any remaining paragraph input
    let finalParagraphs = [...paragraphs];
    const remainingParagraph = paragraphInput.trim();
    if (remainingParagraph) {
      finalParagraphs.push(remainingParagraph);
    }
    const rawText = finalParagraphs.join('\n\n');
    setRawText(rawText);
    setParagraphs(finalParagraphs);
    setDeletedParagraphs([]); // Reset deleted paragraphs
    if (words.length > 0 && finalParagraphs.length === 0) {
      // Only words, no paragraphs → save directly
      handleSave();
    } else if (finalParagraphs.length > 0) {
      setSelectedWords([...words]);
      // Go to select-paragraphs first to review/delete paragraphs
      setStep('select-paragraphs');
    } else {
      // Nothing entered
      return;
    }
  }

  function handleConfirmParagraphSelection() {
    // Filter out deleted and now-empty paragraphs (client may have cleared the text while editing)
    const activeParagraphs = paragraphs.filter((p, i) => !deletedParagraphs.includes(i) && p.trim().length > 0);
    setParagraphs(activeParagraphs);
    setDeletedParagraphs([]); // Reset after filtering
    if (activeParagraphs.length > 0) {
      setStep('select-words');
    }
  }

  function autoSelectSentences() {
    const newGroups: typeof sentenceGroups = [];

    paragraphs.forEach((para, pi) => {
      // Split from the first letter of a sentence up to and including its punctuation
      // For Chinese: split on sentence-ending punctuation (。！？) AND commas (，,)
      // For English: split on sentence-ending punctuation only
      const isChinesePara = /[\u4e00-\u9fff]/.test(para);
      const splitPunct = isChinesePara ? /[。！？?！，,]/ : /[。！？?!]/;
      const absorbPunct = isChinesePara ? /[。！？?！，,"」』）)\]]/ : /[。！？?!"」』）)\]]/;
      const sentences: string[] = [];
      let current = '';

      for (let i = 0; i < para.length; i++) {
        const ch = para[i];
        current += ch;

        if (splitPunct.test(ch)) {
          // absorb repeated end punctuation and closing quotes/brackets
          while (i + 1 < para.length && absorbPunct.test(para[i + 1])) {
            i++;
            current += para[i];
          }
          sentences.push(current);
          current = '';
        } else if (ch === '\n') {
          sentences.push(current);
          current = '';
        }
      }
      if (current) sentences.push(current);

      let charIndex = 0;
      for (const s of sentences) {
        if (s.trim()) {
          newGroups.push({ pi, start: charIndex, end: charIndex + s.length - 1, text: s });
        }
        charIndex += s.length;
      }
    });

    setSentenceGroups(newGroups);
    sentenceGroupsRef.current = newGroups;
    setUsedAutoSplit(true);
    setCuts(new Set());
  }

  // Cutter units: English words (with trailing space) or single CJK characters
  function getCutUnits(text: string): string[] {
    const isEnglish = /[a-zA-Z]/.test(text) && !/[\u4e00-\u9fff]/.test(text);
    if (isEnglish) {
      return text.match(/\S+\s*|\s+/g) || [text];
    }
    return Array.from(text);
  }

  function handleConfirmCutter() {
    const newGroups: typeof sentenceGroups = [];
    sentenceGroups.forEach((sg, gi) => {
      const units = getCutUnits(sg.text);
      const cutHere = new Set<number>();
      cuts.forEach(key => {
        const [g, u] = key.split('|');
        if (+g === gi) cutHere.add(+u);
      });
      let chunk = '';
      let offset = 0;
      units.forEach((u, ui) => {
        chunk += u;
        if (cutHere.has(ui) || ui === units.length - 1) {
          if (chunk.trim()) {
            newGroups.push({ pi: sg.pi, start: sg.start + offset, end: sg.start + offset + chunk.length - 1, text: chunk });
          }
          offset += chunk.length;
          chunk = '';
        }
      });
    });
    setSentenceGroups(newGroups);
    sentenceGroupsRef.current = newGroups;
    setCuts(new Set());
    handleSave();
  }

  function removeWord(index: number) {
    const newWords = words.filter((_, i) => i !== index);
    setWords(newWords);
  }

  async function handleSave() {
    if (words.length === 0 && paragraphWords.length === 0 && paragraphs.length === 0) return;

    await saveWordList({
      id: generateId(),
      name: listName,
      words,
      paragraphWords,
      paragraphs,
      sentences: sentenceGroupsRef.current.map(g => g.text),
      createdAt: Date.now(),
      rawText,
      language,
      voice,
    });

    navigate('/syllabus');
  }

  // Setup Step
  if (step === 'setup') {
    return (
      <div className="page import-page">
        <TopNavBar onBack={handleBack} />
        <h1>{t('import.title')}</h1>

        <div className="setup-section">
          <div className="form-group">
            <label>{t('import.examDate')}</label>
            <div className="date-input-wrapper" onClick={() => dateInputRef.current?.showPicker()}>
              <input
                ref={dateInputRef}
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>{t('import.subject')}</label>
            <div className="subject-options">
              <button
                className={`subject-btn ${subject === 'cantonese' ? 'active' : ''}`}
                onClick={() => setSubject('cantonese')}
              >
                {t('import.subject.cantonese')}
              </button>
              <button
                className={`subject-btn ${subject === 'english' ? 'active' : ''}`}
                onClick={() => setSubject('english')}
              >
                {t('import.subject.english')}
              </button>
              <button
                className={`subject-btn ${subject === 'mandarin' ? 'active' : ''}`}
                onClick={() => setSubject('mandarin')}
              >
                {t('import.subject.mandarin')}
              </button>
              <button
                className={`subject-btn ${subject === 'other' ? 'active' : ''}`}
                onClick={() => setSubject('other')}
              >
                {t('import.subject.other')}
              </button>
            </div>
            {subject === 'other' && (
              <input
                type="text"
                value={otherSubject}
                onChange={(e) => setOtherSubject(e.target.value)}
                placeholder={t('import.otherSubjectPlaceholder')}
                className="form-input other-subject-input"
              />
            )}
          </div>

          <div className="form-group">
            <label>{t('import.examType')}</label>
            <div className="exam-type-options">
              <button
                className={`exam-type-btn ${examType === 'dictation' ? 'active' : ''}`}
                onClick={() => setExamType('dictation')}
              >
                {t('import.type.dictation')}
              </button>
              <button
                className={`exam-type-btn ${examType === 'quiz' ? 'active' : ''}`}
                onClick={() => setExamType('quiz')}
                disabled
              >
                {t('import.type.quiz')}
              </button>
              <button
                className={`exam-type-btn ${examType === 'exam' ? 'active' : ''}`}
                onClick={() => setExamType('exam')}
                disabled
              >
                {t('import.type.exam')}
              </button>
              <button
                className={`exam-type-btn ${examType === 'other' ? 'active' : ''}`}
                onClick={() => setExamType('other')}
                disabled
              >
                {t('import.type.other')}
              </button>
            </div>
            {examType === 'other' && (
              <input
                type="text"
                value={otherExamType}
                onChange={(e) => setOtherExamType(e.target.value)}
                placeholder={t('import.otherTypePlaceholder')}
                className="form-input other-exam-type-input"
              />
            )}
          </div>

          {isFormComplete && (
            <div className="preview-name">
              <p className="preview-label">{t('import.namePreview')}</p>
              <input
                type="text"
                value={listName}
                onChange={(e) => {
                  setListName(e.target.value);
                  setNameManuallyEdited(true);
                }}
                className="preview-input"
              />
            </div>
          )}

          <button
            className="btn btn-primary btn-large"
            onClick={handleSetupComplete}
            disabled={!isFormComplete}
          >
            {t('common.next')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page import-page">
      <TopNavBar onBack={handleBack} />
      <h1>{t('import.title')}</h1>

      {step === 'upload' && (
        <div className="upload-section">
          <div className="upload-options">
            <button
              className="btn upload-btn-color-blue btn-large upload-btn"
              onClick={() => cameraInputRef.current?.click()}
              disabled={isProcessing}
            >
              <span className="btn-icon upload-icon-lg"><span className="ico">📷</span></span>
              {t('import.takePhoto')}
            </button>

            <button
              className="btn upload-btn-color-green btn-large upload-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
            >
              <span className="btn-icon upload-icon-lg"><span className="ico">🖼️</span></span>
              {t('import.uploadImage')}
            </button>

            <button
              className="btn upload-btn-color-orange btn-large upload-btn"
              onClick={handleManualEntry}
              disabled={isProcessing}
            >
              <span className="btn-icon upload-icon-lg"><span className="ico">✏️</span></span>
              {t('import.manualEntry')}
            </button>
          </div>

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageSelect}
            style={{ display: 'none' }}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            style={{ display: 'none' }}
          />

          {isProcessing && (
            <div className="processing-overlay">
              <div className="spinner"></div>
              <p>{t('import.processing', { n: progress })}</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt={t('import.uploadedAlt')} style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '12px', marginTop: '16px' }} />
            </div>
          )}

          {error && <p className="error-message">{error}</p>}
        </div>
      )}

      {step === 'review' && (
        <div className="review-section">
          <ImportStepBar current={1} />
          {/* Words Input */}
          <div className="form-group">
            <label>{t('import.wordsLabel')}</label>
            <input
              type="text"
              value={wordInput}
              onChange={(e) => setWordInput(e.target.value)}
              onKeyDown={handleWordInputKeyDown}
              placeholder={t('import.wordsPlaceholder')}
              className="form-input"
            />
            {words.length > 0 && (
              <div className="word-tags" style={{ marginTop: '12px' }}>
                {words.map((word, i) => (
                  <span key={i} className="word-tag removable" onClick={() => removeWord(i)} title={t('import.clickToRemove')}>
                    {word} <span className="remove-x">&times;</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Paragraph Input */}
          <div className="form-group">
            <label>{t('import.paragraphLabel')}</label>
            <textarea
              value={paragraphInput}
              onChange={(e) => setParagraphInput(e.target.value)}
              onKeyDown={handleParagraphInputKeyDown}
              placeholder={t('import.paragraphPlaceholder')}
              className="form-textarea"
              rows={4}
            />
            {paragraphs.length > 0 && (
              <div className="paragraph-tags" style={{ marginTop: '12px' }}>
                {paragraphs.map((p, i) => (
                  <div key={i} className="paragraph-tag removable" onClick={() => removeParagraph(i)} title={t('import.clickToRemove')}>
                    <span className="paragraph-text">{p.length > 30 ? p.substring(0, 30) + '...' : p}</span>
                    <span className="remove-x">&times;</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Next Button */}
          <button
            className="btn btn-primary btn-large"
            onClick={handleConfirmFromReview}
            disabled={words.length === 0 && paragraphs.length === 0 && paragraphInput.trim() === ''}
          >
            {t('common.next')}
          </button>
        </div>
      )}

      {step === 'select-paragraphs' && (
        <div className="select-paragraphs-section">
          <h2>{t('import.checkParagraphs')}</h2>
          <p className="select-paragraphs-hint">{t('import.checkParagraphsHint')}<span className="ico">🗑️</span>{t('import.checkParagraphsHint2')}</p>
          <ImportStepBar current={1} showCutter={usedAutoSplit} />
          
          <div className="paragraph-cards">
            {paragraphs.map((p, i) => {
              const isDeleted = deletedParagraphs.includes(i);
              return (
                <div key={i} className={`paragraph-card ${isDeleted ? 'deleted' : ''}`}>
                  <div className="paragraph-card-header">
                    <span className="paragraph-card-number">{t('import.paragraphN', { n: i + 1 })}</span>
                    <button
                      className="btn btn-small btn-danger paragraph-delete-btn"
                      onClick={() => {
                        if (isDeleted) {
                          setDeletedParagraphs(deletedParagraphs.filter(idx => idx !== i));
                        } else {
                          setDeletedParagraphs([...deletedParagraphs, i]);
                        }
                      }}
                      title={isDeleted ? t('import.restoreParagraph') : t('import.deleteParagraph')}
                    >
                      {isDeleted ? <span className="ico" data-word={t('import.restore')}>↩️</span> : <span className="ico" data-word={t('common.delete')}>🗑️</span>}
                    </button>
                  </div>
                  <textarea
                    className="paragraph-edit"
                    value={p}
                    readOnly={isDeleted}
                    ref={el => {
                      if (el) {
                        el.style.height = 'auto';
                        el.style.height = `${el.scrollHeight}px`;
                      }
                    }}
                    onChange={e => {
                      const next = [...paragraphs];
                      next[i] = e.target.value;
                      setParagraphs(next);
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Original photo reference — verify OCR wording before confirming */}
          {imagePreview && (
            <div className="source-photo-check">
              <button
                className="btn source-photo-toggle"
                onClick={() => setShowSourcePhoto(v => !v)}
              >
                <span className="ico">📷</span> {showSourcePhoto ? t('import.hideOriginal') : t('import.showOriginal')}
              </button>
              {showSourcePhoto && (
                <img
                  src={imagePreview}
                  alt={t('import.originalAlt')}
                  className="source-photo-img"
                  onClick={() => setPhotoFullscreen(true)}
                />
              )}
            </div>
          )}

          <button
            className="btn btn-primary btn-large"
            onClick={handleConfirmParagraphSelection}
            disabled={paragraphs.filter((p, i) => !deletedParagraphs.includes(i) && p.trim().length > 0).length === 0}
          >
            {t('import.confirmRange', { n: paragraphs.filter((p, i) => !deletedParagraphs.includes(i) && p.trim().length > 0).length })}
          </button>
        </div>
      )}

      {step === 'select-words' && (() => {
        const highlightedWords = extractWordsFromHighlights();
        const allWords = [...selectedWords];
        for (const w of highlightedWords) {
          if (!allWords.some(cw => cw.toLowerCase() === w.toLowerCase())) {
            allWords.push(w);
          }
        }
        
        // Detect if content is primarily English
        const isEnglishContent = subject === 'english' || /[a-zA-Z]/.test(paragraphs.join('')) && !/[\u4e00-\u9fff]/.test(paragraphs.join(''));
        
        return (
          <div className="select-words-section">
            <h2>{t('import.selectWordsTitle')}</h2>
            <p className="select-paragraphs-hint">{t('import.selectWordsHint')}</p>
            <ImportStepBar current={2} showCutter={usedAutoSplit} />

            {paragraphs.map((p, pi) => {
              // For English: split by words with position tracking; For Chinese: split by characters
              let tokens: { text: string; charIndex: number }[];
              if (isEnglishContent) {
                tokens = [];
                const words = p.split(/(\s+)/);
                let charPos = 0;
                for (const word of words) {
                  if (word.trim().length > 0) {
                    tokens.push({ text: word, charIndex: charPos });
                  }
                  charPos += word.length;
                }
              } else {
                tokens = Array.from(p).map((ch, i) => ({ text: ch, charIndex: i }));
              }
              
              return (
                <div key={pi} className="paragraph-card">
                  <div className="paragraph-card-header">
                    <span className="paragraph-card-number">{t('import.paragraphN', { n: pi + 1 })}</span>
                  </div>
                  <div className="paragraph-card-content" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
                    {tokens.map((token, ti) => {
                      const ci = token.charIndex;
                      const key = `${pi}-${ci}`;
                      let groupIdx = -1;
                      for (let gi = 0; gi < wordGroups.length; gi++) {
                        if (wordGroups[gi].indices.has(key)) { groupIdx = gi; break; }
                      }
                      const isPunctuation = isEnglishContent
                        ? /^[,.!?;:'"\-()\[\]{}\/\\]+$/.test(token.text)
                        : /^[\u3000-\u303f\uff00-\uffef,.!?;:'"\-()\[\]{}\/\\\s]$/.test(token.text);
                      const isInDragRange = dragActive && dragStartRef.current?.pi === pi && dragEnd !== null && (() => {
                        const s = dragStartRef.current!.ci;
                        const e = dragEnd;
                        const min = Math.min(s, e);
                        const max = Math.max(s, e);
                        return ci >= min && ci <= max;
                      })();
                      let highlightClass = '';
                      if (groupIdx >= 0) {
                        highlightClass = groupIdx % 2 === 0 ? 'highlight-color-a' : 'highlight-color-b';
                      }
                      return (
                        <span
                          key={ti}
                          data-pi={pi}
                          data-ci={ci}
                          className={`highlight-char ${highlightClass} ${isInDragRange ? 'drag-preview' : ''} ${isPunctuation ? 'punctuation' : ''} ${isEnglishContent ? 'english-word' : ''}`}
                        >
                          {token.text}{isEnglishContent && ti < tokens.length - 1 ? ' ' : ''}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Original photo reference — let the client verify OCR wording */}
            {imagePreview && (
              <div className="source-photo-check">
                <button
                  className="btn source-photo-toggle"
                  onClick={() => setShowSourcePhoto(v => !v)}
                >
                  <span className="ico">📷</span> {showSourcePhoto ? t('import.hideOriginal') : t('import.showOriginal')}
                </button>
                {showSourcePhoto && (
                  <img
                    src={imagePreview}
                    alt={t('import.originalAlt')}
                    className="source-photo-img"
                    onClick={() => setPhotoFullscreen(true)}
                  />
                )}
              </div>
            )}

            {/* Selected keywords at bottom */}
            {allWords.length > 0 && (
              <div className="selected-words-summary">
                <h3>{t('import.selectedWords', { n: allWords.length })}</h3>
                <div className="word-tags">
                  {allWords.map((w, i) => (
                    <span
                      key={i}
                      className={`word-tag removable ${i % 2 === 0 ? 'word-tag-blue' : 'word-tag-yellow'}`}
                      onClick={() => {
                        const idx = selectedWords.indexOf(w);
                        if (idx >= 0) {
                          setSelectedWords(selectedWords.filter((_, j) => j !== idx));
                        } else {
                          const groupIdx = wordGroups.findIndex(g => {
                            const charMap = new Map<number, Map<number, string>>();
                            g.indices.forEach(key => {
                              const [piStr, ciStr] = key.split('-');
                              const pi = parseInt(piStr);
                              const ci = parseInt(ciStr);
                              if (!charMap.has(pi)) charMap.set(pi, new Map());
                              const pChars = Array.from(paragraphs[pi] || '');
                              if (ci < pChars.length) {
                                charMap.get(pi)!.set(ci, pChars[ci]);
                              }
                            });
                            let text = '';
                            const sortedPis = Array.from(charMap.keys()).sort((a, b) => a - b);
                            for (const pi of sortedPis) {
                              const ciMap = charMap.get(pi)!;
                              const sortedCis = Array.from(ciMap.keys()).sort((a, b) => a - b);
                              for (const ci of sortedCis) {
                                text += ciMap.get(ci);
                              }
                            }
                            return text.trim() === w;
                          });
                          if (groupIdx >= 0) {
                            const updated = wordGroups.filter((_, j) => j !== groupIdx);
                            setWordGroups(updated);
                            wordGroupsRef.current = updated;
                          }
                        }
                      }}
                    >
                      {w} <span className="remove-x">&times;</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              className="btn btn-primary btn-large"
              onClick={handleConfirmWordSelection}
              disabled={allWords.length === 0}
            >
              {t('import.nextWords', { n: allWords.length })}
            </button>

            {wordPopup && (
              <div className="popup-overlay" onClick={() => {
                if (wordPopup.removeIdx >= 0) {
                  const updated = wordGroups.filter((_, j) => j !== wordPopup.removeIdx);
                  setWordGroups(updated);
                  wordGroupsRef.current = updated;
                }
                setWordPopup(null);
              }}>
                <div className="popup-content" onClick={e => e.stopPropagation()}>
                  <p>{wordPopup.message}</p>
                  <button className="btn btn-primary" onClick={() => {
                    if (wordPopup.removeIdx >= 0) {
                      const updated = wordGroups.filter((_, j) => j !== wordPopup.removeIdx);
                      setWordGroups(updated);
                      wordGroupsRef.current = updated;
                    }
                    setWordPopup(null);
                  }}>{t('common.confirm')}</button>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {step === 'split-sentences' && (() => {
        // Detect if content is primarily English
        const isEnglishContent = subject === 'english' || /[a-zA-Z]/.test(paragraphs.join('')) && !/[\u4e00-\u9fff]/.test(paragraphs.join(''));
        
        return (
          <div className="split-sentences-section">
            <h2>{t('import.splitTitle')}</h2>
            <p className="split-sentences-hint">{t('import.splitHint')}</p>
            <ImportStepBar current={3} showCutter={usedAutoSplit} />

            {/* Auto-select button */}
            {sentenceGroups.length === 0 && (
              <button className="btn btn-auto-select" onClick={autoSelectSentences}>
                <span className="ico">✨</span> {t('import.autoSelect')}
              </button>
            )}

            {paragraphs.map((p, pi) => {
              // For English: split by words with position tracking; For Chinese: split by characters
              let tokens: { text: string; charIndex: number }[];
              if (isEnglishContent) {
                tokens = [];
                const words = p.split(/(\s+)/);
                let charPos = 0;
                for (const word of words) {
                  if (word.trim().length > 0) {
                    tokens.push({ text: word, charIndex: charPos });
                  }
                  charPos += word.length;
                }
              } else {
                tokens = Array.from(p).map((ch, i) => ({ text: ch, charIndex: i }));
              }
              
              return (
                <div key={pi} className="paragraph-card">
                  <div className="paragraph-card-header">
                    <span className="paragraph-card-number">{t('import.paragraphN', { n: pi + 1 })}</span>
                  </div>
                  <div className="paragraph-card-content" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
                    {tokens.map((token, ti) => {
                      const ci = token.charIndex;
                      let groupIdx = -1;
                      for (let gi = 0; gi < sentenceGroups.length; gi++) {
                        const sg = sentenceGroups[gi];
                        if (sg.pi === pi && ci >= sg.start && ci <= sg.end) { groupIdx = gi; break; }
                      }
                      const isPunctuation = isEnglishContent
                        ? /^[,.!?;:'"\-()\[\]{}\/\\]+$/.test(token.text)
                        : /^[\u3000-\u303f\uff00-\uffef,.!?;:'"\-()\[\]{}\/\\\s]$/.test(token.text);
                      const isInDragRange = dragActive && dragStartRef.current?.pi === pi && dragEnd !== null && (() => {
                        const s = dragStartRef.current!.ci;
                        const e = dragEnd;
                        const min = Math.min(s, e);
                        const max = Math.max(s, e);
                        return ci >= min && ci <= max;
                      })();
                      let highlightClass = '';
                      if (groupIdx >= 0) {
                        highlightClass = groupIdx % 2 === 0 ? 'highlight-color-a' : 'highlight-color-b';
                      }
                      return (
                        <span
                          key={ti}
                          data-pi={pi}
                          data-ci={ci}
                          className={`highlight-char ${highlightClass} ${isInDragRange ? 'drag-preview' : ''} ${isPunctuation ? 'punctuation' : ''} ${isEnglishContent ? 'english-word' : ''}`}
                        >
                          {token.text}{isEnglishContent && ti < tokens.length - 1 ? ' ' : ''}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Selected sentences summary */}
            {sentenceGroups.length > 0 && (
              <div className="selected-sentences-summary">
                <h3>{t('import.selectedSentences', { n: sentenceGroups.length })}</h3>
                <div className="sentence-tags">
                  {sentenceGroups.map((sg, i) => (
                    <span
                      key={i}
                      className={`sentence-tag ${i % 2 === 0 ? 'sentence-tag-a' : 'sentence-tag-b'}`}
                      onClick={() => {
                        const updated = sentenceGroups.filter((_, j) => j !== i);
                        setSentenceGroups(updated);
                        sentenceGroupsRef.current = updated;
                        if (updated.length === 0) setUsedAutoSplit(false); // all cleared → back to manual mode, no cutter step
                      }}
                      title={t('import.clickToRemove')}
                    >
                      {sg.text} <span className="remove-x">&times;</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              className="btn btn-primary btn-large"
              onClick={handleConfirmSentenceSplit}
            >
              {usedAutoSplit ? t('import.nextCut', { n: sentenceGroups.length }) : t('import.finishSave', { n: sentenceGroups.length })}
            </button>

            {sentencePopup && (
              <div className="popup-overlay" onClick={() => {
                if (sentencePopup.removeIdx >= 0) {
                  const updated = sentenceGroups.filter((_, j) => j !== sentencePopup.removeIdx);
                  setSentenceGroups(updated);
                  sentenceGroupsRef.current = updated;
                }
                setSentencePopup(null);
              }}>
                <div className="popup-content" onClick={e => e.stopPropagation()}>
                  <p>{sentencePopup.message}</p>
                  <button className="btn btn-primary" onClick={() => {
                    if (sentencePopup.removeIdx >= 0) {
                      const updated = sentenceGroups.filter((_, j) => j !== sentencePopup.removeIdx);
                      setSentenceGroups(updated);
                      sentenceGroupsRef.current = updated;
                    }
                    setSentencePopup(null);
                  }}>{t('common.confirm')}</button>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {step === 'cut-sentences' && (() => {
        const cutsPerSentence = (gi: number) => [...cuts].filter(k => k.startsWith(gi + '|')).length;
        const chunkCount = sentenceGroups.reduce((acc, _, gi) => acc + 1 + cutsPerSentence(gi), 0);

        return (
          <div className="cutter-section">
            <h2>{t('import.cutTitle')}</h2>
            <p className="split-sentences-hint">{t('import.cutHintPre')}<span className="ico" data-word={t('import.cut')}>✂</span>{t('import.cutHintPost')}</p>
            <ImportStepBar current={4} showCutter />

            {sentenceGroups.map((sg, gi) => {
              const units = getCutUnits(sg.text);
              const nCuts = cutsPerSentence(gi);
              return (
                <div key={gi} className="paragraph-card cutter-card">
                  <div className="paragraph-card-header">
                    <span className="paragraph-card-number">{t('import.sentenceN', { n: gi + 1 })}</span>
                    <span className="cutter-chunk-badge">{t('import.chunkCount', { n: nCuts + 1 })}</span>
                  </div>
                  <div className="cutter-units">
                    {units.map((u, ui) => {
                      const isLast = ui === units.length - 1;
                      const key = `${gi}|${ui}`;
                      const isCut = cuts.has(key);
                      const toggleCut = () => {
                        if (isLast) return;
                        const next = new Set(cuts);
                        if (next.has(key)) next.delete(key); else next.add(key);
                        setCuts(next);
                      };
                      return (
                        <span key={ui} className="cutter-unit-wrap">
                          <span className={`cutter-unit ${isCut ? 'cut-here' : ''}`} onClick={toggleCut}>
                            {u.trimEnd() || u}
                          </span>
                          {!isLast && (
                            <span className={`cut-marker ${isCut ? 'cut-marker-on' : ''}`} onClick={toggleCut}>
                              <span className="ico" data-word={t('import.cut')}>✂</span>
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <button
              className="btn btn-primary btn-large"
              onClick={handleConfirmCutter}
            >
              {t('import.finishCut', { n: chunkCount })}
            </button>
          </div>
        );
      })()}

      {showUpgrade && (
        <UpgradeModal
          onClose={() => setShowUpgrade(false)}
          reason={t('import.scanExhausted', { reset: formatReset(getScanAllowance().resetsInMs) || t('import.later') })}
        />
      )}

      {/* Fullscreen photo viewer — shared by Step 1 / Step 2 pages */}
      {photoFullscreen && imagePreview && (
        <div className="popup-overlay" onClick={() => setPhotoFullscreen(false)}>
          <img
            src={imagePreview}
            alt={t('import.fullscreenAlt')}
            className="source-photo-full"
            onClick={e => e.stopPropagation()}
          />
          <button
            className="source-photo-close"
            onClick={() => setPhotoFullscreen(false)}
          >
            <span className="ico" data-word={t('common.close')}>✕</span>
          </button>
        </div>
      )}

      {cropSrc && (
        <ImageCropper imageUrl={cropSrc} onCancel={handleCropCancel} onConfirm={handleCropConfirm} />
      )}
    </div>
  );
}
