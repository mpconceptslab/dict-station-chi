import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  getWordList,
  getStudiedWords,
  getStudiedParagraphWords,
  getStudiedSentences,
  markWordsAsStudied,
  markParagraphWordsAsStudied,
  markSentencesAsStudied,
  calculateStudyPoints,
  addPoints,
  getVoiceSpeed
} from '../utils/storage';
import { useSpeech } from '../hooks/useSpeech';
import { usePrefs } from '../context/PrefsContext';
import TopNavBar from '../components/TopNavBar';
import SpeedButton from '../components/SpeedButton';
import StrokeOrderPanel from '../components/StrokeOrderPanel';
import HanziGlyph from '../components/HanziGlyph';
import WritingPad from '../components/WritingPad';
import type { WritingPadHandle } from '../components/WritingPad';

type Category = 'words' | 'paragraphWords' | 'sentences';

export default function RevisionPage() {
  const navigate = useNavigate();
  const { listId } = useParams<{ listId: string }>();
  const [searchParams] = useSearchParams();
  const category = (searchParams.get('category') || 'words') as Category;
  const filter = searchParams.get('filter') || 'all';
  const { speak, isSpeaking } = useSpeech();
  const { t } = usePrefs();

  const [items, setItems] = useState<string[]>([]);
  const [totalSyllabusItems, setTotalSyllabusItems] = useState(0);
  const [listName, setListName] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [viewedIndices, setViewedIndices] = useState<Set<number>>(new Set([0]));
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(0); // 0=100%, 1=160%, 2=220%
  const [showStroke, setShowStroke] = useState(false); // 筆順 panel toggle

  // 試寫 mode state (pure practice — no OCR, no scoring)
  const [isWritingMode, setIsWritingMode] = useState(false);
  const writingPadRef = useRef<WritingPadHandle>(null);
  const [englishInput, setEnglishInput] = useState('');

  useEffect(() => {
    loadItems();
  }, [listId]);

  async function loadItems() {
    if (!listId) return;
    const list = await getWordList(listId);
    if (!list) {
      navigate('/home');
      return;
    }
    setListName(list.name);
    // Store total syllabus items based on category
    const totalItems = category === 'words' ? list.words.length :
                       category === 'paragraphWords' ? list.paragraphWords.length :
                       list.sentences.length;
    setTotalSyllabusItems(totalItems);

    // Also check for words passed via URL (from WordListDetailPage)
    const wordsParam = searchParams.get('words');
    if (wordsParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(wordsParam));
        setItems(parsed);
        return;
      } catch (e) {
        console.error('Failed to parse words parameter:', e);
      }
    }

    // Fallback: load from stored data based on category and filter
    let allItems: string[];
    let studiedItems: string[];

    if (category === 'words') {
      allItems = list.words;
      studiedItems = getStudiedWords(listId).words.filter(w => list.words.includes(w));
    } else if (category === 'paragraphWords') {
      allItems = list.paragraphWords;
      studiedItems = getStudiedParagraphWords(listId).words.filter(w => list.paragraphWords.includes(w));
    } else {
      allItems = list.sentences;
      studiedItems = getStudiedSentences(listId).sentences.filter(s => list.sentences.includes(s));
    }

    let itemsToShow: string[];
    if (filter === 'studied') {
      itemsToShow = studiedItems;
    } else if (filter === 'unstudied') {
      itemsToShow = allItems.filter(i => !studiedItems.includes(i));
    } else {
      itemsToShow = allItems;
    }

    setItems(itemsToShow);
  }

  function handlePrevious() {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setViewedIndices(prev => new Set([...prev, newIndex]));
    }
  }

  function handleNext() {
    if (currentIndex < items.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setViewedIndices(prev => new Set([...prev, newIndex]));
    } else {
      // Reached the end - auto show completion
      setShowComplete(true);
      // Calculate and add study points based on cards reviewed
      const cardsReviewed = viewedIndices.size;
      // For study, accuracy is 100% since they're just reviewing
      const points = calculateStudyPoints(listId || '', cardsReviewed, totalSyllabusItems || items.length, 100);
      addPoints(points);
      setEarnedPoints(points);
    }
  }

  function handleReadCantonese() {
    if (items[currentIndex]) {
      speak(items[currentIndex], getVoiceSpeed(), 'zh-HK');
    }
  }

  function handleReadMandarin() {
    if (items[currentIndex]) {
      speak(items[currentIndex], getVoiceSpeed(), 'zh-CN');
    }
  }

  function handleReadEnglish() {
    if (items[currentIndex]) {
      speak(items[currentIndex], getVoiceSpeed(), 'en-US');
    }
  }

  function markCurrentItemsAsStudied() {
    if (!listId) return;
    const viewedItems = items.filter((_, i) => viewedIndices.has(i));
    if (category === 'words') {
      markWordsAsStudied(listId, viewedItems);
    } else if (category === 'paragraphWords') {
      markParagraphWordsAsStudied(listId, viewedItems);
    } else {
      markSentencesAsStudied(listId, viewedItems);
    }
  }

  function handleExit() {
    setShowExitPopup(true);
  }

  function handleExitGoHome() {
    markCurrentItemsAsStudied();
    navigate('/home');
  }

  function handleExitStartDictation() {
    markCurrentItemsAsStudied();
    startDictation();
  }

  function handleCompleteGoHome() {
    markCurrentItemsAsStudied();
    navigate('/home');
  }

  function handleCompleteStartDictation() {
    markCurrentItemsAsStudied();
    startDictation();
  }

  function startDictation() {
    if (!listId) return;
    if (category === 'sentences') {
      const paragraphsParam = encodeURIComponent(JSON.stringify(items));
      navigate(`/pre-dictation/${listId}?mode=paragraphs&paragraphs=${paragraphsParam}`);
    } else {
      const wordsParam = encodeURIComponent(JSON.stringify(items));
      navigate(`/dictation/${listId}?mode=words&count=${items.length}&words=${wordsParam}`);
    }
  }

  // 試寫 mode handlers (pure practice — no OCR, no scoring)
  function handleStartWriting() {
    setIsWritingMode(true);
    setEnglishInput('');
  }

  function handleStopWriting() {
    setIsWritingMode(false);
    setEnglishInput('');
    writingPadRef.current?.clear();
  }

  function handleNextAfterWriting() {
    handleStopWriting();
    handleNext();
  }

  // Determine which language buttons to show based on content
  const contentSample = items.join(' ');
  const hasChinese = /[\u4e00-\u9fff\u3400-\u4dbf]/.test(contentSample);
  const hasEnglish = /[a-zA-Z]/.test(contentSample);
  const showChineseOpts = hasChinese || !hasEnglish;
  const showEnglishOpt = hasEnglish;

  // Stroke order (筆順) applies to any Chinese content — words, sentences and paragraphs.
  const currentHanzi = [...(items[currentIndex] || '')].filter((ch) => /\p{Script=Han}/u.test(ch));
  const currentHasStroke = currentHanzi.length > 0;
  // Only short words are drawn glyph-by-glyph on the card; long text stays as flowing text.
  const currentShortWord = currentHanzi.length > 0 && currentHanzi.length <= 8;

  const categoryTitle = category === 'paragraphWords' ? t('revision.catParagraphWords') : category === 'sentences' ? t('revision.catSentences') : t('revision.catWords');

  if (items.length === 0) {
    return (
      <div className="page revision-page">
        <TopNavBar />
        <h1>{categoryTitle}</h1>
        <div className="empty-state">
          <p>{t('revision.empty')}</p>
          <button className="btn btn-primary" onClick={() => navigate('/home')}>{t('pre.backHome')}</button>
        </div>
      </div>
    );
  }

  // Completion screen
  if (showComplete) {
    return (
      <div className="page revision-page">
        <TopNavBar />
        <h1>{t('revision.doneTitle')}</h1>
        <p className="list-name">{listName}</p>

        <div className="revision-complete">
          {earnedPoints > 0 && (
            <p className="points-earned">{t('revision.points', { n: earnedPoints })}</p>
          )}
          <div className="popup-buttons">
            <button className="btn btn-secondary btn-large" onClick={handleCompleteStartDictation}>
              {t('revision.startDictation')}
            </button>
            <button className="btn btn-outline btn-large" onClick={handleCompleteGoHome}>
              {t('revision.later')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page revision-page">
      <TopNavBar />
      <h1>{categoryTitle}</h1>
      <p className="list-name">{listName}</p>

      <div className="revision-progress">
        {t('revision.progress', { current: currentIndex + 1, total: items.length })}
      </div>

      {/* Navigation buttons ON TOP of word card */}
      <div className="revision-nav-top">
        <button
          className="btn btn-outline revision-nav-btn"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <span className="ico">←</span> {t('revision.prev')}
        </button>

        <div className="revision-read-buttons">
          <SpeedButton />
          {showChineseOpts && (
            <button
              className={`btn ${isSpeaking ? 'btn-warning' : 'btn-secondary'} revision-read-btn`}
              onClick={handleReadCantonese}
            >
              {t('lang.cantonese')}
            </button>
          )}
          {showChineseOpts && (
            <button
              className={`btn ${isSpeaking ? 'btn-warning' : 'btn-primary'} revision-read-btn`}
              onClick={handleReadMandarin}
            >
              {t('lang.mandarin')}
            </button>
          )}
          {showEnglishOpt && (
            <button
              className={`btn ${isSpeaking ? 'btn-warning' : 'btn-primary'} revision-read-btn`}
              onClick={handleReadEnglish}
            >
              {t('lang.english')}
            </button>
          )}
        </div>

        <button
          className="btn btn-outline revision-nav-btn"
          onClick={handleNext}
        >
          {t('revision.next')} <span className="ico">→</span>
        </button>
      </div>

      <div className={`word-card-row${showStroke && currentHasStroke ? ' stroke-open' : ''}`}>
        <div className="word-card" style={{ position: 'relative' }}>
          {/* Zoom button in top-right corner */}
          <button
            className="btn btn-outline"
            onClick={() => setZoomLevel((zoomLevel + 1) % 3)}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              fontSize: '0.85rem',
              padding: '6px 12px',
              zIndex: 10
            }}
          >
            <span className="ico">🔍</span> {zoomLevel === 0 ? t('revision.zoomIn') : zoomLevel === 1 ? t('revision.zoomMore') : t('revision.zoomReset')}
          </button>

          {/* 筆順 button, just under the magnifier */}
          {currentHasStroke && (
            <button
              className="btn btn-outline"
              onClick={() => setShowStroke((v) => !v)}
              style={{
                position: 'absolute',
                top: '54px',
                right: '8px',
                fontSize: '0.85rem',
                padding: '6px 12px',
                zIndex: 10
              }}
            >
              {showStroke ? <><span className="ico">✕</span> {t('revision.hideStroke')}</> : <><span className="ico">✍️</span> {t('revision.stroke')}</>}
            </button>
          )}

          <div className="word-card-content" style={{ transform: `scale(${1 + zoomLevel * 0.6})`, transformOrigin: 'center center', transition: 'transform 0.2s ease' }}>
            <span className={`word-card-text${(items[currentIndex] || '').length > 10 ? ' long-text' : ''}`}>
              {currentShortWord
                ? [...(items[currentIndex] || '')].map((ch, i) => (<HanziGlyph key={i} char={ch} />))
                : items[currentIndex]}
            </span>
          </div>
        </div>

        {showStroke && currentHasStroke && (
          <StrokeOrderPanel
            word={items[currentIndex]}
            hasPrev={currentIndex > 0}
            hasNext={currentIndex < items.length - 1}
            onPrev={handlePrevious}
            onNext={handleNext}
            positionLabel={t('revision.position', { current: currentIndex + 1, total: items.length })}
            onClose={() => setShowStroke(false)}
          />
        )}
      </div>

      {/* 試寫 and 離開 buttons side by side */}
      {!isWritingMode && (
        <div className="revision-action-row">
          <button className="btn btn-primary" onClick={handleStartWriting}>
            {hasChinese || !hasEnglish ? `️ ${t('revision.tryWrite')}` : `️ ${t('revision.tryWriteInput')}`}
          </button>
          <button className="btn btn-outline revision-exit-btn" onClick={handleExit}>
            {t('revision.exit')}
          </button>
        </div>
      )}

      {/* 試寫 mode UI — pure practice (no OCR, no scoring) */}
      {isWritingMode && (
        <div className="writing-mode-section">
          <p className="practice-hint">{t('revision.practiceHint')}</p>

          {/* English-only: free typing practice */}
          {(hasEnglish && !hasChinese) ? (
            <div className="english-typing-section">
              <textarea
                value={englishInput}
                onChange={(e) => setEnglishInput(e.target.value)}
                placeholder="Practice typing here..."
                className="english-typing-input"
                rows={3}
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
              <div className="typing-buttons-row">
                <button
                  className="btn btn-outline"
                  onClick={() => setEnglishInput('')}
                >
                  Clear
                </button>
                <button className="btn btn-primary" onClick={handleNextAfterWriting}>
                  Next <span className="ico">→</span>
                </button>
                <button className="btn btn-outline" onClick={handleStopWriting}>
                  Done
                </button>
              </div>
            </div>
          ) : (
          /* Chinese: handwriting pad with buttons on the right */
          <div className="writing-pad-with-buttons">
            <div className="writing-pad-container">
              <WritingPad
                ref={writingPadRef}
                hideControls={true}
              />
            </div>

            {/* Buttons on the right side vertically */}
            <div className="writing-pad-side-buttons">
              <button
                className="btn btn-outline"
                onClick={() => writingPadRef.current?.clear()}
              >
                {t('revision.clear')}
              </button>
              <button
                className="btn btn-primary"
                onClick={handleNextAfterWriting}
              >
                {t('revision.next')} <span className="ico">→</span>
              </button>
              <button
                className="btn btn-outline"
                onClick={handleStopWriting}
              >
                {t('common.done')}
              </button>
            </div>
          </div>
          )}
        </div>
      )}

      {/* Exit button - only show when not in writing mode and no 試寫 button visible (never shown now since 試寫 is always visible) */}

      <div className="revision-dots">
        {items.map((_, i) => (
          <div
            key={i}
            className={`revision-dot ${i === currentIndex ? 'current' : ''} ${viewedIndices.has(i) ? 'viewed' : ''}`}
          />
        ))}
      </div>

      {/* Exit Popup */}
      {showExitPopup && (
        <div className="popup-overlay" onClick={() => setShowExitPopup(false)}>
          <div className="popup-content" onClick={e => e.stopPropagation()}>
            <p>{t('revision.exitConfirm')}</p>
            <div className="popup-buttons">
              <button className="btn btn-secondary btn-large" onClick={handleExitStartDictation}>
                {t('revision.startDictation')}
              </button>
              <button className="btn btn-outline btn-large" onClick={handleExitGoHome}>
                {t('revision.later')}
              </button>
            </div>
            <button className="btn btn-primary btn-large" onClick={() => setShowExitPopup(false)} style={{ marginTop: '12px', width: '100%' }}>
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
