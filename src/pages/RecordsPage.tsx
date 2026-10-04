import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getRecentSessions,
  getAllCorrections,
  type DictationSession,
  type CorrectionSession,
} from '../utils/storage';
import TopNavBar from '../components/TopNavBar';
import { usePrefs } from '../context/PrefsContext';

/* Parent gate — when enabled, the detailed status view (scores, badges,
 * marking/correction shortcuts) is hidden behind a simple PIN so kids can't
 * browse or tamper with the parent report. Off by default. */
const PARENT_GATE = false;
const PARENT_PIN = '1234';

const REQUIRED_PRACTICE = 3;

interface CorrectionProgress {
  total: number;
  done: number;
  completed: boolean;
}

function correctionProgress(c: CorrectionSession | undefined): CorrectionProgress | null {
  if (!c) return null;
  const total = c.wrongWords.length;
  if (total === 0) return { total: 0, done: 0, completed: true };
  let done = 0;
  for (const round of c.practiceRounds) {
    const imgs = round.images?.length ?? 0;
    const typed = round.attempts?.length ?? 0;
    if (imgs >= REQUIRED_PRACTICE || typed >= REQUIRED_PRACTICE) done++;
  }
  return { total, done, completed: !!c.completedAt || done >= total };
}

export default function RecordsPage() {
  const navigate = useNavigate();
  const { t } = usePrefs();
  const [sessions, setSessions] = useState<DictationSession[]>([]);
  const [corrections, setCorrections] = useState<Map<string, CorrectionSession>>(new Map());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(!PARENT_GATE);
  const [showPin, setShowPin] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  
  // Choice popup state
  const [choicePopup, setChoicePopup] = useState<{
    type: 'restudy' | 'redictate';
    session: DictationSession;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const [s, c] = await Promise.all([getRecentSessions(100), getAllCorrections()]);
      setSessions(s);
      const map = new Map<string, CorrectionSession>();
      for (const corr of c) map.set(corr.dictationSessionId, corr);
      setCorrections(map);
    })();
  }, []);

  function toggleExpand(id: string) {
    setExpandedId(prev => (prev === id ? null : id));
  }

  function handleRestudyClick(session: DictationSession) {
    setChoicePopup({ type: 'restudy', session });
  }

  function handleRedictateClick(session: DictationSession) {
    setChoicePopup({ type: 'redictate', session });
  }

  function handleRestudy(session: DictationSession, wrongOnly: boolean) {
    const words = wrongOnly
      ? session.wrongIndices.map(i => session.words[i])
      : session.words;
    const wordsParam = encodeURIComponent(JSON.stringify(words));
    navigate(`/revision/${session.wordListId}?type=custom&words=${wordsParam}`);
    setChoicePopup(null);
  }

  function handleRedictate(session: DictationSession, wrongOnly: boolean) {
    const words = wrongOnly
      ? session.wrongIndices.map(i => session.words[i])
      : session.words;
    const wordsParam = encodeURIComponent(JSON.stringify(words));
    const mode = session.mode === 'pre-dictation' ? 'paragraphs' : 'words';
    navigate(`/dictation/${session.wordListId}?count=${words.length}&words=${wordsParam}&mode=${mode}`);
    setChoicePopup(null);
  }

  function submitPin() {
    if (pinInput === PARENT_PIN) {
      setUnlocked(true);
      setShowPin(false);
      setPinInput('');
      setPinError(false);
    } else {
      setPinError(true);
    }
  }

  // Summary stats for the parent header
  const graded = sessions.filter(s => s.checkStatus === 'ai-checked' || s.checkStatus === 'manual');
  const pendingCorrection = sessions.filter(s => {
    const p = correctionProgress(corrections.get(s.id));
    return p && !p.completed;
  }).length;
  const avgScore = sessions.length
    ? Math.round(sessions.reduce((sum, s) => sum + (s.totalWords ? (s.score / s.totalWords) * 100 : 0), 0) / sessions.length)
    : 0;

  return (
    <div className="page records-page">
      <TopNavBar />
      <h1>{t('records.title')}</h1>

      {PARENT_GATE && !unlocked && (
        <div className="parent-gate">
          <p><span className="ico">🔒</span> {t('records.gateMsg')}</p>
          <button className="btn btn-primary" onClick={() => setShowPin(true)}>
            {t('records.unlock')}
          </button>
        </div>
      )}

      {showPin && (
        <div className="popup-overlay" onClick={() => setShowPin(false)}>
          <div className="popup-content" onClick={e => e.stopPropagation()}>
            <p className="popup-title">{t('records.pinTitle')}</p>
            <input
              type="password"
              inputMode="numeric"
              className="pin-input"
              value={pinInput}
              autoFocus
              onChange={e => { setPinInput(e.target.value); setPinError(false); }}
              onKeyDown={e => { if (e.key === 'Enter') submitPin(); }}
              placeholder="••••"
            />
            {pinError && <p className="pin-error">{t('records.pinError')}</p>}
            <div className="popup-buttons">
              <button className="btn btn-primary" onClick={submitPin}>{t('common.confirm')}</button>
              <button className="btn btn-outline" onClick={() => setShowPin(false)}>{t('common.cancel')}</button>
            </div>
          </div>
        </div>
      )}

      {choicePopup && (
        <div className="popup-overlay" onClick={() => setChoicePopup(null)}>
          <div className="popup-content" onClick={e => e.stopPropagation()}>
            <p className="popup-title">
              {choicePopup.type === 'restudy' ? t('records.restudy') : t('records.redictate')}
            </p>
            <div className="choice-buttons">
              <button
                className="btn btn-primary btn-large"
                onClick={() => {
                  if (choicePopup.type === 'restudy') {
                    handleRestudy(choicePopup.session, false);
                  } else {
                    handleRedictate(choicePopup.session, false);
                  }
                }}
              >
                <span className="ico">📚</span> {choicePopup.type === 'restudy' ? t('records.restudyAll') : t('records.redictateAll')}
              </button>
              {choicePopup.session.wrongIndices.length > 0 && (
                <button
                  className="btn btn-secondary btn-large"
                  onClick={() => {
                    if (choicePopup.type === 'restudy') {
                      handleRestudy(choicePopup.session, true);
                    } else {
                      handleRedictate(choicePopup.session, true);
                    }
                  }}
                >
                  <span className="ico">✏️</span> {choicePopup.type === 'restudy' ? t('records.restudyWrong') : t('records.redictateWrong')}
                </button>
              )}
            </div>
            <button className="btn btn-outline" onClick={() => setChoicePopup(null)} style={{ marginTop: '12px' }}>
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}

      {unlocked && sessions.length > 0 && (
        <div className="parent-summary">
          <div className="summary-stat">
            <span className="summary-num">{sessions.length}</span>
            <span className="summary-label">{t('records.statCount')}</span>
          </div>
          <div className="summary-stat">
            <span className="summary-num">{avgScore}%</span>
            <span className="summary-label">{t('records.statAvg')}</span>
          </div>
          <div className="summary-stat">
            <span className="summary-num">{graded.length}</span>
            <span className="summary-label">{t('records.statGraded')}</span>
          </div>
          <div className="summary-stat">
            <span className="summary-num">{pendingCorrection}</span>
            <span className="summary-label">{t('records.toCorrect')}</span>
          </div>
        </div>
      )}

      {sessions.length === 0 ? (
        <div className="empty-state">
          <p>{t('records.empty')}</p>
          <button className="btn btn-primary" onClick={() => navigate('/home')}>{t('pre.backHome')}</button>
        </div>
      ) : (
        <div className="activity-list">
          {sessions.map(session => {
            const isExpanded = expandedId === session.id;
            const date = new Date(session.timestamp);
            const dateStr = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            const modeLabel = session.mode === 'pre-dictation' ? t('records.modeParagraph') : t('records.modeWords');
            const correctWords = session.words.filter((_, i) => !session.wrongIndices.includes(i));
            const wrongItems = session.wrongIndices.map(i => ({
              correct: session.correctAnswers[i] || session.words[i],
              user: session.userAnswers[i] || '',
            }));

            const isHandwriting = session.inputType === 'handwriting' || session.inputType === 'mixed';
            const gradedNow = session.checkStatus === 'ai-checked' || session.checkStatus === 'manual';
            const prog = correctionProgress(corrections.get(session.id));
            const hasWrong = session.wrongIndices.length > 0;

            return (
              <div key={session.id} className="activity-item">
                <div className="activity-header" onClick={() => toggleExpand(session.id)}>
                  <div className="activity-info">
                    <span className="activity-name">{session.wordListName}</span>
                    <span className="activity-mode">{dateStr} · {modeLabel}</span>
                    {unlocked && (
                      <span className="badge-row">
                        <span className={`status-badge ${gradedNow ? 'ok' : session.checkStatus === 'failed' ? 'bad' : 'warn'}`}>
                          {gradedNow ? t('records.badgeGraded') : session.checkStatus === 'failed' ? t('records.badgeFailed') : t('records.badgePending')}
                        </span>
                        {!hasWrong ? (
                          <span className="status-badge ok">{t('records.allCorrect')} <span className="ico">🎉</span></span>
                        ) : prog ? (
                          <span className={`status-badge ${prog.completed ? 'ok' : 'warn'}`}>
                            {prog.completed ? t('records.correctionDone') : t('records.correctionProgress', { done: prog.done, total: prog.total })}
                          </span>
                        ) : (
                          <span className="status-badge warn">{t('records.toCorrect')}</span>
                        )}
                      </span>
                    )}
                  </div>
                  <div className="activity-score">
                    {session.score}/{session.totalWords}
                    <span className="expand-icon">{isExpanded ? <span className="ico" data-word={t('wordlist.collapse')}>▲</span> : <span className="ico" data-word={t('wordlist.expand')}>▼</span>}</span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="activity-details">
                    {/* Correct words */}
                    {correctWords.length > 0 && (
                      <div className="correct-words-section">
                        <h4><span className="ico">✓</span> {t('records.correctHeading', { n: correctWords.length })}</h4>
                        <div className="correct-words-list">
                          {correctWords.map((w, i) => (
                            <span key={i} className="correct-word-tag">{w}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Wrong words */}
                    {wrongItems.length > 0 ? (
                      <div className="wrong-words-section">
                        <h4><span className="ico">✗</span> {t('records.wrongHeading', { n: wrongItems.length })}</h4>
                        <div className="wrong-words-list">
                          {wrongItems.map((item, i) => (
                            <div key={i} className="wrong-word-item">
                              <span className="correct-word">{item.correct}</span>
                              <span className="user-answer">{t('marking.youWrote')}{item.user || t('marking.blankParen')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="no-wrong-words">{t('records.noWrong')}<span className="ico">🎉</span></p>
                    )}

                    {/* Action buttons */}
                    <div className="record-action-buttons">
                      {isHandwriting && (
                        <button className="btn btn-primary" onClick={() => navigate(`/marking/${session.id}`)}>
                          <span className="ico">📝</span> {gradedNow ? t('records.viewMarking') : t('records.goMarking')}
                        </button>
                      )}
                      {hasWrong && (
                        <button className="btn btn-secondary" onClick={() => navigate(`/correction/${session.id}`)}>
                          <span className="ico">✏️</span> {prog?.completed ? t('records.viewCorrection') : t('records.goCorrection')}
                        </button>
                      )}
                      <button className="btn btn-secondary" onClick={() => handleRestudyClick(session)}>
                        <span className="ico"></span> {t('records.restudy')}
                      </button>
                      <button className="btn btn-outline" onClick={() => handleRedictateClick(session)}>
                        <span className="ico"></span> {t('records.redictate')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
