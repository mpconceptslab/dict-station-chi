import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCorrection, saveCorrection, type CorrectionSession, type HandwritingCell } from '../utils/storage';
import { useSpeech } from '../hooks/useSpeech';
import TopNavBar from '../components/TopNavBar';
import { fireConfetti } from '../components/Confetti';
import { useSound } from '../hooks/useSound';
import HandwritingGrid from '../components/HandwritingGrid';
import HanziGlyph from '../components/HanziGlyph';
import StrokeOrderPanel from '../components/StrokeOrderPanel';
import { usePrefs } from '../context/PrefsContext';

const REQUIRED_PRACTICE_COUNT = 3;
const HANZI_RE = /\p{Script=Han}/u;
const WRITABLE = /[\p{Script=Han}A-Za-z0-9]/u;

function makeCells(target: string): HandwritingCell[] {
  const chars = [...(target || '')].filter((ch) => WRITABLE.test(ch));
  return chars.map((ch, i) => ({ charIndex: i, targetChar: ch }));
}

/** Identify which characters in the correct answer were written incorrectly */
function identifyWrongChars(correct: string, userAnswer: string): Set<number> {
  const wrongIndices = new Set<number>();
  const correctChars = [...correct];
  const userChars = [...userAnswer];
  
  // Compare character by character
  for (let i = 0; i < correctChars.length; i++) {
    if (i >= userChars.length || correctChars[i] !== userChars[i]) {
      // Only mark writable characters as wrong
      if (WRITABLE.test(correctChars[i])) {
        wrongIndices.add(i);
      }
    }
  }
  
  return wrongIndices;
}

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = reject;
    im.src = src;
  });
}

/** Join one attempt's box images into a single row PNG (capture-only, no OCR). */
async function compositeRow(imgs: (string | undefined)[]): Promise<string> {
  const present = imgs.filter((s): s is string => !!s);
  if (present.length === 0) return '';
  const loaded = await Promise.all(present.map(loadImg));
  const box = 140;
  const c = document.createElement('canvas');
  c.width = loaded.length * box;
  c.height = box;
  const ctx = c.getContext('2d');
  if (!ctx) return '';
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, c.width, c.height);
  loaded.forEach((im, idx) => ctx.drawImage(im, idx * box, 0, box, box));
  return c.toDataURL('image/png');
}

