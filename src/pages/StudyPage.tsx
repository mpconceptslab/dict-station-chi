import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getWordList, getStudiedWords, markWordsAsStudied, type WordList } from '../utils/storage';
import TopNavBar from '../components/TopNavBar';
import { usePrefs } from '../context/PrefsContext';

export default function StudyPage() {
  const navigate = useNavigate();
  const { t } = usePrefs();
  const { listId } = useParams<{ listId: string }>();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'unstudied';
  
  const [wordList, setWordList] = useState<WordList | null>(null);
  const [words, setWords] = useState<string[]>([]);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [count, setCount] = useState<string>('全部');

  useEffect(() => {
    if (listId) {
      loadData();
    }
  }, [listId, type]);

  async function loadData() {
    if (!listId) return;
    const wl = await getWordList(listId);
    if (wl) {
      setWordList(wl);
      
      const studied = getStudiedWords(listId);
      const studiedSet = new Set(studied.words);
      
      if (type === 'studied') {
        setWords(wl.words.filter(w => studiedSet.has(w)));
        setParagraphs([]);
      } else if (type === 'unstudied') {
        setWords(wl.words.filter(w => !studiedSet.has(w)));
        setParagraphs([]);
      } else if (type === 'paragraph-studied') {
        setWords([]);
        const studiedParagraphsData = localStorage.getItem(`studied_paragraphs_${listId}`);
        const sParagraphs = studiedParagraphsData ? JSON.parse(studiedParagraphsData).paragraphs || [] : [];
        setParagraphs(wl.paragraphs.filter(p => sParagraphs.includes(p)));
      } else if (type === 'paragraph-unstudied') {
        setWords([]);
        const studiedParagraphsData = localStorage.getItem(`studied_paragraphs_${listId}`);
        const sParagraphs = studiedParagraphsData ? JSON.parse(studiedParagraphsData).paragraphs || [] : [];
        setParagraphs(wl.paragraphs.filter(p => !sParagraphs.includes(p)));
      } else if (type === 'all') {
        setWords(wl.words);
        setParagraphs(wl.paragraphs);
      }
    }
  }

  function handleStartStudy() {
    if (!wordList || !listId) return;
    
    let wordsToStudy: string[] = [];
    let paragraphsToStudy: string[] = [];
    
    if (type === 'all') {
      // Study all words and paragraphs
      wordsToStudy = [...words];
      paragraphsToStudy = [...paragraphs];
      
      // Mark words as studied
      markWordsAsStudied(listId, wordsToStudy);
      
      // Mark paragraphs as studied
      const studiedParagraphsData = localStorage.getItem(`studied_paragraphs_${listId}`);
      const existing = studiedParagraphsData ? JSON.parse(studiedParagraphsData).paragraphs || [] : [];
      const updated = [...new Set([...existing, ...paragraphsToStudy])];
      localStorage.setItem(`studied_paragraphs_${listId}`, JSON.stringify({ paragraphs: updated, lastStudied: Date.now() }));
      
      // Navigate to revision with all words and paragraphs
      const wordsParam = encodeURIComponent(JSON.stringify(wordsToStudy));
      const paragraphsParam = encodeURIComponent(JSON.stringify(paragraphsToStudy));
      navigate(`/revision/${listId}?type=custom&words=${wordsParam}&paragraphs=${paragraphsParam}`);
    } else if (type === 'studied' || type === 'unstudied') {
      const numCount = count === '全部' ? words.length : parseInt(count) || words.length;
      wordsToStudy = words.slice(0, numCount);
      
      if (type === 'unstudied') {
        markWordsAsStudied(listId, wordsToStudy);
      }
      
      // Navigate to revision with these words
      const wordsParam = encodeURIComponent(JSON.stringify(wordsToStudy));
      navigate(`/revision/${listId}?type=custom&words=${wordsParam}`);
    } else {
      // Paragraphs
      const numCount = count === '全部' ? paragraphs.length : parseInt(count) || paragraphs.length;
      paragraphsToStudy = paragraphs.slice(0, numCount);
      
      // Mark paragraphs as studied
      const studiedParagraphsData = localStorage.getItem(`studied_paragraphs_${listId}`);
      const existing = studiedParagraphsData ? JSON.parse(studiedParagraphsData).paragraphs || [] : [];
      const updated = [...new Set([...existing, ...paragraphsToStudy])];
      localStorage.setItem(`studied_paragraphs_${listId}`, JSON.stringify({ paragraphs: updated, lastStudied: Date.now() }));
      
      // Navigate to pre-dictation for paragraphs
      navigate(`/pre-dictation/${listId}?paragraphs=${encodeURIComponent(JSON.stringify(paragraphsToStudy))}`);
    }
  }

  if (!wordList) {
    return <div className="page study-page"><TopNavBar /><p>{t('common.loading')}</p></div>;
  }

  const isParagraph = type === 'paragraph-studied' || type === 'paragraph-unstudied';
  const isStudied = type === 'studied' || type === 'paragraph-studied';
  const isAll = type === 'all';
  const items = isAll ? [...words, ...paragraphs] : (isParagraph ? paragraphs : words);
  const title = isAll
    ? t('study.title.all')
    : (isParagraph
      ? (isStudied ? t('study.title.paragraphStudied') : t('study.title.paragraphUnstudied'))
      : (isStudied ? t('study.title.wordStudied') : t('study.title.wordUnstudied')));

  return (
    <div className="page study-page">
      <TopNavBar />
      <div className="hero-section">
        <h1>{title}</h1>
        <p className="study-subtitle">{wordList.name}</p>
      </div>

      {/* Word/Paragraph List */}
      <section className="study-list-section">
        {items.length === 0 ? (
          <p className="empty-list">{t(isParagraph ? (isStudied ? 'study.empty.studiedParagraphs' : 'study.empty.unstudiedParagraphs') : (isStudied ? 'study.empty.studiedWords' : 'study.empty.unstudiedWords'))}</p>
        ) : (
          <div className="study-list">
            {items.map((item, i) => (
              <div key={i} className="study-item">
                {isParagraph ? (
                  <p className="paragraph-preview">{item.length > 50 ? item.substring(0, 50) + '...' : item}</p>
                ) : (
                  <span className="word-item">{item}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Count Input */}
      {items.length > 0 && (
        <section className="study-count-section">
          <label>{isParagraph ? t('study.countLabelParagraphs') : t('study.countLabelWords')}</label>
          <div className="count-input-group">
            <input
              type="text"
              value={count === '全部' ? t('study.all') : count}
              onChange={(e) => setCount(e.target.value)}
              placeholder={t('study.all')}
              className="form-input count-input"
            />
            <button 
              className="btn btn-all" 
              onClick={() => setCount('全部')}
            >
              {t('study.all')}
            </button>
          </div>
          <p className="count-hint">
            {isParagraph ? t('study.countTotalParagraphs', { n: items.length }) : t('study.countTotalWords', { n: items.length })}
            {count !== '全部' && count !== '' && (isParagraph ? t('study.countWillParagraphs', { n: Math.min(parseInt(count) || 0, items.length) }) : t('study.countWillWords', { n: Math.min(parseInt(count) || 0, items.length) }))}
          </p>
        </section>
      )}

      {/* Start Button */}
      {items.length > 0 && (
        <section className="study-action">
          <button className="btn new-range-btn" onClick={handleStartStudy}>
            {t('study.start')}
          </button>
        </section>
      )}
    </div>
  );
}
