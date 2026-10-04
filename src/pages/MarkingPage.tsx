import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getSession,
  saveSession,
  saveCorrection,
  markWordsAsStudied,
  calculateDictationPoints,
  addPoints,
  type DictationSession,
  type HandwritingCell,
  type CorrectionSession,
} from '../utils/storage';
import TopNavBar from '../components/TopNavBar';
import { fireConfetti } from '../components/Confetti';
import { useSound } from '../hooks/useSound';
import { usePrefs } from '../context/PrefsContext';

export default function MarkingPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<DictationSession | null>(null);
  const [cells, setCells] = useState<HandwritingCell[][]>([]);
  const [zoomItem, setZoomItem] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const { celebrate, tap } = useSound();
  const { t } = usePrefs();

  useEffect(() => {
    (async () => {
      if (!sessionId) return;
      const s = await getSession(sessionId);
      if (s) {
        setSession(s);
        setCells(s.cells ? s.cells.map((row) => row.map((c) => ({ ...c }))) : []);
      }
      setLoading(false);
    })();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="page marking-page">
        <TopNavBar />
        <div className="empty-state">
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="page marking-page">
        <TopNavBar />
        <div className="empty-state">
          <p>{t('marking.notFound')}</p>
          <button className="btn btn-primary" onClick={() => navigate('/records')}>
            {t('marking.backToRecords')}
          </button>
        </div>
      </div>
    );
  }

  const isHandwriting = session.inputType === 'handwriting' && cells.length > 0;
  const wasAi = session.checkStatus === 'ai-checked';
  const needsManual = !wasAi; // pending / failed -> a parent marks it here

  function itemCorrect(row: HandwritingCell[]): boolean {
    return row.length > 0 && row.every((c) => c.correct === true);
  }

  function computeScore(): { score: number; wrongIndices: number[] } {
    const wrongIndices: number[] = [];
    let score = 0;
    if (isHandwriting) {
      cells.forEach((row, i) => {
        if (itemCorrect(row)) score++;
        else wrongIndices.push(i);
      });
    } else {
      const wrong = new Set(session!.wrongIndices || []);
      const n = (session!.userAnswers || []).length;
      for (let i = 0; i < n; i++) {
        if (wrong.has(i)) wrongIndices.push(i);
        else score++;
      }
    }
    return { score, wrongIndices };
  }

  function flipCell(itemIndex: number, charIndex: number) {
    setSaved(false);
    setCells((prev) => {
      const next = prev.map((row) => row.map((c) => ({ ...c })));
      const cell = next[itemIndex][charIndex];
      cell.correct = cell.correct === true ? false : true;
      return next;
    });
  }

  async function commit() {
    const { score, wrongIndices } = computeScore();
    const userAnswers = isHandwriting
      ? cells.map((row) => row.map((c) => c.recognized || (c.image ? '?' : '')).join(''))
      : session!.userAnswers;

    const updated: DictationSession = {
      ...session!,
      cells: isHandwriting ? cells : session!.cells,
      userAnswers,
      wrongIndices,
      score,
      checkStatus: wasAi ? 'ai-checked' : 'manual',
      markingViewedAt: Date.now(),
    };

    if (needsManual) {
      // First human marking: award points + mark studied now (AI path already did).
      const marksPct = Math.round((score / Math.max(session!.totalWords, 1)) * 100);
      const { points, bonus } = calculateDictationPoints(
        session!.wordListId,
        session!.totalWords,
        session!.totalWords,
        marksPct
      );
      addPoints(points + bonus);
      if (session!.wordListId) markWordsAsStudied(session!.wordListId, session!.words);
    }

    await saveSession(updated);

    // (Re)build the correction set from the current wrong items.
    if (wrongIndices.length > 0) {
      const correction: CorrectionSession = {
        id: session!.id,
        dictationSessionId: session!.id,
        wrongWords: wrongIndices.map((i) => ({ word: session!.words[i], userAnswer: userAnswers[i] || '' })),
        practiceRounds: wrongIndices.map((i) => ({ wordIndex: i, attempts: [], images: [] })),
      };
      await saveCorrection(correction);
    }

    setSession(updated);
    setSaved(true);
    tap();
    const pct = session!.totalWords > 0 ? Math.round((score / session!.totalWords) * 100) : 0;
    if (pct >= 80) {
      fireConfetti();
      celebrate();
    }
  }

  const { score, wrongIndices } = computeScore();
  const total = session.totalWords;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="page marking-page">
      <TopNavBar />
      <h1>{t('marking.title')}</h1>
      <p className="list-name">{session.wordListName}</p>

      <div className="marking-summary">
        <div className={`score-circle ${percentage >= 80 ? 'great' : percentage >= 50 ? 'good' : 'try-again'}`}>
          <span className="score-number">{percentage}%</span>
        </div>
        <div className="marking-summary-text">
          <p>
            {t('marking.score', { score, total })}
          </p>
          <span className={`status-badge ${session.checkStatus}`}>
            {session.checkStatus === 'ai-checked'
              ? t('marking.status.aiChecked')
              : session.checkStatus === 'manual'
                ? t('marking.status.manual')
                : session.checkStatus === 'failed'
                  ? t('marking.status.failed')
                  : t('marking.status.pending')}
          </span>
        </div>
      </div>

      {needsManual && (
        <div className="marking-notice">
          {session.checkStatus === 'failed'
            ? <>{t('marking.noticeFailedPre')}<span className="ico" data-word={t('marking.rightWord')}>✓</span> / <span className="ico" data-word={t('marking.wrongWord')}>✗</span>{t('marking.noticeFailedPost')}</>
            : <>{t('marking.noticePre')}<span className="ico" data-word={t('marking.rightWord')}>✓</span> / <span className="ico" data-word={t('marking.wrongWord')}>✗</span>{t('marking.noticePost')}</>}
        </div>
      )}

      {/* Items */}
      <div className="marking-items">
        {session.words.map((word, i) => {
          const row = isHandwriting ? cells[i] || [] : [];
          const correct = isHandwriting ? itemCorrect(row) : (session.wrongIndices || []).indexOf(i) === -1;
          return (
            <div key={i} className={`marking-item ${correct ? 'correct' : 'wrong'}`}>
              <div className="marking-item-head" onClick={() => setZoomItem(i)}>
                <span className="marking-index">{i + 1}</span>
                <span className="marking-target">{word}</span>
                <span className="marking-verdict">{correct ? <span className="ico" data-word={t('marking.rightWord')}>✓</span> : <span className="ico" data-word={t('marking.wrongWord')}>✗</span>}</span>
              </div>

              {isHandwriting ? (
                <div className="marking-cells">
                  {row.map((cell, ci) => (
                    <div key={ci} className={`marking-cell ${cell.correct === true ? 'ok' : cell.correct === false ? 'no' : 'unk'}`}>
                      <div className="marking-cell-img" onClick={() => setZoomItem(i)}>
                        {cell.image ? <img src={cell.image} alt="" /> : <span className="blank">{t('marking.blank')}</span>}
                      </div>
                      <button
                        type="button"
                        className="marking-cell-mark"
                        onClick={() => flipCell(i, ci)}
                        aria-label={t('marking.markAria')}
                      >
                        {cell.correct === true ? <span className="ico" data-word={t('marking.rightWord')}>✓</span> : cell.correct === false ? <span className="ico" data-word={t('marking.wrongWord')}>✗</span> : '?'}
                      </button>
                      {cell.correct !== true && <div className="marking-cell-answer">{cell.targetChar}</div>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="marking-typed">
                  {t('marking.youWrote')}<em>{session.userAnswers[i] || t('marking.blankParen')}</em>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="action-buttons">
        <button className="btn btn-primary" onClick={commit}>
          {needsManual ? t('marking.finishMarking') : t('marking.saveChanges')}
        </button>
        {wrongIndices.length > 0 && (wasAi || session.checkStatus === 'manual') && (
          <button className="btn btn-secondary" onClick={() => navigate(`/correction/${session.id}`)}>
            {t('marking.goCorrection', { n: wrongIndices.length })}
          </button>
        )}
        <button className="btn btn-outline" onClick={() => navigate('/records')}>
          {t('marking.backToRecords')}
        </button>
      </div>
      {saved && <p className="save-toast">{t('marking.saved')} <span className="ico">✓</span></p>}

      {/* Zoom overlay */}
      {zoomItem !== null && (
        <div className="zoom-overlay" onClick={() => setZoomItem(null)}>
          <div className="zoom-content" onClick={(e) => e.stopPropagation()}>
            <p className="zoom-target">{session.words[zoomItem]}</p>
            {isHandwriting ? (
              <div className="zoom-cells">
                {(cells[zoomItem] || []).map((cell, ci) => (
                  <div key={ci} className={`zoom-cell ${cell.correct === true ? 'ok' : cell.correct === false ? 'no' : 'unk'}`}>
                    <div className="zoom-cell-img">
                      {cell.image ? <img src={cell.image} alt="" /> : <span className="blank">{t('marking.blank')}</span>}
                    </div>
                    <div className="zoom-cell-foot">
                      <button type="button" className="marking-cell-mark" onClick={() => flipCell(zoomItem, ci)}>
                        {cell.correct === true ? <span className="ico" data-word={t('marking.rightWord')}>✓</span> : cell.correct === false ? <span className="ico" data-word={t('marking.wrongWord')}>✗</span> : '?'}
                      </button>
                      {cell.correct !== true && <span className="zoom-cell-answer">{cell.targetChar}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="zoom-typed">{t('marking.youWrote')}{session.userAnswers[zoomItem] || t('marking.blankParen')}</p>
            )}
            <button className="btn btn-primary" onClick={() => setZoomItem(null)}>
              {t('common.close')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
