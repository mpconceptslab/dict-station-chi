import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllWordLists, getStudiedWords, getStudiedParagraphWords, getStudiedSentences, getSeenSyllabusIds, markSyllabusAsSeen, type WordList } from '../utils/storage';
import TopNavBar from '../components/TopNavBar';
import { usePrefs } from '../context/PrefsContext';

export default function SyllabusPage() {
  const navigate = useNavigate();
  const { t } = usePrefs();
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const [seenIds, setSeenIds] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const lists = await getAllWordLists();
    setWordLists(lists);
    setSeenIds(getSeenSyllabusIds());
  }

  function handleSyllabusClick(listId: string) {
    markSyllabusAsSeen(listId);
    setSeenIds(getSeenSyllabusIds());
    navigate(`/syllabus/${listId}`);
  }

  function getStats(wordList: WordList) {
    const studied = getStudiedWords(wordList.id);
    const studiedWords = studied.words.filter(w => wordList.words.includes(w));
    const unstudiedWords = wordList.words.filter(w => !studiedWords.includes(w));
    
    const studiedPW = getStudiedParagraphWords(wordList.id);
    const studiedParagraphWords = studiedPW.words.filter(w => wordList.paragraphWords.includes(w));
    const unstudiedParagraphWords = wordList.paragraphWords.filter(w => !studiedParagraphWords.includes(w));

    const studiedSent = getStudiedSentences(wordList.id);
    const studiedSentences = studiedSent.sentences.filter(s => wordList.sentences.includes(s));
    const unstudiedSentences = wordList.sentences.filter(s => !studiedSentences.includes(s));

    return {
      studiedWords: studiedWords.length,
      unstudiedWords: unstudiedWords.length,
      totalWords: wordList.words.length,
      studiedParagraphWords: studiedParagraphWords.length,
      unstudiedParagraphWords: unstudiedParagraphWords.length,
      totalParagraphWords: wordList.paragraphWords.length,
      studiedSentences: studiedSentences.length,
      unstudiedSentences: unstudiedSentences.length,
      totalSentences: wordList.sentences.length
    };
  }

  return (
    <div className="page syllabus-page">
      <TopNavBar />
      <div className="hero-section">
        <h1>{t('home.chooseRange')}</h1>
      </div>

      {wordLists.length === 0 ? (
        <div className="empty-state">
          <p>{t('syllabus.empty')}</p>
          <button className="btn new-range-btn" onClick={() => navigate('/import')}>
            {t('home.newRange')}
          </button>
        </div>
      ) : (
        <div className="syllabus-list">
          {wordLists.map(wl => {
            const stats = getStats(wl);
            const isNew = !seenIds.includes(wl.id);
            return (
              <div key={wl.id} className="syllabus-card" onClick={() => handleSyllabusClick(wl.id)}>
                <h2>
                  {wl.name}
                  {isNew && <span className="new-badge">new</span>}
                </h2>
                <div className="syllabus-stats">
                  <div className="stat-row">
                    <span className="stat-label">{t('syllabus.statWords')}</span>
                    <span className="stat-value">
                      {t('syllabus.revised')} <strong>{stats.studiedWords}</strong> / {stats.totalWords}
                    </span>
                  </div>
                  {stats.totalParagraphWords > 0 && (
                    <div className="stat-row">
                      <span className="stat-label">{t('syllabus.statParagraphWords')}</span>
                      <span className="stat-value">
                        {t('syllabus.revised')} <strong>{stats.studiedParagraphWords}</strong> / {stats.totalParagraphWords}
                      </span>
                    </div>
                  )}
                  {stats.totalSentences > 0 && (
                    <div className="stat-row">
                      <span className="stat-label">{t('syllabus.statSentences')}</span>
                      <span className="stat-value">
                        {t('syllabus.revised')} <strong>{stats.studiedSentences}</strong> / {stats.totalSentences}
                      </span>
                    </div>
                  )}
                </div>
                <div className="syllabus-progress">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${stats.totalWords > 0 ? (stats.studiedWords / stats.totalWords) * 100 : 0}%` 
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
