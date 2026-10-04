import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllWordLists, deleteWordList, type WordList } from '../utils/storage';
import TopNavBar from '../components/TopNavBar';
import ConfirmDialog from '../components/ConfirmDialog';
import { usePrefs } from '../context/PrefsContext';

export default function WordListPage() {
  const navigate = useNavigate();
  const { t } = usePrefs();
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const [expandedList, setExpandedList] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  useEffect(() => {
    loadLists();
  }, []);

  async function loadLists() {
    const lists = await getAllWordLists();
    setWordLists(lists);
  }

  async function handleDelete(id: string) {
    await deleteWordList(id);
    setPendingDelete(null);
    loadLists();
  }

  return (
    <div className="page word-list-page">
      <TopNavBar />
      <h1>{t('wordlist.title')}</h1>

      {wordLists.length === 0 ? (
        <div className="empty-state">
          <p>{t('wordlist.empty')}</p>
          <button className="btn btn-primary" onClick={() => navigate('/import')}>
            {t('wordlist.addNew')}
          </button>
        </div>
      ) : (
        <div className="word-list-cards">
          {wordLists.map(list => (
            <div key={list.id} className="word-list-card">
              <div
                className="word-list-header"
                onClick={() => setExpandedList(expandedList === list.id ? null : list.id)}
              >
                <div>
                  <h3>{list.name}</h3>
                  <span className="word-count">{t('wordlist.wordCount', { n: list.words.length })}</span>
                  {list.paragraphs && list.paragraphs.length > 0 && (
                    <span className="paragraph-count">{t('wordlist.paragraphCount', { n: list.paragraphs.length })}</span>
                  )}
                  <span className="date">
                    {new Date(list.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span className="expand-icon">{expandedList === list.id ? <span className="ico" data-word={t('wordlist.collapse')}>▲</span> : <span className="ico" data-word={t('wordlist.expand')}>▼</span>}</span>
              </div>

              {expandedList === list.id && (
                <div className="word-list-body">
                  <div className="word-tags">
                    {list.words.map((word, i) => (
                      <span key={i} className="word-tag">{word}</span>
                    ))}
                  </div>
                  {list.paragraphs && list.paragraphs.length > 0 && (
                    <div className="paragraphs-preview">
                      <h4>{t('wordlist.paragraphsHeading')}</h4>
                      {list.paragraphs.map((p, i) => (
                        <p key={i} className="paragraph-snippet">{p.substring(0, 100)}{p.length > 100 ? '...' : ''}</p>
                      ))}
                    </div>
                  )}
                  <div className="action-buttons">
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/dictation/${list.id}?count=${Math.min(5, list.words.length)}`)}
                    >
                      {t('wordlist.startDictation')}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => navigate(`/pre-dictation/${list.id}?count=${Math.min(5, list.words.length)}`)}
                    >
                      {t('wordlist.paragraphMode')}
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => setPendingDelete(list.id)}
                    >
                      {t('common.delete')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title={t('wordlist.deleteTitle')}
          message={t('wordlist.deleteMessage')}
          confirmLabel={t('common.delete')}
          danger
          onConfirm={() => handleDelete(pendingDelete)}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}