export default function CorrectionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { speak } = useSpeech();
  const { celebrate, correct, wrong } = useSound();
  const { t } = usePrefs();
  const [correction, setCorrection] = useState<CorrectionSession | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [attemptCells, setAttemptCells] = useState<HandwritingCell[]>([]);
  const [typedAttempt, setTypedAttempt] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showStroke, setShowStroke] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wrongCharIndices, setWrongCharIndices] = useState<Set<number>>(new Set());
  const [enlarged, setEnlarged] = useState(false);

  useEffect(() => {
    (async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }
      const c = await getCorrection(sessionId);
      setCorrection(c || null);
      setLoading(false);
    })();
  }, [sessionId]);

  const currentWrong = correction?.wrongWords[currentWordIndex];
  const currentRound = correction?.practiceRounds[currentWordIndex];
  const targetWord = currentWrong?.word || '';
  const isCJK = HANZI_RE.test(targetWord);
  const attemptsDone = isCJK
    ? currentRound?.images?.length || 0
    : currentRound?.attempts.length || 0;

  // (Re)initialise the boxes whenever the active word changes.
  useEffect(() => {
    if (!correction) return;
    const word = correction.wrongWords[currentWordIndex]?.word || '';
    const userAnswer = correction.wrongWords[currentWordIndex]?.userAnswer || '';
    
    // Identify which characters are wrong
    const wrongIndices = identifyWrongChars(word, userAnswer);
    setWrongCharIndices(wrongIndices);
    
    // Only create handwriting cells for wrong characters
    const wrongChars = [...word].filter((ch, i) => wrongIndices.has(i) && WRITABLE.test(ch));
    setAttemptCells(wrongChars.map((ch, i) => ({ charIndex: i, targetChar: ch })));
    setTypedAttempt('');
    setShowStroke(false);
    setEnlarged(false);
  }, [currentWordIndex, correction]);

  function advanceOrFinish(updated: CorrectionSession) {
    if (attemptsDone + 1 >= REQUIRED_PRACTICE_COUNT) {
      if (currentWordIndex + 1 >= updated.wrongWords.length) {
        updated.completedAt = Date.now();
        saveCorrection(updated);
        setCorrection(updated);
        setCompleted(true);
        fireConfetti();
        celebrate();
        return;
      }
      setCurrentWordIndex(currentWordIndex + 1);
    }
  }

  async function finishHandwritingAttempt() {
    if (!correction || !currentRound) return;
    if (attemptCells.length === 0 || attemptCells.some((c) => !c.image)) return;
    const composite = await compositeRow(attemptCells.map((c) => c.image));
    const updated: CorrectionSession = {
      ...correction,
      practiceRounds: correction.practiceRounds.map((r, i) =>
        i === currentWordIndex ? { ...r, images: [...(r.images || []), composite] } : r
      ),
    };
    await saveCorrection(updated);
    setCorrection(updated);
    if (attemptsDone + 1 >= REQUIRED_PRACTICE_COUNT) {
      advanceOrFinish(updated);
    } else {
      setAttemptCells(makeCells(targetWord));
    }
  }

  function finishTypedAttempt() {
    if (!correction || !currentRound) return;
    const ok = typedAttempt.trim().toLowerCase() === targetWord.toLowerCase();
    setFeedback(ok ? 'correct' : 'wrong');
    if (ok) correct();
    else wrong();
    if (!ok) {
      setTimeout(() => setFeedback(null), 1500);
      return;
    }
    const updated: CorrectionSession = {
      ...correction,
      practiceRounds: correction.practiceRounds.map((r, i) =>
        i === currentWordIndex ? { ...r, attempts: [...r.attempts, typedAttempt.trim()] } : r
      ),
    };
    saveCorrection(updated);
    setCorrection(updated);
    setTimeout(() => {
      setFeedback(null);
      setTypedAttempt('');
      if (attemptsDone + 1 >= REQUIRED_PRACTICE_COUNT) advanceOrFinish(updated);
    }, 800);
  }

  if (loading) {
    return (
      <div className="page correction-page">
        <TopNavBar />
        <div className="empty-state">
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!correction || correction.wrongWords.length === 0) {
    return (
      <div className="page correction-page">
        <TopNavBar />
        <h1>{t('correction.title')}</h1>
        <div className="empty-state">
          <p>{t('correction.none')}</p>
          <button className="btn btn-primary" onClick={() => navigate('/records')}>
            {t('correction.backToRecords')}
          </button>
        </div>
      </div>
    );
  }

  if (completed || correction.completedAt) {
    return (
      <div className="page correction-page">
        <TopNavBar />
        <h1>{t('correction.doneTitle')}</h1>
        <div className="completion-message">
          <p className="big-emoji"><span className="ico">🎉</span></p>
          <p>{t('correction.doneMsg', { n: REQUIRED_PRACTICE_COUNT })}</p>
          <div className="action-buttons">
            <button className="btn btn-secondary" onClick={() => navigate(`/marking/${sessionId}`)}>
              {t('correction.backToMarking')}
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/records')}>
              {t('correction.backToRecords')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page correction-page">
      <TopNavBar />
      <h1>{t('correction.title')}</h1>

      <div className="correction-progress">
        {t('correction.progress', { current: currentWordIndex + 1, total: correction.wrongWords.length })}
      </div>

      <div className="correction-card">
        {/* Word card style correct answer display */}
        <div className="word-card-display">
          <button className="enlarge-btn" onClick={() => setEnlarged(true)} aria-label="放大">
            <span className="ico">🔍</span>
          </button>
          <div className="word-card-content">
            <p className="label">{t('correction.correctLabel')}</p>
            <p className="word-card-text">
              {isCJK ? [...targetWord].map((ch, i) => (
                <span key={i} className={wrongCharIndices.has(i) ? 'wrong-char' : ''}>
                  <HanziGlyph char={ch} />
                </span>
              )) : targetWord}
            </p>
          </div>
          <div className="correction-word-actions">
            <button className="btn btn-outline speak-btn-small" onClick={() => speak(targetWord, 0.5)}>
              <span className="ico">🔊</span> {t('correction.listen')}
            </button>
            {isCJK && (
              <button className="btn btn-outline" onClick={() => setShowStroke((s) => !s)}>
                <span className="ico">✍️</span> {showStroke ? t('correction.hideStroke') : t('correction.showStroke')}
              </button>
            )}
          </div>
        </div>

        {/* Enlarged modal */}
        {enlarged && (
          <div className="enlarged-modal" onClick={() => setEnlarged(false)}>
            <div className="enlarged-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-enlarge" onClick={() => setEnlarged(false)}>
                <span className="ico">✕</span>
              </button>
              <p className="enlarged-word">
                {isCJK ? [...targetWord].map((ch, i) => (
                  <span key={i} className={wrongCharIndices.has(i) ? 'wrong-char' : ''}>
                    <HanziGlyph char={ch} />
                  </span>
                )) : targetWord}
              </p>
            </div>
          </div>
        )}

        {showStroke && isCJK && (
          <StrokeOrderPanel
            word={targetWord}
            hasPrev={false}
            hasNext={false}
            onPrev={() => {}}
            onNext={() => {}}
            positionLabel={targetWord}
            onClose={() => setShowStroke(false)}
          />
        )}

        <div className="practice-input">
          <p className="practice-count">
            {t('correction.practice', { done: attemptsDone, total: REQUIRED_PRACTICE_COUNT })}
          </p>
          <div className="practice-dots">
            {Array.from({ length: REQUIRED_PRACTICE_COUNT }).map((_, i) => (
              <div key={i} className={`dot ${i < attemptsDone ? 'filled' : ''}`} />
            ))}
          </div>

          {isCJK ? (
            <>
              <p className="ocr-result-instruction">{t('correction.writeInstruction')}</p>
              <HandwritingGrid
                cells={attemptCells}
                onCellImage={(idx, image) =>
                  setAttemptCells((prev) => prev.map((c, i) => (i === idx ? { ...c, image } : c)))
                }
              />
              <button
                className="btn btn-primary"
                onClick={finishHandwritingAttempt}
                disabled={attemptCells.length === 0 || attemptCells.some((c) => !c.image)}
              >
                {t('correction.finishAttempt')}
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                value={typedAttempt}
                onChange={(e) => setTypedAttempt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && finishTypedAttempt()}
                placeholder={t('correction.typePlaceholder', { word: targetWord })}
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
              <button className="btn btn-primary" onClick={finishTypedAttempt} disabled={!typedAttempt.trim()}>
                {t('correction.finishAttempt')}
              </button>
              {feedback === 'correct' && <div className="feedback correct">{t('correction.correctFeedback')}<span className="ico">✓</span></div>}
              {feedback === 'wrong' && (
                <div className="feedback wrong">
                  {t('correction.wrongFeedback')}<strong>{targetWord}</strong>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
