import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllWordLists, getRecentSessions, type WordList, type DictationSession } from '../utils/storage';

export default function HomePage() {
  const navigate = useNavigate();
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const [recentSessions, setRecentSessions] = useState<DictationSession[]>([]);
  const [selectedList, setSelectedList] = useState<WordList | null>(null);
  const [wordCount, setWordCount] = useState(5);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const lists = await getAllWordLists();
    const sessions = await getRecentSessions(5);
    setWordLists(lists);
    setRecentSessions(sessions);
  }

  const totalWordsStudied = recentSessions.reduce((sum, s) => sum + s.totalWords, 0);
  const avgScore = recentSessions.length > 0
    ? Math.round(recentSessions.reduce((sum, s) => sum + (s.score / s.totalWords) * 100, 0) / recentSessions.length)
    : 0;

  return (
    <div className="page home-page">
      <div className="hero-section">
        <h1>Spelling Buddy</h1>
        <p className="subtitle">Let's practice your spelling today!</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-number">{wordLists.length}</span>
          <span className="stat-label">Word Lists</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{totalWordsStudied}</span>
          <span className="stat-label">Words Studied</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{avgScore}%</span>
          <span className="stat-label">Avg Score</span>
        </div>
      </div>

      {/* Quick Start */}
      <section className="section">
        <h2>Quick Start</h2>

        {wordLists.length === 0 ? (
          <div className="empty-state">
            <p>No word lists yet! Add one to get started.</p>
            <button className="btn btn-primary btn-large" onClick={() => navigate('/import')}>
              Add Your First Word List
            </button>
          </div>
        ) : (
          <div className="quick-start">
            <div className="form-group">
              <label>Choose a word list:</label>
              <select
                value={selectedList?.id || ''}
                onChange={(e) => {
                  const found = wordLists.find(wl => wl.id === e.target.value);
                  setSelectedList(found || null);
                }}
              >
                <option value="">-- Select --</option>
                {wordLists.map(wl => (
                  <option key={wl.id} value={wl.id}>
                    {wl.name} ({wl.words.length} words)
                  </option>
                ))}
              </select>
            </div>

            {selectedList && (
              <>
                <div className="form-group">
                  <label>How many words? ({Math.min(wordCount, selectedList.words.length)})</label>
                  <input
                    type="range"
                    min={1}
                    max={Math.min(10, selectedList.words.length)}
                    value={Math.min(wordCount, selectedList.words.length)}
                    onChange={(e) => setWordCount(Number(e.target.value))}
                    className="slider"
                  />
                  <span className="word-count-display">{Math.min(wordCount, selectedList.words.length)} words</span>
                </div>

                <div className="action-buttons">
                  <button
                    className="btn btn-primary btn-large"
                    onClick={() => navigate(`/dictation/${selectedList.id}?count=${Math.min(wordCount, selectedList.words.length)}`)}
                  >
                    Word Dictation
                  </button>
                  <button
                    className="btn btn-secondary btn-large"
                    onClick={() => navigate(`/pre-dictation/${selectedList.id}?count=${Math.min(wordCount, selectedList.words.length)}`)}
                  >
                    Paragraph Dictation
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </section>

      {/* Navigation */}
      <section className="section">
        <h2>Menu</h2>
        <div className="menu-grid">
          <button className="menu-card" onClick={() => navigate('/import')}>
            <span className="menu-icon">📷</span>
            <span>Import Words</span>
          </button>
          <button className="menu-card" onClick={() => navigate('/word-lists')}>
            <span className="menu-icon">📚</span>
            <span>My Word Lists</span>
          </button>
        </div>
      </section>

      {/* Recent Activity */}
      {recentSessions.length > 0 && (
        <section className="section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {recentSessions.map(session => (
              <div key={session.id} className="activity-item">
                <div className="activity-info">
                  <strong>{session.wordListName}</strong>
                  <span className="activity-mode">{session.mode}</span>
                </div>
                <div className="activity-score">
                  {session.score}/{session.totalWords} ({Math.round((session.score / session.totalWords) * 100)}%)
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
