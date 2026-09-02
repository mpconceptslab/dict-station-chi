import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllWordLists, deleteWordList, type WordList } from '../utils/storage';

export default function WordListPage() {
  const navigate = useNavigate();
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const [expandedList, setExpandedList] = useState<string | null>(null);

  useEffect(() => {
    loadLists();
  }, []);

  async function loadLists() {
    const lists = await getAllWordLists();
    setWordLists(lists);
  }

  async function handleDelete(id: string) {
    if (confirm('Delete this word list?')) {
      await deleteWordList(id);
      loadLists();
    }
  }

  return (
    <div className="page word-list-page">
      <button className="back-btn" onClick={() => navigate('/')}>Home</button>
      <h1>My Word Lists</h1>

      {wordLists.length === 0 ? (
        <div className="empty-state">
          <p>No word lists yet.</p>
          <button className="btn btn-primary" onClick={() => navigate('/import')}>
            Import Words
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
                  <span className="word-count">{list.words.length} words</span>
                  {list.paragraphs && list.paragraphs.length > 0 && (
                    <span className="paragraph-count">{list.paragraphs.length} paragraph{list.paragraphs.length > 1 ? 's' : ''}</span>
                  )}
                  <span className="date">
                    {new Date(list.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span className="expand-icon">{expandedList === list.id ? '▲' : '▼'}</span>
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
                      <h4>Paragraphs:</h4>
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
                      Start Dictation
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => navigate(`/pre-dictation/${list.id}?count=${Math.min(5, list.words.length)}`)}
                    >
                      Paragraph Mode
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(list.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
