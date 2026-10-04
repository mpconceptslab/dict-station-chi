import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useSpeech, splitSentences } from '../hooks/useSpeech';
import {
  getWordList,
  saveSession,
  saveCorrection,
  generateId,
  markWordsAsStudied,
  calculateDictationPoints,
  addPoints,
  getVoiceSpeed,
  type DictationSession,
  type CorrectionSession,
  type HandwritingCell,
  type CheckStatus,
} from '../utils/storage';
import { selectRandomWords } from '../utils/wordParser';
import { checkWord, compareText } from '../utils/textComparison';
import { buildSheets } from '../utils/sheetBuilder';
import { recognizeSheets, cellKey, isCharCorrect, type RecognizedMap } from '../services/visionCheck';
import { getCheckAllowance, recordCheck } from '../utils/limits';
import TopNavBar from '../components/TopNavBar';
import SpeedButton from '../components/SpeedButton';
import HandwritingGrid from '../components/HandwritingGrid';
import { fireConfetti } from '../components/Confetti';
import { useSound } from '../hooks/useSound';
import { usePrefs } from '../context/PrefsContext';

/** Characters that get their own handwriting box. */
const WRITABLE = /[\p{Script=Han}A-Za-z0-9]/u;

/** For sentences mode: include punctuation marks as writable boxes too. */
const WRITABLE_SENTENCE = /[\p{Script=Han}A-Za-z0-9，。！？、；：""''（）【】《》,.!?;:'"\[\](){}]/u;

function makeCells(target: string, includePunctuation = false): HandwritingCell[] {
  const pattern = includePunctuation ? WRITABLE_SENTENCE : WRITABLE;
  const chars = [...(target || '')].filter((ch) => pattern.test(ch));
  return chars.map((ch, i) => ({ charIndex: i, targetChar: ch }));
}

function makeToken(): string {
  const raw = localStorage.getItem('current_session');
  let name = 'user';
  try {
    const u = JSON.parse(raw || '{}');
    if (u && u.username) name = u.username;
  } catch {
    /* ignore */
  }
  return btoa(`${name}:${Date.now()}`);
}

export default function DictationPage() {
  const navigate = useNavigate();
  const { listId } = useParams<{ listId: string }>();
  const [searchParams] = useSearchParams();
  const count = Number(searchParams.get('count') || 5);
  const mode = searchParams.get('mode') || 'words';
  const isSentencesMode = mode === 'sentences';
  const { t } = usePrefs();
  const pageTitle = isSentencesMode
    ? t('dictation.titleSentences')
    : mode === 'all'
      ? t('dictation.titleAll')
      : mode === 'paragraphs'
        ? t('dictation.titleParagraphs')
        : t('dictation.titleWords');
  const { speak, isSpeaking } = useSpeech();
  const { celebrate } = useSound();

  const [words, setWords] = useState<string[]>([]);
  const [_paragraphCount, setParagraphCount] = useState(0);
  const [sentenceCount, setSentenceCount] = useState(0);
  const [listName, setListName] = useState('');
  const [voice, setVoice] = useState<string | undefined>();
  const [listLanguage, setListLanguage] = useState<string | undefined>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [totalSyllabusWords, setTotalSyllabusWords] = useState(0);

  // Handwriting grid: per item, one cell array (parallel to `words`).
  const [itemCells, setItemCells] = useState<HandwritingCell[][]>([]);
  // English typing path.
  const [userAnswer, setUserAnswer] = useState('');
  const [answers, setAnswers] = useState<{ word: string; answer: string; correct: boolean }[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [earnedBonus, setEarnedBonus] = useState(0);

  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [checking, setChecking] = useState(false);

  const isEnglishContent = listLanguage === 'english';
  const useHandwriting = !isEnglishContent;
  // For sentences and paragraphs mode, include punctuation in handwriting boxes
  // In 'all' mode, only items that are sentences use sentence boxes
  const isCurrentSentence = mode === 'all' && currentIndex >= words.length - sentenceCount;
  const useSentenceBoxes = isSentencesMode || mode === 'paragraphs' || isCurrentSentence;

  const currentItem = words[currentIndex] || '';

  useEffect(() => {
    loadWords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listId]);

  // Lazily build the boxes for the current handwriting item.
  useEffect(() => {
    if (!useHandwriting || !started) return;
    if (words.length === 0) return;
    setItemCells((prev) => {
      if (prev[currentIndex] && prev[currentIndex].length > 0) return prev;
      const next = [...prev];
      // For sentences/paragraphs mode, include punctuation in boxes
      next[currentIndex] = makeCells(words[currentIndex] || '', useSentenceBoxes);
      return next;
    });
  }, [currentIndex, started, words, useHandwriting, useSentenceBoxes]);

  async function loadWords() {
    if (!listId) return;
    const list = await getWordList(listId);
    if (!list) {
      navigate('/home');
      return;
    }
    setListName(list.name);
    setVoice(list.voice);
    setListLanguage(list.language);
    // Total syllabus size depends on mode
    let syllabusTotal = list.words.length;
    if (mode === 'all') {
      syllabusTotal = list.words.length + list.paragraphWords.length + list.sentences.length;
    } else if (mode === 'paragraphs') {
      syllabusTotal = list.paragraphWords.length;
    } else if (mode === 'sentences') {
      syllabusTotal = list.sentences.length;
    }
    setTotalSyllabusWords(syllabusTotal);

    const wordsParam = searchParams.get('words');
    let parsedWords: string[] = [];
    if (wordsParam) {
      try {
        parsedWords = JSON.parse(decodeURIComponent(wordsParam));
      } catch (e) {
        console.error('Failed to parse words parameter:', e);
      }
    }
    const paragraphsParam = searchParams.get('paragraphs');
    let parsedParagraphs: string[] = [];
    if (paragraphsParam) {
      try {
        parsedParagraphs = JSON.parse(decodeURIComponent(paragraphsParam));
      } catch (e) {
        console.error('Failed to parse paragraphs parameter:', e);
      }
    }
    if (parsedWords.length > 0 || parsedParagraphs.length > 0) {
      setWords([...parsedWords, ...parsedParagraphs]);
      setParagraphCount(parsedParagraphs.length);
      const sc = Number(searchParams.get('sentenceCount') || 0);
      setSentenceCount(sc);
      return;
    }
    const selected = selectRandomWords(list.words, count);
    setWords(selected);
  }

  const speakCurrentWord = useCallback(async () => {
    if (currentIndex < words.length) {
      const defaultLang = isEnglishContent ? 'en-US' : 'zh-HK';
      const text = words[currentIndex];
      
      if (useSentenceBoxes) {
        // For sentences/paragraphs mode: split by punctuation and speak with pauses
        const sentences = splitSentences(text);
        for (const sentence of sentences) {
          if (sentence.trim()) {
            await speak(sentence.trim(), getVoiceSpeed(), selectedVoice || voice || defaultLang);
            // Pause between sentences
            await new Promise(resolve => setTimeout(resolve, 800));
          }
        }
      } else {
        await speak(text, getVoiceSpeed(), selectedVoice || voice || defaultLang);
      }
    }
  }, [currentIndex, words, speak, voice, selectedVoice, isEnglishContent, useSentenceBoxes]);

  function handleCellImage(index: number, image: string | undefined) {
    setItemCells((prev) => {
      const next = [...prev];
      const arr = [...(next[currentIndex] || [])];
      if (arr[index]) arr[index] = { ...arr[index], image };
      next[currentIndex] = arr;
      return next;
    });
  }

  function clearCurrentItem() {
    setItemCells((prev) => {
      const next = [...prev];
      next[currentIndex] = (next[currentIndex] || []).map((c) => ({ ...c, image: undefined }));
      return next;
    });
  }

  function goToNextItem() {
    setUserAnswer('');
    if (currentIndex + 1 >= words.length) {
      setShowSubmitConfirm(true);
    } else {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setTimeout(() => {
        const defaultLang = isEnglishContent ? 'en-US' : 'zh-HK';
        const text = words[nextIndex];
        
        if (useSentenceBoxes) {
          // For sentences/paragraphs mode: split by punctuation and speak with pauses
          const sentences = splitSentences(text);
          speakSentencesSequentially(sentences, defaultLang);
        } else {
          speak(text, getVoiceSpeed(), selectedVoice || voice || defaultLang);
        }
      }, 300);
    }
  }

  // Helper to speak sentences sequentially with pauses
  async function speakSentencesSequentially(sentences: string[], defaultLang: string) {
    for (const sentence of sentences) {
      if (sentence.trim()) {
        await speak(sentence.trim(), getVoiceSpeed(), selectedVoice || voice || defaultLang);
        await new Promise(resolve => setTimeout(resolve, 800));
      }
    }
  }

  function pushTypedAnswer() {
    if (!userAnswer.trim()) return;
    const newAnswers = [...answers, { word: currentItem, answer: userAnswer.trim(), correct: false }];
    setAnswers(newAnswers);
    setUserAnswer('');
    if (currentIndex + 1 >= words.length) {
      setShowSubmitConfirm(true);
    } else {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setTimeout(() => {
        speak(words[nextIndex], getVoiceSpeed(), selectedVoice || voice || 'en-US');
      }, 300);
    }
  }

  async function createCorrection(sessionId: string, wrongIndices: number[], userAnswersArr: string[]) {
    const correction: CorrectionSession = {
      id: sessionId, // keyed by the dictation session id for easy lookup
      dictationSessionId: sessionId,
      wrongWords: wrongIndices.map((i) => ({ word: words[i], userAnswer: userAnswersArr[i] || '' })),
      practiceRounds: wrongIndices.map((i) => ({ wordIndex: i, attempts: [], images: [] })),
    };
    await saveCorrection(correction);
  }

  /** CJK handwriting: one composite pass, then hand off to the marking page. */
  async function submitHandwriting() {
    setShowSubmitConfirm(false);
    setChecking(true);

    const items = words.map((w, i) => ({
      itemIndex: i,
      cells: itemCells[i] && itemCells[i].length > 0 ? itemCells[i] : makeCells(w),
    }));

    let checkStatus: CheckStatus = 'pending';
    let recognized: RecognizedMap = new Map();
    let sheetsCount = 0;

    const allow = getCheckAllowance();
    if (allow.remaining > 0) {
      try {
        const sheets = await buildSheets(items);
        sheetsCount = sheets.length;
        recognized = await recognizeSheets(sheets, makeToken());
        recordCheck();
        checkStatus = 'ai-checked';
      } catch (e) {
        console.error('AI check failed:', e);
        checkStatus = 'failed';
      }
    }

    const finalCells: HandwritingCell[][] = items.map((it) =>
      it.cells.map((c) => {
        const rec = recognized.get(cellKey(it.itemIndex, c.charIndex));
        return {
          ...c,
          recognized: rec,
          correct: checkStatus === 'ai-checked' ? isCharCorrect(rec, c.targetChar) : undefined,
        };
      })
    );

    const wrongIndices: number[] = [];
    let correctCount = 0;
    finalCells.forEach((cellsArr, i) => {
      const allCorrect = cellsArr.length > 0 && cellsArr.every((c) => c.correct === true);
      if (checkStatus === 'ai-checked') {
        if (allCorrect) correctCount++;
        else wrongIndices.push(i);
      } else {
        wrongIndices.push(i); // unknown until a parent marks it
      }
    });

    const userAnswers = finalCells.map((cellsArr) =>
      cellsArr.map((c) => c.recognized || (c.image ? '?' : '')).join('')
    );

    const session: DictationSession = {
      id: generateId(),
      wordListId: listId || '',
      wordListName: listName,
      mode: 'standard',
      words,
      userAnswers,
      correctAnswers: words,
      wrongIndices,
      score: checkStatus === 'ai-checked' ? correctCount : 0,
      totalWords: words.length,
      timestamp: Date.now(),
      inputType: 'handwriting',
      cells: finalCells,
      sheets: sheetsCount,
      checkStatus,
    };
    await saveSession(session);

    if (checkStatus === 'ai-checked') {
      const marksPct = Math.round((correctCount / Math.max(words.length, 1)) * 100);
      const { points, bonus } = calculateDictationPoints(
        listId || '',
        words.length,
        totalSyllabusWords || words.length,
        marksPct
      );
      addPoints(points + bonus);
      if (listId) markWordsAsStudied(listId, words);
      if (wrongIndices.length > 0) await createCorrection(session.id, wrongIndices, userAnswers);
    }

    setChecking(false);
    navigate(`/marking/${session.id}`, { replace: true });
  }

  /** English typing: score locally (free), then show the results screen. */
  function submitTyping() {
    setShowSubmitConfirm(false);
    const finalAnswers = answers.map((a, i) => ({
      ...a,
      correct: isSentencesMode
        ? compareText(a.answer, words[i]).score / Math.max(compareText(a.answer, words[i]).totalWords, 1) === 1
        : checkWord(a.answer, words[i]).isCorrect,
    }));
    setAnswers(finalAnswers);

    const wrongIndices = finalAnswers.map((a, i) => (a.correct ? -1 : i)).filter((i) => i >= 0);
    const correctCount = finalAnswers.filter((a) => a.correct).length;
    const session: DictationSession = {
      id: generateId(),
      wordListId: listId || '',
      wordListName: listName,
      mode: 'standard',
      words,
      userAnswers: finalAnswers.map((a) => a.answer),
      correctAnswers: words,
      wrongIndices,
      score: correctCount,
      totalWords: words.length,
      timestamp: Date.now(),
      inputType: 'typing',
      checkStatus: 'ai-checked',
    };
    saveSession(session);

    const marksPct = Math.round((correctCount / Math.max(words.length, 1)) * 100);
    const { points, bonus } = calculateDictationPoints(
      listId || '',
      words.length,
      totalSyllabusWords || words.length,
      marksPct
    );
    addPoints(points + bonus);
    setEarnedPoints(points);
    setEarnedBonus(bonus);
    if (listId) markWordsAsStudied(listId, words);
    if (wrongIndices.length > 0) {
      createCorrection(session.id, wrongIndices, finalAnswers.map((a) => a.answer));
    }
    setShowResult(true);
    if (marksPct >= 80) {
      fireConfetti();
      celebrate();
    }
  }

  function handleSubmit() {
    if (useHandwriting) submitHandwriting();
    else submitTyping();
  }

  function handleReDictateWrong() {
    const wrongWords = answers.filter((a) => !a.correct).map((a) => a.word);
    if (wrongWords.length === 0) return;
    setWords(wrongWords);
    setCurrentIndex(0);
    setUserAnswer('');
    setAnswers([]);
    setItemCells([]);
    setShowResult(false);
    setStarted(false);
    setSelectedVoice(null);
  }

  const contentSample = words.join(' ');
  const hasChinese = /[\u4e00-\u9fff\u3400-\u4dbf]/.test(contentSample);
  const hasEnglish = /[a-zA-Z]/.test(contentSample);
  const showChineseOpts = hasChinese || !hasEnglish;
  const showEnglishOpt = hasEnglish;

  /* ── Result screen (English typing) ─────────────────────────────────────── */
  if (showResult) {
    const score = answers.filter((a) => a.correct).length;
    const percentage = answers.length > 0 ? Math.round((score / words.length) * 100) : 0;
    const hasWrong = answers.some((a) => !a.correct);
    return (
      <div className="page results-page">
        <TopNavBar />
        <h1>{t('pre.resultTitle')}</h1>
        <div className="score-display">
          <div className={`score-circle ${percentage >= 80 ? 'great' : percentage >= 50 ? 'good' : 'try-again'}`}>
            <span className="score-number">{percentage}%</span>
          </div>
          <p>
            {t('marking.score', { score, total: words.length })}
          </p>
          <p className="encouragement">
            {percentage === 100
              ? t('dictation.enc100')
              : percentage >= 80
                ? t('dictation.enc80')
                : percentage >= 50
                  ? t('dictation.enc50')
                  : t('dictation.encLow')}
          </p>
          {(earnedPoints > 0 || earnedBonus > 0) && (
            <p className="points-earned">
              {t('dictation.pointsEarned', { points: earnedPoints, bonus: earnedBonus > 0 ? ` + ${earnedBonus}` : '' })}
            </p>
          )}
        </div>
        <div className="answer-review">
          <h3>{t('dictation.reviewTitle')}</h3>
          {answers.map((a, i) => (
            <div key={i} className={`answer-item ${a.correct ? 'correct' : 'wrong'}`}>
              <span className="answer-word">{a.word}</span>
              {!a.correct && (
                <span className="answer-detail">
                  {t('marking.youWrote')}<em>{a.answer}</em>
                </span>
              )}
              <span className="answer-icon">
                {a.correct ? <span className="ico" data-word={t('marking.rightWord')}>✓</span> : <span className="ico" data-word={t('marking.wrongWord')}>✗</span>}
              </span>
            </div>
          ))}
        </div>
        <div className="action-buttons">
          <button className="btn btn-primary" onClick={() => navigate('/home')}>
            {t('pre.backHome')}
          </button>
          {hasWrong && (
            <button className="btn btn-secondary" onClick={handleReDictateWrong}>
              {t('pre.redoWrong')}
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ── Start screen (voice selection) ─────────────────────────────────────── */
  if (!started && words.length > 0) {
    return (
      <div className="page dictation-page">
        <TopNavBar />
        <h1>{pageTitle}</h1>
        <p className="list-name">{listName}</p>
        <div className="pre-start">
          <p className="word-count-text">
            {isSentencesMode
              ? t('dictation.countWords', { n: words.length })
              : mode === 'paragraphs'
                ? t('dictation.countParagraphs', { n: words.length })
                : mode === 'all'
                  ? t('dictation.countMixed', { w: words.length - sentenceCount, p: sentenceCount })
                  : t('dictation.countWords', { n: words.length })}
          </p>
          <div className="instruction-list">
            {useHandwriting ? (
              <>
                <p>{t('dictation.instRead')}</p>
                <p>{t('dictation.instHw2')}</p>
                <p>{t('dictation.instHw3')}</p>
              </>
            ) : (
              <>
                <p>{t('dictation.instRead')}</p>
                <p>{t('dictation.instType2')}</p>
                <p>{t('dictation.instType3')}</p>
              </>
            )}
          </div>
          <p className="encourage-text">{t('dictation.encourageStart')}</p>
          <div className="voice-selection">
            {showChineseOpts && (
              <button
                className="btn btn-secondary btn-large"
                onClick={() => {
                  setSelectedVoice('zh-HK');
                  setStarted(true);
                  setTimeout(() => speakCurrentWord(), 100);
                }}
              >
                {t('lang.cantonese')}
              </button>
            )}
            {showChineseOpts && (
              <button
                className="btn btn-primary btn-large"
                onClick={() => {
                  setSelectedVoice('zh-CN');
                  setStarted(true);
                  setTimeout(() => speakCurrentWord(), 100);
                }}
              >
                {t('lang.mandarin')}
              </button>
            )}
            {showEnglishOpt && (
              <button
                className="btn btn-primary btn-large"
                onClick={() => {
                  setSelectedVoice('en-US');
                  setStarted(true);
                  setTimeout(() => speakCurrentWord(), 100);
                }}
              >
                {t('lang.english')}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── Main dictation screen ──────────────────────────────────────────────── */
  const filledCount = useHandwriting
    ? (itemCells[currentIndex] || []).filter((c) => c.image).length
    : 0;
  const boxCount = useHandwriting ? (itemCells[currentIndex] || []).length : 0;

  return (
    <div className="page dictation-page">
      <TopNavBar />
      <h1>{pageTitle}</h1>

      <div className="progress-info">
        {isSentencesMode
          ? t('dictation.progressSentence', { current: currentIndex + 1, total: words.length })
          : t('revision.progress', { current: currentIndex + 1, total: words.length })}
      </div>

      <div className="speed-bar">
        <SpeedButton />
      </div>

      <div className="dictation-area">
        <button className={`speak-btn ${isSpeaking ? 'speaking' : ''}`} onClick={speakCurrentWord}>
          {isSpeaking
            ? <><span className="ico">🔊</span> {t('dictation.playing')}</>
            : t('dictation.clickListen')}
        </button>

        {useHandwriting ? (
          <>
            <p className="ocr-result-instruction">{t('dictation.hwInstruction')}</p>
            <HandwritingGrid
              cells={itemCells[currentIndex] || []}
              onCellImage={handleCellImage}
              disabled={checking}
            />
            <div className="hw-item-actions">
              <button className="btn btn-outline" onClick={clearCurrentItem} disabled={filledCount === 0}>
                {t('dictation.clearAll')}
              </button>
              <span className="hw-item-count">
                {filledCount} / {boxCount}
              </span>
              <button className="btn btn-primary" onClick={goToNextItem}>
                {currentIndex + 1 >= words.length ? t('common.done') : isSentencesMode ? t('dictation.nextSentence') : t('revision.next')}
              </button>
            </div>
          </>
        ) : (
          <div className="input-area">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder={t('dictation.typePlaceholder')}
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className="english-typing-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter') pushTypedAnswer();
              }}
            />
            <button className="btn btn-primary" onClick={pushTypedAnswer} disabled={!userAnswer.trim()}>
              {currentIndex + 1 >= words.length ? t('common.done') : t('revision.next')}
            </button>
          </div>
        )}
      </div>

      <div className="mini-progress">
        {words.map((_, i) => {
          let cls = 'progress-dot';
          if (useHandwriting) {
            const cells = itemCells[i] || [];
            if (cells.length > 0 && cells.every((c) => c.image)) cls += ' correct';
            else if (cells.some((c) => c.image)) cls += ' wrong';
          } else if (i < answers.length) {
            cls += answers[i].answer ? ' correct' : '';
          }
          if (i === currentIndex) cls += ' current';
          return <div key={i} className={cls} />;
        })}
      </div>

      {/* Submit confirmation */}
      {showSubmitConfirm && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p className="popup-title">{t('dictation.submitTitle')}</p>
            <p className="popup-subtitle">
              {useHandwriting ? t('dictation.submitHw') : t('dictation.submitTyping')}
            </p>
            {useHandwriting && (
              <p className="popup-hint">
                {t('dictation.aiBalance', { n: getCheckAllowance().remaining })}
              </p>
            )}
            <div className="popup-buttons">
              <button className="btn btn-secondary btn-large" onClick={() => setShowSubmitConfirm(false)}>
                {t('dictation.backToCheck')}
              </button>
              <button className="btn btn-primary btn-large" onClick={handleSubmit}>
                {t('dictation.submit')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI checking overlay */}
      {checking && (
        <div className="popup-overlay">
          <div className="popup-content checking-popup">
            <div className="spinner" />
            <p className="popup-title">{t('dictation.checkingTitle')}</p>
            <p className="popup-subtitle">{t('dictation.checkingMsg')}</p>
          </div>
        </div>
      )}
    </div>
  );
}
