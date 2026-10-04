import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getWordList,
  getStudiedWords,
  getUnstudiedWords,
  getStudiedParagraphWords,
  getUnstudiedParagraphWords,
  getStudiedSentences,
  getUnstudiedSentences,
  markWordsAsStudied,
  markParagraphWordsAsStudied,
  markSentencesAsStudied,
  type WordList
} from '../utils/storage';
import TopNavBar from '../components/TopNavBar';
import { usePrefs } from '../context/PrefsContext';

type Section = 'words' | 'paragraphWords' | 'sentences';
type Filter = 'studied' | 'unstudied' | 'all';

interface ActionPopup {
  section: Section;
  filter: Filter;
}

export default function WordListDetailPage() {
  const navigate = useNavigate();
  const { t } = usePrefs();
  const { listId } = useParams<{ listId: string }>();
  const [wordList, setWordList] = useState<WordList | null>(null);
  const [actionPopup, setActionPopup] = useState<ActionPopup | null>(null);

  // Words tracking
  const [studiedWords, setStudiedWords] = useState<string[]>([]);
  const [unstudiedWords, setUnstudiedWords] = useState<string[]>([]);

  // Paragraph words tracking
  const [studiedPW, setStudiedPW] = useState<string[]>([]);
  const [unstudiedPW, setUnstudiedPW] = useState<string[]>([]);

  // Sentences tracking
  const [studiedSent, setStudiedSent] = useState<string[]>([]);
  const [unstudiedSent, setUnstudiedSent] = useState<string[]>([]);

  useEffect(() => {
    if (listId) {
      loadData();
    }
  }, [listId]);

  async function loadData() {
    if (!listId) return;
    const wl = await getWordList(listId);
    if (wl) {
      setWordList(wl);

      // Words
      const sw = getStudiedWords(listId);
      const sWords = sw.words.filter(w => wl.words.includes(w));
      const uWords = getUnstudiedWords(listId, wl.words);
      setStudiedWords(sWords);
      setUnstudiedWords(uWords);

      // Paragraph words
      const spw = getStudiedParagraphWords(listId);
      const sPW = spw.words.filter(w => wl.paragraphWords.includes(w));
      const uPW = getUnstudiedParagraphWords(listId, wl.paragraphWords);
      setStudiedPW(sPW);
      setUnstudiedPW(uPW);

      // Sentences
      const ss = getStudiedSentences(listId);
      const sSent = ss.sentences.filter(s => wl.sentences.includes(s));
      const uSent = getUnstudiedSentences(listId, wl.sentences);
      setStudiedSent(sSent);
      setUnstudiedSent(uSent);
    }
  }

  function getItems(section: Section, filter: Filter): string[] {
    if (!wordList) return [];
    let allItems: string[];
    let studied: string[];

    if (section === 'words') {
      allItems = wordList.words;
      studied = studiedWords;
    } else if (section === 'paragraphWords') {
      allItems = wordList.paragraphWords;
      studied = studiedPW;
    } else {
      allItems = wordList.sentences;
      studied = studiedSent;
    }

    if (filter === 'studied') return studied;
    if (filter === 'unstudied') return allItems.filter(i => !studied.includes(i));
    return allItems;
  }

  function handleStudy() {
    if (!actionPopup || !listId) return;
    const { section, filter } = actionPopup;
    const items = getItems(section, filter);
    if (items.length === 0) return;

    // Mark items as studied
    if (section === 'words') {
      markWordsAsStudied(listId, items);
    } else if (section === 'paragraphWords') {
      markParagraphWordsAsStudied(listId, items);
    } else {
      markSentencesAsStudied(listId, items);
    }

    const wordsParam = encodeURIComponent(JSON.stringify(items));
    navigate(`/revision/${listId}?category=${section}&filter=${filter}&words=${wordsParam}`);
    setActionPopup(null);
  }

  function handleDictation() {
    if (!actionPopup || !listId) return;
    const { section, filter } = actionPopup;
    const items = getItems(section, filter);
    if (items.length === 0) return;

    if (section === 'sentences') {
      const wordsParam = encodeURIComponent(JSON.stringify(items));
      navigate(`/dictation/${listId}?mode=sentences&count=${items.length}&words=${wordsParam}`);
    } else {
      const wordsParam = encodeURIComponent(JSON.stringify(items));
      navigate(`/dictation/${listId}?mode=words&count=${items.length}&words=${wordsParam}`);
    }
    setActionPopup(null);
  }

  function handleDictateAll() {
    if (!listId || !wordList) return;
    // Collect all items: words + paragraphWords + sentences
    const allItems = [
      ...wordList.words,
      ...wordList.paragraphWords,
      ...wordList.sentences,
    ];
    if (allItems.length === 0) return;

    const wordsParam = encodeURIComponent(JSON.stringify(allItems));
    navigate(`/dictation/${listId}?mode=all&count=${allItems.length}&words=${wordsParam}&sentenceCount=${wordList.sentences.length}`);
  }

  if (!wordList) {
    return <div className="page wordlist-detail-page"><TopNavBar /><p>{t('common.loading')}</p></div>;
  }

  function renderSection(title: string, section: Section, studiedCount: number, unstudiedCount: number, totalCount: number) {
    return (
      <section className="detail-section">
        <h2>{title}</h2>
        <div className="detail-stats">
          <div
            className="detail-stat-box clickable"
            onClick={() => studiedCount > 0 && setActionPopup({ section, filter: 'studied' })}
            style={{ opacity: studiedCount === 0 ? 0.4 : 1 }}
          >
            <span className="stat-number">{studiedCount}</span>
            <span className="stat-label">{t('detail.studied')}</span>
          </div>
          <div
            className="detail-stat-box unstudied clickable"
            onClick={() => unstudiedCount > 0 && setActionPopup({ section, filter: 'unstudied' })}
            style={{ opacity: unstudiedCount === 0 ? 0.4 : 1 }}
          >
            <span className="stat-number">{unstudiedCount}</span>
            <span className="stat-label">{t('detail.unstudied')}</span>
          </div>
          <div
            className="detail-stat-box total clickable"
            onClick={() => totalCount > 0 && setActionPopup({ section, filter: 'all' })}
          >
            <span className="stat-number">{totalCount}</span>
            <span className="stat-label">{t('study.all')}</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="page wordlist-detail-page">
      <TopNavBar />
      <div className="hero-section">
        <h1>{wordList.name}</h1>
      </div>

      {/* Section 1: 詞語 */}
      {renderSection(t('revision.catWords'), 'words', studiedWords.length, unstudiedWords.length, wordList.words.length)}

      {/* Section 2: 文章詞語 */}
      {wordList.paragraphWords.length > 0 && renderSection(
        t('revision.catParagraphWords'), 'paragraphWords', studiedPW.length, unstudiedPW.length, wordList.paragraphWords.length
      )}

      {/* Section 3: 段落句子 */}
      {wordList.sentences.length > 0 && renderSection(
        t('revision.catSentences'), 'sentences', studiedSent.length, unstudiedSent.length, wordList.sentences.length
      )}

      {/* Dictate All Button */}
      {(wordList.words.length > 0 || wordList.paragraphWords.length > 0 || wordList.sentences.length > 0) && (
        <div className="dictate-all-section">
          <button className="btn btn-primary btn-large dictate-all-btn" onClick={handleDictateAll}>
            <span className="ico"></span> {t('detail.dictateAll')}
          </button>
        </div>
      )}

      {/* Action Popup */}
      {actionPopup && (
        <div className="popup-overlay" onClick={() => setActionPopup(null)}>
          <div className="popup-content" onClick={e => e.stopPropagation()}>
            <p>{t('detail.actionTitle')}</p>
            <div className="popup-buttons">
              <button className="btn btn-secondary btn-large" onClick={handleStudy}>
                {t('detail.study')}
              </button>
              <button className="btn btn-primary btn-large" onClick={handleDictation}>
                {t('detail.dictation')}
              </button>
            </div>
            <button className="btn btn-outline btn-small" onClick={() => setActionPopup(null)} style={{ marginTop: '12px' }}>
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
