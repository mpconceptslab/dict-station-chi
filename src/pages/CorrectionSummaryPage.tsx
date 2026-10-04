import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCorrection, type CorrectionSession } from '../utils/storage';
import TopNavBar from '../components/TopNavBar';
import { usePrefs } from '../context/PrefsContext';

export default function CorrectionSummaryPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { t } = usePrefs();
  const [correction, setCorrection] = useState<CorrectionSession | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="page correction-summary-page">
        <TopNavBar />
        <div className="empty-state">
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!correction || correction.wrongWords.length === 0) {
    return (
      <div className="page correction-summary-page">
        <TopNavBar />
        <h1>改正記錄</h1>
        <div className="empty-state">
          <p>沒有改正記錄</p>
          <button className="btn btn-primary" onClick={() => navigate('/records')}>
            返回記錄
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page correction-summary-page">
      <TopNavBar />
      <h1>改正記錄</h1>

      <div className="correction-summary-list">
        {correction.wrongWords.map((wrong, idx) => {
          const round = correction.practiceRounds[idx];
          const images = round?.images || [];
          return (
            <div key={idx} className="correction-summary-item">
              <div className="word-header">
                <span className="word-index">{idx + 1}.</span>
                <span className="target-word">{wrong.word}</span>
              </div>
              <div className="attempts-row">
                {images.length > 0 ? (
                  images.map((img, imgIdx) => (
                    <div key={imgIdx} className="attempt-box">
                      <img src={img} alt={`${wrong.word} 第 ${imgIdx + 1} 次`} />
                      <span className="attempt-label">第 {imgIdx + 1} 次</span>
                    </div>
                  ))
                ) : (
                  <span className="no-attempts">未練習</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="action-buttons">
        <button className="btn btn-primary" onClick={() => navigate('/records')}>
          返回記錄
        </button>
      </div>
    </div>
  );
}
